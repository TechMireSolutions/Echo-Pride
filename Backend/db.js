const path = require('path')
const fs = require('fs')
const Database = require('better-sqlite3')

const DB_PATH = path.resolve(__dirname, process.env.DB_PATH || './data/echopride.db')

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.exec('PRAGMA foreign_keys = ON;')

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    image TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    sku TEXT NOT NULL DEFAULT '',
    price REAL NOT NULL DEFAULT 0,
    retail_price REAL NOT NULL DEFAULT 0,
    wholesale_min_quantity INTEGER NOT NULL DEFAULT 0,
    compare_at_price REAL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    is_featured INTEGER NOT NULL DEFAULT 0,
    category_id INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    url TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT NOT NULL UNIQUE,
    user_id INTEGER,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT NOT NULL DEFAULT 'cod',
    subtotal REAL NOT NULL DEFAULT 0,
    tax REAL NOT NULL DEFAULT 0,
    total REAL NOT NULL DEFAULT 0,
    shipping_address TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    is_demo INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER,
    product_name TEXT NOT NULL,
    price REAL NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL DEFAULT 1,
    image TEXT NOT NULL DEFAULT '',
    sizes TEXT NOT NULL DEFAULT '{}',
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    payload TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS analytics_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL DEFAULT 'page_view',
    path TEXT NOT NULL DEFAULT '',
    source TEXT NOT NULL DEFAULT '',
    session_id TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sales_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    starts_at TEXT NOT NULL,
    ends_at TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    color TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS price_tiers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    type TEXT NOT NULL DEFAULT 'retail',
    min_quantity INTEGER NOT NULL DEFAULT 1,
    price REAL NOT NULL DEFAULT 0,
    label TEXT NOT NULL DEFAULT '',
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS product_videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    url TEXT NOT NULL,
    poster TEXT NOT NULL DEFAULT '',
    title TEXT NOT NULL DEFAULT '',
    kind TEXT NOT NULL DEFAULT 'link',
    position INTEGER NOT NULL DEFAULT 0,
    duration REAL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS media_assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL DEFAULT 'image',
    title TEXT NOT NULL DEFAULT '',
    url TEXT NOT NULL,
    thumb TEXT NOT NULL DEFAULT '',
    mime TEXT NOT NULL DEFAULT '',
    size INTEGER NOT NULL DEFAULT 0,
    duration REAL,
    kind TEXT NOT NULL DEFAULT 'upload',
    product_id INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL DEFAULT 'system',
    title TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL DEFAULT '',
    data TEXT NOT NULL DEFAULT '{}',
    is_read INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS order_status_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    from_status TEXT NOT NULL DEFAULT '',
    to_status TEXT NOT NULL DEFAULT '',
    note TEXT NOT NULL DEFAULT '',
    actor TEXT NOT NULL DEFAULT 'system',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    subject TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS survey_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL DEFAULT '',
    rating INTEGER NOT NULL DEFAULT 0,
    feedback TEXT NOT NULL DEFAULT '',
    source TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
  CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);
  CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
  CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at);
  CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type);
  CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events(session_id);
  CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
  CREATE INDEX IF NOT EXISTS idx_tiers_product ON price_tiers(product_id);
  CREATE INDEX IF NOT EXISTS idx_videos_product ON product_videos(product_id);
  CREATE INDEX IF NOT EXISTS idx_media_type ON media_assets(type);
  CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
  CREATE INDEX IF NOT EXISTS idx_status_events_order ON order_status_events(order_id);
`)

/* -------------------- Migrations -------------------- */

function migrateGuestOrders() {
  const cols = db.prepare('PRAGMA table_info(orders)').all()
  const userIdCol = cols.find((c) => c.name === 'user_id')
  if (!userIdCol || userIdCol.notnull === 0) return

  db.pragma('foreign_keys = OFF')
  db.exec('BEGIN')
  try {
    db.exec(`
      CREATE TABLE orders_v2 (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT NOT NULL UNIQUE,
        user_id INTEGER,
        status TEXT NOT NULL DEFAULT 'pending',
        payment_method TEXT NOT NULL DEFAULT 'cod',
        subtotal REAL NOT NULL DEFAULT 0,
        tax REAL NOT NULL DEFAULT 0,
        total REAL NOT NULL DEFAULT 0,
        shipping_address TEXT NOT NULL DEFAULT '{}',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        is_demo INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      INSERT INTO orders_v2 (id, order_number, user_id, status, payment_method, subtotal, tax, total, shipping_address, created_at, is_demo)
        SELECT id, order_number, user_id, status, payment_method, subtotal, tax, total, shipping_address, created_at, is_demo FROM orders;

      DROP TABLE orders;
      ALTER TABLE orders_v2 RENAME TO orders;

      CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
    `)
    db.exec('COMMIT')
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  } finally {
    db.pragma('foreign_keys = ON')
  }
}

migrateGuestOrders()

function migrateDemoOrdersFlag() {
  const cols = db.prepare('PRAGMA table_info(orders)').all()
  if (cols.some((c) => c.name === 'is_demo')) return
  db.prepare('ALTER TABLE orders ADD COLUMN is_demo INTEGER NOT NULL DEFAULT 0').run()
  const demoUser = db.prepare('SELECT id FROM users WHERE email = ?').get('demo@echopride.com')
  if (demoUser) {
    db.prepare('UPDATE orders SET is_demo = 1 WHERE user_id = ?').run(demoUser.id)
  }
}

migrateDemoOrdersFlag()

function migrateOrderShippingFee() {
  const cols = db.prepare('PRAGMA table_info(orders)').all()
  if (cols.some((c) => c.name === 'shipping_fee')) return
  db.prepare('ALTER TABLE orders ADD COLUMN shipping_fee REAL NOT NULL DEFAULT 0').run()
}

migrateOrderShippingFee()

function migrateRetailPricing() {
  const cols = db.prepare('PRAGMA table_info(products)').all()
  const hadRetail = cols.some((c) => c.name === 'retail_price')
  const hadMin = cols.some((c) => c.name === 'wholesale_min_quantity')
  if (!hadRetail) {
    db.prepare('ALTER TABLE products ADD COLUMN retail_price REAL NOT NULL DEFAULT 0').run()
  }
  if (!hadMin) {
    db.prepare('ALTER TABLE products ADD COLUMN wholesale_min_quantity INTEGER NOT NULL DEFAULT 0').run()
  }
  // Legacy products: promote the compare-at (MSRP) into a real retail price and
  // default to a 12-unit wholesale threshold so the retail/wholesale model is
  // meaningful without requiring manual re-entry.
  if (!hadRetail) {
    db.prepare(
      `UPDATE products
       SET retail_price = compare_at_price, wholesale_min_quantity = 12
       WHERE compare_at_price IS NOT NULL AND compare_at_price > price`,
    ).run()
  }
  // Idempotent: keep legacy retail tier rows aligned with the retail_price
  // column (the column is the source of truth for the retail base price).
  db.prepare(
    `UPDATE price_tiers
     SET price = (SELECT p.retail_price FROM products p WHERE p.id = price_tiers.product_id)
     WHERE type = 'retail'
       AND EXISTS (
         SELECT 1 FROM products p
         WHERE p.id = price_tiers.product_id AND p.retail_price > 0
       )`,
  ).run()
}

migrateRetailPricing()

function migrateOrderItemSizes() {
  const cols = db.prepare('PRAGMA table_info(order_items)').all()
  if (cols.some((c) => c.name === 'sizes')) return
  db.prepare("ALTER TABLE order_items ADD COLUMN sizes TEXT NOT NULL DEFAULT '{}'").run()
}

migrateOrderItemSizes()

const CATEGORY_SEEDS = [
  { slug: 'basketball', name: 'Basketball', image: 'imgi_5_m3_cat_01.jpg' },
  { slug: 'football', name: 'Football', image: 'imgi_6_m3_cat_02.jpg' },
  { slug: 'soccers', name: 'Soccers', image: 'imgi_7_m3_cat_03.jpg' },
  { slug: 'softballs', name: 'SoftBalls', image: 'imgi_8_m3_cat_04.jpg' },
  { slug: 'rugby', name: 'Rugby', image: 'imgi_9_m3_cat_05.jpg' },
]

// slug, name, category, price, compareAtPrice, stock, featured, image, description
const PRODUCT_SEEDS = [
  {
    slug: 'quarter-zip-basketball-coachs-pullover',
    name: "Quarter-Zip Basketball Coach's Pullover",
    category: 'Basketball',
    price: 50,
    compareAtPrice: 65,
    stock: 120,
    featured: true,
    image: 'imgi_18_a-sleek-modern-basketball-coach-s-hoodie-featuri-700x700.webp',
    description:
      "Built for maximum comfort, thermal insulation, and athletic mobility on the sidelines or training court. Features lightweight moisture-wicking fleece fabric, durable reinforced quarter-zip collar, and a modern tailored athletic fit.",
  },
  {
    slug: 'waterproof-basketball-coachs-jacket',
    name: "Waterproof Basketball Coach's Jacket",
    category: 'Basketball',
    price: 60,
    compareAtPrice: 85,
    stock: 90,
    featured: true,
    image: 'imgi_19_a-waterproof-basketball-coach-s-jacket-with-a-bold-700x700.webp',
    description:
      "Engineered for all-weather conditions, this waterproof coaching jacket features a bold team-ready design, reinforced seam sealing, and a windproof outer shell. Keeps you dry and focused no matter the weather on the sideline.",
  },
  {
    slug: 'basketball-coachs-zip-up-hoodie',
    name: "Basketball Coach's Zip-Up Hoodie",
    category: 'Basketball',
    price: 60,
    compareAtPrice: 80,
    stock: 110,
    featured: true,
    image: 'imgi_20_a-zip-up-hoodie-designed-for-basketball-coaches-w-700x700.webp',
    description:
      "A stylish zip-up hoodie crafted for basketball coaches who demand comfort and performance. Features a smooth full-zip closure, soft-touch interior lining, kangaroo pocket, and team-ready athletic styling perfect for both practice and game day.",
  },
  {
    slug: 'high-performance-basketball-fleece-hoodie',
    name: 'High-Performance Basketball Fleece Hoodie',
    category: 'Basketball',
    price: 50,
    compareAtPrice: 65,
    stock: 95,
    featured: true,
    image: 'imgi_21_a-high-performance-fleece-lined-hoodie-for-basketb-700x700.webp',
    description:
      'The ultimate fleece-lined hoodie for serious basketball coaches. Built with high-performance dual-layer fabric that locks in warmth while staying breathable, featuring a structured hood, ribbed cuffs, and a streamlined athletic silhouette.',
  },
  {
    slug: 'basketball-coachs-lightweight-windbreaker',
    name: "Basketball Coach's Lightweight Windbreaker",
    category: 'Basketball',
    price: 60,
    compareAtPrice: 80,
    stock: 85,
    featured: true,
    image: 'imgi_22_a-lightweight-basketball-coach-s-windbreaker-with--700x700.webp',
    description:
      "A lightweight, packable windbreaker designed for basketball coaches who need versatility. Features wind and water-resistant outer shell, breathable mesh lining, and a streamlined cut ideal for sideline movement or early morning training sessions.",
  },
  {
    slug: 'basketball-coachs-minimalist-hoodie',
    name: "Basketball Coach's Minimalist Hoodie",
    category: 'Basketball',
    price: 50,
    compareAtPrice: 65,
    stock: 100,
    featured: true,
    image: 'imgi_23_a-minimalist-basketball-coach-s-jacket-with-subtle-700x700.webp',
    description:
      'Clean lines meet elite coaching performance. This minimalist hoodie strips back distractions to deliver pure comfort and mobility — with a subtle team-inspired accent design, ultra-soft interior, and a modern slim fit that commands respect on the sideline.',
  },
  {
    slug: 'moisture-wicking-basketball-coachs-hoodie',
    name: "Moisture-Wicking Basketball Coach's Hoodie",
    category: 'Basketball',
    price: 50,
    compareAtPrice: 65,
    stock: 105,
    featured: true,
    image: 'imgi_24_a-moisture-wicking-basketball-coach-s-hoodie-with-1-700x700.webp',
    description:
      'Stay cool and dry during the most intense coaching sessions. This moisture-wicking hoodie uses advanced fabric technology to pull sweat away from the body, keeping you fresh and focused through every drill and play. Perfect for high-intensity practice environments.',
  },
  {
    slug: 'moisture-wicking-hoodie-bold-design',
    name: 'Moisture-Wicking Hoodie Bold Design',
    category: 'Basketball',
    price: 50,
    compareAtPrice: 65,
    stock: 88,
    featured: true,
    image: 'imgi_25_a-moisture-wicking-basketball-coach-s-hoodie-with--700x700.webp',
    description:
      'Make a statement on the court. This bold-design moisture-wicking hoodie combines eye-catching graphics with advanced performance fabric — pulling sweat away instantly while delivering maximum comfort throughout the longest game days and practice sessions.',
  },
  {
    slug: 'premium-varsity-style-basketball-coaching-jacket',
    name: 'Premium Varsity-Style Basketball Coaching Jacket',
    category: 'Basketball',
    price: 60,
    compareAtPrice: 85,
    stock: 75,
    featured: true,
    image: 'imgi_16_a-premium-varsity-style-basketball-coaching-jacket-700x700.webp',
    description:
      'The pinnacle of coaching outerwear. This premium varsity-style jacket blends classic collegiate design with modern athletic engineering — featuring embroidered detailing, heavy-duty zipper, premium wool-blend body, and leather-look sleeves for a timeless professional look.',
  },
  {
    slug: 'quarter-zip-basketball-coachs-pullover-alternate',
    name: "Quarter-Zip Basketball Coach's Pullover",
    category: 'Basketball',
    price: 50,
    compareAtPrice: 65,
    stock: 80,
    featured: true,
    image: 'imgi_17_a-quarter-zip-basketball-coach-s-pullover-with-a-s-700x700.webp',
    description:
      "A refined take on the classic quarter-zip, this pullover features a sleek tonal colorblock design and improved ergonomic patterning for superior freedom of movement. Built with a durable stretch-woven exterior and a warm brushed interior for all-season sideline readiness.",
  },
  {
    slug: 'custom-sublimated-football-jersey',
    name: 'Custom Sublimated Football Jersey',
    category: 'Football',
    price: 55,
    compareAtPrice: 75,
    stock: 130,
    featured: false,
    image: 'imgi_6_m3_cat_02.jpg',
    description:
      'A fully customizable football jersey produced with dye-sublimation printing — your team colors, name, and number fade into the fabric for a bold, permanent look. Cut for full range of motion with breathable, sweat-wicking fabric engineered for game day.',
  },
  {
    slug: 'football-coachs-windbreaker',
    name: "Football Coach's Windbreaker",
    category: 'Football',
    price: 60,
    compareAtPrice: 80,
    stock: 70,
    featured: false,
    image: 'imgi_22_a-lightweight-basketball-coach-s-windbreaker-with--700x700.webp',
    description:
      "A lightweight, packable windbreaker built for football coaches who live on the sideline. Features wind and water-resistant outer shell, breathable mesh lining, and a streamlined cut ideal for movement during practice and match day.",
  },
  {
    slug: 'football-training-zip-hoodie',
    name: 'Football Training Zip-Up Hoodie',
    category: 'Football',
    price: 55,
    compareAtPrice: 75,
    stock: 95,
    featured: false,
    image: 'imgi_20_a-zip-up-hoodie-designed-for-basketball-coaches-w-700x700.webp',
    description:
      'A smooth full-zip hoodie made for football players and coaches. Soft-touch interior lining, kangaroo pocket, and team-ready athletic styling keep you comfortable from warm-up drills to final whistle.',
  },
  {
    slug: 'custom-sublimated-soccer-jersey',
    name: 'Custom Sublimated Soccer Jersey',
    category: 'Soccers',
    price: 50,
    compareAtPrice: 68,
    stock: 140,
    featured: false,
    image: 'imgi_7_m3_cat_03.jpg',
    description:
      'Fully customizable soccer jerseys with sublimated crests, numbers, and player names. Ultra-lightweight, breathable knit keeps players cool across 90 minutes, with reinforced stitching where it matters most.',
  },
  {
    slug: 'soccer-fleece-training-hoodie',
    name: 'Soccer Training Fleece Hoodie',
    category: 'Soccers',
    price: 50,
    compareAtPrice: 65,
    stock: 90,
    featured: false,
    image: 'imgi_21_a-high-performance-fleece-lined-hoodie-for-basketb-700x700.webp',
    description:
      'A high-performance fleece-lined hoodie for soccer teams training in cool weather. Dual-layer fabric locks in warmth while staying breathable, with a structured hood and ribbed cuffs for a clean athletic silhouette.',
  },
  {
    slug: 'soccer-coachs-sleek-pullover',
    name: "Soccer Coach's Sleek Pullover",
    category: 'Soccers',
    price: 50,
    compareAtPrice: 65,
    stock: 85,
    featured: false,
    image: 'imgi_18_a-sleek-modern-basketball-coach-s-hoodie-featuri-700x700.webp',
    description:
      "A sleek, modern pullover designed for soccer coaches. Lightweight moisture-wicking fleece, a durable quarter-zip collar, and a tailored athletic fit keep you sharp while you direct play from the sideline.",
  },
  {
    slug: 'custom-sublimated-softball-jersey',
    name: 'Custom Sublimated Softball Jersey',
    category: 'SoftBalls',
    price: 50,
    compareAtPrice: 65,
    stock: 110,
    featured: false,
    image: 'imgi_8_m3_cat_04.jpg',
    description:
      'Bold, fully sublimated softball jerseys with custom colors, names, and numbers. Built for the fast-paced diamond with breathable, quick-dry fabric and reinforced seams that hold up all season long.',
  },
  {
    slug: 'softball-minimalist-team-hoodie',
    name: 'Softball Minimalist Team Hoodie',
    category: 'SoftBalls',
    price: 50,
    compareAtPrice: 65,
    stock: 82,
    featured: false,
    image: 'imgi_23_a-minimalist-basketball-coach-s-jacket-with-subtle-700x700.webp',
    description:
      'Clean lines meet elite team comfort. This minimalist hoodie strips back distractions to deliver pure comfort and mobility — with a subtle accent design, ultra-soft interior, and a modern slim fit for the dugout and beyond.',
  },
  {
    slug: 'softball-moisture-wicking-hoodie',
    name: 'Softball Moisture-Wicking Hoodie',
    category: 'SoftBalls',
    price: 50,
    compareAtPrice: 65,
    stock: 78,
    featured: false,
    image: 'imgi_24_a-moisture-wicking-basketball-coach-s-hoodie-with-1-700x700.webp',
    description:
      'Advanced moisture-wicking technology keeps softball players and coaches dry through long tournament days. Soft, breathable, and built to move with you from the dugout to the plate.',
  },
  {
    slug: 'custom-sublimated-rugby-jersey',
    name: 'Custom Sublimated Rugby Jersey',
    category: 'Rugby',
    price: 65,
    compareAtPrice: 85,
    stock: 100,
    featured: false,
    image: 'imgi_9_m3_cat_05.jpg',
    description:
      'Heavy-duty custom rugby jerseys built for contact. Sublimated club crests and numbers printed directly into reinforced, moisture-wicking fabric that stands up to scrums, tackles, and try celebrations alike.',
  },
  {
    slug: 'rugby-coachs-waterproof-jacket',
    name: "Rugby Coach's Waterproof Jacket",
    category: 'Rugby',
    price: 60,
    compareAtPrice: 85,
    stock: 66,
    featured: false,
    image: 'imgi_19_a-waterproof-basketball-coach-s-jacket-with-a-bold-700x700.webp',
    description:
      "Engineered for all-weather sideline duty, this waterproof coaching jacket features a bold team-ready design, reinforced seam sealing, and a windproof outer shell so you stay dry and focused through every match.",
  },
  {
    slug: 'rugby-bold-design-hoodie',
    name: 'Rugby Bold Design Hoodie',
    category: 'Rugby',
    price: 50,
    compareAtPrice: 65,
    stock: 92,
    featured: false,
    image: 'imgi_25_a-moisture-wicking-basketball-coach-s-hoodie-with--700x700.webp',
    description:
      'Make a statement at training. This bold-design moisture-wicking hoodie combines eye-catching graphics with advanced performance fabric — pulling sweat away instantly while delivering maximum comfort throughout the longest sessions.',
  },
]

const DEFAULT_SETTINGS = {
  storeName: 'Echo Pride',
  tagline: 'Premium sports apparel & custom team uniforms',
  currency: 'PKR',
  taxPercent: 5,
  shippingFee: 0,
  shippingTiers: [{ minQuantity: 50, fee: 0 }],
  contact: { email: 'support@echopride.com', phone: '', address: '' },
  heroBanners: [],
  currencyRates: {},
  deal: {
    enabled: true,
    subtitle: 'SKYWALKER SPECIALS',
    title: "High-Flyin' Deals on Basketball Gear!",
    targetUrl: '/shop/basketball',
    category: 'basketball',
    dealEndDate: '2026-12-31T23:59:59.000Z',
    backgroundImage: 'imgi_224_m3_deal_bg.jpg',
    buttonText: 'Shop now',
  },
}

function seed() {
  const categoryCount = db.prepare('SELECT COUNT(*) AS c FROM categories').get().c
  if (categoryCount > 0) return

  const insertCategory = db.prepare(
    'INSERT INTO categories (slug, name, image) VALUES (?, ?, ?)',
  )
  const categoryIdBySlug = {}
  for (const cat of CATEGORY_SEEDS) {
    const { lastInsertRowid } = insertCategory.run(cat.slug, cat.name, cat.image)
    categoryIdBySlug[cat.slug] = Number(lastInsertRowid)
  }

  const insertProduct = db.prepare(`
    INSERT INTO products (slug, name, description, price, compare_at_price, stock_quantity, is_featured, category_id, retail_price, wholesale_min_quantity)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  const insertImage = db.prepare(
    'INSERT INTO product_images (product_id, url, position) VALUES (?, ?, ?)',
  )

  const slugToName = (sport) => sport.toLowerCase()
  const insertAll = db.transaction ? db : null

  const runSeed = () => {
    for (const p of PRODUCT_SEEDS) {
      const categorySlug = slugToName(p.category)
      const categoryId = categoryIdBySlug[categorySlug]
      const retailPrice = Number(p.retailPrice) || Number(p.compareAtPrice) || Number(p.price) || 0
      const wholesaleMinQuantity = Number(p.wholesaleMinQuantity) || (retailPrice > Number(p.price) ? 12 : 0)
      const { lastInsertRowid } = insertProduct.run(
        p.slug,
        p.name,
        p.description,
        p.price,
        p.compareAtPrice ?? null,
        p.stock,
        p.featured ? 1 : 0,
        categoryId ?? null,
        retailPrice,
        wholesaleMinQuantity,
      )
      insertImage.run(Number(lastInsertRowid), p.image, 0)
    }

    db.prepare(
      'INSERT INTO settings (id, payload) VALUES (1, ?) ON CONFLICT(id) DO NOTHING',
    ).run(JSON.stringify(DEFAULT_SETTINGS))
  }

  if (typeof insertAll === 'function') {
    db.exec('BEGIN')
    try {
      runSeed()
      db.exec('COMMIT')
    } catch (err) {
      db.exec('ROLLBACK')
      throw err
    }
  } else {
    runSeed()
  }
}

const pad2 = (n) => String(n).padStart(2, '0')
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const isoUtc = (ms) => {
  const d = new Date(ms)
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())} ${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}:${pad2(d.getUTCSeconds())}`
}

/* -------------------- Sales events seed -------------------- */

const SALES_EVENT_SEEDS = [
  ['Cyber Week Sale', '2026-11-24T00:00:00.000Z', '2026-12-02T23:59:59.000Z', 'Live', 'bg-[#baf120] text-black'],
  ['Basketball Season Launch', '2026-10-14T00:00:00.000Z', null, 'Scheduled', 'bg-white/10 text-gray-300'],
  ['Summer Clearance', '2026-08-12T00:00:00.000Z', '2026-08-22T23:59:59.000Z', 'Live', 'bg-[#baf120] text-black'],
  ['Back to School Kit', '2026-09-01T00:00:00.000Z', '2026-09-10T23:59:59.000Z', 'Scheduled', 'bg-white/10 text-gray-300'],
  ['Spring Training Drop', '2027-03-02T00:00:00.000Z', null, 'Draft', 'bg-white/10 text-gray-300'],
]

function seedSalesEvents() {
  const count = Number(db.prepare('SELECT COUNT(*) AS c FROM sales_events').get().c)
  if (count > 0) return
  const insert = db.prepare(
    'INSERT INTO sales_events (title, starts_at, ends_at, status, color) VALUES (?, ?, ?, ?, ?)',
  )
  const run = db.transaction((rows) => {
    for (const r of rows) insert.run(...r)
  })
  run(SALES_EVENT_SEEDS)
  console.log('[db] Seeded sales events.')
}

/* -------------------- Analytics events seed -------------------- */

function seedAnalyticsEvents() {
  const count = Number(db.prepare('SELECT COUNT(*) AS c FROM analytics_events').get().c)
  if (count > 0) return

  const insert = db.prepare(
    `INSERT INTO analytics_events (event_type, path, source, session_id, created_at) VALUES (?, ?, ?, ?, ?)`,
  )

  const PATHS = [
    '/',
    '/shop',
    '/shop/basketball',
    '/shop/football',
    '/shop/soccers',
    '/shop/softballs',
    '/shop/rugby',
    '/product/quarter-zip-basketball-coachs-pullover',
    '/product/basketball-coachs-zip-up-hoodie',
    '/product/premium-varsity-style-basketball-coaching-jacket',
    '/product/moisture-wicking-basketball-coachs-hoodie',
    '/product/waterproof-basketball-coachs-jacket',
  ]
  const SOURCES = [
    ['Google search', 0.31],
    ['Instagram', 0.19],
    ['Direct', 0.16],
    ['TikTok', 0.11],
    ['Facebook', 0.15],
    ['Email', 0.08],
  ]
  const pickSource = () => {
    let r = Math.random()
    for (const [name, w] of SOURCES) {
      r -= w
      if (r <= 0) return name
    }
    return 'Direct'
  }

  const DAY = 86400e3
  const DAYS = 300
  const now = Date.now()

  const run = db.transaction(() => {
    let sessionSeq = 1
    for (let d = DAYS - 1; d >= 0; d--) {
      const dayStart = now - d * DAY
      const growth = 1 + (DAYS - d) * 0.004
      const sessions = Math.max(8, Math.round((30 + Math.random() * 60) * growth))
      for (let s = 0; s < sessions; s++) {
        const sessionId = `seed-${Math.floor(dayStart / DAY)}-${sessionSeq++}`
        const source = pickSource()
        let t = dayStart + Math.random() * Math.min(DAY, now - dayStart)
        const views = randInt(1, 4)
        for (let v = 0; v < views; v++) {
          insert.run('page_view', PATHS[randInt(0, PATHS.length - 1)], source, sessionId, isoUtc(t))
          t += randInt(20, 600) * 1000
        }
        if (Math.random() < 0.12) {
          insert.run('add_to_cart', PATHS[randInt(0, PATHS.length - 1)], source, sessionId, isoUtc(t + 1000))
        }
        if (Math.random() < 0.04) {
          insert.run('checkout', '/checkout', source, sessionId, isoUtc(t + 2000))
        }
      }
    }
  })
  run()
  console.log('[db] Seeded analytics events.')
}

/* -------------------- Demo orders seed -------------------- */

function seedDemoOrders() {
  const count = Number(db.prepare('SELECT COUNT(*) AS c FROM orders').get().c)
  if (count > 0) return
  const productRows = db.prepare('SELECT id, name, price FROM products ORDER BY id').all()
  if (productRows.length === 0) return

  let customerId = db.prepare('SELECT id FROM users WHERE email = ?').get('demo@echopride.com')?.id
  if (!customerId) {
    const bcrypt = require('bcryptjs')
    const hash = bcrypt.hashSync('demopass123', 10)
    const { lastInsertRowid } = db
      .prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)')
      .run('Demo Customer', 'demo@echopride.com', hash, 'customer')
    customerId = Number(lastInsertRowid)
  }

  const statuses = ['delivered', 'delivered', 'delivered', 'shipped', 'confirmed', 'pending', 'cancelled', 'refunded']
  const methods = ['cod', 'card', 'paypal', 'card']
  const DAY = 86400e3
  const now = Date.now()

  const insertOrder = db.prepare(
    `INSERT INTO orders (order_number, user_id, status, payment_method, subtotal, tax, total, shipping_address, created_at, is_demo)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
  )
  const insertItem = db.prepare(
    'INSERT INTO order_items (order_id, product_id, product_name, price, quantity, image) VALUES (?, ?, ?, ?, ?, ?)',
  )

  const run = db.transaction(() => {
    let seq = 0
    for (let d = 364; d >= 0; d -= randInt(1, 3)) {
      const created = now - d * DAY - randInt(0, 8) * 3600e3
      const itemCount = randInt(1, 3)
      const items = []
      let subtotal = 0
      for (let i = 0; i < itemCount; i++) {
        const p = productRows[randInt(0, productRows.length - 1)]
        const qty = randInt(1, 2)
        items.push({ ...p, qty })
        subtotal += p.price * qty
      }
      const tax = Math.round(subtotal * 0.05 * 100) / 100
      const total = Math.round((subtotal + tax) * 100) / 100

      let orderNumber = `EP-${Math.floor(Math.random() * 1e9)}`
      while (db.prepare('SELECT id FROM orders WHERE order_number = ?').get(orderNumber)) {
        orderNumber = `EP-${Math.floor(Math.random() * 1e9)}`
      }

      const { lastInsertRowid } = insertOrder.run(
        orderNumber,
        customerId,
        statuses[randInt(0, statuses.length - 1)],
        methods[randInt(0, methods.length - 1)],
        subtotal,
        tax,
        total,
        JSON.stringify({
          fullName: 'Demo Customer',
          phone: '+92 300 0000000',
          address: '12 Demo Street',
          city: 'Karachi',
          state: 'Sindh',
          country: 'Pakistan',
        }),
        isoUtc(created),
      )
      const orderId = Number(lastInsertRowid)
      for (const it of items) {
        insertItem.run(orderId, it.id, it.name, it.price, it.qty, '')
      }
      seq += 1
      if (seq >= 220) break
    }
  })
  run()
  console.log('[db] Seeded demo orders for analytics.')
}

/* -------------------- Inquiries seed -------------------- */

const INQUIRY_SEEDS = [
  ['Sarah Ahmed', 'sarah@example.com', 'Custom team order', 'Hi, we need 30 custom basketball jerseys for our club team before the season. Can you quote bulk pricing?', 'new'],
  ['Usman Khan', 'usman@example.com', 'Shipping question', 'How long does shipping take to Lahore? I need the order before next weekend.', 'new'],
  ['Priya Shah', 'priya@example.com', 'Refund status', 'I requested a refund for order EP-881203 last week but havent received a confirmation yet.', 'answered'],
  ['Daniel Lee', 'daniel@example.com', 'Wholesale partnership', 'I run a sports store and would like to discuss wholesale pricing for your football range.', 'new'],
  ['Fatima Noor', 'fatima@example.com', 'Size exchange', 'The hoodie I ordered runs small. Can I exchange it for a larger size?', 'answered'],
  ['Omar Farooq', 'omar@example.com', 'Bulk discount inquiry', 'Looking to purchase 50 training hoodies for a school program. Is there a volume discount?', 'closed'],
]

function seedInquiries() {
  const count = Number(db.prepare('SELECT COUNT(*) AS c FROM inquiries').get().c)
  if (count > 0) return
  const DAY = 86400e3
  const now = Date.now()
  const insert = db.prepare(
    'INSERT INTO inquiries (name, email, subject, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?)',
  )
  const run = db.transaction((rows) => {
    rows.forEach((r, i) => {
      insert.run(r[0], r[1], r[2], r[3], r[4], isoUtc(now - i * DAY * 2 - randInt(0, 12) * 3600e3))
    })
  })
  run(INQUIRY_SEEDS)
  console.log('[db] Seeded inquiries.')
}

/* -------------------- Survey responses seed -------------------- */

const SURVEY_RESPONSE_SEEDS = [
  ['aisha@example.com', 5, 'Love the quality of the jerseys! Will order again.', 'Instagram'],
  ['bilal@example.com', 4, 'Great fit and fast shipping.', 'Google search'],
  ['zara@example.com', 5, 'The sublimated design came out perfect.', 'Direct'],
  ['hamza@example.com', 3, 'Good product, but sizing was a bit off.', 'TikTok'],
  ['mariam@example.com', 5, 'Best team gear we have ever bought.', 'Facebook'],
  ['ali@example.com', 4, 'Customer support was very helpful.', 'Email'],
  ['nadia@example.com', 2, 'Delivery took longer than expected.', 'Google search'],
  ['rehan@example.com', 5, 'Excellent fabric and stitching.', 'Instagram'],
]

function seedSurveyResponses() {
  const count = Number(db.prepare('SELECT COUNT(*) AS c FROM survey_responses').get().c)
  if (count > 0) return
  const DAY = 86400e3
  const now = Date.now()
  const insert = db.prepare(
    'INSERT INTO survey_responses (email, rating, feedback, source, created_at) VALUES (?, ?, ?, ?, ?)',
  )
  const run = db.transaction((rows) => {
    rows.forEach((r, i) => {
      insert.run(r[0], r[1], r[2], r[3], isoUtc(now - i * DAY * 3 - randInt(0, 18) * 3600e3))
    })
  })
  run(SURVEY_RESPONSE_SEEDS)
  console.log('[db] Seeded survey responses.')
}

seed()

// Demo/seed data generators are intentionally disabled so the admin panel
// only ever shows real store activity. Remove these comments to re-enable.
// seedSalesEvents()
// seedAnalyticsEvents()
// seedDemoOrders()
// seedInquiries()
// seedSurveyResponses()

module.exports = db
