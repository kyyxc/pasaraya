import { Link, router } from '@inertiajs/react';
import { ArrowUpRight, BadgeCheck, MapPin, Search, ShieldCheck, Star, Store, TrendingUp, X } from 'lucide-react';
import { useState } from 'react';
import AdminSidebar from '../../components/admin-sidebar';
import ConfirmDialog from '../../components/confirm-dialog';

const statusColor = {
    Active: 'bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300',
    Suspended: 'bg-rose-500/10 text-rose-700 ring-1 ring-rose-500/20 dark:text-rose-300',
    Rejected: 'bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20 dark:text-amber-300',
    Pending: 'bg-sky-500/10 text-sky-700 ring-1 ring-sky-500/20 dark:text-sky-300',
};

const statusOptions = [
    { value: 'all', label: 'Semua status' },
    { value: 'pending', label: 'Pending' },
    { value: 'active', label: 'Aktif' },
    { value: 'suspended', label: 'Ditangguhkan' },
];

export default function AdminStores({ stores = [], summary = {}, filters = {} }) {
    const [query, setQuery] = useState(filters.q || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [selectedStore, setSelectedStore] = useState(null);
    const [deleteStore, setDeleteStore] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const applyFilters = (nextQ = query, nextStatus = statusFilter) => {
        const params = {};

        if (nextQ && nextQ.trim()) {
            params.q = nextQ.trim();
        }

        if (nextStatus && nextStatus !== 'all') {
            params.status = nextStatus;
        }

        router.get('/admin/stores', params, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const updateStoreStatus = (store, nextStatus) => {
        setIsSubmitting(true);

        router.patch(`/admin/stores/${store.id}/status`, { status: nextStatus }, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedStore(null);
            },
            onError: () => {
                setSelectedStore(null);
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleDeleteStore = () => {
        if (!deleteStore) {
            return;
        }

        setIsDeleting(true);

        router.delete(`/admin/stores/${deleteStore.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteStore(null);
            },
            onError: () => {
                setDeleteStore(null);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <main className="min-h-screen bg-background text-foreground">
            <AdminSidebar currentPath="/admin/stores" />

            <ConfirmDialog
                open={!!deleteStore}
                title="Hapus toko"
                description={deleteStore ? `Apakah Anda yakin ingin menghapus toko "${deleteStore.name}"? Tindakan ini tidak dapat dibatalkan.` : 'Apakah Anda yakin ingin melanjutkan?'}
                confirmText="Ya, hapus"
                cancelText="Batal"
                loading={isDeleting}
                onConfirm={handleDeleteStore}
                onCancel={() => setDeleteStore(null)}
            />

            <div className="lg:pl-72">
                <div className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 lg:px-6">
                    <header className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">Store</p>
                                <h1 className="mt-2 text-3xl font-semibold tracking-tight">Store Management</h1>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Link href="/admin/dashboard" className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary">
                                    Kembali Dashboard
                                </Link>
                            </div>
                        </div>
                    </header>

                    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {[
                            { label: 'Total Toko', value: summary.total_stores ?? 0, icon: Store },
                            { label: 'Aktif', value: summary.active_stores ?? 0, icon: BadgeCheck },
                            { label: 'Pending', value: summary.pending_stores ?? 0, icon: ShieldCheck },
                            { label: 'Penjualan', value: summary.total_sales ? `Rp ${(summary.total_sales / 1000000).toFixed(1)}M` : 'Rp 0M', icon: TrendingUp },
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
                                    placeholder="Cari nama toko atau pemilik"
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
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </section>

                    <section className="grid gap-6">
                        {stores.map((store) => (
                            <div key={store.id} className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                            <Store className="size-7" />
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h2 className="text-xl font-semibold">{store.name}</h2>
                                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColor[store.status] || 'bg-muted text-muted-foreground'}`}>
                                                    {store.status}
                                                </span>
                                            </div>
                                            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{store.description}</p>
                                            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                <span className="inline-flex items-center gap-2"><BadgeCheck className="size-4 text-primary" /> Pemilik: {store.owner}</span>
                                                <span className="inline-flex items-center gap-2"><MapPin className="size-4 text-primary" /> {store.address}</span>
                                                <span className="inline-flex items-center gap-2"><Star className="size-4 text-amber-500" /> {store.rating}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <button type="button" onClick={() => setSelectedStore(store)} className="rounded-full border border-border bg-background px-3 py-2 text-sm font-medium hover:border-primary/40 hover:text-primary">
                                            Detail
                                        </button>
                                        {store.status_value === 'pending' ? (
                                            <>
                                                <button type="button" disabled={isSubmitting} onClick={() => updateStoreStatus(store, 'active')} className="rounded-full bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
                                                    Approve
                                                </button>
                                                <button type="button" disabled={isSubmitting} onClick={() => updateStoreStatus(store, 'suspended')} className="rounded-full border border-red-500/40 bg-red-500/5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60">
                                                    Tolak
                                                </button>
                                            </>
                                        ) : null}
                                        {store.status_value === 'active' ? (
                                            <button type="button" disabled={isSubmitting} onClick={() => updateStoreStatus(store, 'suspended')} className="rounded-full border border-amber-500/40 bg-amber-500/5 px-3 py-2 text-sm font-medium text-amber-600 hover:bg-amber-500/10 disabled:cursor-not-allowed disabled:opacity-60">
                                                Suspend
                                            </button>
                                        ) : null}
                                        {store.status_value === 'suspended' ? (
                                            <button type="button" disabled={isSubmitting} onClick={() => updateStoreStatus(store, 'active')} className="rounded-full bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60">
                                                Aktifkan
                                            </button>
                                        ) : null}
                                        <button type="button" onClick={() => setDeleteStore(store)} className="rounded-full border border-red-500/40 bg-red-500/5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-500/10">
                                            Hapus
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-4 md:grid-cols-4">
                                    <div className="rounded-2xl border border-border bg-background p-3">
                                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Telepon</p>
                                        <p className="mt-2 font-medium">{store.phone}</p>
                                    </div>
                                    <div className="rounded-2xl border border-border bg-background p-3">
                                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Produk</p>
                                        <p className="mt-2 font-medium">{store.products}</p>
                                    </div>
                                    <div className="rounded-2xl border border-border bg-background p-3">
                                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Total Penjualan</p>
                                        <p className="mt-2 font-medium">{store.sales}</p>
                                    </div>
                                    <div className="rounded-2xl border border-border bg-background p-3">
                                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Verifikasi</p>
                                        <p className="mt-2 font-medium">{store.verification}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>
                </div>
            </div>

            {selectedStore ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="w-full max-w-xl rounded-[28px] border border-border bg-card p-6 shadow-xl">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Detail Toko</p>
                                <h2 className="mt-2 text-2xl font-semibold">{selectedStore.name}</h2>
                            </div>
                            <button type="button" onClick={() => setSelectedStore(null)} className="rounded-full border border-border bg-background p-2 text-muted-foreground hover:text-foreground">
                                <X className="size-4" />
                            </button>
                        </div>

                        <div className="mt-5 space-y-4">
                            <div className="rounded-2xl border border-border bg-background p-4">
                                <p className="text-sm text-muted-foreground">Pemilik</p>
                                <p className="mt-2 font-medium">{selectedStore.owner}</p>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-2xl border border-border bg-background p-4">
                                    <p className="text-sm text-muted-foreground">Alamat</p>
                                    <p className="mt-2 font-medium">{selectedStore.address}</p>
                                </div>
                                <div className="rounded-2xl border border-border bg-background p-4">
                                    <p className="text-sm text-muted-foreground">Telepon</p>
                                    <p className="mt-2 font-medium">{selectedStore.phone}</p>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-border bg-background p-4">
                                <p className="text-sm text-muted-foreground">Deskripsi</p>
                                <p className="mt-2 text-sm leading-6 text-foreground">{selectedStore.description}</p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap justify-end gap-3">
                            {selectedStore.status_value === 'pending' ? (
                                <>
                                    <button type="button" disabled={isSubmitting} onClick={() => updateStoreStatus(selectedStore, 'active')} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
                                        Approve
                                    </button>
                                    <button type="button" disabled={isSubmitting} onClick={() => updateStoreStatus(selectedStore, 'suspended')} className="rounded-full border border-red-500/40 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60">
                                        Tolak
                                    </button>
                                </>
                            ) : null}
                            {selectedStore.status_value === 'active' ? (
                                <button type="button" disabled={isSubmitting} onClick={() => updateStoreStatus(selectedStore, 'suspended')} className="rounded-full border border-amber-500/40 bg-amber-500/5 px-4 py-2 text-sm font-medium text-amber-600 hover:bg-amber-500/10 disabled:cursor-not-allowed disabled:opacity-60">
                                    Suspend
                                </button>
                            ) : null}
                            {selectedStore.status_value === 'suspended' ? (
                                <button type="button" disabled={isSubmitting} onClick={() => updateStoreStatus(selectedStore, 'active')} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60">
                                    Aktifkan
                                </button>
                            ) : null}
                            <button type="button" onClick={() => setDeleteStore(selectedStore)} className="rounded-full border border-red-500/40 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-500/10">
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </main>
    );
}
