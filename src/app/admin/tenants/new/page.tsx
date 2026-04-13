import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createTenant } from "@/lib/actions/tenants"

export default function NewTenantPage() {
  return (
    <div className="p-8 max-w-lg">
      <Link
        href="/admin/tenants"
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to tenants
      </Link>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Add New Tenant</h1>

      <form action={createTenant} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
            <input name="firstName" required className="input" placeholder="Jane" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
            <input name="lastName" required className="input" placeholder="Doe" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
          <input name="email" type="email" required className="input" placeholder="jane@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input name="phone" type="tel" className="input" placeholder="(555) 123-4567" />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Save Tenant
          </button>
          <Link
            href="/admin/tenants"
            className="px-6 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
