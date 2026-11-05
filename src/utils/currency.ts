export function formatUsd(value: number | null) {
  if (value === null) return 'Contact us'
  const amount = Number.isFinite(value) ? value : 0
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}
