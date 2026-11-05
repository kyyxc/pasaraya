import { router } from '@inertiajs/react';
import { BellRing, Plus, Send, X } from 'lucide-react';
import { useState } from 'react';
import AdminSidebar from '../../components/admin-sidebar';

const defaultForm = {
    title: '',
    message: '',
    type: 'announcement',
    target: 'all',
};

export default function AdminNotifications({ notifications = [] }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [form, setForm] = useState(defaultForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);

    const closeModal = () => {
        setShowCreateModal(false);
        setForm(defaultForm);
        setErrors({});
    };

    const submitForm = (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        router.post('/admin/notifications', form, {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                setToast({ type: 'success', message: 'Notifikasi berhasil dikirim.' });
                window.setTimeout(() => setToast(null), 2500);
            },
            onError: (payloadErrors) => setErrors(payloadErrors || {}),
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <main className="min-h-screen bg-background text-foreground">
            <AdminSidebar currentPath="/admin/notifications" />

            {showCreateModal ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="w-full max-w-xl rounded-[28px] border border-border bg-card p-6 shadow-xl">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Notifikasi</p>
                                <h2 className="mt-2 text-2xl font-semibold">Buat notifikasi baru</h2>
                            </div>
                            <button type="button" onClick={closeModal} className="rounded-full border border-border bg-background p-2 text-muted-foreground hover:text-foreground">
                                <X className="size-4" />
                            </button>
                        </div>

                        <form onSubmit={submitForm} className="mt-6 space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Judul</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none"
                                    placeholder="Contoh: Promo Hari Ini"
                                />
                                {errors.title ? <p className="mt-1 text-xs text-red-500">{errors.title}</p> : null}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Pesan</label>
                                <textarea
                                    value={form.message}
                                    onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                                    className="min-h-[120px] w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none"
                                    placeholder="Tulis isi notifikasi"
                                />
                                {errors.message ? <p className="mt-1 text-xs text-red-500">{errors.message}</p> : null}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Tipe</label>
                                    <select
                                        value={form.type}
                                        onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none"
                                    >
                                        <option value="announcement">Announcement</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="order">Order</option>
                                        <option value="system">System</option>
                                        <option value="verification">Verification</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">Target</label>
                                    <select
                                        value={form.target}
                                        onChange={(event) => setForm((current) => ({ ...current, target: event.target.value }))}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none"
                                    >
                                        <option value="all">Semua</option>
                                        <option value="buyer">Buyer</option>
                                        <option value="seller">Seller</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={closeModal} className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-primary/40 hover:text-primary">
                                    Batal
                                </button>
                                <button type="submit" disabled={isSubmitting} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70">
                                    {isSubmitting ? 'Mengirim...' : 'Kirim notifikasi'}
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
                                <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">Notifications</p>
                                <h1 className="mt-2 text-3xl font-semibold tracking-tight">Notification Management</h1>
                            </div>
                            <button type="button" onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                <Plus className="size-4" /> Buat Notifikasi
                            </button>
                        </div>
                    </header>

                    {toast ? (
                        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
                            {toast.message}
                        </div>
                    ) : null}

                    <section className="space-y-4">
                        {notifications.map((item) => (
                            <div key={`${item.id ?? item.title}-${item.target}`} className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                            <BellRing className="size-5" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold">{item.title}</p>
                                            <p className="mt-1 text-sm text-muted-foreground">{item.message}</p>
                                            <p className="mt-2 text-xs text-muted-foreground">Target: {item.target} • Type: {item.type} • {item.created_at}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${item.status === 'Sent' || item.status === 'Read' ? 'bg-emerald-500/10 text-emerald-700' : item.status === 'Scheduled' ? 'bg-amber-500/10 text-amber-700' : 'bg-slate-500/10 text-slate-700'}`}>
                                            {item.status}
                                        </span>
                                        <button type="button" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm font-medium hover:border-primary/40 hover:text-primary">
                                            <Send className="size-4" /> Kirim
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </main>
    );
}
