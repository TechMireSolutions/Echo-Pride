export const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

export function sizesLabel(sizes) {
  if (!sizes || typeof sizes !== 'object') return null
  const parts = Object.entries(sizes).filter(([, n]) => Number(n) > 0)
  return parts.length ? parts.map(([size, n]) => `${size}: ${n}`).join(' · ') : null
}
