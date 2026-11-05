import { Link } from '@inertiajs/react';
import { BadgeCheck, CalendarDays, Lock, Mail, Phone, ShieldCheck, UserCircle } from 'lucide-react';

const formatDate = (value) => {
    if (!value) {
        return 'Tidak tersedia';
    }

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
    }).format(new Date(value));
};

export default function Profile({ message = 'Selamat datang di profil Anda', user = null, notifications = [] }) {
    const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Anggota Pasaraya';
    const initials = fullName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('') || 'P';

    return (
        <main className="min-h-screen bg-background text-foreground">
            <header className="border-b border-border bg-background/80 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/images/logo.png" alt="Pasaraya logo" className="size-10 rounded-xl border border-border bg-background object-contain p-1.5" />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Pasaraya</p>
                            <p className="text-[10px] text-muted-foreground">Akun Anda</p>
                        </div>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link href="/products" className="text-sm font-medium text-muted-foreground hover:text-primary">
                            Marketplace
                        </Link>
                        <form method="post" action="/logout">
                            <input type="hidden" name="_token" value={typeof document !== 'undefined' ? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '' : ''} />
                            <button type="submit" className="rounded-full border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary">
                                Keluar
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-[30px] border border-border bg-card p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
                                {initials}
                            </div>
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Profil</p>
                                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{message}</h1>
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
                            <BadgeCheck className="size-4" />
                            {user?.is_active ? 'Akun aktif' : 'Status akun tidak tersedia'}
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-5xl gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
                <div className="space-y-6">
                    <div className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <UserCircle className="size-5 text-primary" />
                            <h2 className="text-xl font-semibold text-foreground">Ringkasan akun</h2>
                        </div>
                        <div className="mt-6 space-y-5">
                            <div>
                                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Nama lengkap</p>
                                <p className="mt-2 text-lg font-semibold text-foreground">{fullName}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Peran</p>
                                <p className="mt-2 text-lg font-semibold capitalize text-foreground">{user?.role === 'seller' ? 'Penjual' : 'Pembeli'}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Status akun</p>
                                <p className="mt-2 inline-flex items-center gap-2 text-lg font-semibold text-foreground">
                                    <ShieldCheck className="size-4 text-primary" />
                                    {user?.is_active ? 'Terverifikasi dan aktif' : 'Menunggu verifikasi'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-xl font-semibold text-foreground">Notifikasi</h2>
                            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                {notifications.length}
                            </span>
                        </div>

                        <div className="mt-5 space-y-3">
                            {notifications.length ? (
                                notifications.map((item) => (
                                    <div key={item.id} className="rounded-2xl border border-border bg-background p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-sm font-semibold text-foreground">{item.title}</p>
                                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-primary">
                                                {item.type}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.message}</p>
                                        <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                                            <span>Target: {item.target}</span>
                                            <span>{item.created_at}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
                                    Belum ada notifikasi untuk akun Anda.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold text-foreground">Edit profil</h2>
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">Data akun</span>
                    </div>

                    <form method="post" action="/profile" className="mt-6 space-y-5">
                        <input type="hidden" name="_token" value={typeof document !== 'undefined' ? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '' : ''} />
                        <input type="hidden" name="_method" value="PUT" />

                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block text-sm font-medium text-foreground">
                                <span className="mb-2 block">Nama depan</span>
                                <input
                                    defaultValue={user?.first_name ?? ''}
                                    name="first_name"
                                    className="w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                                />
                            </label>

                            <label className="block text-sm font-medium text-foreground">
                                <span className="mb-2 block">Nama belakang</span>
                                <input
                                    defaultValue={user?.last_name ?? ''}
                                    name="last_name"
                                    className="w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                                />
                            </label>
                        </div>

                        <label className="block text-sm font-medium text-foreground">
                            <span className="mb-2 flex items-center gap-2"><Mail className="size-4 text-primary" />Email</span>
                            <input
                                type="email"
                                defaultValue={user?.email ?? ''}
                                name="email"
                                className="w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                            />
                        </label>

                        <label className="block text-sm font-medium text-foreground">
                            <span className="mb-2 flex items-center gap-2"><Phone className="size-4 text-primary" />Nomor telepon</span>
                            <input
                                type="tel"
                                defaultValue={user?.phone ?? ''}
                                name="phone"
                                className="w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                            />
                        </label>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block text-sm font-medium text-foreground">
                                <span className="mb-2 flex items-center gap-2"><Lock className="size-4 text-primary" />Password baru</span>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Kosongkan jika tidak diubah"
                                    className="w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                                />
                            </label>

                            <label className="block text-sm font-medium text-foreground">
                                <span className="mb-2 block">Konfirmasi password</span>
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    placeholder="Ulangi password baru"
                                    className="w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                                />
                            </label>
                        </div>

                        <div className="mt-6 space-y-4 rounded-2xl border border-border bg-background p-4">
                            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card/50 p-4">
                                <CalendarDays className="mt-0.5 size-5 text-primary" />
                                <div>
                                    <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Bergabung sejak</p>
                                    <p className="mt-2 text-base font-medium text-foreground">{formatDate(user?.date_joined)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                            <Link href="/products" className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary">
                                Kembali ke belanja
                            </Link>
                            <button type="submit" className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
                                Simpan perubahan
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
}
