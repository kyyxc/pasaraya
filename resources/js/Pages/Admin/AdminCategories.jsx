import { router } from '@inertiajs/react';
import { FolderTree, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import AdminSidebar from '../../components/admin-sidebar';

const defaultForm = {
    name: '',
    description: '',
    is_active: true,
};

export default function AdminCategories({ categories = [], filters = {} }) {
    const [search, setSearch] = useState(filters.q || '');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deleteCategory, setDeleteCategory] = useState(null);
    const [form, setForm] = useState(defaultForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);

    const filteredCategories = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) {
            return categories;
        }

        return categories.filter((category) => {
            const haystack = `${category.name ?? ''} ${category.description ?? ''}`.toLowerCase();
            return haystack.includes(term);
        });
    }, [categories, search]);

    const openCreateModal = () => {
        setEditingCategory(null);
        setForm(defaultForm);
        setErrors({});
        setShowCreateModal(true);
    };

    const openEditModal = (category) => {
        setEditingCategory(category);
        setForm({
            name: category.name || '',
            description: category.description || '',
            is_active: category.status_value === 'active',
        });
        setErrors({});
        setShowCreateModal(true);
    };

    const closeModal = () => {
        setShowCreateModal(false);
        setEditingCategory(null);
        setForm(defaultForm);
        setErrors({});
    };

    const submitForm = (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const payload = new FormData();
        payload.append('name', form.name);
        payload.append('description', form.description || '');
        payload.append('is_active', form.is_active ? '1' : '0');

        const successMessage = editingCategory ? 'Kategori berhasil diperbarui.' : 'Kategori berhasil ditambahkan.';
        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                setToast({ type: 'success', message: successMessage });
                window.setTimeout(() => setToast(null), 2500);
            },
            onError: (payloadErrors) => {
                setErrors(payloadErrors || {});
            },
            onFinish: () => setIsSubmitting(false),
        };

        if (editingCategory) {
            payload.append('_method', 'PUT');
            router.post(`/admin/categories/${editingCategory.id}`, payload, options);
            return;
        }

        router.post('/admin/categories', payload, options);
    };

    const confirmDelete = () => {
        if (!deleteCategory) {
            return;
        }

        setIsDeleting(true);

        router.delete(`/admin/categories/${deleteCategory.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setToast({ type: 'success', message: 'Kategori berhasil dihapus.' });
                window.setTimeout(() => setToast(null), 2500);
                setDeleteCategory(null);
            },
            onError: () => {
                setToast({ type: 'error', message: 'Kategori gagal dihapus karena masih digunakan.' });
                window.setTimeout(() => setToast(null), 2500);
                setDeleteCategory(null);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <main className="min-h-screen bg-background text-foreground">
            <AdminSidebar currentPath="/admin/categories" />

            {showCreateModal ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="w-full max-w-xl rounded-[28px] border border-border bg-card p-6 shadow-xl">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Kategori</p>
                                <h2 className="mt-2 text-2xl font-semibold">{editingCategory ? 'Edit kategori' : 'Tambah kategori baru'}</h2>
                            </div>
                            <button type="button" onClick={closeModal} className="rounded-full border border-border bg-background p-2 text-muted-foreground hover:text-foreground">
                                <X className="size-4" />
                            </button>
                        </div>

                        <form onSubmit={submitForm} className="mt-6 space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Nama kategori</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none"
                                    placeholder="Contoh: Fashion"
                                />
                                {errors.name ? <p className="mt-1 text-xs text-red-500">{errors.name}</p> : null}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Deskripsi</label>
                                <textarea
                                    value={form.description}
                                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                                    className="min-h-[120px] w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none"
                                    placeholder="Deskripsi singkat kategori"
                                />
                                {errors.description ? <p className="mt-1 text-xs text-red-500">{errors.description}</p> : null}
                            </div>

                            <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3">
                                <div>
                                    <p className="text-sm font-medium">Status aktif</p>
                                    <p className="text-xs text-muted-foreground">Kategori akan tampil di marketplace.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setForm((current) => ({ ...current, is_active: !current.is_active }))}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${form.is_active ? 'bg-primary' : 'bg-muted'}`}
                                    aria-label="Toggle status kategori"
                                >
                                    <span className={`inline-block size-5 rounded-full bg-white transition ${form.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={closeModal} className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-primary/40 hover:text-primary">
                                    Batal
                                </button>
                                <button type="submit" disabled={isSubmitting} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-70">
                                    {isSubmitting ? (editingCategory ? 'Menyimpan...' : 'Menambah...') : (editingCategory ? 'Simpan perubahan' : 'Tambah kategori')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}

            <div className="lg:pl-72">
                <div className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 lg:px-6">
                    <header className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">Categories</p>
                                <h1 className="mt-2 text-3xl font-semibold tracking-tight">Category Management</h1>
                            </div>
                            <button type="button" onClick={openCreateModal} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                <Plus className="size-4" /> Tambah Kategori
                            </button>
                        </div>
                    </header>

                    <section className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                        <div className="relative max-w-md">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Cari kategori"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm"
                            />
                        </div>
                    </section>

                    <section className="grid gap-4">
                        {filteredCategories.length === 0 ? (
                            <div className="rounded-[28px] border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
                                Tidak ada kategori yang sesuai dengan pencarian.
                            </div>
                        ) : null}

                        {filteredCategories.map((category) => (
                            <div key={category.id} className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                            <FolderTree className="size-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-xl font-semibold">{category.name}</h2>
                                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${category.status === 'Active' ? 'bg-emerald-500/10 text-emerald-700' : 'bg-slate-500/10 text-slate-700'}`}>
                                                    {category.status}
                                                </span>
                                            </div>
                                            <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
                                            <p className="mt-2 text-xs text-muted-foreground">Slug: {category.slug} • Produk: {category.products_count}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => openEditModal(category)} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm font-medium hover:border-primary/40 hover:text-primary">
                                            <Pencil className="size-4" /> Edit
                                        </button>
                                        <button type="button" onClick={() => setDeleteCategory(category)} className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-200">
                                            <Trash2 className="size-4" /> Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>
                </div>
            </div>

            {deleteCategory ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="w-full max-w-md rounded-[28px] border border-border bg-card p-6 shadow-xl">
                        <h3 className="text-xl font-semibold">Hapus kategori</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Apakah Anda yakin ingin menghapus kategori <span className="font-semibold text-foreground">{deleteCategory.name}</span>?
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button type="button" onClick={() => setDeleteCategory(null)} className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-primary/40 hover:text-primary">
                                Batal
                            </button>
                            <button type="button" disabled={isDeleting} onClick={confirmDelete} className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-70">
                                {isDeleting ? 'Menghapus...' : 'Hapus'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            {toast ? (
                <div className="fixed bottom-6 right-6 z-[60] rounded-full border border-border bg-card px-4 py-2 text-sm shadow-lg">
                    {toast.message}
                </div>
            ) : null}
        </main>
    );
}
