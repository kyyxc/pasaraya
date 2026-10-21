import { Link } from '@inertiajs/react';
import { ArrowRight, Menu, Minus, Plus, Search, ShoppingCart, Trash2, User } from 'lucide-react';
import { Button } from '../components/ui/button';

const cartItems = [
    { name: 'Organic Rice 5kg', seller: 'Toko Bersama', price: 'Rp 82.000', qty: 1 },
    { name: 'Portable Blender', seller: 'Nusantara Tech', price: 'Rp 249.000', qty: 1 },
    { name: 'Local Herbal Tea Set', seller: 'Rumah Rasa', price: 'Rp 68.000', qty: 2 },
];

export default function Cart({ message = 'Your cart' }) {
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
                        <Link href="/deals">Deals</Link>
                    </nav>

                    <div className="hidden flex-1 max-w-xl items-center rounded-full border border-border bg-card px-3 py-2 shadow-sm md:flex">
                        <Search className="mr-2 size-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search in cart"
                            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Button variant="ghost" size="icon" className="rounded-full md:hidden" aria-label="Open menu">
                            <Menu className="size-4" />
                        </Button>
                        <Button variant="default" className="rounded-full px-3 py-2 text-sm">
                            <User className="mr-2 size-4" />
                            Login
                        </Button>
                    </div>
                </div>
            </header>

            <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
                <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm sm:p-6">
                    <div className="mb-6 flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Basket</p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{message}</h1>
                        </div>
                        <div className="rounded-full bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
                            3 items
                        </div>
                    </div>

                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.name} className="flex flex-col gap-4 rounded-[22px] border border-border bg-background p-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 to-primary/5 text-lg font-semibold text-primary">
                                        {item.name.slice(0, 1)}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-foreground">{item.name}</h2>
                                        <p className="text-sm text-muted-foreground">{item.seller}</p>
                                        <p className="mt-1 text-base font-semibold text-foreground">{item.price}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-3 sm:justify-end">
                                    <div className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1.5">
                                        <button type="button" className="flex size-7 items-center justify-center rounded-full bg-muted text-foreground">
                                            <Minus className="size-3.5" />
                                        </button>
                                        <span className="min-w-5 text-center text-sm font-medium">{item.qty}</span>
                                        <button type="button" className="flex size-7 items-center justify-center rounded-full bg-muted text-foreground">
                                            <Plus className="size-3.5" />
                                        </button>
                                    </div>
                                    <button type="button" className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-destructive">
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <aside className="rounded-[28px] border border-border bg-card p-5 shadow-sm sm:p-6">
                    <h2 className="text-xl font-semibold text-foreground">Order summary</h2>

                    <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                        <div className="flex items-center justify-between">
                            <span>Subtotal</span>
                            <span className="font-medium text-foreground">Rp 399.000</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Shipping</span>
                            <span className="font-medium text-foreground">Rp 25.000</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Discount</span>
                            <span className="font-medium text-foreground">-Rp 30.000</span>
                        </div>
                    </div>

                    <div className="my-5 h-px bg-border" />

                    <div className="flex items-center justify-between text-base font-semibold text-foreground">
                        <span>Total</span>
                        <span>Rp 394.000</span>
                    </div>

                    <Button className="mt-6 w-full gap-2 rounded-full px-4 py-2.5 text-sm font-medium">
                        Checkout
                        <ArrowRight className="size-4" />
                    </Button>

                    <Button variant="outline" className="mt-3 w-full rounded-full px-4 py-2.5 text-sm font-medium">
                        Continue shopping
                    </Button>
                </aside>
            </section>
        </main>
    );
}
