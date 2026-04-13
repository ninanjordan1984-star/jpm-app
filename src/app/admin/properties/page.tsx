import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Plus, Pencil, Trash2, Building2, MapPin } from "lucide-react"
import { deleteProperty } from "@/lib/actions/properties"

export default async function AdminPropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { leases: true } },
    },
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Properties</h1>
          <p className="text-slate-500 text-sm mt-1">{properties.length} total</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" /> Add Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-16 text-center">
          <Building2 className="h-16 w-16 text-slate-200 mx-auto mb-4" />
          <h2 className="font-semibold text-slate-600 mb-2">No properties yet</h2>
          <p className="text-slate-400 text-sm mb-6">Add your first property to get started.</p>
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            <Plus className="h-4 w-4" /> Add Property
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">
                  Property
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">
                  Type
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">
                  Rent
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">
                  Leases
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{p.name}</div>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                      <MapPin className="h-3 w-3" /> {p.address}, {p.city}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600 capitalize">{p.type}</td>
                  <td className="px-4 py-4 text-sm font-medium text-slate-700">
                    ${p.rentAmount.toLocaleString()}/mo
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                        p.status === "available"
                          ? "bg-green-100 text-green-700"
                          : p.status === "occupied"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-500">{p._count.leases}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/properties/${p.id}/edit`}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <form
                        action={async () => {
                          "use server"
                          await deleteProperty(p.id)
                        }}
                      >
                        <button
                          type="submit"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          onClick={(e) => {
                            if (!confirm("Delete this property?")) e.preventDefault()
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
