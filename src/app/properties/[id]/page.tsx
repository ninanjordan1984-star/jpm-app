import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Building2, Bed, Bath, Square, MapPin, ArrowLeft, Mail } from "lucide-react"

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const property = await prisma.property.findUnique({ where: { id } })
  if (!property) notFound()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-slate-800">JPM Property Management</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <Link
          href="/"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Image */}
          <div className="h-64 bg-gradient-to-br from-blue-100 to-slate-200 flex items-center justify-center">
            {property.imageUrl ? (
              <img src={property.imageUrl} alt={property.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="h-24 w-24 text-blue-300" />
            )}
          </div>

          <div className="p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">{property.name}</h1>
                <div className="flex items-center gap-1 text-slate-500 mt-1">
                  <MapPin className="h-4 w-4" />
                  {property.address}, {property.city}, {property.state} {property.zip}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  ${property.rentAmount.toLocaleString()}
                </div>
                <div className="text-slate-400 text-sm">per month</div>
              </div>
            </div>

            {/* Status badge */}
            <span
              className={`inline-block text-sm font-medium px-3 py-1 rounded-full mb-6 capitalize ${
                property.status === "available"
                  ? "bg-green-100 text-green-700"
                  : property.status === "occupied"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {property.status}
            </span>

            {/* Details grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <span className="text-slate-400 text-xs uppercase tracking-wide">Type</span>
                <div className="font-semibold text-slate-700 capitalize mt-1">{property.type}</div>
              </div>
              {property.bedrooms != null && (
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <span className="text-slate-400 text-xs uppercase tracking-wide">Bedrooms</span>
                  <div className="font-semibold text-slate-700 mt-1 flex items-center justify-center gap-1">
                    <Bed className="h-4 w-4" /> {property.bedrooms}
                  </div>
                </div>
              )}
              {property.bathrooms != null && (
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <span className="text-slate-400 text-xs uppercase tracking-wide">Bathrooms</span>
                  <div className="font-semibold text-slate-700 mt-1 flex items-center justify-center gap-1">
                    <Bath className="h-4 w-4" /> {property.bathrooms}
                  </div>
                </div>
              )}
              {property.sqft != null && (
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <span className="text-slate-400 text-xs uppercase tracking-wide">Square Feet</span>
                  <div className="font-semibold text-slate-700 mt-1 flex items-center justify-center gap-1">
                    <Square className="h-4 w-4" /> {property.sqft.toLocaleString()}
                  </div>
                </div>
              )}
            </div>

            {property.description && (
              <div className="mb-6">
                <h2 className="font-semibold text-slate-700 mb-2">About this property</h2>
                <p className="text-slate-600 leading-relaxed">{property.description}</p>
              </div>
            )}

            {property.status === "available" && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h2 className="font-semibold text-slate-800 mb-2">Interested in this property?</h2>
                <p className="text-slate-600 text-sm mb-4">Contact us to schedule a viewing or apply.</p>
                <a
                  href="mailto:contact@jpmproperties.com"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Mail className="h-4 w-4" /> Contact Us
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
