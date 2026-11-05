import { Link, router } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, Clock3, CreditCard, MapPinned, PackageCheck, Search, Truck, WalletCards, X } from 'lucide-react';
import { useState } from 'react';
import AdminSidebar from '../../components/admin-sidebar';

const badgeColor = {
    Pending: 'bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20 dark:text-amber-300',
    Paid: 'bg-blue-500/10 text-blue-700 ring-1 ring-blue-500/20 dark:text-blue-300',
    Processing: 'bg-violet-500/10 text-violet-700 ring-1 ring-violet-500/20 dark:text-violet-300',
    Shipped: 'bg-sky-500/10 text-sky-700 ring-1 ring-sky-500/20 dark:text-sky-300',
    'Ready for Pickup': 'bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300',
    Completed: 'bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300',
    Cancelled: 'bg-rose-500/10 text-rose-700 ring-1 ring-rose-500/20 dark:text-rose-300',
    Refunded: 'bg-slate-500/10 text-slate-700 ring-1 ring-slate-500/20 dark:text-slate-300',
};

const statusLabel = {
    pending_payment: 'Pending',
    confirmed: 'Paid',
    processing: 'Processing',
    ready_for_pickup: 'Ready for Pickup',
    out_for_delivery: 'Shipped',
    completed: 'Completed',
    cancelled: 'Cancelled',
};

export default function AdminOrders({ orders = [], summary = {}, filters = {}, statuses = [] }) {
    const [query, setQuery] = useState(filters.q || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const applyFilters = (nextQuery = query, nextStatus = statusFilter) => {
        const params = {};

        if (nextQuery && nextQuery.trim()) {
            params.q = nextQuery.trim();
        }

        if (nextStatus && nextStatus !== 'all') {
            params.status = nextStatus;
        }

        router.get('/admin/orders', params, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const updateOrderStatus = (order, nextStatus) => {
        if (!order || !nextStatus || nextStatus === 'all') {
            return;
        }

        setIsUpdating(true);

        router.patch(`/admin/orders/${order.id}/status`, { status: nextStatus }, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedOrder(null);
            },
            onError: () => {
                setSelectedOrder(null);
            },
            onFinish: () => setIsUpdating(false),
        });
    };

    return (
        <main className="min-h-screen bg-background text-foreground">
            <AdminSidebar currentPath="/admin/orders" />

            <div className="lg:pl-72">
                <div className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 lg:px-6">
                    <header className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">Orders</p>
                                <h1 className="mt-2 text-3xl font-semibold tracking-tight">Order & Transaction Management</h1>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Link href="/admin/dashboard" className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary">
                                    Dashboard
                                </Link>
                            </div>
                        </div>
                    </header>

                    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                        {[
                            { label: 'Total Pesanan', value: summary.total_orders ?? 0, icon: PackageCheck },
                            { label: 'Paid', value: summary.paid_orders ?? 0, icon: WalletCards },
                            { label: 'Processing', value: summary.processing_orders ?? 0, icon: Clock3 },
                            { label: 'Shipped', value: summary.shipped_orders ?? 0, icon: Truck },
                            { label: 'Completed', value: summary.completed_orders ?? 0, icon: CheckCircle2 },
                        ].map(({ label, value, icon: Icon }) => (
                            <div key={label} className="rounded-[24px] border border-border bg-card p-4 shadow-sm">
                                <div className="flex items-center justify-between gap-3">
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

                    <section className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="relative w-full max-w-md">
                                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(event) => {
                                        const nextValue = event.target.value;
                                        setQuery(nextValue);
                                        applyFilters(nextValue, statusFilter);
                                    }}
                                    placeholder="Cari order, buyer, atau seller"
                                    className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(event) => {
                                    const nextStatus = event.target.value;
                                    setStatusFilter(nextStatus);
                                    applyFilters(query, nextStatus);
                                }}
                                className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none"
                            >
                                <option value="all">Semua Status</option>
                                {statuses.filter((item) => item !== 'all').map((status) => (
                                    <option key={status} value={status}>{statusLabel[status] ?? status}</option>
                                ))}
                            </select>
                        </div>
                    </section>

                    <section className="space-y-4">
                        {orders.length === 0 ? (
                            <div className="rounded-[28px] border border-border bg-card p-10 text-center text-muted-foreground">
                                Belum ada pesanan yang sesuai dengan filter saat ini.
                            </div>
                        ) : orders.map((order) => (
                            <div key={order.id} className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="text-lg font-semibold">{order.order_number}</p>
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${badgeColor[order.status] || 'bg-muted text-muted-foreground'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-muted-foreground">Buyer: {order.buyer} • Seller: {order.seller}</p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <button type="button" onClick={() => setSelectedOrder(order)} className="rounded-full border border-border bg-background px-3 py-2 text-sm font-medium hover:border-primary/40 hover:text-primary">
                                            Detail
                                        </button>
                                        <select
                                            value={order.status_value || 'pending_payment'}
                                            onChange={(event) => updateOrderStatus(order, event.target.value)}
                                            disabled={isUpdating}
                                            className="rounded-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {statuses.filter((item) => item !== 'all').map((status) => (
                                                <option key={status} value={status}>{statusLabel[status] ?? status}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-4 md:grid-cols-5">
                                    <div className="rounded-2xl border border-border bg-background p-3">
                                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Tanggal</p>
                                        <p className="mt-2 font-medium">{order.date}</p>
                                    </div>
                                    <div className="rounded-2xl border border-border bg-background p-3">
                                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Pembayaran</p>
                                        <p className="mt-2 font-medium">{order.payment}</p>
                                    </div>
                                    <div className="rounded-2xl border border-border bg-background p-3">
                                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Pengiriman</p>
                                        <p className="mt-2 font-medium">{order.delivery}</p>
                                    </div>
                                    <div className="rounded-2xl border border-border bg-background p-3">
                                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Total</p>
                                        <p className="mt-2 font-medium">{order.total}</p>
                                    </div>
                                    <div className="rounded-2xl border border-border bg-background p-3">
                                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Pickup</p>
                                        <p className="mt-2 font-medium">{order.pickup ? 'Ya' : 'Tidak'}</p>
                                    </div>
                                </div>

                                <div className="mt-5 flex flex-wrap gap-3 text-sm text-muted-foreground">
                                    <span className="inline-flex items-center gap-2"><CreditCard className="size-4 text-primary" /> {order.paymentMethod}</span>
                                    <span className="inline-flex items-center gap-2"><MapPinned className="size-4 text-primary" /> {order.address}</span>
                                    <span className="inline-flex items-center gap-2"><ArrowRight className="size-4 text-primary" /> {order.items}</span>
                                </div>
                            </div>
                        ))}
                    </section>
                </div>
            </div>

            {selectedOrder ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="w-full max-w-2xl rounded-[28px] border border-border bg-card p-6 shadow-xl">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Detail Order</p>
                                <h2 className="mt-2 text-2xl font-semibold">{selectedOrder.order_number}</h2>
                            </div>
                            <button type="button" onClick={() => setSelectedOrder(null)} className="rounded-full border border-border bg-background p-2 text-muted-foreground hover:text-foreground">
                                <X className="size-4" />
                            </button>
                        </div>

                        <div className="mt-5 space-y-4">
                            <div className="rounded-2xl border border-border bg-background p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Status</p>
                                        <p className="mt-2 font-medium">{selectedOrder.status}</p>
                                    </div>
                                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${badgeColor[selectedOrder.status] || 'bg-muted text-muted-foreground'}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-2xl border border-border bg-background p-4">
                                    <p className="text-sm text-muted-foreground">Pembeli</p>
                                    <p className="mt-2 font-medium">{selectedOrder.buyer}</p>
                                </div>
                                <div className="rounded-2xl border border-border bg-background p-4">
                                    <p className="text-sm text-muted-foreground">Seller</p>
                                    <p className="mt-2 font-medium">{selectedOrder.seller}</p>
                                </div>
                                <div className="rounded-2xl border border-border bg-background p-4">
                                    <p className="text-sm text-muted-foreground">Alamat</p>
                                    <p className="mt-2 font-medium">{selectedOrder.address}</p>
                                </div>
                                <div className="rounded-2xl border border-border bg-background p-4">
                                    <p className="text-sm text-muted-foreground">Penerima</p>
                                    <p className="mt-2 font-medium">{selectedOrder.recipient_name} / {selectedOrder.recipient_phone}</p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-border bg-background p-4">
                                <p className="text-sm text-muted-foreground">Ringkasan pembelian</p>
                                <div className="mt-3 space-y-2 text-sm text-foreground">
                                    <div className="flex items-center justify-between"><span>Subtotal</span><span>Rp {Number(selectedOrder.subtotal || 0).toLocaleString('id-ID')}</span></div>
                                    <div className="flex items-center justify-between"><span>Ongkir</span><span>Rp {Number(selectedOrder.delivery_fee || 0).toLocaleString('id-ID')}</span></div>
                                    <div className="flex items-center justify-between"><span>Diskon</span><span>- Rp {Number(selectedOrder.discount_amount || 0).toLocaleString('id-ID')}</span></div>
                                    <div className="flex items-center justify-between border-t border-border pt-2 font-semibold"><span>Total</span><span>{selectedOrder.total}</span></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <select
                                value={selectedOrder.status_value || 'pending_payment'}
                                onChange={(event) => updateOrderStatus(selectedOrder, event.target.value)}
                                disabled={isUpdating}
                                className="rounded-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {statuses.filter((item) => item !== 'all').map((status) => (
                                    <option key={status} value={status}>{statusLabel[status] ?? status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            ) : null}
        </main>
    );
}
