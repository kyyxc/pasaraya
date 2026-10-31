import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useState } from 'react';

const highlights = [
    'Penjual lokal terpercaya',
    'Pengalaman checkout aman',
    'Update pengiriman lokal cepat',
];

export default function Login({ message = 'Silakan masuk', auth, errors = {} }) {
    const user = auth?.user;
    const csrfToken = typeof document !== 'undefined'
        ? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? ''
        : '';
    const formErrors = Object.values(errors || {}).flatMap((error) => Array.isArray(error) ? error : [error]).filter(Boolean);

    const [showPassword, setShowPassword] = useState(false);

    if (user) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
                <div className="w-full max-w-md rounded-[28px] border border-border bg-card p-8 text-center shadow-sm">
                    <img src="/images/logo.png" alt="Pasaraya logo" className="mx-auto size-14 rounded-2xl border border-border bg-background object-contain p-2" />
                    <h1 className="mt-5 text-3xl font-semibold tracking-tight">Anda sudah masuk</h1>
                    <p className="mt-3 text-sm text-muted-foreground">
                        Selamat datang kembali, {user.first_name || 'teman'}.
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
            <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-10">
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
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Pasaraya</p>
                                <p className="text-sm text-muted-foreground">Marketplace kebutuhan lokal</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
                                <Sparkles className="size-4" />
                                Temukan belanja harian yang lebih baik
                            </div>

                            <div className="space-y-4">
                                <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                    Belanja lokal. Jual lebih cerdas. Tumbuh lebih cepat.
                                </h1>
                                <p className="max-w-lg text-base leading-7 text-muted-foreground">
                                    {message}. Akses favorit Anda, lacak pesanan, dan jaga marketplace lingkungan Anda tetap terhubung.
                                </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3">
                                {highlights.map((item) => (
                                    <div key={item} className="rounded-2xl border border-border bg-background/80 p-3">
                                        <div className="mb-2 flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <BadgeCheck className="size-4" />
                                        </div>
                                        <p className="text-sm font-medium text-foreground">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-border bg-background p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-foreground">Skor kepercayaan penjual</p>
                                    <p className="text-xs text-muted-foreground">Komunitas terverifikasi</p>
                                </div>
                                <div className="flex items-center gap-2 text-primary">
                                    <ShieldCheck className="size-5" />
                                    <span className="text-lg font-semibold">4.9/5</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="flex items-center justify-center">
                    <div className="w-full max-w-md rounded-[28px] border border-border bg-card p-6 shadow-sm sm:p-8">
                        <div className="mb-7 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Selamat datang</p>
                                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Masuk</h2>
                            </div>
                            <img
                                src="/images/logo.png"
                                alt="Pasaraya logo"
                                className="size-11 rounded-2xl border border-border bg-background object-contain p-1.5 shadow-sm"
                            />
                        </div>

                        <form method="post" action="/login" className="space-y-5">
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
                                        autoComplete="email"
                                        placeholder="nama@contoh.com"
                                        className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-3">
                                    <label htmlFor="password" className="text-sm font-medium text-foreground">
                                        Kata sandi
                                    </label>
                                    <Link href="/register" className="text-sm font-medium text-primary hover:underline">
                                        Lupa kata sandi?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        placeholder="Masukkan kata sandi Anda"
                                        className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                                        aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                                    >
                                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                            </div>

                            <label className="flex items-center gap-2 text-sm text-muted-foreground">
                                <input type="checkbox" name="remember" className="size-4 rounded border-border text-primary focus:ring-primary/20" />
                                Biarkan saya tetap masuk
                            </label>

                            <Button type="submit" className="w-full gap-2 rounded-xl px-4 py-2.5 text-sm font-medium">
                                Masuk
                                <ArrowRight className="size-4" />
                            </Button>
                        </form>

                        <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            <span className="h-px flex-1 bg-border" />
                            atau lanjutkan dengan
                            <span className="h-px flex-1 bg-border" />
                        </div>

                        <div className="flex gap-3">
                            <Button type="button" variant="outline" className="flex-1 rounded-xl">
                                Google
                            </Button>
                            <Button type="button" variant="outline" className="flex-1 rounded-xl">
                                Facebook
                            </Button>
                        </div>

                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Baru di Pasaraya?{' '}
                            <Link href="/register" className="font-semibold text-primary hover:underline">
                                Buat akun
                            </Link>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
