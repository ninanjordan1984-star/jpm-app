import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Home, Users, DollarSign, TrendingUp, AlertCircle } from "lucide-react"

export default async function AdminDashboard() {
  const [
    totalProperties,
    occupiedProperties,
    availableProperties,
    totalTenants,
    activeLeases,
    recentPayments,
    pendingPayments,
    recentExpenses,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { status: "occupied" } }),
    prisma.property.count({ where: { status: "available" } }),
    prisma.tenant.count(),
    prisma.lease.count({ where: { status: "active" } }),
    prisma.payment.findMany({
      where: { status: "paid" },
      orderBy: { paidDate: "desc" },
      take: 5,
      include: { lease: { include: { property: true, tenant: true } } },
    }),
    prisma.payment.count({ where: { status: "pending" } }),
    prisma.expense.findMany({
      orderBy: { date: "desc" },
      take: 5,
      include: { property: true },
    }),
  ])

  const thisMonth = new Date()
  thisMonth.setDate(1)
  thisMonth.setHours(0, 0, 0, 0)

  const monthlyIncomeResult = await prisma.payment.aggregate({
    where: { status: "paid", paidDate: { gte: thisMonth } },
    _sum: { amount: true },
  })

  const monthlyExpenseResult = await prisma.expense.aggregate({
    where: { date: { gte: thisMonth } },
    _sum: { amount: true },
  })

  const monthlyIncome = monthlyIncomeResult._sum.amount ?? 0
  const monthlyExpenses = monthlyExpenseResult._sum.amount ?? 0
  const netIncome = monthlyIncome - monthlyExpenses

  const stats = [
    {
      label: "Total Properties",
      value: totalProperties,
      sub: `${occupiedProperties} occupied · ${availableProperties} available`,
      icon: <Home className="h-5 w-5" />,
      color: "bg-blue-50 text-blue-600",
      href: "/admin/properties",
    },
    {
      label: "Active Tenants",
      value: totalTenants,
      sub: `${activeLeases} active lease${activeLeases !== 1 ? "s" : ""}`,
      icon: <Users className="h-5 w-5" />,
      color: "bg-violet-50 text-violet-600",
      href: "/admin/tenants",
    },
    {
      label: "This Month Income",
      value: `$${monthlyIncome.toLocaleString()}`,
      sub: `$${monthlyExpenses.toLocaleString()} expenses`,
      icon: <DollarSign className="h-5 w-5" />,
      color: "bg-green-50 text-green-600",
      href: "/admin/financials",
    },
    {
      label: "Net Income",
      value: `$${netIncome.toLocaleString()}`,
      sub: pendingPayments > 0 ? `${pendingPayments} payment${pendingPayments !== 1 ? "s" : ""} pending` : "All caught up",
      icon: <TrendingUp className="h-5 w-5" />,
      color: netIncome >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600",
      href: "/admin/financials",
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-500">{s.label}</span>
                <span className={`h-9 w-9 rounded-lg flex items-center justify-center ${s.color}`}>
                  {s.icon}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent payments */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">Recent Payments</h2>
            <Link href="/admin/financials" className="text-xs text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          {recentPayments.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">No payments recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {recentPayments.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium text-slate-700">
                      {p.lease.tenant.firstName} {p.lease.tenant.lastName}
                    </div>
                    <div className="text-xs text-slate-400">{p.lease.property.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">${p.amount.toLocaleString()}</div>
                    <div className="text-xs text-slate-400">
                      {p.paidDate ? new Date(p.paidDate).toLocaleDateString() : "—"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent expenses */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">Recent Expenses</h2>
            <Link href="/admin/financials" className="text-xs text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          {recentExpenses.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">No expenses recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {recentExpenses.map((e) => (
                <div key={e.id} className="flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium text-slate-700">{e.description}</div>
                    <div className="text-xs text-slate-400">
                      {e.property.name} · {e.category}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-red-500">-${e.amount.toLocaleString()}</div>
                    <div className="text-xs text-slate-400">
                      {new Date(e.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {pendingPayments > 0 && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-700">
            You have <strong>{pendingPayments}</strong> pending payment{pendingPayments !== 1 ? "s" : ""}.{" "}
            <Link href="/admin/financials" className="underline">
              Review now
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}
