import { Link } from '@inertiajs/react';
import { ArrowRight, Menu, Minus, Plus, Search, ShoppingCart, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import ProfileMenu from '../components/profile-menu';
import { Button } from '../components/ui/button';

const initialCartItems = [
    { id: 1, name: 'Organic Rice 5kg', seller: 'Toko Bersama', price: 82000, qty: 1 },
    { id: 2, name: 'Portable Blender', seller: 'Nusantara Tech', price: 249000, qty: 1 },
    { id: 3, name: 'Local Herbal Tea Set', seller: 'Rumah Rasa', price: 68000, qty: 2 },
];

const formatPrice = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(amount);

export default function Cart({ message = 'Your cart', auth }) {
    const user = auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [items, setItems] = useState(initialCartItems);
    const [checkoutMessage, setCheckoutMessage] = useState('');

    const filteredItems = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return items;
        }

        return items.filter((item) =>
            `${item.name} ${item.seller}`.toLowerCase().includes(query),
        );
    }, [items, searchQuery]);

    const subtotal = items.reduce((total, item) => total + item.price * item.qty, 0);
    const shipping = subtotal > 0 ? 25000 : 0;
    const discount = subtotal >= 300000 ? 30000 : 0;
    const total = subtotal + shipping - discount;

    const adjustQty = (id, delta) => {
        setItems((current) =>
            current
                .map((item) => (item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item))
                .filter((item) => item.qty > 0),
        );
    };

    const removeItem = (id) => {
        setItems((current) => current.filter((item) => item.id !== id));
    };

    return (
        <main className="min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/images/logo.png" alt="Pasaraya logo" className="size-10 rounded-xl border border-border bg-background object-contain p-1.5" />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Pasaraya</p>
                            <p className="text-[10px] text-muted-foreground">Local marketplace</p>
                        </div>
                    </Link>

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
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search in cart"
                            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="rounded-full md:hidden"
                            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                            onClick={() => setMobileMenuOpen((current) => !current)}
                        >
                            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
                        </Button>
                        <ProfileMenu user={user} />
                    </div>
                </div>

                {mobileMenuOpen ? (
                    <div className="border-t border-border bg-card md:hidden">
                        <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 text-sm font-medium text-muted-foreground sm:px-6">
                            <Link href="/" className="rounded-lg px-2 py-2">Home</Link>
                            <Link href="/products" className="rounded-lg px-2 py-2">Products</Link>
                            <Link href="/categories" className="rounded-lg px-2 py-2">Categories</Link>
                            <Link href="/sell" className="rounded-lg px-2 py-2">Sell</Link>
                            <Link href="/deals" className="rounded-lg px-2 py-2">Deals</Link>
                        </nav>
                    </div>
                ) : null}
            </header>

            <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
                <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm sm:p-6">
                    <div className="mb-6 flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Basket</p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{message}</h1>
                        </div>
                        <div className="rounded-full bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
                            {items.reduce((count, item) => count + item.qty, 0)} items
                        </div>
                    </div>

                    {filteredItems.length > 0 ? (
                        <div className="space-y-4">
                            {filteredItems.map((item) => (
                                <div key={item.id} className="flex flex-col gap-4 rounded-[22px] border border-border bg-background p-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 to-primary/5 text-lg font-semibold text-primary">
                                            {item.name.slice(0, 1)}
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-foreground">{item.name}</h2>
                                            <p className="text-sm text-muted-foreground">{item.seller}</p>
                                            <p className="mt-1 text-base font-semibold text-foreground">{formatPrice(item.price * item.qty)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                                        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1.5">
                                            <button type="button" onClick={() => adjustQty(item.id, -1)} className="flex size-7 items-center justify-center rounded-full bg-muted text-foreground">
                                                <Minus className="size-3.5" />
                                            </button>
                                            <span className="min-w-5 text-center text-sm font-medium">{item.qty}</span>
                                            <button type="button" onClick={() => adjustQty(item.id, 1)} className="flex size-7 items-center justify-center rounded-full bg-muted text-foreground">
                                                <Plus className="size-3.5" />
                                            </button>
                                        </div>
                                        <button type="button" onClick={() => removeItem(item.id)} className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-destructive">
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-[22px] border border-dashed border-border bg-background p-8 text-center">
                            <p className="text-xl font-semibold text-foreground">No items match your search.</p>
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                            >
                                Clear search
                            </button>
                        </div>
                    )}
                </div>

                <aside className="rounded-[28px] border border-border bg-card p-5 shadow-sm sm:p-6">
                    <h2 className="text-xl font-semibold text-foreground">Order summary</h2>

                    <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                        <div className="flex items-center justify-between">
                            <span>Subtotal</span>
                            <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Shipping</span>
                            <span className="font-medium text-foreground">{formatPrice(shipping)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Discount</span>
                            <span className="font-medium text-foreground">-{formatPrice(discount)}</span>
                        </div>
                    </div>

                    <div className="my-5 h-px bg-border" />

                    <div className="flex items-center justify-between text-base font-semibold text-foreground">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                    </div>

                    {checkoutMessage ? (
                        <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-3 text-sm text-primary">
                            {checkoutMessage}
                        </div>
                    ) : null}

                    <Button
                        type="button"
                        onClick={() => setCheckoutMessage('Demo checkout only: no payment is processed in this frontend preview.')}
                        className="mt-6 w-full gap-2 rounded-full px-4 py-2.5 text-sm font-medium"
                    >
                        Checkout
                        <ArrowRight className="size-4" />
                    </Button>

                    <Link href="/products" className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/40 hover:text-primary">
                        Continue shopping
                    </Link>
                </aside>
            </section>
        </main>
    );
}
