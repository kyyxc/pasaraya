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
} from 'lucide-react';
import { Button } from '../components/ui/button';

const categories = [
    'Groceries',
    'Fashion',
    'Electronics',
    'Home',
    'Beauty',
    'Fresh Finds',
];

const products = [
    {
        id: 1,
        name: 'Organic Rice 5kg',
        seller: 'Toko Bersama',
        price: 'Rp 82.000',
        rating: 4.9,
        sold: '1.2k sold',
        badge: 'Popular',
        accent: 'from-emerald-500/15 to-emerald-500/5',
    },
    {
        id: 2,
        name: 'Handwoven Basket',
        seller: 'Kreatif Lokal',
        price: 'Rp 135.000',
        rating: 4.8,
        sold: '640 sold',
        badge: 'New',
        accent: 'from-amber-500/15 to-amber-500/5',
    },
    {
        id: 3,
        name: 'Portable Blender',
        seller: 'Nusantara Tech',
        price: 'Rp 249.000',
        rating: 4.7,
        sold: '890 sold',
        badge: 'Top Rated',
        accent: 'from-sky-500/15 to-sky-500/5',
    },
    {
        id: 4,
        name: 'Local Herbal Tea Set',
        seller: 'Rumah Rasa',
        price: 'Rp 68.000',
        rating: 4.9,
        sold: '1.8k sold',
        badge: 'Best Value',
        accent: 'from-violet-500/15 to-violet-500/5',
    },
    {
        id: 5,
        name: 'Eco Lunch Box',
        seller: 'Mitra Hijau',
        price: 'Rp 96.000',
        rating: 4.8,
        sold: '540 sold',
        badge: 'Eco',
        accent: 'from-rose-500/15 to-rose-500/5',
    },
    {
        id: 6,
        name: 'Premium Coffee Beans',
        seller: 'Kopi Kampung',
        price: 'Rp 120.000',
        rating: 5.0,
        sold: '2.1k sold',
        badge: 'Featured',
        accent: 'from-orange-500/15 to-orange-500/5',
    },
];

const trending = [
    'Fresh produce',
    'Home essentials',
    'Fashion picks',
    'Weekend deals',
];

export default function Home({ message = 'Welcome to Pasaraya', auth }) {
    const user = auth?.user;

    return (
        <main className="min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/logo.png"
                            alt="Pasaraya logo"
                            className="size-10 rounded-xl border border-border bg-background object-contain p-1.5"
                        />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Pasaraya</p>
                            <p className="text-[10px] text-muted-foreground">Local marketplace</p>
                        </div>
                    </div>

                    <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
                        <Link href="/" className="text-foreground">Home</Link>
                        <Link href="/products">Products</Link>
                        <Link href="/categories">Categories</Link>
                        <Link href="/seller">Sell</Link>
                        <Link href="/offers">Deals</Link>
                    </nav>

                    <div className="hidden flex-1 max-w-xl items-center rounded-full border border-border bg-card px-3 py-2 shadow-sm md:flex">
                        <Search className="mr-2 size-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search for products, stores, or essentials"
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
                            <span className="ml-2 inline-flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                                3
                            </span>
                        </Button>
                        {user ? (
                            <form method="post" action="/logout">
                                <input type="hidden" name="_token" value={typeof document !== 'undefined' ? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '' : ''} />
                                <Button type="submit" variant="default" className="rounded-full px-3 py-2 text-sm">
                                    <User className="mr-2 size-4" />
                                    Logout
                                </Button>
                            </form>
                        ) : (
                            <Link href="/login" className="inline-flex items-center justify-center rounded-full bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                <User className="mr-2 size-4" />
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <section className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-[30px] border border-border bg-card shadow-sm">
                    <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
                        <div className="flex flex-col justify-center">
                            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
                                <Sparkles className="size-4" />
                                Fresh finds from your neighborhood
                            </div>
                            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                {message}
                            </h1>
                            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                                Discover better local essentials from trusted sellers, get fast delivery, and support small businesses in your community.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <Button className="gap-2 rounded-full px-5 py-2.5 text-sm font-medium">
                                    Shop now
                                    <ArrowRight className="size-4" />
                                </Button>
                                <Button variant="outline" className="rounded-full px-5 py-2.5 text-sm font-medium">
                                    Explore categories
                                </Button>
                            </div>

                            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <BadgeCheck className="size-4 text-primary" />
                                    Verified sellers
                                </div>
                                <div className="flex items-center gap-2">
                                    <Truck className="size-4 text-primary" />
                                    Same-day delivery
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-border bg-gradient-to-br from-primary/10 via-background to-muted p-5">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-primary">Top picks</p>
                                    <p className="text-2xl font-semibold text-foreground">This week</p>
                                </div>
                                <div className="rounded-full bg-background px-2.5 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-border">
                                    Live
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
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Categories</p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight">Browse by needs</h2>
                    </div>
                    <Link href="/categories" className="text-sm font-medium text-primary hover:underline">
                        View all
                    </Link>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            className="rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5"
                        >
                            <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Sparkles className="size-4" />
                            </div>
                            <p className="text-sm font-medium text-foreground">{category}</p>
                        </button>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Featured</p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight">Popular products</h2>
                    </div>
                    <Link href="/products" className="text-sm font-medium text-primary hover:underline">
                        See more
                    </Link>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {products.map((product) => (
                        <article key={product.id} className="group overflow-hidden rounded-[24px] border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                            <div className={`relative h-48 bg-gradient-to-br ${product.accent} p-4`}>
                                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-[11px] font-medium text-foreground ring-1 ring-border">
                                    <Star className="size-3 fill-current text-amber-400" />
                                    {product.rating}
                                </div>
                                <div className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary ring-1 ring-border">
                                    {product.badge}
                                </div>
                                <div className="absolute bottom-3 left-3 right-3 flex h-16 items-end justify-between rounded-2xl bg-background/75 p-3 ring-1 ring-border backdrop-blur-sm">
                                    <div>
                                        <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">Seller</p>
                                        <p className="text-sm font-medium text-foreground">{product.seller}</p>
                                    </div>
                                    <button type="button" className="flex size-8 items-center justify-center rounded-full bg-background text-muted-foreground shadow-sm ring-1 ring-border transition hover:text-primary">
                                        <Heart className="size-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4 p-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">{product.sold}</p>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Price</p>
                                        <p className="text-xl font-semibold text-foreground">{product.price}</p>
                                    </div>
                                    <Button className="rounded-full px-4 py-2 text-sm">Add to cart</Button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
