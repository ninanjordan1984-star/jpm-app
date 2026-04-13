import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createProperty } from "@/lib/actions/properties"

export default function NewPropertyPage() {
  return (
    <div className="p-8 max-w-2xl">
      <Link
        href="/admin/properties"
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to properties
      </Link>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Add New Property</h1>

      <form action={createProperty} className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Property Name *</label>
            <input name="name" required className="input" placeholder="e.g. Oak Street Apartments Unit 2A" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Street Address *</label>
            <input name="address" required className="input" placeholder="123 Main St" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
            <input name="city" required className="input" placeholder="New York" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">State *</label>
            <input name="state" required className="input" placeholder="NY" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ZIP Code *</label>
            <input name="zip" required className="input" placeholder="10001" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type *</label>
            <select name="type" required className="input">
              <option value="">Select type</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bedrooms</label>
            <input name="bedrooms" type="number" min="0" className="input" placeholder="2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bathrooms</label>
            <input name="bathrooms" type="number" min="0" step="0.5" className="input" placeholder="1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Sq. Footage</label>
            <input name="sqft" type="number" min="0" className="input" placeholder="850" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Rent ($) *</label>
            <input name="rentAmount" type="number" min="0" step="0.01" required className="input" placeholder="1500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select name="status" className="input" defaultValue="available">
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
            <input name="imageUrl" type="url" className="input" placeholder="https://..." />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea name="description" rows={3} className="input resize-none" placeholder="Property description..." />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Save Property
          </button>
          <Link
            href="/admin/properties"
            className="px-6 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
