"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

async function requireAuth() {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")
}

export async function createProperty(formData: FormData) {
  await requireAuth()

  await prisma.property.create({
    data: {
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zip: formData.get("zip") as string,
      type: formData.get("type") as string,
      bedrooms: formData.get("bedrooms") ? Number(formData.get("bedrooms")) : null,
      bathrooms: formData.get("bathrooms") ? Number(formData.get("bathrooms")) : null,
      sqft: formData.get("sqft") ? Number(formData.get("sqft")) : null,
      rentAmount: Number(formData.get("rentAmount")),
      description: (formData.get("description") as string) || null,
      status: (formData.get("status") as string) || "available",
      imageUrl: (formData.get("imageUrl") as string) || null,
    },
  })

  revalidatePath("/admin/properties")
  revalidatePath("/")
  redirect("/admin/properties")
}

export async function updateProperty(id: string, formData: FormData) {
  await requireAuth()

  await prisma.property.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zip: formData.get("zip") as string,
      type: formData.get("type") as string,
      bedrooms: formData.get("bedrooms") ? Number(formData.get("bedrooms")) : null,
      bathrooms: formData.get("bathrooms") ? Number(formData.get("bathrooms")) : null,
      sqft: formData.get("sqft") ? Number(formData.get("sqft")) : null,
      rentAmount: Number(formData.get("rentAmount")),
      description: (formData.get("description") as string) || null,
      status: formData.get("status") as string,
      imageUrl: (formData.get("imageUrl") as string) || null,
    },
  })

  revalidatePath("/admin/properties")
  revalidatePath("/")
  redirect("/admin/properties")
}

export async function deleteProperty(id: string) {
  await requireAuth()
  await prisma.property.delete({ where: { id } })
  revalidatePath("/admin/properties")
  revalidatePath("/")
}
