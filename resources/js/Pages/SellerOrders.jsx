import { Link } from '@inertiajs/react';
import {
    BarChart3,
    Boxes,
    CalendarRange,
    MessageSquare,
    Package,
    PackageCheck,
    Search,
    Settings,
    ShoppingBag,
    ShoppingCart,
    Store,
    TrendingUp,
    TriangleAlert,
    UserCircle2,
} from 'lucide-react';
import { useState } from 'react';
import ProfileMenu from '../components/profile-menu';
import SellerSidebar from '../components/seller-sidebar';
import { Button } from '../components/ui/button';

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

const statusLabel = {
    pending_payment: 'Menunggu Pembayaran',
    confirmed: 'Terkonfirmasi',
    processing: 'Sedang Diproses',
    ready_for_pickup: 'Siap Diambil',
    out_for_delivery: 'Sedang Dikirim',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
};

export default function SellerOrders({ auth, store = null, orders = [], filters = {}, pagination = {}, statuses = [] }) {
    const user = auth?.user;
    const [query, setQuery] = useState(filters.q || '');
    const [status, setStatus] = useState(filters.status || 'all');

    return (
        <main className="min-h-screen bg-background text-foreground">
            <SellerSidebar currentPath="/seller/orders" store={store} />

            <div className="lg:pl-72">
                <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-sm">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Pesanan</p>
                            <h1 className="mt-1 text-2xl font-semibold text-foreground">Manajemen Pesanan</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button type="button" variant="outline" asChild>
                                <Link href="/seller/dashboard">Kembali ke dashboard</Link>
                            </Button>
                            <ProfileMenu user={user} />
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <section className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                            <label className="relative block flex-1">
                                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder="Cari nomor atau pembeli"
                                    className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20"
                                />
                            </label>
                            <select
                                value={status}
                                onChange={(event) => setStatus(event.target.value)}
                                className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20"
                            >
                                <option value="all">Semua status</option>
                                {statuses.map((statusOption) => (
                                    <option key={statusOption} value={statusOption}>{statusLabel[statusOption] ?? statusOption}</option>
                                ))}
                            </select>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                            <CalendarRange className="size-4" />
                            Filter tanggal
                        </div>
                    </div>

                    <div className="mt-6 overflow-hidden rounded-[24px] border border-border">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-border text-left text-sm">
                                <thead className="bg-muted/60">
                                    <tr>
                                        <th className="px-4 py-3 font-medium text-muted-foreground">Nomor Pesanan</th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground">Pembeli</th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground">Tanggal</th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground">Total</th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-background">
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                                                Belum ada pesanan untuk toko ini.
                                            </td>
                                        </tr>
                                    ) : (
                                        orders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="px-4 py-3 font-medium text-foreground">{order.order_number}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{order.buyer_name || order.buyer_email || 'Pelanggan'}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{formatDate(order.created_at)}</td>
                                                <td className="px-4 py-3 font-medium text-foreground">{formatCurrency(order.total)}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusBadgeClass[order.status] ?? 'bg-muted text-foreground'}`}>
                                                        {statusLabel[order.status] ?? order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-muted-foreground">{pagination.total ?? 0} pesanan</div>
                        <div className="flex items-center gap-2">
                            <Button type="button" variant="outline" size="sm" disabled>
                                Sebelumnya
                            </Button>
                            <span className="text-sm text-muted-foreground">Halaman {pagination.current_page ?? 1}</span>
                            <Button type="button" variant="outline" size="sm" disabled>
                                Selanjutnya
                            </Button>
                        </div>
                    </div>
                </section>
                </div>
            </div>
        </main>
    );
}
