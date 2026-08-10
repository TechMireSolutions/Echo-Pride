/**
 * Wholesale calculation engine.
 *
 * Pure functions shared by the product editor, the quote endpoint and (in the
 * future) the checkout/cart pipeline. Price breaks follow the standard
 * "min-quantity" model: a tier with `minQuantity` applies from that quantity up
 * to (but excluding) the next tier's `minQuantity`.
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
 */
function normalizeTiers(raw = [], retailPrice = 0) {
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

  out.sort((a, b) => (a.type === 'retail' ? -1 : b.type === 'retail' ? 1 : a.minQuantity - b.minQuantity))

  // Drop wholesale breaks that are not cheaper than the retail price (or a
  // cheaper earlier break) — they would never be applied.
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
 * Returns null when no wholesale break is reached (retail applies).
 */
function tierForQuantity(tiers, quantity) {
  const qty = Math.max(1, Math.floor(asNumber(quantity, 1)))
  const breaks = normalizeTiers(tiers).filter((t) => t.type === 'wholesale' && qty >= t.minQuantity)
  if (breaks.length === 0) return null
  return breaks[breaks.length - 1]
}

function retailPriceOf(tiers, fallback = 0) {
  const retail = normalizeTiers(tiers).find((t) => t.type === 'retail')
  return retail ? retail.price : round2(Math.max(0, asNumber(fallback)))
}

/**
 * Compute a quote for `quantity` units of a product.
 *
 * @returns {{
 *   quantity, unitPrice, total, saving, savingPct, discountPct,
 *   appliedTier: ({minQuantity, price, label}|null), retailPrice
 * }}
 */
function quote({ retailPrice = 0, tiers = [], quantity = 1 }) {
  const qty = Math.max(1, Math.floor(asNumber(quantity, 1)))
  const normalized = normalizeTiers(tiers, retailPrice)
  const base = retailPriceOf(normalized, retailPrice)

  const appliedTier = tierForQuantity(normalized, qty)
  const unitPrice = appliedTier ? round2(appliedTier.price) : round2(base)
  const total = round2(unitPrice * qty)
  const retailTotal = round2(base * qty)
  const saving = round2(Math.max(0, retailTotal - total))
  const discountPct = retailTotal > 0 ? round2((saving / retailTotal) * 100) : 0
  const unitSaving = base > 0 ? round2(((base - unitPrice) / base) * 100) : 0

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
  }
}

module.exports = { quote, normalizeTiers, tierForQuantity, retailPriceOf }
