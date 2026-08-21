const express = require('express')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const db = require('../db')
const { quote, normalizeTiers } = require('../wholesale')

const router = express.Router()

const UPLOAD_DIR = path.resolve(__dirname, '..', process.env.UPLOAD_DIR || './uploads')
fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safeName = file.originalname.toLowerCase().replace(/[^a-z0-9.\-_]/g, '-')
    cb(null, `${Date.now()}-${safeName}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true)
    else cb(new Error('Only image uploads are allowed.'))
  },
})

const slugify = (input) =>
  String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

function getTiers(productId) {
  return db
    .prepare(
      'SELECT id, type, min_quantity, price, label FROM price_tiers WHERE product_id = ? ORDER BY min_quantity ASC',
    )
    .all(productId)
    .map((t) => ({
      id: t.id,
      type: t.type,
      minQuantity: Number(t.min_quantity),
      price: Number(t.price),
      label: t.label,
    }))
}

function getVideos(productId) {
  return db
    .prepare(
      'SELECT id, url, poster, title, kind, position, duration FROM product_videos WHERE product_id = ? ORDER BY position ASC, id ASC',
    )
    .all(productId)
    .map((v) => ({
      id: v.id,
      url: v.url,
      poster: v.poster,
      title: v.title,
      kind: v.kind,
      position: Number(v.position),
      duration: v.duration === null ? null : Number(v.duration),
    }))
}

function inventoryStatusOf(stock) {
  return Number(stock) > 0 ? 'in_stock' : 'out_of_stock'
}

function serializeProduct(row) {
  if (!row) return null
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    sku: row.sku,
    price: Number(row.price),
    wholesaleMinQuantity: Number(row.wholesale_min_quantity) || 0,
    stockQuantity: Number(row.stock_quantity),
    inventoryStatus: inventoryStatusOf(row.stock_quantity),
    isFeatured: Boolean(row.is_featured),
    images: (row.images ? String(row.images) : '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    category: row.category_name
      ? { id: row.category_id, slug: row.category_slug, name: row.category_name }
      : null,
    tiers: getTiers(row.id),
    videos: getVideos(row.id),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

const PRODUCT_SELECT = `
  SELECT p.*,
         c.slug AS category_slug,
         c.name AS category_name,
         COALESCE((SELECT GROUP_CONCAT(url, ',') FROM product_images i WHERE i.product_id = p.id ORDER BY i.position), '') AS images
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
`

const PRODUCT_ROW = `${PRODUCT_SELECT} WHERE p.id = ?`

function getProductById(id) {
  return serializeProduct(db.prepare(PRODUCT_ROW).get(id))
}

function resolveCategoryId(categoryInput) {
  if (!categoryInput) return null
  if (Number.isInteger(categoryInput)) return categoryInput
  const byId = db.prepare('SELECT id FROM categories WHERE id = ?').get(Number(categoryInput))
  if (byId) return Number(byId.id)
  const row =
    db
      .prepare('SELECT id FROM categories WHERE slug = ? OR LOWER(name) = LOWER(?)')
      .get(String(categoryInput), String(categoryInput)) || null
  return row ? Number(row.id) : null
}

const asyncWrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ------------------------ Tiers & videos helpers ------------------------ */

function parseTiers(body) {
  const raw = Array.isArray(body.tiers) ? body.tiers : []
  const basePrice = Number(body.price) || 0
  const wholesaleMinQuantity = Math.max(0, Math.floor(Number(body.wholesaleMinQuantity) || 0))
  const wholesalePrice = Number(body.price) || 0
  const normalized = normalizeTiers(raw, basePrice, { wholesaleMinQuantity, wholesalePrice })
  const list = normalized.filter((t) => t.price > 0)
  return list
}

function replaceProductTiers(productId, tiers) {
  db.prepare('DELETE FROM price_tiers WHERE product_id = ?').run(productId)
  const insert = db.prepare(
    'INSERT INTO price_tiers (product_id, type, min_quantity, price, label) VALUES (?, ?, ?, ?, ?)',
  )
  for (const t of tiers) {
    insert.run(productId, 'wholesale', t.minQuantity, t.price, t.label || `Wholesale ${t.minQuantity}+`)
  }
}

function parseVideos(body) {
  return Array.isArray(body.videos) ? body.videos.filter(Boolean) : []
}

function replaceProductVideos(productId, videos) {
  db.prepare('DELETE FROM product_videos WHERE product_id = ?').run(productId)
  if (videos.length === 0) return
  const insert = db.prepare(
    'INSERT INTO product_videos (product_id, url, poster, title, kind, position, duration) VALUES (?, ?, ?, ?, ?, ?, ?)',
  )
  videos.forEach((v, i) => {
    if (!v || !String(v.url || '').trim()) return
    insert.run(
      productId,
      String(v.url).trim(),
      String(v.poster || ''),
      String(v.title || ''),
      String(v.kind || 'link'),
      Number(v.position) || i,
      v.duration === undefined || v.duration === null ? null : Number(v.duration),
    )
  })
}

/* ------------------------------ Upload ------------------------------ */

router.post(
  '/products/upload/single',
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file was uploaded.' })
      return
    }
    res.json({
      success: true,
      data: { url: `/uploads/${req.file.filename}` },
    })
  },
)

/* ---------------------------- Products ------------------------------ */

router.get(
  '/products',
  asyncWrap(async (req, res) => {
    const {
      search = '',
      category = '',
      featured = '',
      status = '',
      sort = '',
      limit: rawLimit = '',
      page: rawPage = '1',
    } = req.query

    const where = []
    const params = []

    if (search) {
      where.push('(p.name LIKE ? OR p.slug LIKE ? OR p.description LIKE ?)')
      const like = `%${search}%`
      params.push(like, like, like)
    }
    if (category) {
      where.push('c.slug = ?')
      params.push(String(category).toLowerCase())
    }
    if (featured === 'true' || featured === '1') {
      where.push('p.is_featured = 1')
    }
    if (status === 'in_stock') {
      where.push('p.stock_quantity > 0')
    } else if (status === 'out_of_stock') {
      where.push('p.stock_quantity <= 0')
    } else if (status === 'low_stock') {
      where.push('p.stock_quantity > 0 AND p.stock_quantity < 20')
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

    let orderSql = 'ORDER BY p.id ASC'
    const sortMap = {
      price_asc: 'ORDER BY p.price ASC, p.id ASC',
      price_desc: 'ORDER BY p.price DESC, p.id ASC',
      stock_asc: 'ORDER BY p.stock_quantity ASC, p.id ASC',
      stock_desc: 'ORDER BY p.stock_quantity DESC, p.id ASC',
      newest: 'ORDER BY p.created_at DESC, p.id DESC',
      oldest: 'ORDER BY p.created_at ASC, p.id ASC',
      name: 'ORDER BY p.name ASC, p.id ASC',
    }
    if (sort && sortMap[sort]) orderSql = sortMap[sort]

    const countRow = db
      .prepare(`SELECT COUNT(*) AS c FROM products p LEFT JOIN categories c ON c.id = p.category_id ${whereSql}`)
      .get(...params)
    const total = Number(countRow.c)

    let page = Math.max(1, parseInt(rawPage, 10) || 1)
    const limit = rawLimit === '' || rawLimit === undefined || rawLimit === null
      ? 100
      : Math.min(500, Math.max(1, parseInt(rawLimit, 10) || 100))
    const pages = Math.max(1, Math.ceil(total / limit))
    if (page > pages) page = pages

    const rows = db
      .prepare(`${PRODUCT_SELECT} ${whereSql} ${orderSql} LIMIT ? OFFSET ?`)
      .all(...params, limit, (page - 1) * limit)

    res.json({
      success: true,
      data: { items: rows.map(serializeProduct), total, page, pages, limit },
    })
  }),
)

router.get(
  '/products/:slug',
  asyncWrap(async (req, res) => {
    const row =
      db
        .prepare(`${PRODUCT_SELECT} WHERE p.slug = ?`)
        .get(String(req.params.slug).toLowerCase()) || null
    if (!row) {
      res.status(404).json({ success: false, message: 'Product not found.' })
      return
    }

    const relatedRows = db
      .prepare(
        `${PRODUCT_SELECT}
         WHERE p.category_id = ? AND p.id != ?
         ORDER BY p.is_featured DESC, p.id ASC LIMIT 4`,
      )
      .all(row.category_id, row.id)

    res.json({
      success: true,
      data: {
        product: serializeProduct(row),
        related: relatedRows.map(serializeProduct),
      },
    })
  }),
)

router.post(
  '/products',
  asyncWrap(async (req, res) => {
    const body = req.body || {}
    if (!body.name || !String(body.name).trim()) {
      res.status(400).json({ success: false, message: 'Product name is required.' })
      return
    }

    const slug = slugify(body.slug || body.name)
    const existing = db.prepare('SELECT id FROM products WHERE slug = ?').get(slug)
    if (existing) {
      res.status(409).json({ success: false, message: 'A product with this slug already exists.' })
      return
    }

    const categoryId = resolveCategoryId(body.categoryId ?? body.category)
    const images = Array.isArray(body.images)
      ? body.images.filter(Boolean)
      : body.image
        ? [body.image]
        : []

    const result = db
      .prepare(
        `INSERT INTO products
           (slug, name, description, sku, price, stock_quantity, is_featured, category_id, wholesale_min_quantity)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        slug,
        String(body.name).trim(),
        String(body.description || ''),
        String(body.sku || ''),
        Number(body.price) || 0,
        Number(body.stockQuantity) || 0,
        body.isFeatured ? 1 : 0,
        categoryId,
        Math.max(0, Math.floor(Number(body.wholesaleMinQuantity) || 0)),
      )

    const productId = Number(result.lastInsertRowid)
    const insertImage = db.prepare(
      'INSERT INTO product_images (product_id, url, position) VALUES (?, ?, ?)',
    )
    images.forEach((url, i) => insertImage.run(productId, url, i))

    replaceProductTiers(productId, parseTiers(body))
    replaceProductVideos(productId, parseVideos(body))

    res.status(201).json({ success: true, data: { product: getProductById(productId) } })
  }),
)

router.put(
  '/products/:id',
  asyncWrap(async (req, res) => {
    const id = Number(req.params.id)
    const current = db.prepare('SELECT * FROM products WHERE id = ?').get(id)
    if (!current) {
      res.status(404).json({ success: false, message: 'Product not found.' })
      return
    }

    const body = req.body || {}
    const slug = body.slug ? slugify(body.slug) : current.slug
    const clash = db.prepare('SELECT id FROM products WHERE slug = ? AND id != ?').get(slug, id)
    if (clash) {
      res.status(409).json({ success: false, message: 'A product with this slug already exists.' })
      return
    }

    const categoryId =
      body.categoryId !== undefined || body.category !== undefined
        ? resolveCategoryId(body.categoryId ?? body.category)
        : current.category_id

    db.prepare(
      `UPDATE products SET
         slug = ?, name = ?, description = ?, sku = ?, price = ?,
         wholesale_min_quantity = ?, stock_quantity = ?, is_featured = ?, category_id = ?, updated_at = datetime('now')
       WHERE id = ?`,
    ).run(
      slug,
      body.name !== undefined ? String(body.name).trim() : current.name,
      body.description !== undefined ? String(body.description) : current.description,
      body.sku !== undefined ? String(body.sku) : current.sku,
      body.price !== undefined ? Number(body.price) : current.price,
      body.wholesaleMinQuantity !== undefined
        ? Math.max(0, Math.floor(Number(body.wholesaleMinQuantity) || 0))
        : Number(current.wholesale_min_quantity) || 0,
      body.stockQuantity !== undefined ? Number(body.stockQuantity) : current.stock_quantity,
      body.isFeatured !== undefined ? (body.isFeatured ? 1 : 0) : current.is_featured,
      categoryId,
      id,
    )

    if (body.images !== undefined && Array.isArray(body.images)) {
      db.prepare('DELETE FROM product_images WHERE product_id = ?').run(id)
      const insertImage = db.prepare(
        'INSERT INTO product_images (product_id, url, position) VALUES (?, ?, ?)',
      )
      body.images.filter(Boolean).forEach((url, i) => insertImage.run(id, url, i))
    }

    if (body.tiers !== undefined) {
      replaceProductTiers(id, parseTiers({
        ...body,
        price: body.price !== undefined ? body.price : current.price,
        wholesaleMinQuantity:
          body.wholesaleMinQuantity !== undefined
            ? body.wholesaleMinQuantity
            : Number(current.wholesale_min_quantity) || 0,
      }))
    }
    if (body.videos !== undefined) {
      replaceProductVideos(id, parseVideos(body))
    }

    res.json({ success: true, data: { product: getProductById(id) } })
  }),
)

router.delete(
  '/products/:id',
  asyncWrap(async (req, res) => {
    const result = db.prepare('DELETE FROM products WHERE id = ?').run(Number(req.params.id))
    if (result.changes === 0) {
      res.status(404).json({ success: false, message: 'Product not found.' })
      return
    }
    res.json({ success: true, data: { id: Number(req.params.id) } })
  }),
)

/* --------------------------- Wholesale quote --------------------------- */

router.get(
  '/products/:id/wholesale',
  asyncWrap(async (req, res) => {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(req.params.id))
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' })
      return
    }
    const quantity = Math.max(1, Math.floor(Number(req.query.qty) || 1))
    const tiers = getTiers(product.id)
    const result = quote({
      basePrice: Number(product.price) || 0,
      tiers,
      quantity,
      wholesaleMinQuantity: Number(product.wholesale_min_quantity) || 0,
      wholesalePrice: Number(product.price) || 0,
    })
    res.json({ success: true, data: result })
  }),
)

router.post(
  '/products/:id/wholesale',
  asyncWrap(async (req, res) => {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(req.params.id))
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' })
      return
    }
    const quantity = Math.max(1, Math.floor(Number(req.body?.quantity) || 1))
    const tiers = getTiers(product.id)
    const result = quote({
      basePrice: Number(product.price) || 0,
      tiers,
      quantity,
      wholesaleMinQuantity: Number(product.wholesale_min_quantity) || 0,
      wholesalePrice: Number(product.price) || 0,
    })
    res.json({ success: true, data: result })
  }),
)

/* --------------------------- Categories ----------------------------- */

router.get(
  '/categories',
  asyncWrap(async (req, res) => {
    const rows = db
      .prepare(
        `SELECT c.*,
                (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) AS product_count
         FROM categories c
         ORDER BY c.id ASC`,
      )
      .all()
    res.json({
      success: true,
      data: {
        items: rows.map((r) => ({
          id: r.id,
          slug: r.slug,
          name: r.name,
          image: r.image,
          productCount: Number(r.product_count),
        })),
      },
    })
  }),
)

router.get(
  '/categories/:slug',
  asyncWrap(async (req, res) => {
    const cat =
      db
        .prepare('SELECT * FROM categories WHERE slug = ?')
        .get(String(req.params.slug).toLowerCase()) || null
    if (!cat) {
      res.status(404).json({ success: false, message: 'Category not found.' })
      return
    }
    const rows = db
      .prepare(`${PRODUCT_SELECT} WHERE p.category_id = ? ORDER BY p.id ASC`)
      .all(cat.id)
    res.json({
      success: true,
      data: {
        category: { id: cat.id, slug: cat.slug, name: cat.name, image: cat.image },
        products: rows.map(serializeProduct),
      },
    })
  }),
)

router.post(
  '/categories',
  asyncWrap(async (req, res) => {
    const name = String(req.body?.name || '').trim()
    if (!name) {
      res.status(400).json({ success: false, message: 'Category name is required.' })
      return
    }
    const slug = slugify(req.body.slug || name)
    if (db.prepare('SELECT id FROM categories WHERE slug = ?').get(slug)) {
      res.status(409).json({ success: false, message: 'A category with this slug already exists.' })
      return
    }
    const { lastInsertRowid } = db
      .prepare('INSERT INTO categories (slug, name, image) VALUES (?, ?, ?)')
      .run(slug, name, String(req.body.image || ''))
    res.status(201).json({
      success: true,
      data: { category: { id: Number(lastInsertRowid), slug, name, image: String(req.body.image || ''), productCount: 0 } },
    })
  }),
)

router.put(
  '/categories/:id',
  asyncWrap(async (req, res) => {
    const id = Number(req.params.id)
    const current = db.prepare('SELECT * FROM categories WHERE id = ?').get(id)
    if (!current) {
      res.status(404).json({ success: false, message: 'Category not found.' })
      return
    }
    const name = req.body?.name !== undefined ? String(req.body.name).trim() : current.name
    const slug = req.body?.slug ? slugify(req.body.slug) : current.slug
    const clash = db.prepare('SELECT id FROM categories WHERE slug = ? AND id != ?').get(slug, id)
    if (clash) {
      res.status(409).json({ success: false, message: 'A category with this slug already exists.' })
      return
    }
    db.prepare('UPDATE categories SET slug = ?, name = ?, image = ? WHERE id = ?').run(
      slug,
      name,
      req.body?.image !== undefined ? String(req.body.image) : current.image,
      id,
    )
    res.json({ success: true, data: { category: { id, slug, name, image: req.body?.image !== undefined ? String(req.body.image) : current.image } } })
  }),
)

router.delete(
  '/categories/:id',
  asyncWrap(async (req, res) => {
    const result = db.prepare('DELETE FROM categories WHERE id = ?').run(Number(req.params.id))
    if (result.changes === 0) {
      res.status(404).json({ success: false, message: 'Category not found.' })
      return
    }
    res.json({ success: true, data: { id: Number(req.params.id) } })
  }),
)

module.exports = router
