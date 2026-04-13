"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

async function requireAuth() {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")
}

export async function createTenant(formData: FormData) {
  await requireAuth()

  await prisma.tenant.create({
    data: {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
    },
  })

  revalidatePath("/admin/tenants")
  redirect("/admin/tenants")
}

export async function updateTenant(id: string, formData: FormData) {
  await requireAuth()

  await prisma.tenant.update({
    where: { id },
    data: {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
    },
  })

  revalidatePath("/admin/tenants")
  redirect("/admin/tenants")
}

export async function deleteTenant(id: string) {
  await requireAuth()
  await prisma.tenant.delete({ where: { id } })
  revalidatePath("/admin/tenants")
}

export async function createLease(formData: FormData) {
  await requireAuth()

  await prisma.lease.create({
    data: {
      propertyId: formData.get("propertyId") as string,
      tenantId: formData.get("tenantId") as string,
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
      rentAmount: Number(formData.get("rentAmount")),
      deposit: formData.get("deposit") ? Number(formData.get("deposit")) : null,
      status: "active",
    },
  })

  revalidatePath("/admin/tenants")
  revalidatePath("/admin/properties")
  redirect("/admin/tenants")
}
