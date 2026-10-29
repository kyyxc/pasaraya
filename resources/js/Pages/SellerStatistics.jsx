import { Link } from '@inertiajs/react';
import { ArrowRight, BarChart3, DollarSign, PackageCheck, ShoppingBag } from 'lucide-react';
import ProfileMenu from '../components/profile-menu';
import SellerSidebar from '../components/seller-sidebar';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(amount || 0));

export default function SellerStatistics({ auth, store = null, metrics = {}, salesChart = [], topProducts = [], period = 30 }) {
    const user = auth?.user;
    const chartMax = Math.max(...salesChart.map((item) => Number(item.value || 0)), 1);

    return (
        <main className="min-h-screen bg-background text-foreground">
            <SellerSidebar currentPath="/seller/statistics" store={store} />

            <div className="lg:pl-72">
                <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-sm">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Analitik</p>
                            <h1 className="mt-1 text-2xl font-semibold text-foreground">Statistik Penjualan</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/seller/dashboard" className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-primary/30 hover:text-primary">
                                Kembali ke dashboard
                            </Link>
                            <ProfileMenu user={user} />
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-wrap gap-2">
                        {[7, 30, 90].map((days) => (
                            <Link
                                key={days}
                                href={`/seller/statistics?days=${days}`}
                                className={[
                                    'rounded-full px-3 py-1.5 text-sm font-medium transition',
                                    Number(period) === days
                                        ? 'bg-primary text-primary-foreground'
                                        : 'border border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground',
                                ].join(' ')}
                            >
                                {days} hari
                            </Link>
                        ))}
                    </div>

                    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-[26px] border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex rounded-2xl bg-primary/10 p-2.5 text-primary"><DollarSign className="size-5" /></span>
                                <span className="text-xs text-muted-foreground">Omzet</span>
                            </div>
                            <p className="mt-4 text-sm text-muted-foreground">Total pendapatan</p>
                            <p className="mt-2 text-3xl font-semibold text-foreground">{formatCurrency(metrics.total_revenue ?? 0)}</p>
                        </div>

                        <div className="rounded-[26px] border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex rounded-2xl bg-primary/10 p-2.5 text-primary"><ShoppingBag className="size-5" /></span>
                                <span className="text-xs text-muted-foreground">Pesanan</span>
                            </div>
                            <p className="mt-4 text-sm text-muted-foreground">Jumlah transaksi</p>
                            <p className="mt-2 text-3xl font-semibold text-foreground">{metrics.total_orders ?? 0}</p>
                        </div>

                        <div className="rounded-[26px] border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex rounded-2xl bg-primary/10 p-2.5 text-primary"><PackageCheck className="size-5" /></span>
                                <span className="text-xs text-muted-foreground">Produk</span>
                            </div>
                            <p className="mt-4 text-sm text-muted-foreground">Barang terjual</p>
                            <p className="mt-2 text-3xl font-semibold text-foreground">{metrics.total_products_sold ?? 0}</p>
                        </div>

                        <div className="rounded-[26px] border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex rounded-2xl bg-primary/10 p-2.5 text-primary"><BarChart3 className="size-5" /></span>
                                <span className="text-xs text-muted-foreground">Rata-rata</span>
                            </div>
                            <p className="mt-4 text-sm text-muted-foreground">Nilai pesanan</p>
                            <p className="mt-2 text-3xl font-semibold text-foreground">{formatCurrency(metrics.average_order_value ?? 0)}</p>
                        </div>
                    </section>

                    <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Tren penjualan</p>
                                    <h2 className="mt-2 text-xl font-semibold text-foreground">Periode {period} hari</h2>
                                </div>
                                <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">Live data</span>
                            </div>

                            <div className="mt-6 flex h-56 items-end gap-3">
                                {salesChart.length === 0 ? (
                                    <div className="flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-border bg-background text-sm text-muted-foreground">
                                        Belum ada data penjualan pada periode ini.
                                    </div>
                                ) : (
                                    salesChart.map((item) => (
                                        <div key={`${item.label}-${item.value}`} className="flex flex-1 flex-col items-center justify-end gap-2">
                                            <div
                                                className="flex w-full items-end justify-center rounded-t-2xl bg-gradient-to-t from-primary to-primary/40"
                                                style={{ height: `${Math.max((Number(item.value || 0) / chartMax) * 100, 10)}%` }}
                                            />
                                            <span className="text-[10px] text-muted-foreground">{item.label}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Produk terlaris</p>
                            <div className="mt-5 space-y-3">
                                {topProducts.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
                                        Produk terlaris belum tersedia.
                                    </div>
                                ) : (
                                    topProducts.map((product, index) => (
                                        <div key={product.id ?? index} className="flex items-center justify-between rounded-2xl border border-border bg-background px-3 py-2.5">
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{product.name}</p>
                                                <p className="text-xs text-muted-foreground">{product.sold_quantity} terjual</p>
                                            </div>
                                            <span className="text-sm font-semibold text-foreground">{formatCurrency(product.revenue)}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
