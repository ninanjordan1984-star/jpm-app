import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Plus, Users, Pencil, Trash2, Phone, Mail } from "lucide-react"
import { deleteTenant } from "@/lib/actions/tenants"

export default async function AdminTenantsPage() {
  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      leases: {
        where: { status: "active" },
        include: { property: true },
      },
    },
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tenants</h1>
          <p className="text-slate-500 text-sm mt-1">{tenants.length} total</p>
        </div>
        <Link
          href="/admin/tenants/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" /> Add Tenant
        </Link>
      </div>

      {tenants.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-16 text-center">
          <Users className="h-16 w-16 text-slate-200 mx-auto mb-4" />
          <h2 className="font-semibold text-slate-600 mb-2">No tenants yet</h2>
          <p className="text-slate-400 text-sm mb-6">Add your first tenant to get started.</p>
          <Link
            href="/admin/tenants/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            <Plus className="h-4 w-4" /> Add Tenant
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tenants.map((t) => (
            <div key={t.id} className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold text-slate-800">
                    {t.firstName} {t.lastName}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Added {new Date(t.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/tenants/${t.id}/edit`}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <form
                    action={async () => {
                      "use server"
                      await deleteTenant(t.id)
                    }}
                  >
                    <button
                      type="submit"
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>

              <div className="space-y-1 text-sm mb-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="h-3.5 w-3.5 text-slate-400" /> {t.email}
                </div>
                {t.phone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="h-3.5 w-3.5 text-slate-400" /> {t.phone}
                  </div>
                )}
              </div>

              {t.leases.length > 0 ? (
                <div className="border-t border-slate-100 pt-3 mt-3">
                  <div className="text-xs font-medium text-slate-500 mb-1">Active Lease</div>
                  {t.leases.map((l) => (
                    <div key={l.id} className="text-sm text-slate-700">
                      <div className="font-medium">{l.property.name}</div>
                      <div className="text-xs text-slate-400">
                        ${l.rentAmount.toLocaleString()}/mo ·{" "}
                        {new Date(l.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-t border-slate-100 pt-3 mt-3">
                  <div className="text-xs text-slate-400">No active lease</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Lease section */}
      <div className="mt-8 bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="font-semibold text-slate-800 mb-4">Create Lease</h2>
        <LeaseForm />
      </div>
    </div>
  )
}

async function LeaseForm() {
  const [properties, tenants] = await Promise.all([
    prisma.property.findMany({ orderBy: { name: "asc" } }),
    prisma.tenant.findMany({ orderBy: { lastName: "asc" } }),
  ])

  const { createLease } = await import("@/lib/actions/tenants")

  return (
    <form action={createLease} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Property *</label>
        <select name="propertyId" required className="input">
          <option value="">Select property</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Tenant *</label>
        <select name="tenantId" required className="input">
          <option value="">Select tenant</option>
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>
              {t.firstName} {t.lastName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Rent ($) *</label>
        <input name="rentAmount" type="number" min="0" step="0.01" required className="input" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Start Date *</label>
        <input name="startDate" type="date" required className="input" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">End Date *</label>
        <input name="endDate" type="date" required className="input" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Security Deposit ($)</label>
        <input name="deposit" type="number" min="0" step="0.01" className="input" />
      </div>
      <div className="sm:col-span-2 lg:col-span-3">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Create Lease
        </button>
      </div>
    </form>
  )
}
