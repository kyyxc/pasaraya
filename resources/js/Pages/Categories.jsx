import { Link, router } from '@inertiajs/react';
import { ArrowRight, Menu, Search, ShoppingCart, Sparkles, User, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import ProfileMenu from '../components/profile-menu';
import { Button } from '../components/ui/button';

export default function Categories({ message = 'Jelajahi kategori', categories: categoryList = [], auth }) {
    const user = auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const categories = categoryList ?? [];

    const filteredCategories = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return categories;
        }

        return categories.filter((category) => `${category.name} ${category.description || ''}`.toLowerCase().includes(query));
    }, [categories, searchQuery]);

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
                        <Link href="/categories" className="text-foreground">Kategori</Link>
                        <Link href="/sell">Jual</Link>
                        <Link href="/deals">Promo</Link>
                    </nav>

                    <div className="hidden flex-1 max-w-xl items-center rounded-full border border-border bg-card px-3 py-2 shadow-sm md:flex">
                        <Search className="mr-2 size-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Cari kategori atau produk"
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
                            <Link href="/categories" className="rounded-lg px-2 py-2 text-foreground">Kategori</Link>
                            <Link href="/sell" className="rounded-lg px-2 py-2">Jual</Link>
                            <Link href="/deals" className="rounded-lg px-2 py-2">Promo</Link>
                        </nav>
                    </div>
                ) : null}
            </header>

            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-[28px] border border-border bg-card p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Jelajahi</p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{message}</h1>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
                            <Sparkles className="size-4" />
                            Dipilih untuk belanja lokal
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-12 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
                {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                        <Link
                            key={category.slug || category.id}
                            href={category.slug ? `/products?category=${category.slug}` : '/products'}
                            className="group block overflow-hidden rounded-[26px] border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className={`h-40 bg-gradient-to-br ${category.accent || 'from-primary/10 via-background to-primary/5'} p-5`}>
                                <div className="flex h-full items-end justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Koleksi</p>
                                        <h2 className="mt-2 text-2xl font-semibold text-foreground">{category.name}</h2>
                                    </div>
                                    <div className="flex size-10 items-center justify-center rounded-full bg-background/80 ring-1 ring-border">
                                        <ArrowRight className="size-4 text-primary" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4">
                                <span className="text-sm text-muted-foreground">{category.items ?? 0} item</span>
                                <span className="text-sm font-medium text-primary">Jelajahi</span>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full rounded-[26px] border border-dashed border-border bg-card p-8 text-center shadow-sm md:col-span-2 lg:col-span-3">
                        <h2 className="text-xl font-semibold text-foreground">Tidak ada kategori yang cocok dengan pencarian Anda</h2>
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                        >
                            Hapus pencarian
                        </button>
                    </div>
                )}
            </section>
        </main>
    );
}
