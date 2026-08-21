export const mapApiProduct = (p) => ({
  id: p.id,
  slug: p.slug,
  title: p.name,
  subtitle: p.category?.name || '',
  category: p.category?.name || '',
  sport: p.category?.name || '',
  price: Number(p.price),
  wholesaleMinQuantity:
    p.wholesaleMinQuantity !== undefined && p.wholesaleMinQuantity !== null
      ? Number(p.wholesaleMinQuantity)
      : undefined,
  tiers: Array.isArray(p.tiers) ? p.tiers : [],
  reviews: 0,
  image: (p.images && p.images[0] ? p.images[0] : '').replace(/^\/+/, ''),
  description: p.description || '',
  stock: Number(p.stockQuantity ?? 0),
  isFeatured: Boolean(p.isFeatured),
})

export const mapApiCartItem = (item) => ({
  id: item.product.id,
  cartItemId: item.id,
  slug: item.product.slug,
  title: item.product.name,
  price:
    item.effectivePrice !== undefined && item.effectivePrice !== null
      ? Number(item.effectivePrice)
      : Number(item.product.price),
  size: 'L',
  qty: item.quantity,
  image: (item.product.images && item.product.images[0] ? item.product.images[0] : '').replace(/^\/+/, ''),
})
