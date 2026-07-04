import { prisma } from "@/lib/prisma"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const record = await prisma.record.findUnique({
    where: { id: Number(id) },
  })

  if (!record) {
    return Response.json({ error: "Record not found" }, { status: 404 })
  }

  return Response.json(record)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { name, category, description, expiryDate } = body

  const existing = await prisma.record.findUnique({
    where: { id: Number(id) },
  })

  if (!existing) {
    return Response.json({ error: "Record not found" }, { status: 404 })
  }

  const record = await prisma.record.update({
    where: { id: Number(id) },
    data: {
      ...(name !== undefined && { name }),
      ...(category !== undefined && { category }),
      ...(description !== undefined && { description }),
      ...(expiryDate !== undefined && { expiryDate: new Date(expiryDate) }),
    },
  })

  return Response.json(record)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const existing = await prisma.record.findUnique({
    where: { id: Number(id) },
  })

  if (!existing) {
    return Response.json({ error: "Record not found" }, { status: 404 })
  }

  await prisma.record.delete({
    where: { id: Number(id) },
  })

  return Response.json({ success: true })
}
