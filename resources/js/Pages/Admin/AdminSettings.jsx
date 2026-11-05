import { router } from '@inertiajs/react';
import { LogOut, ShieldCheck, Store, Wrench } from 'lucide-react';
import AdminSidebar from '../../components/admin-sidebar';

export default function AdminSettings({ marketplace = {}, sections = [], security = [] }) {
    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <main className="min-h-screen bg-background text-foreground">
            <AdminSidebar currentPath="/admin/settings" />

            <div className="lg:pl-72">
                <div className="mx-auto max-w-[1200px] space-y-6 px-4 py-6 lg:px-6">
                    <header className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">System</p>
                                <h1 className="mt-2 text-3xl font-semibold tracking-tight">Pengaturan Sistem</h1>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                                >
                                    <LogOut className="size-4" />
                                    Keluar
                                </button>
                            </div>
                        </div>
                    </header>

                    <section className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">Marketplace</p>
                                <Store className="size-5 text-primary" />
                            </div>
                            <p className="mt-4 text-2xl font-semibold">{marketplace.name ?? 'Pasaraya'}</p>
                            <p className="mt-2 text-sm text-muted-foreground">{marketplace.email ?? 'hello@pasaraya.id'}</p>
                        </div>

                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">Komisi</p>
                                <Wrench className="size-5 text-primary" />
                            </div>
                            <p className="mt-4 text-2xl font-semibold">{marketplace.commission ?? '5%'}</p>
                            <p className="mt-2 text-sm text-muted-foreground">Persentase marketplace fee</p>
                        </div>

                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">Keamanan</p>
                                <ShieldCheck className="size-5 text-primary" />
                            </div>
                            <p className="mt-4 text-2xl font-semibold">{security.length}</p>
                            <p className="mt-2 text-sm text-muted-foreground">Rule keamanan aktif</p>
                        </div>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <h2 className="text-xl font-semibold">Konfigurasi umum</h2>
                            <div className="mt-5 space-y-3">
                                {sections.map((item) => (
                                    <div key={item.title} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/70 p-3">
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{item.title}</p>
                                            <p className="mt-1 text-sm text-muted-foreground">{item.value}</p>
                                        </div>
                                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                            {item.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                            <h2 className="text-xl font-semibold">Keamanan akun</h2>
                            <div className="mt-5 space-y-3">
                                {security.map((item) => (
                                    <div key={item.label} className="rounded-2xl border border-border bg-background/70 p-3">
                                        <p className="text-sm text-muted-foreground">{item.label}</p>
                                        <p className="mt-2 text-base font-medium text-foreground">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
                            >
                                <LogOut className="size-4" />
                                Keluar dari admin
                            </button>
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                        <h2 className="text-xl font-semibold">Ringkasan pengaturan</h2>
                        <div className="mt-5 grid gap-4 md:grid-cols-4">
                            <div className="rounded-2xl border border-border bg-background/70 p-4">
                                <p className="text-sm text-muted-foreground">Nama marketplace</p>
                                <p className="mt-2 text-lg font-semibold">{marketplace.name ?? 'Pasaraya'}</p>
                            </div>
                            <div className="rounded-2xl border border-border bg-background/70 p-4">
                                <p className="text-sm text-muted-foreground">Komisi</p>
                                <p className="mt-2 text-lg font-semibold">{marketplace.commission ?? '5%'}</p>
                            </div>
                            <div className="rounded-2xl border border-border bg-background/70 p-4">
                                <p className="text-sm text-muted-foreground">Pajak</p>
                                <p className="mt-2 text-lg font-semibold">{marketplace.tax ?? '0%'}</p>
                            </div>
                            <div className="rounded-2xl border border-border bg-background/70 p-4">
                                <p className="text-sm text-muted-foreground">Currency</p>
                                <p className="mt-2 text-lg font-semibold">{marketplace.currency ?? 'IDR'}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
