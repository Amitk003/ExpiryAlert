export type ExpiryStatus = "active" | "expiring_soon" | "expired"

const EXPIRING_SOON_DAYS = 30

export function getExpiryStatus(expiryDate: Date): ExpiryStatus {
  const now = new Date()
  const diffMs = expiryDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return "expired"
  }

  if (diffDays <= EXPIRING_SOON_DAYS) {
    return "expiring_soon"
  }

  return "active"
}

export function getDaysUntilExpiry(expiryDate: Date): number {
  const now = new Date()
  const diffMs = expiryDate.getTime() - now.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
