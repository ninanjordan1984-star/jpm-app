import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"
import bcrypt from "bcryptjs"

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding database...")

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@jpm.com" },
    update: {},
    create: {
      email: "admin@jpm.com",
      password: hashedPassword,
      name: "JPM Admin",
    },
  })
  console.log("Created admin user:", admin.email)

  // Create sample properties
  const prop1 = await prisma.property.upsert({
    where: { id: "prop-1" },
    update: {},
    create: {
      id: "prop-1",
      name: "Sunset Apartments Unit 3B",
      address: "412 Sunset Blvd",
      city: "Los Angeles",
      state: "CA",
      zip: "90028",
      type: "apartment",
      bedrooms: 2,
      bathrooms: 1,
      sqft: 850,
      rentAmount: 2200,
      description: "Bright 2-bedroom apartment with modern finishes, in-unit laundry, and a private balcony. Walking distance to shops and restaurants.",
      status: "available",
    },
  })

  const prop2 = await prisma.property.upsert({
    where: { id: "prop-2" },
    update: {},
    create: {
      id: "prop-2",
      name: "Oak Street House",
      address: "87 Oak Street",
      city: "Austin",
      state: "TX",
      zip: "78701",
      type: "house",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1400,
      rentAmount: 2800,
      description: "Charming 3-bedroom house with a large backyard, updated kitchen, and attached garage. Great neighborhood schools.",
      status: "occupied",
    },
  })

  const prop3 = await prisma.property.upsert({
    where: { id: "prop-3" },
    update: {},
    create: {
      id: "prop-3",
      name: "Downtown Condo #12",
      address: "200 Main St",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      type: "condo",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 650,
      rentAmount: 1800,
      description: "Stylish downtown condo with city views, gym access, and concierge. Minutes from the Loop.",
      status: "available",
    },
  })

  console.log("Created properties:", prop1.name, prop2.name, prop3.name)

  // Create sample tenants
  const tenant1 = await prisma.tenant.upsert({
    where: { email: "sarah.johnson@example.com" },
    update: {},
    create: {
      email: "sarah.johnson@example.com",
      firstName: "Sarah",
      lastName: "Johnson",
      phone: "(512) 555-0101",
    },
  })

  const tenant2 = await prisma.tenant.upsert({
    where: { email: "mike.chen@example.com" },
    update: {},
    create: {
      email: "mike.chen@example.com",
      firstName: "Mike",
      lastName: "Chen",
      phone: "(512) 555-0182",
    },
  })

  console.log("Created tenants:", tenant1.email, tenant2.email)

  // Create a lease for the occupied property
  const existingLease = await prisma.lease.findFirst({
    where: { propertyId: prop2.id, tenantId: tenant1.id },
  })

  if (!existingLease) {
    const lease = await prisma.lease.create({
      data: {
        propertyId: prop2.id,
        tenantId: tenant1.id,
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-12-31"),
        rentAmount: 2800,
        deposit: 5600,
        status: "active",
      },
    })
    console.log("Created lease:", lease.id)

    // Create some payments
    await prisma.payment.createMany({
      data: [
        { leaseId: lease.id, amount: 2800, dueDate: new Date("2025-01-01"), paidDate: new Date("2025-01-02"), status: "paid" },
        { leaseId: lease.id, amount: 2800, dueDate: new Date("2025-02-01"), paidDate: new Date("2025-02-01"), status: "paid" },
        { leaseId: lease.id, amount: 2800, dueDate: new Date("2025-03-01"), paidDate: new Date("2025-03-03"), status: "paid" },
        { leaseId: lease.id, amount: 2800, dueDate: new Date("2025-04-01"), status: "pending" },
      ],
    })
    console.log("Created payments")
  }

  // Create sample expenses
  const existingExpense = await prisma.expense.findFirst({ where: { propertyId: prop2.id } })
  if (!existingExpense) {
    await prisma.expense.createMany({
      data: [
        { propertyId: prop2.id, category: "maintenance", description: "HVAC tune-up", amount: 350, date: new Date("2025-01-15") },
        { propertyId: prop1.id, category: "insurance", description: "Annual property insurance", amount: 1200, date: new Date("2025-01-01") },
        { propertyId: prop3.id, category: "management", description: "Management fee - Q1", amount: 540, date: new Date("2025-01-05") },
      ],
    })
    console.log("Created expenses")
  }

  console.log("\nSeed complete!")
  console.log("Login: admin@jpm.com / admin123")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
