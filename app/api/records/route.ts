import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const category = searchParams.get("category") || ""
  const status = searchParams.get("status") || ""

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

  return Response.json(records)
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
