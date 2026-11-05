import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    Bell,
    Boxes,
    DollarSign,
    MessageSquare,
    Package,
    PackageCheck,
    Settings,
    ShoppingBag,
    ShoppingCart,
    Store,
    TrendingUp,
    TriangleAlert,
    UserCircle2,
} from 'lucide-react';
import { useMemo } from 'react';
import ProfileMenu from '../../components/profile-menu';
import SellerSidebar from '../../components/seller-sidebar';
import { Button } from '../../components/ui/button';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(amount || 0));

const formatDate = (value) => {
    if (!value) {
        return '—';
    }

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
};

const statusBadgeClass = {
    pending_payment: 'bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20 dark:text-amber-300',
    confirmed: 'bg-blue-500/10 text-blue-700 ring-1 ring-blue-500/20 dark:text-blue-300',
    processing: 'bg-violet-500/10 text-violet-700 ring-1 ring-violet-500/20 dark:text-violet-300',
    ready_for_pickup: 'bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300',
    out_for_delivery: 'bg-sky-500/10 text-sky-700 ring-1 ring-sky-500/20 dark:text-sky-300',
    completed: 'bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300',
    cancelled: 'bg-rose-500/10 text-rose-700 ring-1 ring-rose-500/20 dark:text-rose-300',
};

function TruckIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M3 7h11v8H3z" />
            <path d="M14 9h2l3 3v3h-5z" />
            <circle cx="7.5" cy="17.5" r="1.5" />
            <circle cx="17.5" cy="17.5" r="1.5" />
        </svg>
    );
}

const statusLabel = {
    pending_payment: 'Menunggu Pembayaran',
    confirmed: 'Terkonfirmasi',
    processing: 'Sedang Diproses',
    ready_for_pickup: 'Siap Diambil',
    out_for_delivery: 'Sedang Dikirim',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
};

export default function SellerDashboard({ auth, store = null, stats = {}, salesChart = [], recentOrders = [], topProducts = [], lowStockProducts = [], orderStatusSummary = {} }) {
    const user = auth?.user;
    const metrics = [
        {
            label: 'Total Penjualan',
            value: formatCurrency(stats.total_sales ?? 0),
            change: '+12.4%',
            icon: DollarSign,
        },
        {
            label: 'Jumlah Pesanan',
            value: String(stats.total_orders ?? 0),
            change: '+8.1%',
            icon: ShoppingBag,
        },
        {
            label: 'Perlu Diproses',
            value: String(stats.pending_orders ?? 0),
            change: '-2.3%',
            icon: PackageCheck,
        },
        {
            label: 'Produk Aktif',
            value: String(stats.active_products ?? 0),
            change: '+4.7%',
            icon: Boxes,
        },
        {
            label: 'Stok Menipis',
            value: String(stats.low_stock_products ?? 0),
            change: 'Perlu perhatian',
            icon: TriangleAlert,
        },
        {
            label: 'Pendapatan Bulan Ini',
            value: formatCurrency(stats.monthly_revenue ?? 0),
            change: '+15.8%',
            icon: TrendingUp,
        },
    ];

    const chartData = useMemo(() => {
        if (!salesChart.length) {
            return [];
        }

        const maxValue = Math.max(...salesChart.map((item) => Number(item.value || 0)), 1);

        return salesChart.map((item) => ({
            ...item,
            height: (Number(item.value || 0) / maxValue) * 100,
        }));
    }, [salesChart]);

    return (
        <main className="min-h-screen bg-background text-foreground">
            <SellerSidebar currentPath="/seller/dashboard" store={store} />

            <div className="lg:pl-72">
                <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-sm">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Ringkasan</p>
                            <h1 className="mt-1 text-2xl font-semibold text-foreground">Dashboard Penjual</h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <button type="button" className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground">
                                <Bell className="size-4" />
                            </button>
                            <ProfileMenu user={user} />
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <section className="mb-6 flex flex-col gap-4 rounded-[30px] border border-border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Halo, {user?.first_name ?? 'Penjual'}</p>
                            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{store?.name ?? 'Toko Pasaraya'}</h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button type="button" asChild>
                                <Link href="/seller/products" className="gap-2">
                                    Tambah produk
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                            <Button type="button" variant="outline">
                                <Link href="/seller/orders">Lihat pesanan baru</Link>
                            </Button>
                        </div>
                    </section>

                    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {metrics.map((metric) => (
                            <div key={metric.label} className="rounded-[26px] border border-border bg-card p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="rounded-2xl bg-primary/10 p-2.5 text-primary">
                                        <metric.icon className="size-5" />
                                    </div>
                                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{metric.change}</span>
                                </div>
                                <p className="mt-5 text-sm text-muted-foreground">{metric.label}</p>
                                <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{metric.value}</p>
                            </div>
                        ))}
                    </section>

                    <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Statistik penjualan</p>
                                    <h3 className="mt-2 text-xl font-semibold text-foreground">Tren 30 hari</h3>
                                </div>
                                <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">30 hari terakhir</span>
                            </div>

                            <div className="mt-6 flex h-56 items-end gap-3">
                                {chartData.length === 0 ? (
                                    <div className="flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-border bg-background text-sm text-muted-foreground">
                                        Belum ada data penjualan dalam 30 hari terakhir.
                                    </div>
                                ) : (
                                    chartData.map((item) => (
                                        <div key={item.label} className="flex flex-1 flex-col items-center justify-end gap-2">
                                            <div className="flex w-full items-end justify-center rounded-t-2xl bg-gradient-to-t from-primary to-primary/40" style={{ height: `${Math.max(item.height, 12)}%` }} />
                                            <span className="text-[10px] text-muted-foreground">{item.label}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Ringkasan status</p>
                            <div className="mt-5 space-y-3">
                                {Object.entries(statusLabel).map(([key, label]) => (
                                    <div key={key} className="flex items-center justify-between rounded-2xl border border-border bg-background px-3 py-2.5">
                                        <span className="text-sm text-muted-foreground">{label}</span>
                                        <span className="text-sm font-semibold text-foreground">{orderStatusSummary[key] ?? 0}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Pesanan terbaru</p>
                                    <h3 className="mt-2 text-xl font-semibold text-foreground">Aktivitas pesanan</h3>
                                </div>
                                <Link href="/seller/orders" className="text-sm font-medium text-primary hover:underline">Lihat semua</Link>
                            </div>

                            <div className="mt-5 space-y-3">
                                {recentOrders.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
                                        Belum ada pesanan masuk untuk toko Anda.
                                    </div>
                                ) : (
                                    recentOrders.map((order) => (
                                        <div key={order.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">{order.order_number}</p>
                                                <p className="mt-1 text-sm text-muted-foreground">{order.buyer_name || 'Pelanggan'} • {formatDate(order.created_at)}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusBadgeClass[order.status] ?? 'bg-muted text-foreground'}`}>
                                                    {statusLabel[order.status] ?? order.status}
                                                </span>
                                                <span className="text-sm font-semibold text-foreground">{formatCurrency(order.total)}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Produk terlaris</p>
                                    <h3 className="mt-2 text-xl font-semibold text-foreground">Produk terlaris</h3>
                                </div>
                            </div>

                            <div className="mt-5 space-y-3">
                                {topProducts.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
                                        Belum ada produk yang terjual.
                                    </div>
                                ) : (
                                    topProducts.map((product, index) => (
                                        <div key={product.id ?? index} className="flex items-center justify-between rounded-2xl border border-border bg-background p-3">
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">{product.name}</p>
                                                <p className="text-xs text-muted-foreground">{product.sold_quantity} terjual</p>
                                            </div>
                                            <span className="text-sm font-semibold text-primary">{formatCurrency(product.price)}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Stok rendah</p>
                                    <h3 className="mt-2 text-xl font-semibold text-foreground">Perlu restock</h3>
                                </div>
                                <Link href="/seller/products" className="text-sm font-medium text-primary hover:underline">Kelola stok</Link>
                            </div>

                            <div className="mt-5 space-y-3">
                                {lowStockProducts.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
                                        Semua produk aman dari stok rendah.
                                    </div>
                                ) : (
                                    lowStockProducts.map((product) => (
                                        <div key={product.id} className="flex items-center justify-between rounded-2xl border border-border bg-background p-3">
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">{product.name}</p>
                                                <p className="text-xs text-muted-foreground">{product.category}</p>
                                            </div>
                                            <span className="rounded-full bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">Sisa {product.stock}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Aksi cepat</p>
                                    <h3 className="mt-2 text-xl font-semibold text-foreground">Pintasan</h3>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <Link href="/seller/products" className="rounded-2xl border border-border bg-background p-4 text-left hover:border-primary/40">
                                    <Package className="size-5 text-primary" />
                                    <p className="mt-3 text-base font-semibold text-foreground">Kelola produk</p>
                                    <p className="mt-1 text-sm text-muted-foreground">Edit, tambah, dan cek stok.</p>
                                </Link>
                                <Link href="/seller/orders" className="rounded-2xl border border-border bg-background p-4 text-left hover:border-primary/40">
                                    <ShoppingBag className="size-5 text-primary" />
                                    <p className="mt-3 text-base font-semibold text-foreground">Pesanan</p>
                                    <p className="mt-1 text-sm text-muted-foreground">Pantau status pengiriman.</p>
                                </Link>
                                <Link href="/profile" className="rounded-2xl border border-border bg-background p-4 text-left hover:border-primary/40">
                                    <UserCircle2 className="size-5 text-primary" />
                                    <p className="mt-3 text-base font-semibold text-foreground">Profil toko</p>
                                    <p className="mt-1 text-sm text-muted-foreground">Atur identitas dan kontak.</p>
                                </Link>
                                <Link href="/products" className="rounded-2xl border border-border bg-background p-4 text-left hover:border-primary/40">
                                    <Store className="size-5 text-primary" />
                                    <p className="mt-3 text-base font-semibold text-foreground">Lihat marketplace</p>
                                    <p className="mt-1 text-sm text-muted-foreground">Cek penampilan toko Anda.</p>
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </main>
    );
}

function BoxIcon() {
    return <Boxes className="size-4" />;
}
