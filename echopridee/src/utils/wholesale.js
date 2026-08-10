/**
 * Client-side mirror of the backend wholesale engine (Backend/wholesale.js).
 * Used for live pricing preview in the product editor and storefront display.
 */

const round2 = (n) => Math.round(n * 100) / 100

function asNumber(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

/**
 * Coerce an arbitrary tiers payload into a normalised array:
 *   [{ type: 'retail'|'wholesale', minQuantity: int, price: number, label: string }]
 * Retail is always a single breakpoint starting at quantity 1.
 *
 * Options:
 *   wholesaleMinQuantity {number} product-level minimum quantity that unlocks
 *     wholesale pricing when no explicit wholesale break is configured.
 *   wholesalePrice {number} unit price used at/above wholesaleMinQuantity when
 *     no explicit wholesale break is configured.
 */
export function normalizeTiers(raw = [], retailPrice = 0, opts = {}) {
  const { wholesaleMinQuantity = 0, wholesalePrice = 0 } = opts || {}
  const out = []
  if (Array.isArray(raw)) {
    for (const t of raw) {
      if (!t || typeof t !== 'object') continue
      const type = String(t.type || (Number(t.minQuantity) > 1 ? 'wholesale' : 'retail')).toLowerCase()
      const minQuantity = Math.max(1, Math.floor(asNumber(t.minQuantity, type === 'retail' ? 1 : 2)))
      const price = round2(Math.max(0, asNumber(t.price)))
      const label = String(t.label || '')
      if (price <= 0) continue
      out.push({ type, minQuantity, price, label })
    }
  }

  if (!out.some((t) => t.type === 'retail')) {
    out.unshift({ type: 'retail', minQuantity: 1, price: round2(Math.max(0, asNumber(retailPrice))), label: 'Retail' })
  }

  // Product-level minimum quantity rule: synthesise a wholesale break when the
  // merchant configured a threshold but did not define explicit wholesale tiers.
  if (
    !out.some((t) => t.type === 'wholesale') &&
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

  out.sort((a, b) => (a.type === 'retail' ? -1 : b.type === 'retail' ? 1 : a.minQuantity - b.minQuantity))

  let best = Infinity
  return out.filter((t) => {
    if (t.price < best) {
      best = t.price
      return true
    }
    return false
  })
}

export function retailPriceOf(tiers, fallback = 0) {
  const retail = normalizeTiers(tiers).find((t) => t.type === 'retail')
  return retail ? retail.price : round2(Math.max(0, asNumber(fallback)))
}

export function tierForQuantity(tiers, quantity) {
  const qty = Math.max(1, Math.floor(asNumber(quantity, 1)))
  const breaks = normalizeTiers(tiers).filter((t) => t.type === 'wholesale' && qty >= t.minQuantity)
  if (breaks.length === 0) return null
  return breaks[breaks.length - 1]
}

export function computeQuote({ retailPrice = 0, tiers = [], quantity = 1, wholesaleMinQuantity = 0, wholesalePrice = 0 }) {
  const qty = Math.max(1, Math.floor(asNumber(quantity, 1)))
  const normalized = normalizeTiers(tiers, retailPrice, { wholesaleMinQuantity, wholesalePrice })
  const base = retailPriceOf(normalized, retailPrice)

  const appliedTier = tierForQuantity(normalized, qty)
  const unitPrice = appliedTier ? round2(appliedTier.price) : round2(base)
  const total = round2(unitPrice * qty)
  const retailTotal = round2(base * qty)
  const saving = round2(Math.max(0, retailTotal - total))
  const discountPct = retailTotal > 0 ? round2((saving / retailTotal) * 100) : 0
  const unitSaving = base > 0 ? round2(((base - unitPrice) / base) * 100) : 0

  const wholesale = wholesaleSummary(normalized, base)

  return {
    quantity: qty,
    retailPrice: round2(base),
    unitPrice,
    total,
    retailTotal,
    saving,
    savingPct: discountPct,
    discountPct: unitSaving,
    appliedTier,
    wholesaleThreshold: wholesale.threshold,
    wholesaleUnitPrice: wholesale.unitPrice === null ? null : round2(wholesale.unitPrice),
  }
}

export function wholesaleSummary(tiers, retailPrice = 0) {
  const normalized = normalizeTiers(tiers, retailPrice)
  const wholesale = normalized.filter((t) => t.type === 'wholesale')
  const entry = wholesale.length ? wholesale[0] : null
  return {
    retailPrice: retailPriceOf(normalized, retailPrice),
    threshold: entry ? entry.minQuantity : null,
    unitPrice: entry ? entry.price : null,
  }
}

/**
 * Derive the display pricing surface for a product object (API or local fallback).
 *
 * API products carry `retailPrice` and `wholesaleMinQuantity` explicitly.
 * Local fallback products only have `price`/`oldPrice`, so the old (struck-out)
 * price is treated as the retail base and the legacy 12-unit minimum is assumed.
 *
 * @returns {{ retail: number, price: number, threshold: number|null, wholesale: number|null, hasWholesale: boolean }}
 */
export function productPricing(product = {}) {
  const hasApiPricing = product.retailPrice !== undefined && product.retailPrice !== null
  const retail = hasApiPricing
    ? Number(product.retailPrice) || Number(product.price) || 0
    : Number(product.oldPrice) || Number(product.price) || 0
  const price = Number(product.price) || 0
  const threshold = hasApiPricing
    ? Math.max(0, Number(product.wholesaleMinQuantity) || 0)
    : 12
  const hasWholesale = threshold > 1 && price > 0 && price < retail
  return {
    retail,
    price,
    threshold: hasWholesale ? threshold : null,
    wholesale: hasWholesale ? price : null,
    hasWholesale,
  }
}

export default computeQuote
