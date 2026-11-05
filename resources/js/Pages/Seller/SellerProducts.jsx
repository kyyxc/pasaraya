import { Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    BarChart3,
    Boxes,
    CheckCircle2,
    MessageSquare,
    Package,
    PackageCheck,
    PencilLine,
    Plus,
    Search,
    Settings,
    ShoppingBag,
    ShoppingCart,
    SlidersHorizontal,
    Store,
    Trash2,
    TrendingUp,
    TriangleAlert,
    Upload,
    UserCircle2,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import ConfirmDialog from '../../components/confirm-dialog';
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
    }).format(new Date(value));
};

const emptyForm = {
    name: '',
    description: '',
    category_id: '',
    price: '',
    stock: '',
    weight_grams: '',
    status: 'active',
    image: null,
};

export default function SellerProducts({ auth, store = null, products = [], categories = [], filters = {}, pagination = {} }) {
    const user = auth?.user;
    const [query, setQuery] = useState(filters.q || '');
    const [category, setCategory] = useState(filters.category || 'all');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [sort, setSort] = useState(filters.sort || 'created_at_desc');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editingProduct, setEditingProduct] = useState(null);
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteProduct, setDeleteProduct] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const categoryOptions = useMemo(
        () => [{ id: 'all', name: 'Semua kategori' }, ...(Array.isArray(categories) ? categories : [])],
        [categories],
    );

    const buildParams = (next = {}) => {
        const params = {};
        const q = next.q ?? query;
        const nextCategory = next.category ?? category;
        const nextStatus = next.status ?? statusFilter;
        const nextSort = next.sort ?? sort;

        if (q && q.trim()) params.q = q.trim();
        if (nextCategory && nextCategory !== 'all') params.category = nextCategory;
        if (nextStatus && nextStatus !== 'all') params.status = nextStatus;
        if (nextSort && nextSort !== 'created_at_desc') params.sort = nextSort;

        return params;
    };

    const applyFilters = (nextValues = {}) => {
        router.get('/seller/products', buildParams(nextValues), {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const handlePageChange = (page) => {
        if (!page || page < 1 || page > (pagination.last_page ?? 1)) {
            return;
        }

        router.get('/seller/products', {
            ...buildParams(),
            page,
        }, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const openCreateForm = () => {
        setEditingProduct(null);
        setForm(emptyForm);
        setErrors({});
        setShowForm(true);
    };

    const openEditForm = (product) => {
        setEditingProduct(product);
        setForm({
            name: product.name || '',
            description: product.description || '',
            category_id: String(product.category_id ?? ''),
            price: String(product.price ?? ''),
            stock: String(product.stock ?? ''),
            weight_grams: String(product.weight_grams ?? ''),
            status: product.status || 'active',
            image: null,
        });
        setErrors({});
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setErrors({});
        setEditingProduct(null);
        setForm(emptyForm);
    };

    const submitForm = (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const payload = new FormData();
        payload.append('name', form.name);
        payload.append('description', form.description || '');
        payload.append('category_id', form.category_id);
        payload.append('price', form.price);
        payload.append('stock', form.stock);
        payload.append('weight_grams', form.weight_grams || '');
        payload.append('status', form.status);

        if (form.image) {
            payload.append('image', form.image);
        }

        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                closeForm();
                setToast({
                    type: 'success',
                    message: editingProduct ? 'Produk berhasil diperbarui.' : 'Produk berhasil ditambahkan.',
                });
                window.setTimeout(() => setToast(null), 2500);
            },
            onError: (errorsPayload) => {
                setErrors(errorsPayload || {});
            },
            onFinish: () => setIsSubmitting(false),
        };

        if (editingProduct) {
            payload.append('_method', 'PUT');
            router.post(`/seller/products/${editingProduct.id}`, payload, options);
            return;
        }

        router.post('/seller/products', payload, options);
    };

    const handleDelete = (product) => {
        setDeleteProduct(product);
    };

    const confirmDelete = () => {
        if (!deleteProduct) {
            return;
        }

        setIsDeleting(true);

        router.delete(`/seller/products/${deleteProduct.id}`, {
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
            {toast ? (
                <div className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-lg">
                    {toast.type === 'success' ? <CheckCircle2 className="size-4 text-emerald-600" /> : <AlertCircle className="size-4 text-rose-600" />}
                    <span className="text-sm font-medium text-foreground">{toast.message}</span>
                </div>
            ) : null}

            <SellerSidebar currentPath="/seller/products" store={store} />

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
                <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-sm">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Produk</p>
                            <h1 className="mt-1 text-2xl font-semibold text-foreground">Manajemen Produk</h1>
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
                    <section className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                            <label className="relative block flex-1">
                                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            applyFilters();
                                        }
                                    }}
                                    placeholder="Cari produk"
                                    className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20"
                                />
                            </label>
                            <select
                                value={category}
                                onChange={(event) => {
                                    const nextCategory = event.target.value;
                                    setCategory(nextCategory);
                                    applyFilters({ category: nextCategory });
                                }}
                                className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20"
                            >
                                {categoryOptions.map((option) => (
                                    <option key={option.id} value={option.id}>{option.name}</option>
                                ))}
                            </select>
                            <select
                                value={statusFilter}
                                onChange={(event) => {
                                    const nextStatus = event.target.value;
                                    setStatusFilter(nextStatus);
                                    applyFilters({ status: nextStatus });
                                }}
                                className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20"
                            >
                                <option value="all">Semua status</option>
                                <option value="active">Aktif</option>
                                <option value="draft">Draft</option>
                                <option value="inactive">Tidak aktif</option>
                                <option value="out_of_stock">Stok habis</option>
                            </select>
                            <select
                                value={sort}
                                onChange={(event) => {
                                    const nextSort = event.target.value;
                                    setSort(nextSort);
                                    applyFilters({ sort: nextSort });
                                }}
                                className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20"
                            >
                                <option value="created_at_desc">Urut: terbaru</option>
                                <option value="price_asc">Harga: terendah</option>
                                <option value="price_desc">Harga: tertinggi</option>
                                <option value="stock_desc">Stok: paling banyak</option>
                            </select>
                        </div>
                        <Button type="button" onClick={openCreateForm} className="gap-2 rounded-full px-4 py-2.5">
                            <Plus className="size-4" />
                            Tambah produk
                        </Button>
                    </div>

                    <div className="mt-6 overflow-hidden rounded-[24px] border border-border">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-border text-left text-sm">
                                <thead className="bg-muted/60">
                                    <tr>
                                        <th className="px-4 py-3 font-medium text-muted-foreground">Produk</th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground">Kategori</th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground">Harga</th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground">Stok</th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground">Dibuat</th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-background">
                                    {Array.isArray(products) && products.length > 0 ? (
                                        products.map((product) => (
                                            <tr key={product.id} className="align-middle">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={product.images?.[0]?.image || product.image || '/images/producs/image_1.webp'}
                                                            alt={product.name}
                                                            className="size-12 rounded-xl border border-border object-cover"
                                                        />
                                                        <div>
                                                            <p className="font-medium text-foreground">{product.name}</p>
                                                            <p className="text-xs text-muted-foreground">{product.slug}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">{product.category?.name || product.category_name || 'Tanpa kategori'}</td>
                                                <td className="px-4 py-3 font-medium text-foreground">{formatCurrency(product.price)}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${Number(product.stock) <= 5 ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'}`}>
                                                        {product.stock}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${product.status === 'active' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-slate-500/10 text-slate-700 dark:text-slate-300'}`}>
                                                        {product.status === 'active' ? 'Aktif' : product.status === 'draft' ? 'Draft' : product.status === 'out_of_stock' ? 'Stok habis' : 'Tidak aktif'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">{formatDate(product.created_at)}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditForm(product)}
                                                            className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground"
                                                            aria-label={`Edit ${product.name}`}
                                                        >
                                                            <PencilLine className="size-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(product)}
                                                            className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground"
                                                            aria-label={`Hapus ${product.name}`}
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                                                Belum ada produk untuk toko ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <SlidersHorizontal className="size-4" />
                            {pagination.total ?? 0} produk
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                disabled={pagination.current_page <= 1}
                                onClick={() => handlePageChange((pagination.current_page ?? 1) - 1)}
                                className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Sebelumnya
                            </button>
                            <span className="text-sm text-muted-foreground">Halaman {pagination.current_page ?? 1}</span>
                            <button
                                type="button"
                                disabled={pagination.current_page >= (pagination.last_page ?? 1)}
                                onClick={() => handlePageChange((pagination.current_page ?? 1) + 1)}
                                className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    </div>
                </section>
                </div>
            </div>

            {showForm ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[30px] border border-border bg-card shadow-xl">
                        <div className="flex items-center justify-between gap-4 border-b border-border p-5">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Produk</p>
                                <h2 className="mt-2 text-2xl font-semibold text-foreground">
                                    {editingProduct ? 'Edit produk' : 'Tambah produk'}
                                </h2>
                            </div>
                            <button type="button" onClick={closeForm} className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground">
                                <X className="size-4" />
                            </button>
                        </div>

                        <div className="max-h-[calc(90vh-88px)] overflow-y-auto p-5">
                            <form onSubmit={submitForm} className="space-y-5">
                                <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-foreground">Nama produk</label>
                                    <input
                                        value={form.name}
                                        onChange={(event) => setForm({ ...form, name: event.target.value })}
                                        placeholder="Contoh: Jeruk Lokal 5kg"
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20"
                                    />
                                    {errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name}</p> : null}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-foreground">Deskripsi</label>
                                    <textarea
                                        value={form.description}
                                        onChange={(event) => setForm({ ...form, description: event.target.value })}
                                        rows={4}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20"
                                    />
                                    {errors.description ? <p className="mt-1 text-xs text-rose-600">{errors.description}</p> : null}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-foreground">Kategori</label>
                                    <select
                                        value={form.category_id}
                                        onChange={(event) => setForm({ ...form, category_id: event.target.value })}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20"
                                    >
                                        <option value="">Pilih kategori</option>
                                        {categories.map((categoryItem) => (
                                            <option key={categoryItem.id} value={categoryItem.id}>{categoryItem.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id ? <p className="mt-1 text-xs text-rose-600">{errors.category_id}</p> : null}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-foreground">Status</label>
                                    <select
                                        value={form.status}
                                        onChange={(event) => setForm({ ...form, status: event.target.value })}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20"
                                    >
                                        <option value="active">Aktif</option>
                                        <option value="draft">Draft</option>
                                        <option value="inactive">Tidak aktif</option>
                                        <option value="out_of_stock">Stok habis</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-foreground">Harga</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.price}
                                        onChange={(event) => setForm({ ...form, price: event.target.value })}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20"
                                    />
                                    {errors.price ? <p className="mt-1 text-xs text-rose-600">{errors.price}</p> : null}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-foreground">Stok</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.stock}
                                        onChange={(event) => setForm({ ...form, stock: event.target.value })}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20"
                                    />
                                    {errors.stock ? <p className="mt-1 text-xs text-rose-600">{errors.stock}</p> : null}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-foreground">Berat (gram)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.weight_grams}
                                        onChange={(event) => setForm({ ...form, weight_grams: event.target.value })}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20"
                                    />
                                    {errors.weight_grams ? <p className="mt-1 text-xs text-rose-600">{errors.weight_grams}</p> : null}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-foreground">Foto produk</label>
                                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-background px-4 py-6 text-sm text-muted-foreground hover:border-primary/40 hover:text-primary">
                                        <Upload className="size-4" />
                                        {form.image ? form.image.name : 'Pilih gambar'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(event) => setForm({ ...form, image: event.target.files?.[0] || null })}
                                        />
                                    </label>
                                    {errors.image ? <p className="mt-1 text-xs text-rose-600">{errors.image}</p> : null}
                                </div>
                            </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={closeForm} className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground">
                                        Batal
                                    </button>
                                    <Button type="submit" disabled={isSubmitting} className="rounded-full px-5 py-2.5 text-sm font-medium">
                                        {isSubmitting ? 'Menyimpan...' : editingProduct ? 'Simpan perubahan' : 'Simpan produk'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            ) : null}
        </main>
    );
}
