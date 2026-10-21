import { Link } from '@inertiajs/react';
import { ArrowRight, Menu, Search, ShoppingCart, Sparkles, User } from 'lucide-react';
import { Button } from '../components/ui/button';

const categories = [
    { name: 'Groceries', items: '240 items', accent: 'from-emerald-500/15 to-emerald-500/5' },
    { name: 'Fashion', items: '180 items', accent: 'from-violet-500/15 to-violet-500/5' },
    { name: 'Electronics', items: '140 items', accent: 'from-sky-500/15 to-sky-500/5' },
    { name: 'Home & Living', items: '200 items', accent: 'from-amber-500/15 to-amber-500/5' },
    { name: 'Beauty', items: '90 items', accent: 'from-rose-500/15 to-rose-500/5' },
    { name: 'Fresh Finds', items: '160 items', accent: 'from-orange-500/15 to-orange-500/5' },
];

export default function Categories({ message = 'Explore categories' }) {
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
                        <Link href="/products">Products</Link>
                        <Link href="/categories" className="text-foreground">Categories</Link>
                        <Link href="/sell">Sell</Link>
                        <Link href="/deals">Deals</Link>
                    </nav>

                    <div className="hidden flex-1 max-w-xl items-center rounded-full border border-border bg-card px-3 py-2 shadow-sm md:flex">
                        <Search className="mr-2 size-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search categories or products"
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
                <div className="rounded-[28px] border border-border bg-card p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Browse</p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{message}</h1>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
                            <Sparkles className="size-4" />
                            Curated for local shopping
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-12 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
                {categories.map((category) => (
                    <article key={category.name} className="overflow-hidden rounded-[26px] border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <div className={`h-40 bg-gradient-to-br ${category.accent} p-5`}>
                            <div className="flex h-full items-end justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Collection</p>
                                    <h2 className="mt-2 text-2xl font-semibold text-foreground">{category.name}</h2>
                                </div>
                                <div className="flex size-10 items-center justify-center rounded-full bg-background/80 ring-1 ring-border">
                                    <ArrowRight className="size-4 text-primary" />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4">
                            <span className="text-sm text-muted-foreground">{category.items}</span>
                            <Button variant="outline" className="rounded-full px-3 py-2 text-sm">Shop now</Button>
                        </div>
                    </article>
                ))}
            </section>
        </main>
    );
}
