/**
 * Client-side mirror of the backend wholesale engine (Backend/wholesale.js).
 * Used for the live pricing preview in the product editor.
 */

const round2 = (n) => Math.round(n * 100) / 100

function asNumber(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export function normalizeTiers(raw = [], retailPrice = 0) {
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

export function computeQuote({ retailPrice = 0, tiers = [], quantity = 1 }) {
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

export default computeQuote
