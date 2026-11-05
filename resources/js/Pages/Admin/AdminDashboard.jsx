import { Link } from '@inertiajs/react';
import {
    Activity,
    ArrowUpRight,
    BadgeCheck,
    CreditCard,
    DollarSign,
    Package,
    ShieldCheck,
    ShoppingBag,
    Store,
    TrendingUp,
    Users,
} from 'lucide-react';
import AdminSidebar from '../../components/admin-sidebar';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(amount || 0));

const statusTone = {
    Active: 'bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300',
    Pending: 'bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20 dark:text-amber-300',
    Suspended: 'bg-rose-500/10 text-rose-700 ring-1 ring-rose-500/20 dark:text-rose-300',
};

const navItems = [
    { label: 'Overview', href: '/admin/dashboard', active: true },
    { label: 'Products', href: '/admin/products' },
    { label: 'Users', href: '/admin/users' },
    { label: 'Stores', href: '/admin/stores' },
    { label: 'Transactions', href: '/admin/orders' },
];

export default function AdminDashboard({
    stats = {},
    revenueChart = [],
    transactionChart = [],
    userGrowth = [],
    sellerGrowth = [],
    orderStatus = [],
    bestProducts = [],
    topStores = [],
    recentActivity = [],
    users = [],
    pendingVerifications = [],
}) {
    const statCards = [
        { title: 'Total Pengguna', value: stats.total_users ?? 0, icon: Users, change: '+12.4%' },
        { title: 'Total Toko', value: stats.total_stores ?? 0, icon: Store, change: '+8.1%' },
        { title: 'Total Produk', value: stats.total_products ?? 0, icon: Package, change: '+15.2%' },
        { title: 'Total Transaksi', value: stats.total_transactions ?? 0, icon: ShoppingBag, change: '+9.8%' },
        { title: 'Pendapatan Marketplace', value: formatCurrency(stats.total_revenue ?? 0), icon: DollarSign, change: '+18.6%' },
        { title: 'GMV', value: formatCurrency(stats.total_gmv ?? 0), icon: CreditCard, change: '+11.7%' },
        { title: 'Komisi Marketplace', value: formatCurrency(stats.total_commission ?? 0), icon: TrendingUp, change: '+10.3%' },
        { title: 'Transaksi Berlangsung', value: stats.active_transactions ?? 0, icon: Activity, change: '+4.2%' },
    ];

    const maxRevenue = Math.max(...revenueChart.map((item) => Number(item.value || 0)), 1);
    const maxTransactions = Math.max(...transactionChart.map((item) => Number(item.value || 0)), 1);

    return (
        <main className="min-h-screen bg-background text-foreground">
            <AdminSidebar currentPath="/admin/dashboard" />

            <div className="lg:pl-72">
                <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 lg:px-6">
                    <header className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">Overview</p>
                                <h2 className="mt-2 text-3xl font-semibold tracking-tight">Dashboard Admin</h2>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Link href="/admin/products" className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                    Kelola Produk
                                </Link>
                                <Link href="/logout" className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary">
                                    Keluar
                                </Link>
                            </div>
                        </div>
                    </header>

                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {statCards.map(({ title, value, icon: Icon, change }) => (
                            <div key={title} className="rounded-[24px] border border-border bg-card p-4 shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{title}</p>
                                        <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
                                    </div>
                                    <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <Icon className="size-5" />
                                    </div>
                                </div>
                                <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                    <ArrowUpRight className="size-3" />
                                    {change}
                                </div>
                            </div>
                        ))}
                    </section>

                    <section className="grid gap-6 xl:grid-cols-2">
                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Revenue</p>
                                    <h3 className="mt-2 text-xl font-semibold">Pendapatan marketplace</h3>
                                </div>
                                <BadgeCheck className="size-5 text-primary" />
                            </div>
                            <div className="mt-6 flex h-56 items-end gap-3">
                                {revenueChart.map((item) => (
                                    <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                                        <div className="flex h-44 w-full items-end">
                                            <div
                                                className="w-full rounded-t-2xl bg-gradient-to-t from-primary to-primary/50"
                                                style={{ height: `${(Number(item.value || 0) / maxRevenue) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Transactions</p>
                                    <h3 className="mt-2 text-xl font-semibold">Jumlah transaksi</h3>
                                </div>
                                <ShoppingBag className="size-5 text-primary" />
                            </div>
                            <div className="mt-6 flex h-56 items-end gap-3">
                                {transactionChart.map((item) => (
                                    <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                                        <div className="flex h-44 w-full items-end">
                                            <div
                                                className="w-full rounded-t-2xl bg-gradient-to-t from-emerald-500 to-emerald-300"
                                                style={{ height: `${(Number(item.value || 0) / maxTransactions) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-6 xl:grid-cols-2">
                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Growth</p>
                            <h3 className="mt-2 text-xl font-semibold">Pertumbuhan pengguna</h3>
                            <div className="mt-6 space-y-4">
                                {userGrowth.map((row) => (
                                    <div key={row.month} className="rounded-2xl border border-border bg-background p-3">
                                        <div className="mb-2 flex items-center justify-between text-sm">
                                            <span className="font-medium">{row.month}</span>
                                            <span className="text-muted-foreground">{row.buyers} buyer / {row.sellers} seller</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="h-2 flex-1 rounded-full bg-primary/15">
                                                <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.min((row.buyers / 800) * 100, 100)}%` }} />
                                            </div>
                                            <div className="h-2 flex-1 rounded-full bg-amber-500/20">
                                                <div className="h-2 rounded-full bg-amber-500" style={{ width: `${Math.min((row.sellers / 180) * 100, 100)}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Growth</p>
                            <h3 className="mt-2 text-xl font-semibold">Pertumbuhan seller</h3>
                            <div className="mt-6 flex h-56 items-end gap-3">
                                {sellerGrowth.map((item) => (
                                    <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                                        <div className="flex h-44 w-full items-end">
                                            <div
                                                className="w-full rounded-t-2xl bg-gradient-to-t from-amber-500 to-yellow-300"
                                                style={{ height: `${(item.value / 140) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground">{item.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Status</p>
                                    <h3 className="mt-2 text-xl font-semibold">Distribusi status pesanan</h3>
                                </div>
                                <ShieldCheck className="size-5 text-primary" />
                            </div>
                            <div className="mt-6 space-y-4">
                                {orderStatus.map((item) => (
                                    <div key={item.label}>
                                        <div className="mb-2 flex items-center justify-between text-sm">
                                            <span>{item.label}</span>
                                            <span className="font-medium">{item.value}</span>
                                        </div>
                                        <div className="h-2.5 rounded-full bg-muted">
                                            <div
                                                className="h-2.5 rounded-full"
                                                style={{ width: `${(item.value / 420) * 100}%`, backgroundColor: item.color }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Products</p>
                            <h3 className="mt-2 text-xl font-semibold">Produk terlaris</h3>
                            <div className="mt-6 space-y-4">
                                {bestProducts.map((product, index) => (
                                    <div key={product.name} className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3">
                                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                                            #{index + 1}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium">{product.name}</p>
                                            <p className="text-sm text-muted-foreground">{product.sales} terjual</p>
                                        </div>
                                        <span className="text-sm font-semibold text-primary">{formatCurrency(product.revenue)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Stores</p>
                            <h3 className="mt-2 text-xl font-semibold">Toko dengan penjualan tertinggi</h3>
                            <div className="mt-6 space-y-4">
                                {topStores.map((store, index) => (
                                    <div key={store.name} className="flex items-center justify-between rounded-2xl border border-border bg-background p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium">{store.name}</p>
                                                <p className="text-sm text-muted-foreground">{store.orders} order</p>
                                            </div>
                                        </div>
                                        <span className="font-semibold text-primary">{formatCurrency(store.gmv)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Verification</p>
                            <h3 className="mt-2 text-xl font-semibold">Pengajuan verifikasi toko</h3>
                            <div className="mt-6 space-y-3">
                                {pendingVerifications.map((item) => (
                                    <div key={item.store} className="rounded-2xl border border-border bg-background p-3">
                                        <p className="font-medium">{item.store}</p>
                                        <p className="mt-1 text-sm text-muted-foreground">Pemilik: {item.owner}</p>
                                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                                            <span>{item.date}</span>
                                            <button type="button" className="rounded-full bg-primary px-3 py-1.5 font-medium text-primary-foreground">
                                                Review
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Users</p>
                                    <h3 className="mt-2 text-xl font-semibold">User Management</h3>
                                </div>
                                <Link href="/admin/users" className="text-sm font-medium text-primary hover:underline">
                                    Lihat semua
                                </Link>
                            </div>
                            <div className="mt-6 overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-border text-muted-foreground">
                                            <th className="pb-3 font-medium">Nama</th>
                                            <th className="pb-3 font-medium">Role</th>
                                            <th className="pb-3 font-medium">Status</th>
                                            <th className="pb-3 font-medium">Transaksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.email} className="border-b border-border/70">
                                                <td className="py-3 pr-4">
                                                    <div>
                                                        <p className="font-medium">{user.name}</p>
                                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                                    </div>
                                                </td>
                                                <td className="py-3 pr-4 text-muted-foreground">{user.role}</td>
                                                <td className="py-3 pr-4">
                                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusTone[user.status] || 'bg-muted text-muted-foreground'}`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 pr-4">{user.orders}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Activity</p>
                            <h3 className="mt-2 text-xl font-semibold">Aktivitas terbaru</h3>
                            <div className="mt-6 space-y-4">
                                {recentActivity.map((item) => (
                                    <div key={`${item.title}-${item.time}`} className="flex gap-3 rounded-2xl border border-border bg-background p-3">
                                        <div className="mt-1 flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            {item.type === 'seller_new' ? <Store className="size-4" /> : item.type === 'product_new' ? <Package className="size-4" /> : item.type === 'transaction' ? <CreditCard className="size-4" /> : item.type === 'verification' ? <ShieldCheck className="size-4" /> : <Activity className="size-4" />}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium">{item.title}</p>
                                            <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                                            <p className="mt-2 text-xs text-muted-foreground">{item.time}</p>
                                        </div>
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
