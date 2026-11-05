import { Link } from '@inertiajs/react';
import {
    BadgeCheck,
    CalendarDays,
    Mail,
    Phone,
    ShieldCheck,
    Store,
    UserCircle,
} from 'lucide-react';
import ProfileMenu from '../../components/profile-menu';
import SellerSidebar from '../../components/seller-sidebar';

const formatDate = (value) => {
    if (!value) {
        return 'Belum tersedia';
    }

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
    }).format(new Date(value));
};

export default function SellerAccount({ user = null, store = null, notifications = [] }) {
    const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Penjual Pasaraya';
    const initials = fullName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('') || 'P';

    return (
        <main className="min-h-screen bg-background text-foreground">
            <SellerSidebar currentPath="/seller/account" store={store} />

            <div className="lg:pl-72">
                <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-sm">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Akun</p>
                            <h1 className="mt-1 text-2xl font-semibold text-foreground">Profil & Akun</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/seller/dashboard" className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-primary/30 hover:text-primary">
                                Ke dashboard
                            </Link>
                            <ProfileMenu user={user} />
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                    <section className="rounded-[30px] border border-border bg-card p-6 shadow-sm sm:p-8">
                        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
                                    {initials}
                                </div>
                                <div>
                                    <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">Penjual</p>
                                    <h2 className="mt-2 text-3xl font-semibold text-foreground">{fullName}</h2>
                                </div>
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
                                <BadgeCheck className="size-4" />
                                {user?.is_active ? 'Akun aktif' : 'Status akun belum tersedia'}
                            </div>
                        </div>
                    </section>

                    <section className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                        <div className="space-y-6">
                            <div className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <UserCircle className="size-5 text-primary" />
                                    <h3 className="text-xl font-semibold text-foreground">Ringkasan akun</h3>
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
                                            {user?.is_active ? 'Terverifikasi' : 'Belum diverifikasi'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="text-xl font-semibold text-foreground">Notifikasi</h3>
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
                                            Belum ada notifikasi untuk toko Anda.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-foreground">Detail kontak</h3>
                            <div className="mt-6 space-y-4">
                                <div className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                                    <Mail className="mt-0.5 size-5 text-primary" />
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Email</p>
                                        <p className="mt-2 text-base font-medium text-foreground">{user?.email || 'Belum diisi'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                                    <Phone className="mt-0.5 size-5 text-primary" />
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Nomor telepon</p>
                                        <p className="mt-2 text-base font-medium text-foreground">{user?.phone || 'Belum diisi'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                                    <CalendarDays className="mt-0.5 size-5 text-primary" />
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Tanggal bergabung</p>
                                        <p className="mt-2 text-base font-medium text-foreground">{formatDate(user?.date_joined)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
                        <div className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <Store className="size-5 text-primary" />
                                <h3 className="text-xl font-semibold text-foreground">Toko</h3>
                            </div>
                            <div className="mt-6 space-y-5">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Nama toko</p>
                                    <p className="mt-2 text-lg font-semibold text-foreground">{store?.name || 'Toko belum dibuat'}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Status toko</p>
                                    <p className="mt-2 text-lg font-semibold text-foreground">{store?.status || 'Belum tersedia'}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Slug</p>
                                    <p className="mt-2 text-lg font-semibold text-foreground">{store?.slug ? `@${store.slug}` : 'Belum tersedia'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-foreground">Pengaturan akun</h3>
                            <div className="mt-6 space-y-4">
                                <div className="rounded-2xl border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
                                    Pengaturan profil dan perubahan data akun belum tersedia di backend yang saat ini berjalan. Tampilan ini bersifat informational sesuai struktur aplikasi yang ada.
                                </div>
                                <form method="post" action="/logout">
                                    <input type="hidden" name="_token" value={typeof document !== 'undefined' ? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '' : ''} />
                                    <button
                                        type="submit"
                                        className="inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                                    >
                                        Keluar
                                    </button>
                                </form>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
