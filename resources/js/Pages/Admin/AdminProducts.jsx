import { Link, router } from '@inertiajs/react';
import {
    ArrowUpDown,
    CircleDollarSign,
    Eye,
    Package,
    Plus,
    Search,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Star,
    Trash2,
    TrendingUp,
    Warehouse,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import AdminSidebar from '../../components/admin-sidebar';
import ConfirmDialog from '../../components/confirm-dialog';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(amount || 0));

const statusColor = {
    Active: 'bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300',
    'Low Stock': 'bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20 dark:text-amber-300',
    'Out of Stock': 'bg-rose-500/10 text-rose-700 ring-1 ring-rose-500/20 dark:text-rose-300',
};

const defaultForm = {
    store_id: '',
    category_id: '',
    name: '',
    description: '',
    price: '',
    stock: '',
    weight_grams: '',
    status: 'active',
    image: null,
};

export default function AdminProducts({ stats = {}, categories = [], categoryOptions = [], stores = [], products = [], filters = {} }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [viewProduct, setViewProduct] = useState(null);
    const [deleteProduct, setDeleteProduct] = useState(null);
    const [form, setForm] = useState(defaultForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);

    const formCategoryOptions = useMemo(
        () => (Array.isArray(categoryOptions) ? categoryOptions : []),
        [categoryOptions],
    );

    const openCreateModal = () => {
        setEditingProduct(null);
        setViewProduct(null);
        setForm(defaultForm);
        setErrors({});
        setShowCreateModal(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setViewProduct(null);
        setForm({
            store_id: String(product.store_id ?? ''),
            category_id: String(product.category_id ?? ''),
            name: product.name || '',
            description: product.description || '',
            price: String(product.price ?? ''),
            stock: String(product.stock ?? ''),
            weight_grams: String(product.weight_grams ?? ''),
            status: product.status_value || product.status || 'active',
            image: null,
        });
        setErrors({});
        setShowCreateModal(true);
    };

    const closeCreateModal = () => {
        setShowCreateModal(false);
        setEditingProduct(null);
        setErrors({});
        setForm(defaultForm);
    };

    const submitForm = (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const payload = new FormData();
        payload.append('store_id', form.store_id || '');
        payload.append('category_id', form.category_id || '');
        payload.append('name', form.name);
        payload.append('description', form.description || '');
        payload.append('price', form.price);
        payload.append('stock', form.stock);
        payload.append('weight_grams', form.weight_grams || '');
        payload.append('status', form.status);

        if (form.image) {
            payload.append('image', form.image);
        }

        const successMessage = editingProduct ? 'Produk berhasil diperbarui.' : 'Produk berhasil ditambahkan.';
        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                closeCreateModal();
                setToast({ type: 'success', message: successMessage });
                window.setTimeout(() => setToast(null), 2500);
            },
            onError: (payloadErrors) => {
                setErrors(payloadErrors || {});
            },
            onFinish: () => setIsSubmitting(false),
        };

        if (editingProduct) {
            payload.append('_method', 'PUT');
            router.post(`/admin/products/${editingProduct.id}`, payload, options);
            return;
        }

        router.post('/admin/products', payload, options);
    };

    const handleView = (product) => {
        setViewProduct(product);
        setEditingProduct(null);
    };

    const handleDelete = (product) => {
        setDeleteProduct(product);
    };

    const confirmDelete = () => {
        if (!deleteProduct) {
            return;
        }

        setIsDeleting(true);

        router.delete(`/admin/products/${deleteProduct.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setToast({ type: 'success', message: 'Produk berhasil dihapus.' });
                window.setTimeout(() => setToast(null), 2500);
                setDeleteProduct(null);
            },
            onError: () => {
                setToast({ type: 'error', message: 'Produk gagal dihapus.' });
                window.setTimeout(() => setToast(null), 2500);
                setDeleteProduct(null);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <main className="min-h-screen bg-background text-foreground">
            <AdminSidebar currentPath="/admin/products" />

            {showCreateModal ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-border bg-card p-6 shadow-xl">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Produk</p>
                                <h2 className="mt-2 text-2xl font-semibold">{editingProduct ? 'Edit produk' : 'Tambah produk baru'}</h2>
                            </div>
                            <button type="button" onClick={closeCreateModal} className="rounded-full border border-border bg-background p-2 text-muted-foreground hover:text-foreground">
                                <X className="size-4" />
                            </button>
                        </div>

                        <form onSubmit={submitForm} className="mt-6 space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Toko</label>
                                    <select
                                        value={form.store_id}
                                        onChange={(event) => setForm((current) => ({ ...current, store_id: event.target.value }))}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none"
                                    >
                                        <option value="">Pilih toko</option>
                                        {stores.map((store) => (
                                            <option key={store.id} value={store.id}>{store.name}</option>
                                        ))}
                                    </select>
                                    {errors.store_id ? <p className="mt-1 text-xs text-red-500">{errors.store_id}</p> : null}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Kategori</label>
                                    <select
                                        value={form.category_id}
                                        onChange={(event) => setForm((current) => ({ ...current, category_id: event.target.value }))}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none"
                                    >
                                        <option value="">Pilih kategori</option>
                                        {formCategoryOptions.map((category) => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id ? <p className="mt-1 text-xs text-red-500">{errors.category_id}</p> : null}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Nama Produk</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none"
                                />
                                {errors.name ? <p className="mt-1 text-xs text-red-500">{errors.name}</p> : null}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Deskripsi</label>
                                <textarea
                                    value={form.description}
                                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                                    rows={4}
                                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none"
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Harga</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.price}
                                        onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none"
                                    />
                                    {errors.price ? <p className="mt-1 text-xs text-red-500">{errors.price}</p> : null}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Stok</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.stock}
                                        onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none"
                                    />
                                    {errors.stock ? <p className="mt-1 text-xs text-red-500">{errors.stock}</p> : null}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Berat (gram)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.weight_grams}
                                        onChange={(event) => setForm((current) => ({ ...current, weight_grams: event.target.value }))}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Status</label>
                                    <select
                                        value={form.status}
                                        onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none"
                                    >
                                        <option value="active">Active</option>
                                        <option value="draft">Draft</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="out_of_stock">Out of Stock</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Gambar Produk</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => setForm((current) => ({ ...current, image: event.target.files?.[0] ?? null }))}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={closeCreateModal} className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary">
                                    Batal
                                </button>
                                <button type="submit" disabled={isSubmitting} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
                                    {isSubmitting ? 'Menyimpan...' : (editingProduct ? 'Simpan Perubahan' : 'Tambah Produk')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}

            {viewProduct ? (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="w-full max-w-xl rounded-[28px] border border-border bg-card p-6 shadow-xl">
                        <div className="flex items-center justify-between gap-4">
                            <h2 className="text-2xl font-semibold">Detail Produk</h2>
                            <button type="button" onClick={() => setViewProduct(null)} className="rounded-full border border-border bg-background p-2 text-muted-foreground hover:text-foreground">
                                <X className="size-4" />
                            </button>
                        </div>

                        <div className="mt-5 space-y-4">
                            <div className="rounded-2xl border border-border bg-background p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Nama Produk</p>
                                        <p className="mt-2 text-xl font-semibold">{viewProduct.name}</p>
                                    </div>
                                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[viewProduct.status] || 'bg-muted text-muted-foreground'}`}>
                                        {viewProduct.status}
                                    </span>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-2xl border border-border bg-background p-4">
                                    <p className="text-sm text-muted-foreground">Seller</p>
                                    <p className="mt-2 font-medium">{viewProduct.seller}</p>
                                </div>
                                <div className="rounded-2xl border border-border bg-background p-4">
                                    <p className="text-sm text-muted-foreground">Kategori</p>
                                    <p className="mt-2 font-medium">{viewProduct.category}</p>
                                </div>
                                <div className="rounded-2xl border border-border bg-background p-4">
                                    <p className="text-sm text-muted-foreground">Stok</p>
                                    <p className="mt-2 font-medium">{viewProduct.stock}</p>
                                </div>
                                <div className="rounded-2xl border border-border bg-background p-4">
                                    <p className="text-sm text-muted-foreground">Harga</p>
                                    <p className="mt-2 font-medium text-primary">{formatCurrency(viewProduct.price)}</p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-border bg-background p-4">
                                <p className="text-sm text-muted-foreground">Deskripsi</p>
                                <p className="mt-2 text-sm leading-6 text-foreground">{viewProduct.description || 'Tidak ada deskripsi.'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            <ConfirmDialog
                open={!!deleteProduct}
                title="Hapus produk"
                description={deleteProduct ? `Apakah Anda yakin ingin menghapus produk "${deleteProduct.name}"? Tindakan ini tidak dapat dibatalkan.` : 'Apakah Anda yakin ingin melanjutkan?'}
                confirmText="Ya, hapus"
                cancelText="Batal"
                loading={isDeleting}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteProduct(null)}
            />

            <div className="lg:pl-72">
                <div className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 lg:px-6">
                    <header className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">Products</p>
                                <h1 className="mt-2 text-3xl font-semibold tracking-tight">Product Dashboard</h1>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Link href="/admin/dashboard" className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary">
                                    Kembali ke Dashboard
                                </Link>
                                <button type="button" onClick={openCreateModal} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                    <Plus className="size-4" />
                                    Tambah Produk
                                </button>
                            </div>
                        </div>
                    </header>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    {[
                        { label: 'Total Produk', value: stats.total_products ?? 0, icon: Package },
                        { label: 'Produk Aktif', value: stats.active_products ?? 0, icon: ShieldCheck },
                        { label: 'Stok Habis', value: stats.out_of_stock ?? 0, icon: Warehouse },
                        { label: 'Stok Rendah', value: stats.low_stock ?? 0, icon: TrendingUp },
                        { label: 'Ditolak', value: stats.rejected_products ?? 0, icon: Sparkles },
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
                                defaultValue={filters.q || ''}
                                placeholder="Cari produk, seller, atau SKU"
                                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <select defaultValue={filters.category || categories[0] || 'Semua Kategori'} className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none">
                                {categories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            <select defaultValue={filters.status || 'all'} className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none">
                                <option value="all">Semua status</option>
                                <option value="active">Active</option>
                                <option value="low_stock">Low Stock</option>
                                <option value="out_of_stock">Out of Stock</option>
                            </select>
                            <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary">
                                <ArrowUpDown className="size-4" />
                                Urutkan
                            </button>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <div className="overflow-hidden rounded-[28px] border border-border bg-card shadow-sm">
                        <div className="border-b border-border px-5 py-4">
                            <h2 className="text-xl font-semibold">Daftar Produk</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-muted/40">
                                    <tr className="text-muted-foreground">
                                        <th className="px-5 py-3 font-medium">Produk</th>
                                        <th className="px-5 py-3 font-medium">Penjual</th>
                                        <th className="px-5 py-3 font-medium">Kategori</th>
                                        <th className="px-5 py-3 font-medium">Stok</th>
                                        <th className="px-5 py-3 font-medium">Harga</th>
                                        <th className="px-5 py-3 font-medium">Status</th>
                                        <th className="px-5 py-3 font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id || product.name} className="border-t border-border/80">
                                            <td className="px-5 py-4">
                                                <div>
                                                    <p className="font-medium">{product.name}</p>
                                                    <div className="mt-1 flex items-center gap-1 text-amber-500">
                                                        <Star className="size-3.5 fill-current" />
                                                        <span className="text-xs text-muted-foreground">{product.rating}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-muted-foreground">{product.seller}</td>
                                            <td className="px-5 py-4 text-muted-foreground">{product.category}</td>
                                            <td className="px-5 py-4 font-medium">{product.stock}</td>
                                            <td className="px-5 py-4 font-medium text-primary">{formatCurrency(product.price)}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[product.status] || 'bg-muted text-muted-foreground'}`}>
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button type="button" onClick={() => handleView(product)} className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground hover:border-primary/40 hover:text-primary">
                                                        <Eye className="size-3.5" />
                                                        Lihat
                                                    </button>
                                                    <button type="button" onClick={() => openEditModal(product)} className="rounded-full bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                                                        Edit
                                                    </button>
                                                    <button type="button" onClick={() => handleDelete(product)} className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/5 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-500/10">
                                                        <Trash2 className="size-3.5" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Alerts</p>
                            <h3 className="mt-2 text-xl font-semibold">Stok perlu perhatian</h3>
                            <div className="mt-6 space-y-3">
                                {products.filter((product) => product.status !== 'Active').map((product) => (
                                    <div key={product.name} className="flex items-center justify-between rounded-2xl border border-border bg-background p-3">
                                        <div>
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-sm text-muted-foreground">{product.stock} pcs tersisa</p>
                                        </div>
                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColor[product.status] || 'bg-muted text-muted-foreground'}`}>
                                            {product.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Summary</p>
                            <h3 className="mt-2 text-xl font-semibold">Ringkasan katalog</h3>
                            <div className="mt-6 space-y-4">
                                <div className="rounded-2xl border border-border bg-background p-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Total pendapatan produk</p>
                                            <p className="mt-2 text-xl font-semibold">{formatCurrency(128000000)}</p>
                                        </div>
                                        <CircleDollarSign className="size-5 text-primary" />
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-border bg-background p-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Produk paling laku</p>
                                            <p className="mt-2 text-lg font-semibold">Beras Premium 5kg</p>
                                        </div>
                                        <ShoppingBag className="size-5 text-primary" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                </div>
            </div>
        </main>
    );
}
