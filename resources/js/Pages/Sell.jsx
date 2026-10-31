import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    ChartNoAxesCombined,
    Menu,
    Search,
    ShoppingBag,
    ShoppingCart,
    Sparkles,
    Store,
    X,
} from 'lucide-react';
import { useState } from 'react';
import ProfileMenu from '../components/profile-menu';
import { Button } from '../components/ui/button';

const steps = [
    'Buat profil toko Anda',
    'Daftarkan produk dengan foto',
    'Kelola pesanan dan pembayaran',
];

export default function Sell({ message = 'Mulai jualan', auth }) {
    const user = auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <main className="min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/images/logo.png" alt="Pasaraya logo" className="size-10 rounded-xl border border-border bg-background object-contain p-1.5" />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Pasaraya</p>
                            <p className="text-[10px] text-muted-foreground">Marketplace lokal</p>
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
                        <Link href="/">Beranda</Link>
                        <Link href="/products">Produk</Link>
                        <Link href="/categories">Kategori</Link>
                        <Link href="/sell" className="text-foreground">Jual</Link>
                        <Link href="/deals">Promo</Link>
                    </nav>

                    <div className="hidden flex-1 max-w-xl items-center rounded-full border border-border bg-card px-3 py-2 shadow-sm md:flex">
                        <Search className="mr-2 size-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Cari alat atau tips penjual"
                            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="rounded-full md:hidden"
                            aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
                            onClick={() => setMobileMenuOpen((current) => !current)}
                        >
                            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
                        </Button>
                        <Link href="/cart" className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-2 text-sm font-medium text-foreground transition hover:border-primary/30 hover:text-primary">
                            <ShoppingCart className="size-4" />
                            <span className="ml-2 hidden sm:inline">Keranjang</span>
                        </Link>
                        <ProfileMenu user={user} />
                    </div>
                </div>

                {mobileMenuOpen ? (
                    <div className="border-t border-border bg-card md:hidden">
                        <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 text-sm font-medium text-muted-foreground sm:px-6">
                            <Link href="/" className="rounded-lg px-2 py-2">Beranda</Link>
                            <Link href="/products" className="rounded-lg px-2 py-2">Produk</Link>
                            <Link href="/categories" className="rounded-lg px-2 py-2">Kategori</Link>
                            <Link href="/sell" className="rounded-lg px-2 py-2 text-foreground">Jual</Link>
                            <Link href="/deals" className="rounded-lg px-2 py-2">Promo</Link>
                        </nav>
                    </div>
                ) : null}
            </header>

            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid gap-6 rounded-[30px] border border-border bg-card p-6 shadow-sm sm:p-8 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="flex flex-col justify-center">
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
                            <Sparkles className="size-4" />
                            Kembangkan bisnis lokal Anda
                        </div>
                        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{message}</h1>
                        <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                            Buka toko Anda, jangkau pembeli sekitar, dan kelola pesanan dalam satu marketplace sederhana yang dibuat untuk UMKM.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
                                Buka tokoku
                                <ArrowRight className="size-4" />
                            </Link>
                            <Link href="/products" className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/40 hover:text-primary">
                                Pelajari lebih lanjut
                            </Link>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <BadgeCheck className="size-4 text-primary" />
                                Dipercaya oleh 2,8k penjual
                            </div>
                            <div className="flex items-center gap-2">
                                <ChartNoAxesCombined className="size-4 text-primary" />
                                Visibilitas lokal lebih tinggi
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-border bg-gradient-to-br from-primary/10 via-background to-muted p-5">
                        <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/80 p-4">
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                                <Store className="size-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">Toko Anda</p>
                                <p className="text-xs text-muted-foreground">Siap diluncurkan</p>
                            </div>
                        </div>

                        <div className="mt-5 space-y-3">
                            {steps.map((step, index) => (
                                <div key={step} className="flex items-center gap-3 rounded-2xl border border-border bg-background/80 p-3">
                                    <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                                        {index + 1}
                                    </div>
                                    <span className="text-sm font-medium text-foreground">{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
                <div className="grid gap-5 md:grid-cols-3">
                    {[
                        { title: 'Pengaturan tanpa kode', text: 'Buat toko online Anda dalam hitungan menit tanpa kerumitan teknis.' },
                        { title: 'Alat pertumbuhan lokal', text: 'Gunakan promo, kategori, dan pencarian untuk menarik pembeli sekitar.' },
                        { title: 'Alur pesanan cerdas', text: 'Pantau stok, pesanan, dan status pengiriman langsung dari satu dashboard.' },
                    ].map((item) => (
                        <div key={item.title} className="rounded-[24px] border border-border bg-card p-5 shadow-sm">
                            <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <ShoppingBag className="size-5" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
