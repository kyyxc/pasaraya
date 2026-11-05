import { router } from '@inertiajs/react';
import { Megaphone, Pencil, Plus, Sparkles, Store, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import AdminSidebar from '../../components/admin-sidebar';

const defaultForm = {
    title: '',
    subtitle: '',
    description: '',
    image_url: '',
    button_text: 'Lihat detail',
    button_link: '/products',
    status: 'active',
    starts_at: '',
    ends_at: '',
    sort_order: 0,
};

export default function AdminPromotions({ banners = [], featured = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [deleteBanner, setDeleteBanner] = useState(null);
    const [form, setForm] = useState(defaultForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);

    const openCreateModal = () => {
        setEditingBanner(null);
        setForm(defaultForm);
        setErrors({});
        setShowModal(true);
    };

    const openEditModal = (banner) => {
        setEditingBanner(banner);
        setForm({
            title: banner.title || '',
            subtitle: banner.subtitle || '',
            description: banner.description || '',
            image_url: banner.image_url || '',
            button_text: banner.button_text || 'Lihat detail',
            button_link: banner.button_link || '/products',
            status: banner.status_value || 'active',
            starts_at: banner.starts_at ? banner.starts_at.slice(0, 10) : '',
            ends_at: banner.ends_at ? banner.ends_at.slice(0, 10) : '',
            sort_order: banner.sort_order ?? 0,
        });
        setErrors({});
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingBanner(null);
        setForm(defaultForm);
        setErrors({});
    };

    const submitForm = (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const payload = new FormData();
        payload.append('title', form.title);
        payload.append('subtitle', form.subtitle || '');
        payload.append('description', form.description || '');
        payload.append('image_url', form.image_url || '');
        payload.append('button_text', form.button_text || 'Lihat detail');
        payload.append('button_link', form.button_link || '/products');
        payload.append('status', form.status || 'active');
        payload.append('starts_at', form.starts_at || '');
        payload.append('ends_at', form.ends_at || '');
        payload.append('sort_order', String(form.sort_order ?? 0));

        const successMessage = editingBanner ? 'Banner berhasil diperbarui.' : 'Banner berhasil ditambahkan.';
        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                setToast({ type: 'success', message: successMessage });
                window.setTimeout(() => setToast(null), 2500);
            },
            onError: (payloadErrors) => setErrors(payloadErrors || {}),
            onFinish: () => setIsSubmitting(false),
        };

        if (editingBanner) {
            payload.append('_method', 'PUT');
            router.post(`/admin/promotions/${editingBanner.id}`, payload, options);
            return;
        }

        router.post('/admin/promotions', payload, options);
    };

    const confirmDelete = () => {
        if (!deleteBanner) {
            return;
        }

        setIsDeleting(true);
        router.delete(`/admin/promotions/${deleteBanner.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setToast({ type: 'success', message: 'Banner berhasil dihapus.' });
                window.setTimeout(() => setToast(null), 2500);
                setDeleteBanner(null);
            },
            onError: () => {
                setToast({ type: 'error', message: 'Banner gagal dihapus.' });
                window.setTimeout(() => setToast(null), 2500);
                setDeleteBanner(null);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <main className="min-h-screen bg-background text-foreground">
            <AdminSidebar currentPath="/admin/promotions" />

            {showModal ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-border bg-card p-6 shadow-xl">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Banner</p>
                                <h2 className="mt-2 text-2xl font-semibold">{editingBanner ? 'Edit banner' : 'Tambah banner baru'}</h2>
                            </div>
                            <button type="button" onClick={closeModal} className="rounded-full border border-border bg-background p-2 text-muted-foreground hover:text-foreground">
                                <X className="size-4" />
                            </button>
                        </div>

                        <form onSubmit={submitForm} className="mt-6 space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <label className="mb-1 block text-sm font-medium">Judul banner</label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none"
                                        placeholder="Contoh: Festival Produk Lokal"
                                    />
                                    {errors.title ? <p className="mt-1 text-xs text-red-500">{errors.title}</p> : null}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">Subtitle</label>
                                    <input
                                        type="text"
                                        value={form.subtitle}
                                        onChange={(event) => setForm((current) => ({ ...current, subtitle: event.target.value }))}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none"
                                        placeholder="Contoh: Produk pilihan"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">Teks tombol</label>
                                    <input
                                        type="text"
                                        value={form.button_text}
                                        onChange={(event) => setForm((current) => ({ ...current, button_text: event.target.value }))}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none"
                                        placeholder="Lihat detail"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-1 block text-sm font-medium">Deskripsi</label>
                                    <textarea
                                        value={form.description}
                                        onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                                        className="min-h-[120px] w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none"
                                        placeholder="Deskripsi singkat banner"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-1 block text-sm font-medium">URL gambar</label>
                                    <input
                                        type="url"
                                        value={form.image_url}
                                        onChange={(event) => setForm((current) => ({ ...current, image_url: event.target.value }))}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none"
                                        placeholder="https://example.com/banner.jpg"
                                    />
                                    {errors.image_url ? <p className="mt-1 text-xs text-red-500">{errors.image_url}</p> : null}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-1 block text-sm font-medium">Link tujuan</label>
                                    <input
                                        type="text"
                                        value={form.button_link}
                                        onChange={(event) => setForm((current) => ({ ...current, button_link: event.target.value }))}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none"
                                        placeholder="/products"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">Status</label>
                                    <select
                                        value={form.status}
                                        onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="active">Active</option>
                                        <option value="scheduled">Scheduled</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">Urutan</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.sort_order}
                                        onChange={(event) => setForm((current) => ({ ...current, sort_order: Number(event.target.value) || 0 }))}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">Mulai</label>
                                    <input
                                        type="date"
                                        value={form.starts_at}
                                        onChange={(event) => setForm((current) => ({ ...current, starts_at: event.target.value }))}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">Selesai</label>
                                    <input
                                        type="date"
                                        value={form.ends_at}
                                        onChange={(event) => setForm((current) => ({ ...current, ends_at: event.target.value }))}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={closeModal} className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-primary/40 hover:text-primary">
                                    Batal
                                </button>
                                <button type="submit" disabled={isSubmitting} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70">
                                    {isSubmitting ? 'Menyimpan...' : editingBanner ? 'Simpan perubahan' : 'Tambah banner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}

            {deleteBanner ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="w-full max-w-md rounded-[28px] border border-border bg-card p-6 shadow-xl">
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Konfirmasi</p>
                        <h2 className="mt-2 text-2xl font-semibold">Hapus banner?</h2>
                        <p className="mt-3 text-sm text-muted-foreground">Banner <span className="font-medium text-foreground">{deleteBanner.title}</span> akan dihapus dari homepage dan database.</p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button type="button" onClick={() => setDeleteBanner(null)} className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-primary/40 hover:text-primary">
                                Batal
                            </button>
                            <button type="button" disabled={isDeleting} onClick={confirmDelete} className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70">
                                {isDeleting ? 'Menghapus...' : 'Hapus'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            <div className="lg:pl-72">
                <div className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 lg:px-6">
                    <header className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">Promotion</p>
                                <h1 className="mt-2 text-3xl font-semibold tracking-tight">Promotion & Banner Management</h1>
                            </div>
                            <button type="button" onClick={openCreateModal} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                <Plus className="size-4" /> Tambah Banner
                            </button>
                        </div>
                    </header>

                    {toast ? (
                        <div className={`rounded-2xl border px-4 py-3 text-sm ${toast.type === 'success' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700' : 'border-red-500/30 bg-red-500/10 text-red-700'}`}>
                            {toast.message}
                        </div>
                    ) : null}

                    <section className="grid gap-4 md:grid-cols-3">
                        {banners.map((banner) => (
                            <div key={banner.id ?? banner.title} className="overflow-hidden rounded-[24px] border border-border bg-card p-4 shadow-sm">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        {banner.image_url ? (
                                            <img src={banner.image_url} alt={banner.title} className="size-12 rounded-xl object-cover" />
                                        ) : (
                                            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                <Megaphone className="size-5" />
                                            </div>
                                        )}
                                    </div>
                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${banner.status_value === 'active' ? 'bg-emerald-500/10 text-emerald-700' : banner.status_value === 'scheduled' ? 'bg-amber-500/10 text-amber-700' : 'bg-slate-500/10 text-slate-700'}`}>
                                        {banner.status}
                                    </span>
                                </div>
                                <p className="mt-4 text-lg font-semibold">{banner.title}</p>
                                {banner.subtitle ? <p className="mt-1 text-sm text-muted-foreground">{banner.subtitle}</p> : null}
                                <p className="mt-2 text-sm text-muted-foreground">Periode: {banner.period}</p>
                                <div className="mt-4 flex items-center justify-end gap-2">
                                    <button type="button" onClick={() => openEditModal(banner)} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium hover:border-primary/40 hover:text-primary">
                                        <Pencil className="size-3.5" /> Edit
                                    </button>
                                    <button type="button" onClick={() => setDeleteBanner(banner)} className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">
                                        <Trash2 className="size-3.5" /> Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                    </section>

                    <section className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                        <h2 className="text-xl font-semibold">Spotlight</h2>
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {featured.map((item) => (
                                <div key={item.name} className="rounded-2xl border border-border bg-background p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                {item.name.includes('Toko') ? <Store className="size-4" /> : <Sparkles className="size-4" />}
                                            </div>
                                            <p className="font-medium">{item.name}</p>
                                        </div>
                                        <span className="text-sm font-semibold text-primary">{item.count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
