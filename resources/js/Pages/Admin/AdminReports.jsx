import { Link } from '@inertiajs/react';
import { AlertTriangle, ArrowUpRight, Download, ShieldAlert } from 'lucide-react';
import AdminSidebar from '../../components/admin-sidebar';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(amount || 0));

export default function AdminReports({ summary = {}, periods = [], filters = [], performance = [], topProducts = [], alerts = [] }) {
    const maxSales = Math.max(...performance.map((item) => Number(item.sales || 0)), 1);

    return (
        <main className="min-h-screen bg-background text-foreground">
            <AdminSidebar currentPath="/admin/reports" />

            <div className="lg:pl-72">
                <div className="mx-auto max-w-[1200px] space-y-6 px-4 py-6 lg:px-6">
                    <header className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">Reports</p>
                                <h1 className="mt-2 text-3xl font-semibold tracking-tight">Laporan & Analytics</h1>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <button type="button" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary">
                                    <Download className="size-4" />
                                    Export CSV
                                </button>
                                <Link href="/admin/dashboard" className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                    Dashboard
                                </Link>
                            </div>
                        </div>
                    </header>

                    <section className="rounded-[28px] border border-border bg-card p-4 shadow-sm">
                        <div className="flex flex-wrap items-center gap-2">
                            {periods.map((period) => (
                                <button
                                    key={period}
                                    type="button"
                                    className={[
                                        'rounded-full px-3 py-1.5 text-sm font-medium transition',
                                        period === 'Bulanan'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'border border-border bg-background text-muted-foreground hover:text-foreground',
                                    ].join(' ')}
                                >
                                    {period}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <p className="text-sm text-muted-foreground">Total Penjualan</p>
                            <p className="mt-3 text-2xl font-semibold">{formatCurrency(summary.sales ?? 0)}</p>
                            <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"><ArrowUpRight className="size-3" /> +14.2%</p>
                        </div>
                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <p className="text-sm text-muted-foreground">PendapatanMarketplace</p>
                            <p className="mt-3 text-2xl font-semibold">{formatCurrency(summary.revenue ?? 0)}</p>
                            <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"><ArrowUpRight className="size-3" /> +9.8%</p>
                        </div>
                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <p className="text-sm text-muted-foreground">Komisi</p>
                            <p className="mt-3 text-2xl font-semibold">{formatCurrency(summary.commission ?? 0)}</p>
                            <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"><ArrowUpRight className="size-3" /> +6.1%</p>
                        </div>
                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <p className="text-sm text-muted-foreground">Pengguna Baru</p>
                            <p className="mt-3 text-2xl font-semibold">{summary.new_users ?? 0}</p>
                            <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"><ArrowUpRight className="size-3" /> +12.4%</p>
                        </div>
                    </section>

                    <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <h2 className="text-xl font-semibold">Tren penjualan & pendapatan</h2>
                            <div className="mt-6 flex h-64 items-end gap-3">
                                {performance.map((item) => (
                                    <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                                        <div className="flex h-52 w-full items-end gap-1">
                                            <div
                                                className="w-1/2 rounded-t-xl bg-gradient-to-t from-primary to-primary/60"
                                                style={{ height: `${(Number(item.sales || 0) / maxSales) * 100}%` }}
                                            />
                                            <div
                                                className="w-1/2 rounded-t-xl bg-gradient-to-t from-emerald-500 to-emerald-300"
                                                style={{ height: `${(Number(item.revenue || 0) / maxSales) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <h2 className="text-xl font-semibold">Filter laporan</h2>
                            <div className="mt-5 space-y-3">
                                {filters.map((item) => (
                                    <div key={item.label} className="flex items-center justify-between rounded-2xl border border-border bg-background/70 p-3">
                                        <span className="text-sm text-muted-foreground">{item.label}</span>
                                        <span className="text-sm font-medium text-foreground">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <h2 className="text-xl font-semibold">Produk terlaris</h2>
                            <div className="mt-5 space-y-3">
                                {topProducts.map((product, index) => (
                                    <div key={product.name} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/70 p-3">
                                        <div className="flex items-center gap-3">
                                            <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{index + 1}</span>
                                            <div>
                                                <p className="font-medium text-foreground">{product.name}</p>
                                                <p className="text-sm text-muted-foreground">{product.sales} transaksi</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-foreground">{formatCurrency(product.revenue)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-xl font-semibold">Peringatan</h2>
                                <AlertTriangle className="size-5 text-amber-600" />
                            </div>
                            <div className="mt-5 space-y-3">
                                {alerts.map((alert) => (
                                    <div key={alert.title} className="rounded-2xl border border-border bg-background/70 p-3">
                                        <p className="text-sm text-muted-foreground">{alert.title}</p>
                                        <p className="mt-2 text-2xl font-semibold text-foreground">{alert.count}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="mt-6 rounded-[28px] border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <ShieldAlert className="size-5 text-primary" />
                            <h2 className="text-xl font-semibold">Prioritas penanganan</h2>
                        </div>
                        <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                            <p>1. Produk melanggar kebijakan dan perlu review cepat.</p>
                            <p>2. Pengiriman tertunda dari seller tertentu.</p>
                            <p>3. Laporan akun yang mencurigakan dan sering bermasalah.</p>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
