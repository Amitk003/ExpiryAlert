import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getExpiryStatus, getDaysUntilExpiry } from "@/lib/expiry"

const statusPriority: Record<string, number> = {
  expired: 0,
  expiring_soon: 1,
  active: 2,
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const category = searchParams.get("category") || ""
  const statusFilter = searchParams.get("status") || ""

  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ]
  }

  if (category) {
    where.category = category
  }

  const records = await prisma.record.findMany({
    where,
    orderBy: { expiryDate: "asc" },
  })

  let recordsWithStatus = records.map((record) => {
    const status = getExpiryStatus(record.expiryDate)
    const daysUntilExpiry = getDaysUntilExpiry(record.expiryDate)
    return {
      ...record,
      status,
      daysUntilExpiry,
    }
  })

  if (statusFilter) {
    recordsWithStatus = recordsWithStatus.filter((r) => r.status === statusFilter)
  }

  recordsWithStatus.sort((a, b) => {
    const priorityA = statusPriority[a.status]
    const priorityB = statusPriority[b.status]
    if (priorityA !== priorityB) return priorityA - priorityB
    return a.daysUntilExpiry - b.daysUntilExpiry
  })

  return Response.json(recordsWithStatus)
}

export async function POST(request: Request) {
  const body = await request.json()

  const { name, category, description, expiryDate } = body

  if (!name || !category || !expiryDate) {
    return Response.json(
      { error: "Name, category, and expiry date are required" },
      { status: 400 }
    )
  }

  const record = await prisma.record.create({
    data: {
      name,
      category,
      description: description || null,
      expiryDate: new Date(expiryDate),
    },
  })

  return Response.json(record, { status: 201 })
}
