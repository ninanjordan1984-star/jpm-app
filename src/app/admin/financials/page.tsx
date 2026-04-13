import { prisma } from "@/lib/prisma"
import { DollarSign, TrendingUp, TrendingDown, Plus, CheckCircle } from "lucide-react"
import { createExpense, createPayment, markPaymentPaid } from "@/lib/actions/finances"

export default async function AdminFinancialsPage() {
  const [payments, expenses, leases, properties] = await Promise.all([
    prisma.payment.findMany({
      orderBy: { dueDate: "desc" },
      take: 30,
      include: { lease: { include: { property: true, tenant: true } } },
    }),
    prisma.expense.findMany({
      orderBy: { date: "desc" },
      take: 30,
      include: { property: true },
    }),
    prisma.lease.findMany({
      where: { status: "active" },
      include: { property: true, tenant: true },
    }),
    prisma.property.findMany({ orderBy: { name: "asc" } }),
  ])

  const totalIncome = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const netIncome = totalIncome - totalExpenses

  const pendingPayments = payments.filter((p) => p.status === "pending")

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Financials</h1>
        <p className="text-slate-500 text-sm mt-1">Track income, expenses, and payments</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-500">Total Income</span>
            <span className="h-9 w-9 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-800">${totalIncome.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">{payments.filter((p) => p.status === "paid").length} payments received</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-500">Total Expenses</span>
            <span className="h-9 w-9 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
              <TrendingDown className="h-5 w-5" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-800">${totalExpenses.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">{expenses.length} expense records</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-500">Net Income</span>
            <span
              className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                netIncome >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              }`}
            >
              <DollarSign className="h-5 w-5" />
            </span>
          </div>
          <div
            className={`text-2xl font-bold ${netIncome >= 0 ? "text-emerald-600" : "text-red-600"}`}
          >
            {netIncome < 0 ? "-" : ""}${Math.abs(netIncome).toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {pendingPayments.length > 0
              ? `${pendingPayments.length} payment${pendingPayments.length !== 1 ? "s" : ""} pending`
              : "All caught up"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Log Payment */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Plus className="h-4 w-4" /> Log Rent Payment
          </h2>
          <form action={createPayment} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Lease *</label>
              <select name="leaseId" required className="input">
                <option value="">Select lease</option>
                {leases.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.tenant.firstName} {l.tenant.lastName} — {l.property.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($) *</label>
                <input name="amount" type="number" min="0" step="0.01" required className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date *</label>
                <input name="dueDate" type="date" required className="input" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date Paid (leave blank if pending)</label>
              <input name="paidDate" type="date" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
              <input name="notes" className="input" placeholder="Optional note" />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Save Payment
            </button>
          </form>
        </div>

        {/* Log Expense */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Plus className="h-4 w-4" /> Log Expense
          </h2>
          <form action={createExpense} className="space-y-3">
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
              <select name="category" required className="input">
                <option value="">Select category</option>
                <option value="maintenance">Maintenance / Repairs</option>
                <option value="insurance">Insurance</option>
                <option value="tax">Property Tax</option>
                <option value="utilities">Utilities</option>
                <option value="management">Management Fee</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
              <input name="description" required className="input" placeholder="e.g. Plumber visit" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($) *</label>
                <input name="amount" type="number" min="0" step="0.01" required className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
                <input name="date" type="date" required className="input" />
              </div>
            </div>
            <button
              type="submit"
              className="bg-red-500 text-white px-5 py-2.5 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
            >
              Save Expense
            </button>
          </form>
        </div>
      </div>

      {/* Pending payments */}
      {pendingPayments.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-slate-800 mb-4">Pending Payments</h2>
          <div className="divide-y divide-slate-100">
            {pendingPayments.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <div className="font-medium text-slate-700">
                    {p.lease.tenant.firstName} {p.lease.tenant.lastName}
                  </div>
                  <div className="text-xs text-slate-400">
                    {p.lease.property.name} · Due {new Date(p.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-700">${p.amount.toLocaleString()}</span>
                  <form
                    action={async () => {
                      "use server"
                      await markPaymentPaid(p.id)
                    }}
                  >
                    <button
                      type="submit"
                      className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> Mark Paid
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment & Expense history */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Payment History</h2>
          {payments.filter((p) => p.status === "paid").length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">No payments yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {payments
                .filter((p) => p.status === "paid")
                .map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <div className="font-medium text-slate-700">
                        {p.lease.tenant.firstName} {p.lease.tenant.lastName}
                      </div>
                      <div className="text-xs text-slate-400">
                        {p.lease.property.name} ·{" "}
                        {p.paidDate ? new Date(p.paidDate).toLocaleDateString() : "—"}
                      </div>
                    </div>
                    <span className="font-semibold text-green-600">+${p.amount.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Expense History</h2>
          {expenses.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">No expenses yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {expenses.map((e) => (
                <div key={e.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <div className="font-medium text-slate-700">{e.description}</div>
                    <div className="text-xs text-slate-400">
                      {e.property.name} · {e.category} · {new Date(e.date).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="font-semibold text-red-500">-${e.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
