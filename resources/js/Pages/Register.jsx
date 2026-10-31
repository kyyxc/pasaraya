import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Check,
    Mail,
    MapPin,
    PackageCheck,
    Phone,
    ShieldCheck,
    User,
} from 'lucide-react';
import { Button } from '../components/ui/button';

const sellerBenefits = [
    'Jangkauan lokal yang lebih baik',
    'Perlindungan pembayaran aman',
    'Manajemen stok yang mudah',
];

export default function Register({ message = 'Silakan daftar', auth, errors = {} }) {
    const user = auth?.user;
    const csrfToken = typeof document !== 'undefined'
        ? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? ''
        : '';
    const formErrors = Object.values(errors || {}).flatMap((error) => Array.isArray(error) ? error : [error]).filter(Boolean);

    if (user) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
                <div className="w-full max-w-md rounded-[28px] border border-border bg-card p-8 text-center shadow-sm">
                    <img src="/images/logo.png" alt="Pasaraya logo" className="mx-auto size-14 rounded-2xl border border-border bg-background object-contain p-2" />
                    <h1 className="mt-5 text-3xl font-semibold tracking-tight">Anda sudah masuk</h1>
                    <p className="mt-3 text-sm text-muted-foreground">
                        Halo, {user.first_name || 'teman'}.
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Link href="/" className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                            Ke beranda
                        </Link>
                        <form method="post" action="/logout">
                            <input type="hidden" name="_token" value={csrfToken} />
                            <button type="submit" className="inline-flex w-full items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground">
                                Keluar
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background text-foreground">
            <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-10">
                <section className="flex items-center justify-center">
                    <div className="w-full max-w-xl rounded-[28px] border border-border bg-card p-6 shadow-sm sm:p-8">
                        <div className="mb-7 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">Bergabung dengan Pasaraya</p>
                                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Buat akun Anda</h2>
                            </div>
                            <img
                                src="/images/logo.png"
                                alt="Pasaraya logo"
                                className="size-11 rounded-2xl border border-border bg-background object-contain p-1.5 shadow-sm"
                            />
                        </div>

                        <form method="post" action="/register" className="space-y-5">
                            <input type="hidden" name="_token" value={csrfToken} />
                            {formErrors.length > 0 && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
                                    <ul className="list-disc space-y-1 pl-5">
                                        {formErrors.map((error) => (
                                            <li key={error}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="first_name" className="text-sm font-medium text-foreground">
                                        Nama depan
                                    </label>
                                    <div className="relative">
                                        <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            id="first_name"
                                            name="first_name"
                                            type="text"
                                            placeholder="Jane"
                                            className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="last_name" className="text-sm font-medium text-foreground">
                                        Nama belakang
                                    </label>
                                    <div className="relative">
                                        <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            id="last_name"
                                            name="last_name"
                                            type="text"
                                            placeholder="Doe"
                                            className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium text-foreground">
                                    Nomor telepon
                                </label>
                                <div className="relative">
                                    <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="+62 812 3456 7890"
                                        className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-foreground">
                                    Alamat email
                                </label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="nama@contoh.com"
                                        autoComplete="email"
                                        className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="city" className="text-sm font-medium text-foreground">
                                    Kota atau lingkungan
                                </label>
                                <div className="relative">
                                    <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        id="city"
                                        name="city"
                                        type="text"
                                        placeholder="Bandung, Jawa Barat"
                                        className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-foreground">
                                    Kata sandi
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="Buat kata sandi yang aman"
                                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password_confirmation" className="text-sm font-medium text-foreground">
                                    Konfirmasi kata sandi
                                </label>
                                <input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="Ulangi kata sandi Anda"
                                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20"
                                    required
                                />
                            </div>

                            <label className="flex items-start gap-2 text-sm text-muted-foreground">
                                <input type="checkbox" className="mt-0.5 size-4 rounded border-border text-primary focus:ring-primary/20" required />
                                <span>
                                    Saya setuju dengan <Link href="/login" className="font-medium text-primary hover:underline">Syarat</Link> dan{' '}
                                    <Link href="/login" className="font-medium text-primary hover:underline">Kebijakan Privasi</Link>.
                                </span>
                            </label>

                            <Button type="submit" className="w-full gap-2 rounded-xl px-4 py-2.5 text-sm font-medium">
                                Buat akun
                                <ArrowRight className="size-4" />
                            </Button>
                        </form>

                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Sudah punya akun?{' '}
                            <Link href="/login" className="font-semibold text-primary hover:underline">
                                Masuk
                            </Link>
                        </p>
                    </div>
                </section>

                <section className="relative overflow-hidden rounded-[28px] border border-border bg-card p-6 shadow-sm sm:p-8 lg:p-10">
                    <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent" />
                    <div className="relative flex h-full flex-col justify-between gap-8">
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/logo.png"
                                alt="Pasaraya logo"
                                className="size-10 rounded-2xl border border-border bg-background object-contain p-1 shadow-sm"
                            />
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Mengapa bergabung</p>
                                <p className="text-sm text-muted-foreground">Jaringan perdagangan lokal yang lebih baik</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h1 className="max-w-lg text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                    Bangun kepercayaan dan kembangkan bisnis lokal Anda.
                                </h1>
                                <p className="max-w-lg text-base leading-7 text-muted-foreground">
                                    {message}. Terhubung dengan pembeli di sekitar Anda, tingkatkan pesanan berulang, dan kelola perjalanan pelanggan dari satu tempat.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {sellerBenefits.map((benefit) => (
                                    <div key={benefit} className="flex items-start gap-3 rounded-2xl border border-border bg-background/80 p-3">
                                        <div className="mt-0.5 flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Check className="size-4" />
                                        </div>
                                        <p className="text-sm font-medium leading-6 text-foreground">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-border bg-background p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-foreground">Status marketplace</p>
                                    <p className="text-xs text-muted-foreground">Penjual aktif minggu ini</p>
                                </div>
                                <div className="flex items-center gap-2 text-primary">
                                    <PackageCheck className="size-5" />
                                    <span className="text-lg font-semibold">2.8k+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
