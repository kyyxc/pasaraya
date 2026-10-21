import { Link } from '@inertiajs/react';
import { ArrowRight, Menu, Search, ShoppingCart, Sparkles, Tag, Ticket, User } from 'lucide-react';
import { Button } from '../components/ui/button';

const deals = [
    { title: 'Weekend Essentials', discount: '30% off', description: 'Fresh groceries and home items for the whole family.', accent: 'from-emerald-500/15 to-emerald-500/5' },
    { title: 'Seller Spotlight', discount: '20% off', description: 'Support local brands with limited-time promos from nearby sellers.', accent: 'from-violet-500/15 to-violet-500/5' },
    { title: 'Free Shipping', discount: 'Free', description: 'Enjoy free shipping for orders above Rp 150.000 in selected cities.', accent: 'from-sky-500/15 to-sky-500/5' },
];

export default function Deals({ message = "Today's deals" }) {
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
                        <Link href="/categories">Categories</Link>
                        <Link href="/sell">Sell</Link>
                        <Link href="/deals" className="text-foreground">Deals</Link>
                    </nav>

                    <div className="hidden flex-1 max-w-xl items-center rounded-full border border-border bg-card px-3 py-2 shadow-sm md:flex">
                        <Search className="mr-2 size-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search daily deals and coupons"
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
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Promotions</p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{message}</h1>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
                            <Sparkles className="size-4" />
                            Updated today
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-12 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
                {deals.map((deal) => (
                    <article key={deal.title} className="overflow-hidden rounded-[26px] border border-border bg-card shadow-sm">
                        <div className={`relative h-44 bg-gradient-to-br ${deal.accent} p-5`}>
                            <div className="absolute left-4 top-4 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary ring-1 ring-border">
                                {deal.discount}
                            </div>
                            <div className="absolute bottom-4 left-4 flex size-10 items-center justify-center rounded-2xl bg-background/80 ring-1 ring-border">
                                <Ticket className="size-5 text-primary" />
                            </div>
                        </div>
                        <div className="space-y-3 p-5">
                            <h2 className="text-xl font-semibold text-foreground">{deal.title}</h2>
                            <p className="text-sm leading-6 text-muted-foreground">{deal.description}</p>
                            <Button className="gap-2 rounded-full px-4 py-2 text-sm">
                                Claim offer
                                <ArrowRight className="size-4" />
                            </Button>
                        </div>
                    </article>
                ))}
            </section>
        </main>
    );
}
