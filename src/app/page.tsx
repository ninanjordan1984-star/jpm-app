import Link from "next/link"
import { Building2, Phone, Home, FileText, DollarSign, Users, MessageSquare, CheckCircle } from "lucide-react"

const services = [
  {
    icon: <Home className="h-6 w-6" />,
    title: "Property Maintenance",
    description: "Complete upkeep, inspections, and repairs to keep your properties in top condition year-round.",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Lease Administration",
    description: "Full lease management from drafting and signing to renewals and legal compliance.",
  },
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: "Rent Collection Services",
    description: "Reliable, on-time rent collection with detailed financial reporting for property owners.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Tenant Screening & Placement",
    description: "Thorough background checks, credit screening, and placement of quality, long-term tenants.",
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Owner Communication",
    description: "24/7 transparent communication keeping you informed on every aspect of your property.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="JPM Property Management" width={56} height={56} className="object-contain" />
            <span className="text-xl font-bold text-slate-800">JPM Property Management</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="tel:9132073239"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors"
            >
              <Phone className="h-4 w-4" /> 913.207.3239
            </a>
            <Link
              href="/admin"
              className="text-sm text-slate-400 hover:text-blue-600 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative text-white overflow-hidden" style={{background: 'linear-gradient(180deg, #0d1b2e 0%, #1a3a5c 20%, #c47d2a 55%, #e8a830 65%, #1a1a2e 80%, #0a0a1a 100%)'}}>
        <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Professional Property Management
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
              Your Property.<br />
              <span className="text-blue-400">Our Responsibility.</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              We offer top-notch property management services for residential and commercial properties,
              managing tenant relations, legal responsibilities, upkeep, and inspections.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#contact"
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Get Started
              </a>
              <a
                href="#services"
                className="border border-slate-500 hover:border-blue-400 text-slate-200 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Our Services
              </a>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="w-72 h-96 flex items-end justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/owner.jpg" alt="JPM Property Management" className="h-full w-auto object-contain object-bottom" />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">What We Offer</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Comprehensive property management solutions so you can enjoy ownership without the stress.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="h-12 w-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-4">
                  {service.icon}
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">{service.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{service.description}</p>
              </div>
            ))}

            {/* Why choose us card */}
            <div className="bg-blue-700 text-white rounded-xl p-6 sm:col-span-2 lg:col-span-1">
              <h3 className="font-semibold text-lg mb-4">Why Choose JPM?</h3>
              <ul className="space-y-2.5">
                {[
                  "Licensed & insured professionals",
                  "Transparent financial reporting",
                  "Quick maintenance response",
                  "Residential & commercial expertise",
                  "Owner-focused communication",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-blue-100">
                    <CheckCircle className="h-4 w-4 text-blue-300 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-3">Get In Touch</h2>
          <p className="text-slate-500 mb-10">
            Ready to put your property in good hands? Contact us today.
          </p>

          <div className="bg-blue-600 rounded-2xl p-8 text-white">
            <p className="text-blue-200 text-sm uppercase tracking-widest font-semibold mb-2">Call Us</p>
            <a
              href="tel:9132073239"
              className="text-4xl font-bold hover:text-blue-200 transition-colors"
            >
              913.207.3239
            </a>
            <p className="text-blue-200 mt-3 text-sm">Serving Kansas City, Missouri & surrounding areas</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Building2 className="h-4 w-4" />
          <span className="font-semibold text-white">JPM Property Management</span>
        </div>
        <p>© {new Date().getFullYear()} JPM Property Management. All rights reserved.</p>
      </footer>
    </div>
  )
}
