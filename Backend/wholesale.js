/**
 * Wholesale calculation engine.
 *
 * Pure functions shared by the product editor, the quote endpoint and the
 * checkout/cart pipeline. Price breaks follow the standard "min-quantity"
 * model: a tier with `minQuantity` applies from that quantity up to (but
 * excluding) the next tier's `minQuantity`.
 *
 * This engine is wholesale-only — there is no retail pricing path. The base
 * price for a product IS its wholesale unit price.
 */

const round2 = (n) => Math.round(n * 100) / 100

function asNumber(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

/**
 * Coerce an arbitrary tiers payload into a normalised array of wholesale
 * breaks:
 *   [{ type: 'wholesale', minQuantity: int, price: number, label: string }]
 * Any legacy retail tiers are dropped.
 *
 * Options:
 *   wholesaleMinQuantity {number} product-level minimum quantity that unlocks
 *     wholesale pricing when no explicit wholesale break is configured.
 *   wholesalePrice {number} unit price used at/above wholesaleMinQuantity when
 *     no explicit wholesale break is configured.
 */
function normalizeTiers(raw = [], basePrice = 0, opts = {}) {
  const { wholesaleMinQuantity = 0, wholesalePrice = 0 } = opts || {}
  const out = []
  if (Array.isArray(raw)) {
    for (const t of raw) {
      if (!t || typeof t !== 'object') continue
      const type = String(t.type || 'wholesale').toLowerCase()
      if (type !== 'wholesale') continue
      const minQuantity = Math.max(1, Math.floor(asNumber(t.minQuantity, 2)))
      const price = round2(Math.max(0, asNumber(t.price)))
      if (price <= 0) continue
      out.push({ type: 'wholesale', minQuantity, price, label: String(t.label || '') })
    }
  }

  // Product-level minimum quantity rule: synthesise a wholesale break when the
  // merchant configured a threshold but did not define explicit wholesale tiers.
  if (
    out.length === 0 &&
    asNumber(wholesaleMinQuantity) > 0 &&
    asNumber(wholesalePrice) > 0
  ) {
    const minQty = Math.max(1, Math.floor(asNumber(wholesaleMinQuantity)))
    out.push({
      type: 'wholesale',
      minQuantity: minQty,
      price: round2(Math.max(0, asNumber(wholesalePrice))),
      label: `Wholesale ${minQty}+`,
    })
  }

  out.sort((a, b) => a.minQuantity - b.minQuantity)

  // Drop wholesale breaks that are not cheaper than a cheaper earlier break —
  // they would never be applied.
  let best = Infinity
  return out.filter((t) => {
    if (t.price < best) {
      best = t.price
      return true
    }
    return false
  })
}

/**
 * Return the price tier that applies for a given quantity.
 * Returns null when no wholesale break is reached.
 */
function tierForQuantity(tiers, quantity) {
  const qty = Math.max(1, Math.floor(asNumber(quantity, 1)))
  const breaks = normalizeTiers(tiers).filter((t) => qty >= t.minQuantity)
  if (breaks.length === 0) return null
  return breaks[breaks.length - 1]
}

/**
 * First (lowest-quantity) wholesale break for a product.
 */
function wholesaleSummary(tiers, basePrice = 0) {
  const normalized = normalizeTiers(tiers, basePrice)
  const entry = normalized.length ? normalized[0] : null
  return {
    basePrice: round2(Math.max(0, asNumber(basePrice))),
    threshold: entry ? entry.minQuantity : null,
    unitPrice: entry ? entry.price : null,
  }
}

/**
 * Compute a quote for `quantity` units of a product.
 *
 * @param {object} args
 * @param {number} args.basePrice       wholesale unit price (fallback when no tier applies)
 * @param {Array}  args.tiers           explicit wholesale tiers
 * @param {number} args.quantity        requested quantity
 * @param {number} [args.wholesaleMinQuantity] product-level minimum quantity
 * @param {number} [args.wholesalePrice]       product-level wholesale unit price
 * @returns {{quantity, unitPrice, total, appliedTier, wholesaleThreshold, wholesaleUnitPrice}}
 */
function quote({ basePrice = 0, tiers = [], quantity = 1, wholesaleMinQuantity = 0, wholesalePrice = 0 }) {
  const qty = Math.max(1, Math.floor(asNumber(quantity, 1)))
  const normalized = normalizeTiers(tiers, basePrice, { wholesaleMinQuantity, wholesalePrice })
  const appliedTier = tierForQuantity(normalized, qty)
  const unitPrice = appliedTier ? round2(appliedTier.price) : round2(asNumber(basePrice))
  const total = round2(unitPrice * qty)

  return {
    quantity: qty,
    unitPrice,
    total,
    appliedTier,
    wholesaleThreshold: normalized.length ? normalized[0].minQuantity : null,
    wholesaleUnitPrice: normalized.length ? round2(normalized[0].price) : null,
  }
}

module.exports = { quote, normalizeTiers, tierForQuantity, wholesaleSummary }