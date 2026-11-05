import { Link } from '@inertiajs/react';
import { ArrowUpRight, CreditCard, DollarSign, Landmark, Search, ShieldCheck } from 'lucide-react';
import AdminSidebar from '../../components/admin-sidebar';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(amount || 0));

export default function AdminRevenue({ totals = {}, payments = [], commissionRules = [] }) {
    const statCards = [
        { label: 'Total GMV', value: formatCurrency(totals.gmv ?? 0), icon: DollarSign },
        { label: 'Marketplace Revenue', value: formatCurrency(totals.marketplace_revenue ?? 0), icon: Landmark },
        { label: 'Platform Commission', value: formatCurrency(totals.platform_commission ?? 0), icon: CreditCard },
        { label: 'Pending Payout', value: formatCurrency(totals.pending_payout ?? 0), icon: ShieldCheck },
    ];

    return (
        <main className="min-h-screen bg-background text-foreground">
            <AdminSidebar currentPath="/admin/revenue" />

            <div className="lg:pl-72">
                <div className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 lg:px-6">
                    <header className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">Finance</p>
                                <h1 className="mt-2 text-3xl font-semibold tracking-tight">Payment & Revenue Management</h1>
                            </div>
                            <Link href="/admin/dashboard" className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary">
                                Dashboard
                            </Link>
                        </div>
                    </header>

                    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {statCards.map(({ label, value, icon: Icon }) => (
                            <div key={label} className="rounded-[24px] border border-border bg-card p-4 shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{label}</p>
                                        <p className="mt-3 text-2xl font-semibold">{value}</p>
                                    </div>
                                    <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <Icon className="size-5" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>

                    <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-xl font-semibold">Riwayat Pembayaran</h2>
                                <div className="relative w-full max-w-xs">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <input type="text" placeholder="Cari pembayaran" className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm" />
                                </div>
                            </div>

                            <div className="mt-6 overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="text-muted-foreground">
                                        <tr>
                                            <th className="px-3 py-3 font-medium">ID</th>
                                            <th className="px-3 py-3 font-medium">Order</th>
                                            <th className="px-3 py-3 font-medium">Buyer</th>
                                            <th className="px-3 py-3 font-medium">Metode</th>
                                            <th className="px-3 py-3 font-medium">Jumlah</th>
                                            <th className="px-3 py-3 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map((item) => (
                                            <tr key={item.id} className="border-t border-border/80">
                                                <td className="px-3 py-4 font-medium">{item.id}</td>
                                                <td className="px-3 py-4">{item.order}</td>
                                                <td className="px-3 py-4">{item.buyer}</td>
                                                <td className="px-3 py-4">{item.method}</td>
                                                <td className="px-3 py-4 text-primary">{item.amount}</td>
                                                <td className="px-3 py-4">
                                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${item.status === 'Success' ? 'bg-emerald-500/10 text-emerald-700' : item.status === 'Pending' ? 'bg-amber-500/10 text-amber-700' : 'bg-slate-500/10 text-slate-700'}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Commission</p>
                            <h2 className="mt-2 text-xl font-semibold">Aturan Komisi</h2>
                            <div className="mt-6 space-y-4">
                                {commissionRules.map((rule) => (
                                    <div key={rule.label} className="rounded-2xl border border-border bg-background p-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="font-medium">{rule.label}</p>
                                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                                <ArrowUpRight className="size-3" /> {rule.value}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-muted-foreground">{rule.note}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
