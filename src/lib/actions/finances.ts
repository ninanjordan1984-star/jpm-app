"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

async function requireAuth() {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")
}

export async function createExpense(formData: FormData) {
  await requireAuth()

  await prisma.expense.create({
    data: {
      propertyId: formData.get("propertyId") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      amount: Number(formData.get("amount")),
      date: new Date(formData.get("date") as string),
    },
  })

  revalidatePath("/admin/financials")
  redirect("/admin/financials")
}

export async function createPayment(formData: FormData) {
  await requireAuth()

  await prisma.payment.create({
    data: {
      leaseId: formData.get("leaseId") as string,
      amount: Number(formData.get("amount")),
      dueDate: new Date(formData.get("dueDate") as string),
      paidDate: formData.get("paidDate") ? new Date(formData.get("paidDate") as string) : null,
      status: formData.get("paidDate") ? "paid" : "pending",
      notes: (formData.get("notes") as string) || null,
    },
  })

  revalidatePath("/admin/financials")
  redirect("/admin/financials")
}

export async function markPaymentPaid(id: string) {
  await requireAuth()

  await prisma.payment.update({
    where: { id },
    data: { status: "paid", paidDate: new Date() },
  })

  revalidatePath("/admin/financials")
}
