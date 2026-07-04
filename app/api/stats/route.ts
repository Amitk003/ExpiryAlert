import { prisma } from "@/lib/prisma"
import { getExpiryStatus, getDaysUntilExpiry } from "@/lib/expiry"

export async function GET() {
  const records = await prisma.record.findMany()

  let active = 0
  let expiringSoon = 0
  let expired = 0

  const upcoming: Array<{
    id: number
    name: string
    category: string
    daysUntilExpiry: number
    expiryDate: Date
  }> = []

  const recentlyExpired: Array<{
    id: number
    name: string
    category: string
    daysOverdue: number
    expiryDate: Date
  }> = []

  for (const record of records) {
    const status = getExpiryStatus(record.expiryDate)
    const daysUntilExpiry = getDaysUntilExpiry(record.expiryDate)

    if (status === "active") {
      active++
    } else if (status === "expiring_soon") {
      expiringSoon++
      upcoming.push({
        id: record.id,
        name: record.name,
        category: record.category,
        daysUntilExpiry,
        expiryDate: record.expiryDate,
      })
    } else {
      expired++
      if (daysUntilExpiry >= -30) {
        recentlyExpired.push({
          id: record.id,
          name: record.name,
          category: record.category,
          daysOverdue: Math.abs(daysUntilExpiry),
          expiryDate: record.expiryDate,
        })
      }
    }
  }

  upcoming.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)
  recentlyExpired.sort((a, b) => a.daysOverdue - b.daysOverdue)

  return Response.json({
    total: records.length,
    active,
    expiringSoon,
    expired,
    upcoming: upcoming.slice(0, 10),
    recentlyExpired: recentlyExpired.slice(0, 5),
  })
}
