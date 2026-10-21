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
    User,
} from 'lucide-react';
import { Button } from '../components/ui/button';

const steps = [
    'Create your shop profile',
    'List products with photos',
    'Manage orders and payments',
];

export default function Sell({ message = 'Start selling' }) {
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
                        <Link href="/sell" className="text-foreground">Sell</Link>
                        <Link href="/deals">Deals</Link>
                    </nav>

                    <div className="hidden flex-1 max-w-xl items-center rounded-full border border-border bg-card px-3 py-2 shadow-sm md:flex">
                        <Search className="mr-2 size-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search for seller tools or tips"
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
                <div className="grid gap-6 rounded-[30px] border border-border bg-card p-6 shadow-sm sm:p-8 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="flex flex-col justify-center">
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
                            <Sparkles className="size-4" />
                            Grow your local business
                        </div>
                        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{message}</h1>
                        <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                            Launch your store, reach nearby shoppers, and manage orders in one simple marketplace built for MSMEs.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Button className="gap-2 rounded-full px-5 py-2.5 text-sm font-medium">
                                Open my shop
                                <ArrowRight className="size-4" />
                            </Button>
                            <Button variant="outline" className="rounded-full px-5 py-2.5 text-sm font-medium">
                                Learn more
                            </Button>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <BadgeCheck className="size-4 text-primary" />
                                Trusted by 2.8k sellers
                            </div>
                            <div className="flex items-center gap-2">
                                <ChartNoAxesCombined className="size-4 text-primary" />
                                Higher local visibility
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-border bg-gradient-to-br from-primary/10 via-background to-muted p-5">
                        <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/80 p-4">
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                                <Store className="size-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">Your storefront</p>
                                <p className="text-xs text-muted-foreground">Ready to launch</p>
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
                        { title: 'No-code setup', text: 'Create your online shop in minutes without technical hassle.' },
                        { title: 'Local growth tools', text: 'Use promos, categories, and search discovery to attract buyers.' },
                        { title: 'Smart order flow', text: 'Track inventory, orders, and delivery progress from one dashboard.' },
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
