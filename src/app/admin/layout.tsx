import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Building2, LayoutDashboard, Home, Users, DollarSign, LogOut } from "lucide-react"
import { signOut } from "@/lib/auth"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-60 bg-slate-900 text-white flex flex-col fixed h-full">
        {/* Brand */}
        <div className="flex items-center gap-2 px-5 py-5 border-b border-slate-700">
          <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold leading-tight">JPM Property</div>
            <div className="text-xs text-slate-400">Management</div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink href="/admin" icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" exact />
          <NavLink href="/admin/properties" icon={<Home className="h-4 w-4" />} label="Properties" />
          <NavLink href="/admin/tenants" icon={<Users className="h-4 w-4" />} label="Tenants" />
          <NavLink href="/admin/financials" icon={<DollarSign className="h-4 w-4" />} label="Financials" />
        </nav>

        {/* User + sign out */}
        <div className="border-t border-slate-700 p-4">
          <div className="text-xs text-slate-400 truncate mb-2">{session.user.email}</div>
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-60 flex-1 min-h-screen">{children}</main>
    </div>
  )
}

function NavLink({
  href,
  icon,
  label,
  exact = false,
}: {
  href: string
  icon: React.ReactNode
  label: string
  exact?: boolean
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
    >
      {icon}
      {label}
    </Link>
  )
}
