import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    ChevronDown,
    Heart,
    Menu,
    Search,
    ShoppingCart,
    SlidersHorizontal,
    Star,
    User,
} from 'lucide-react';
import { Button } from '../components/ui/button';

const products = [
    { id: 1, name: 'Organic Rice 5kg', seller: 'Toko Bersama', price: 'Rp 82.000', rating: 4.9, badge: 'Popular' },
    { id: 2, name: 'Handwoven Basket', seller: 'Kreatif Lokal', price: 'Rp 135.000', rating: 4.8, badge: 'New' },
    { id: 3, name: 'Portable Blender', seller: 'Nusantara Tech', price: 'Rp 249.000', rating: 4.7, badge: 'Top Rated' },
    { id: 4, name: 'Local Herbal Tea Set', seller: 'Rumah Rasa', price: 'Rp 68.000', rating: 4.9, badge: 'Best Value' },
    { id: 5, name: 'Eco Lunch Box', seller: 'Mitra Hijau', price: 'Rp 96.000', rating: 4.8, badge: 'Eco' },
    { id: 6, name: 'Premium Coffee Beans', seller: 'Kopi Kampung', price: 'Rp 120.000', rating: 5.0, badge: 'Featured' },
    { id: 7, name: 'Batik Tote Bag', seller: 'Seni Desa', price: 'Rp 110.000', rating: 4.8, badge: 'Trending' },
    { id: 8, name: 'Natural Soap Set', seller: 'Bumi Cantik', price: 'Rp 75.000', rating: 4.9, badge: 'Best Seller' },
];

export default function Products({ message = 'Browse products' }) {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <img src="/images/logo.png" alt="Pasaraya logo" className="size-10 rounded-xl border border-border bg-background object-contain p-1.5" />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Pasaraya</p>
                            <p className="text-[10px] text-muted-foreground">Local marketplace</p>
                        </div>
                    </div>

                    <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
                        <Link href="/">Home</Link>
                        <Link href="/products" className="text-foreground">Products</Link>
                        <Link href="/categories">Categories</Link>
                        <Link href="/sell">Sell</Link>
                        <Link href="/deals">Deals</Link>
                    </nav>

                    <div className="hidden flex-1 max-w-xl items-center rounded-full border border-border bg-card px-3 py-2 shadow-sm md:flex">
                        <Search className="mr-2 size-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search products, brands, or stores"
                            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Button variant="ghost" size="icon" className="rounded-full md:hidden" aria-label="Open menu">
                            <Menu className="size-4" />
                        </Button>
                        <Button variant="outline" className="rounded-full px-2.5 py-2 text-sm">
                            <ShoppingCart className="size-4" />
                            <span className="ml-2 hidden sm:inline">Cart</span>
                        </Button>
                        <Button variant="default" className="rounded-full px-3 py-2 text-sm">
                            <User className="mr-2 size-4" />
                            Login
                        </Button>
                    </div>
                </div>
            </header>

            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 rounded-[28px] border border-border bg-card p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Marketplace</p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{message}</h1>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                                <SlidersHorizontal className="size-4" />
                                Filters
                            </div>
                            <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                                Sort by: Popular
                                <ChevronDown className="size-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
                <aside className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                    <h3 className="text-lg font-semibold">Categories</h3>
                    <div className="mt-4 space-y-2">
                        {['Groceries', 'Fashion', 'Electronics', 'Home & Living', 'Beauty', 'Fresh Finds'].map((item) => (
                            <button
                                key={item}
                                type="button"
                                className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary"
                            >
                                {item}
                                <span className="text-xs text-muted-foreground">24</span>
                            </button>
                        ))}
                    </div>

                    <div className="mt-6">
                        <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Price range</h4>
                        <div className="mt-3 h-2 rounded-full bg-muted">
                            <div className="h-2 w-2/3 rounded-full bg-primary" />
                        </div>
                        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                            <span>Rp 20k</span>
                            <span>Rp 500k</span>
                        </div>
                    </div>
                </aside>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {products.map((product) => (
                        <article key={product.id} className="overflow-hidden rounded-[24px] border border-border bg-card shadow-sm">
                            <div className="relative h-44 bg-gradient-to-br from-emerald-500/10 via-background to-primary/5 p-4">
                                <div className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary ring-1 ring-border">
                                    {product.badge}
                                </div>
                                <button type="button" className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-background text-muted-foreground ring-1 ring-border transition hover:text-primary">
                                    <Heart className="size-4" />
                                </button>
                                <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-background/75 p-3 ring-1 ring-border backdrop-blur-sm">
                                    <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Seller</p>
                                    <p className="text-sm font-medium text-foreground">{product.seller}</p>
                                </div>
                            </div>

                            <div className="space-y-4 p-4">
                                <div>
                                    <div className="flex items-center justify-between gap-3">
                                        <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                                        <div className="flex items-center gap-1 text-sm text-amber-500">
                                            <Star className="size-4 fill-current" />
                                            {product.rating}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Price</p>
                                        <p className="text-xl font-semibold text-foreground">{product.price}</p>
                                    </div>
                                    <Button className="rounded-full px-4 py-2 text-sm">Add</Button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
