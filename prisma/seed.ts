import { PrismaClient } from "@/app/generated/prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"

const adapter = new PrismaBetterSqlite3({
  url: "file:./dev.db",
})

const prisma = new PrismaClient({ adapter })

const categories = [
  "Vendor Contract",
  "Compliance Certificate",
  "Insurance Policy",
  "Safety Training",
  "Machine Inspection",
  "Government License",
  "Service Agreement",
  "Quality Certification",
]

const records = [
  {
    name: "Azure Cloud Services Agreement",
    category: "Vendor Contract",
    description: "Annual cloud infrastructure contract with Microsoft",
    expiryDate: new Date("2027-06-15"),
  },
  {
    name: "ISO 9001 Quality Certification",
    category: "Compliance Certificate",
    description: "International quality management standard certification",
    expiryDate: new Date("2026-03-20"),
  },
  {
    name: "General Liability Insurance",
    category: "Insurance Policy",
    description: "Annual general liability coverage for operations",
    expiryDate: new Date("2025-12-31"),
  },
  {
    name: "Fire Safety Training Record",
    category: "Safety Training",
    description: "Annual fire safety training for all employees",
    expiryDate: new Date("2025-08-15"),
  },
  {
    name: "CNC Machine Annual Inspection",
    category: "Machine Inspection",
    description: "Yearly safety and performance inspection for CNC machines",
    expiryDate: new Date("2025-07-10"),
  },
  {
    name: "Trade License Renewal",
    category: "Government License",
    description: "Municipal trade license for business operations",
    expiryDate: new Date("2025-09-30"),
  },
  {
    name: "Office Lease Agreement",
    category: "Service Agreement",
    description: "Three year lease for corporate office space",
    expiryDate: new Date("2027-01-31"),
  },
  {
    name: "CE Marking Certification",
    category: "Quality Certification",
    description: "European conformity certification for manufactured products",
    expiryDate: new Date("2025-06-28"),
  },
  {
    name: "AWS Enterprise Support Plan",
    category: "Vendor Contract",
    description: "Premium support contract for AWS infrastructure",
    expiryDate: new Date("2026-02-28"),
  },
  {
    name: "Environmental Compliance Certificate",
    category: "Compliance Certificate",
    description: "Environmental clearance from pollution control board",
    expiryDate: new Date("2025-05-10"),
  },
  {
    name: "Workers Compensation Insurance",
    category: "Insurance Policy",
    description: "Employee injury and compensation coverage",
    expiryDate: new Date("2025-11-30"),
  },
  {
    name: "Electrical Safety Training",
    category: "Safety Training",
    description: "Annual electrical safety refresher for maintenance staff",
    expiryDate: new Date("2025-07-25"),
  },
  {
    name: "Overhead Crane Inspection",
    category: "Machine Inspection",
    description: "Annual load testing and safety inspection of overhead cranes",
    expiryDate: new Date("2024-12-01"),
  },
  {
    name: "FSSAI Food License",
    category: "Government License",
    description: "Food safety license for cafeteria operations",
    expiryDate: new Date("2026-04-30"),
  },
  {
    name: "IT Support Services Contract",
    category: "Service Agreement",
    description: "Managed IT services for helpdesk and infrastructure",
    expiryDate: new Date("2025-10-15"),
  },
]

async function main() {
  console.log("Seeding database...")

  for (const record of records) {
    await prisma.record.create({
      data: record,
    })
    console.log(`  Created: ${record.name}`)
  }

  console.log("Seeding complete.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
