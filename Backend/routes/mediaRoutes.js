const express = require('express')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const db = require('../db')
const { requireAuth, requireAdmin, asyncWrap } = require('../middleware/auth')

const router = express.Router()

const UPLOAD_DIR = path.resolve(__dirname, '..', process.env.UPLOAD_DIR || './uploads')
fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safeName = String(file.originalname || 'file')
      .toLowerCase()
      .replace(/[^a-z0-9.\-_]/g, '-')
    cb(null, `${Date.now()}-${safeName}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 300 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isImage = /^image\//.test(file.mimetype)
    const isVideo = /^video\//.test(file.mimetype)
    if (isImage || isVideo) cb(null, true)
    else cb(new Error('Only image or video uploads are allowed.'))
  },
})

function serializeAsset(row) {
  if (!row) return null
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    url: row.url,
    thumb: row.thumb,
    mime: row.mime,
    size: Number(row.size),
    duration: row.duration === null || row.duration === undefined ? null : Number(row.duration),
    kind: row.kind,
    productId: row.product_id,
    productName: row.product_name || '',
    createdAt: row.created_at,
  }
}

const ASSET_SELECT = `
  SELECT a.*, p.name AS product_name
  FROM media_assets a
  LEFT JOIN products p ON p.id = a.product_id
`

/* ------------------------------ Upload ------------------------------ */

router.post(
  '/upload',
  requireAuth,
  requireAdmin,
  upload.single('file'),
  (req, res) => {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file was uploaded.' })
      return
    }
    const isVideo = /^video\//.test(req.file.mimetype)
    const title = String(req.body?.title || '').trim() || req.file.originalname
    const productId = req.body?.productId ? Number(req.body.productId) : null
    const url = `/uploads/${req.file.filename}`

    const { lastInsertRowid } = db
      .prepare(
        `INSERT INTO media_assets (type, title, url, mime, size, kind, product_id)
         VALUES (?, ?, ?, ?, ?, 'upload', ?)`,
      )
      .run(isVideo ? 'video' : 'image', title, url, req.file.mimetype, req.file.size, productId)

    const row = db
      .prepare(`${ASSET_SELECT} WHERE a.id = ?`)
      .get(Number(lastInsertRowid))
    res.status(201).json({ success: true, data: { asset: serializeAsset(row) } })
  },
)

/* --------------------------- External links ------------------------- */

router.post(
  '/link',
  requireAuth,
  requireAdmin,
  asyncWrap(async (req, res) => {
    const url = String(req.body?.url || '').trim()
    if (!/^https?:\/\//i.test(url)) {
      res.status(400).json({ success: false, message: 'A valid http(s) stream URL is required.' })
      return
    }
    const type = req.body?.type === 'image' ? 'image' : 'video'
    const title = String(req.body?.title || '').trim() || 'Streaming video'
    const thumb = String(req.body?.thumb || '').trim()
    const duration = req.body?.duration === undefined || req.body?.duration === null ? null : Number(req.body.duration)
    const productId = req.body?.productId ? Number(req.body.productId) : null

    const { lastInsertRowid } = db
      .prepare(
        `INSERT INTO media_assets (type, title, url, thumb, size, duration, kind, product_id)
         VALUES (?, ?, ?, ?, 0, ?, 'link', ?)`,
      )
      .run(type, title, url, thumb, duration, productId)

    const row = db.prepare(`${ASSET_SELECT} WHERE a.id = ?`).get(Number(lastInsertRowid))
    res.status(201).json({ success: true, data: { asset: serializeAsset(row) } })
  }),
)

/* ------------------------------- List ------------------------------- */

router.get(
  '/',
  requireAuth,
  requireAdmin,
  asyncWrap(async (req, res) => {
    const { type = '', search = '', productId = '', limit: rawLimit = '100' } = req.query
    const where = []
    const params = []
    if (type === 'image' || type === 'video') {
      where.push('a.type = ?')
      params.push(type)
    }
    if (search) {
      where.push('(a.title LIKE ? OR a.url LIKE ?)')
      const like = `%${search}%`
      params.push(like, like)
    }
    if (productId) {
      where.push('a.product_id = ?')
      params.push(Number(productId))
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
    const limit = Math.min(500, Math.max(1, parseInt(rawLimit, 10) || 100))

    const rows = db
      .prepare(`${ASSET_SELECT} ${whereSql} ORDER BY a.id DESC LIMIT ?`)
      .all(...params, limit)
    const total = Number(
      db.prepare(`SELECT COUNT(*) AS c FROM media_assets a ${whereSql}`).get(...params).c,
    )
    res.json({ success: true, data: { items: rows.map(serializeAsset), total, limit } })
  }),
)

router.get(
  '/:id',
  requireAuth,
  requireAdmin,
  asyncWrap(async (req, res) => {
    const row = db.prepare(`${ASSET_SELECT} WHERE a.id = ?`).get(Number(req.params.id))
    if (!row) {
      res.status(404).json({ success: false, message: 'Media asset not found.' })
      return
    }
    res.json({ success: true, data: { asset: serializeAsset(row) } })
  }),
)

/* --------------------------- Link to product ------------------------ */

router.post(
  '/:id/link',
  requireAuth,
  requireAdmin,
  asyncWrap(async (req, res) => {
    const id = Number(req.params.id)
    const productId = req.body?.productId === null || req.body?.productId === undefined
      ? null
      : Number(req.body.productId)
    if (productId !== null) {
      const product = db.prepare('SELECT id FROM products WHERE id = ?').get(productId)
      if (!product) {
        res.status(404).json({ success: false, message: 'Product not found.' })
        return
      }
    }
    const result = db
      .prepare('UPDATE media_assets SET product_id = ? WHERE id = ?')
      .run(productId, id)
    if (result.changes === 0) {
      res.status(404).json({ success: false, message: 'Media asset not found.' })
      return
    }
    const row = db.prepare(`${ASSET_SELECT} WHERE a.id = ?`).get(id)
    res.json({ success: true, data: { asset: serializeAsset(row) } })
  }),
)

/* ------------------------------- Delete ----------------------------- */

router.delete(
  '/:id',
  requireAuth,
  requireAdmin,
  asyncWrap(async (req, res) => {
    const id = Number(req.params.id)
    const row = db.prepare('SELECT url FROM media_assets WHERE id = ?').get(id)
    if (!row) {
      res.status(404).json({ success: false, message: 'Media asset not found.' })
      return
    }
    db.prepare('DELETE FROM media_assets WHERE id = ?').run(id)
    if (row.url.startsWith('/uploads/')) {
      const full = path.join(UPLOAD_DIR, path.basename(row.url))
      try {
        fs.unlinkSync(full)
      } catch {
        /* file may not exist */
      }
    }
    res.json({ success: true, data: { id } })
  }),
)

module.exports = router
