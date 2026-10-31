import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    ChevronRight,
    Heart,
    Menu,
    Search,
    ShoppingCart,
    Sparkles,
    Star,
    Truck,
    User,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import ProfileMenu from '../components/profile-menu';
import { Button } from '../components/ui/button';

const formatPrice = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(amount || 0));

export default function Home({ message = 'Selamat datang di Pasaraya', auth, categories: categoryList = [], products: productList = [] }) {
    const user = auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = Array.isArray(categoryList) ? categoryList : [];
    const products = Array.isArray(productList) ? productList : [];
    const categoryOptions = useMemo(() => [{ id: 'all', name: 'Semua', slug: 'all' }, ...categories], [categories]);

    const filteredProducts = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return products.filter((product) => {
            const matchesCategory = selectedCategory === 'all' || Number(product.category_id) === Number(selectedCategory);
            const matchesQuery =
                !query ||
                [product.name, product.seller, product.city, product.category_name, product.badge]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase()
                    .includes(query);

            return matchesCategory && matchesQuery;
        });
    }, [products, searchQuery, selectedCategory]);

    const filteredCategories = useMemo(
        () =>
            categoryOptions.filter((category) =>
                category.id === 'all' || !searchQuery || category.name.toLowerCase().includes(searchQuery.trim().toLowerCase()),
            ),
        [categoryOptions, searchQuery],
    );

    const trending = useMemo(() => products.slice(0, 4).map((product) => product.name), [products]);

    return (
        <main className="min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-3">
                        <img
                            src="/images/logo.png"
                            alt="Pasaraya logo"
                            className="size-10 rounded-xl border border-border bg-background object-contain p-1.5"
                        />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Pasaraya</p>
                            <p className="text-[10px] text-muted-foreground">Marketplace lokal</p>
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
                        <Link href="/" className="text-foreground">Beranda</Link>
                        <Link href="/products">Produk</Link>
                        <Link href="/categories">Kategori</Link>
                        <Link href="/sell">Jual</Link>
                        <Link href="/deals">Promo</Link>
                    </nav>

                    <div className="hidden flex-1 max-w-xl items-center rounded-full border border-border bg-card px-3 py-2 shadow-sm md:flex">
                        <Search className="mr-2 size-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Cari produk, toko, atau kebutuhan"
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
                        <Link
                            href="/cart"
                            className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-2 text-sm font-medium text-foreground transition hover:border-primary/30 hover:text-primary"
                        >
                            <ShoppingCart className="size-4" />
                            <span className="ml-2 hidden sm:inline">Keranjang</span>
                            <span className="ml-2 inline-flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                                3
                            </span>
                        </Link>
                        <ProfileMenu user={user} />
                    </div>
                </div>

                {mobileMenuOpen ? (
                    <div className="border-t border-border bg-card md:hidden">
                        <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 text-sm font-medium text-muted-foreground sm:px-6">
                            <Link href="/" className="rounded-lg px-2 py-2 text-foreground">Beranda</Link>
                            <Link href="/products" className="rounded-lg px-2 py-2">Produk</Link>
                            <Link href="/categories" className="rounded-lg px-2 py-2">Kategori</Link>
                            <Link href="/sell" className="rounded-lg px-2 py-2">Jual</Link>
                            <Link href="/deals" className="rounded-lg px-2 py-2">Promo</Link>
                        </nav>
                    </div>
                ) : null}
            </header>

            <section className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-[30px] border border-border bg-card shadow-sm">
                    <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
                        <div className="flex flex-col justify-center">
                            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
                                <Sparkles className="size-4" />
                                Temuan segar dari lingkungan Anda
                            </div>
                            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                {message}
                            </h1>
                            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                                Temukan kebutuhan lokal yang lebih baik dari penjual terpercaya, nikmati pengiriman cepat, dan dukung UMKM di komunitas Anda.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link href="/products" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
                                    Belanja sekarang
                                    <ArrowRight className="size-4" />
                                </Link>
                                <Link href="/categories" className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/40 hover:text-primary">
                                    Jelajahi kategori
                                </Link>
                            </div>

                            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <BadgeCheck className="size-4 text-primary" />
                                    Penjual terverifikasi
                                </div>
                                <div className="flex items-center gap-2">
                                    <Truck className="size-4 text-primary" />
                                    Pengiriman hari yang sama
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-border bg-gradient-to-br from-primary/10 via-background to-muted p-5">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-primary">Pilihan terbaik</p>
                                    <p className="text-2xl font-semibold text-foreground">Minggu ini</p>
                                </div>
                                <div className="rounded-full bg-background px-2.5 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-border">
                                    Langsung
                                </div>
                            </div>

                            <div className="mt-5 space-y-3">
                                {trending.map((item, index) => (
                                    <div key={item} className="flex items-center justify-between rounded-2xl border border-border bg-background/70 px-3 py-2.5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                                                {index + 1}
                                            </div>
                                            <span className="text-sm font-medium text-foreground">{item}</span>
                                        </div>
                                        <ChevronRight className="size-4 text-muted-foreground" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Kategori</p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight">Jelajahi sesuai kebutuhan</h2>
                    </div>
                    <Link href="/categories" className="text-sm font-medium text-primary hover:underline">
                        Lihat semua
                    </Link>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                    {filteredCategories.map((category) => (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => {
                                setSelectedCategory(category.id);
                                if (category.id === 'all') {
                                    setSearchQuery('');
                                }
                            }}
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                selectedCategory === category.id
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border bg-card text-foreground hover:border-primary/40 hover:text-primary'
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Unggulan</p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight">Produk populer</h2>
                    </div>
                    <Link href="/products" className="text-sm font-medium text-primary hover:underline">
                        Lihat lebih banyak
                    </Link>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <article key={product.id} className="group overflow-hidden rounded-[24px] border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                                <div className="relative h-48 overflow-hidden bg-primary/5 p-4">
                                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-[11px] font-medium text-foreground ring-1 ring-border">
                                        <Star className="size-3 fill-current text-amber-400" />
                                        {(product.rating ?? 4.8).toFixed(1)}
                                    </div>
                                    <div className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary ring-1 ring-border">
                                        {product.badge || 'Populer'}
                                    </div>
                                    <div className="absolute bottom-3 left-3 right-3 flex h-16 items-end justify-between rounded-2xl bg-background/75 p-3 ring-1 ring-border backdrop-blur-sm">
                                        <div>
                                            <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">Penjual</p>
                                            <p className="text-sm font-medium text-foreground">{product.seller}</p>
                                        </div>
                                        <button type="button" className="flex size-8 items-center justify-center rounded-full bg-background text-muted-foreground shadow-sm ring-1 ring-border transition hover:text-primary">
                                            <Heart className="size-4" />
                                        </button>
                                    </div>
                                    <Link href={`/products/${product.id}`} className="block h-full w-full">
                                        <img src={product.image || '/images/producs/image_1.webp'} alt={product.name} className="h-full w-full rounded-2xl object-cover" />
                                    </Link>
                                </div>

                                <div className="space-y-4 p-4">
                                    <div>
                                        <Link href={`/products/${product.id}`} className="text-lg font-semibold text-foreground hover:text-primary">{product.name}</Link>
                                        <p className="mt-1 text-sm text-muted-foreground">{product.seller}</p>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Harga</p>
                                            <p className="text-xl font-semibold text-foreground">{formatPrice(product.price)}</p>
                                        </div>
                                        <Link href="/cart" className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
                                            Tambah ke keranjang
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="col-span-full rounded-[24px] border border-dashed border-border bg-card p-8 text-center shadow-sm">
                            <p className="text-xl font-semibold text-foreground">Tidak ada produk yang cocok dengan pencarian Anda</p>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                }}
                                className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                            >
                                Hapus filter
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
