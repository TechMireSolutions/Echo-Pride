const { sqliteTable, integer, text, real } = require('drizzle-orm/sqlite-core')

const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  image: text('image').notNull().default(''),
})

const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  sku: text('sku').notNull().default(''),
  price: real('price').notNull().default(0),
  compareAtPrice: real('compare_at_price'),
  stockQuantity: integer('stock_quantity').notNull().default(0),
  isFeatured: integer('is_featured').notNull().default(0),
  categoryId: integer('category_id'),
  createdAt: text('created_at'),
  updatedAt: text('updated_at'),
})

const productImages = sqliteTable('product_images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').notNull(),
  url: text('url').notNull(),
  position: integer('position').notNull().default(0),
})

const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('customer'),
  createdAt: text('created_at'),
})

const cartItems = sqliteTable('cart_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull(),
  productId: integer('product_id').notNull(),
  quantity: integer('quantity').notNull().default(1),
  createdAt: text('created_at'),
})

const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderNumber: text('order_number').notNull().unique(),
  userId: integer('user_id'),
  status: text('status').notNull().default('pending'),
  paymentMethod: text('payment_method').notNull().default('cod'),
  subtotal: real('subtotal').notNull().default(0),
  tax: real('tax').notNull().default(0),
  total: real('total').notNull().default(0),
  shippingAddress: text('shipping_address').notNull().default('{}'),
  isDemo: integer('is_demo').notNull().default(0),
  createdAt: text('created_at'),
})

const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').notNull(),
  productId: integer('product_id'),
  productName: text('product_name').notNull(),
  price: real('price').notNull().default(0),
  quantity: integer('quantity').notNull().default(1),
  image: text('image').notNull().default(''),
})

const settings = sqliteTable('settings', {
  id: integer('id').primaryKey(),
  payload: text('payload').notNull(),
})

const analyticsEvents = sqliteTable('analytics_events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  eventType: text('event_type').notNull().default('page_view'),
  path: text('path').notNull().default(''),
  source: text('source').notNull().default(''),
  sessionId: text('session_id').notNull().default(''),
  createdAt: text('created_at'),
})

const salesEvents = sqliteTable('sales_events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  startsAt: text('starts_at').notNull(),
  endsAt: text('ends_at'),
  status: text('status').notNull().default('draft'),
  color: text('color').notNull().default(''),
  createdAt: text('created_at'),
})

const priceTiers = sqliteTable('price_tiers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').notNull(),
  type: text('type').notNull().default('retail'),
  minQuantity: integer('min_quantity').notNull().default(1),
  price: real('price').notNull().default(0),
  label: text('label').notNull().default(''),
})

const productVideos = sqliteTable('product_videos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').notNull(),
  url: text('url').notNull(),
  poster: text('poster').notNull().default(''),
  title: text('title').notNull().default(''),
  kind: text('kind').notNull().default('link'),
  position: integer('position').notNull().default(0),
  duration: real('duration'),
})

const mediaAssets = sqliteTable('media_assets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type').notNull().default('image'),
  title: text('title').notNull().default(''),
  url: text('url').notNull(),
  thumb: text('thumb').notNull().default(''),
  mime: text('mime').notNull().default(''),
  size: integer('size').notNull().default(0),
  duration: real('duration'),
  kind: text('kind').notNull().default('upload'),
  productId: integer('product_id'),
  createdAt: text('created_at'),
})

const notifications = sqliteTable('notifications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type').notNull().default('system'),
  title: text('title').notNull().default(''),
  message: text('message').notNull().default(''),
  data: text('data').notNull().default('{}'),
  isRead: integer('is_read').notNull().default(0),
  createdAt: text('created_at'),
})

const orderStatusEvents = sqliteTable('order_status_events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').notNull(),
  fromStatus: text('from_status').notNull().default(''),
  toStatus: text('to_status').notNull().default(''),
  note: text('note').notNull().default(''),
  actor: text('actor').notNull().default('system'),
  createdAt: text('created_at'),
})

module.exports = {
  categories,
  products,
  productImages,
  users,
  cartItems,
  orders,
  orderItems,
  settings,
  analyticsEvents,
  salesEvents,
  priceTiers,
  productVideos,
  mediaAssets,
  notifications,
  orderStatusEvents,
}
