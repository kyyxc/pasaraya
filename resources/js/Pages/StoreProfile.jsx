import { Link } from '@inertiajs/react';
import { ArrowRight, MapPin, MessageCircle, Send, ShoppingCart, Star, Store as StoreIcon } from 'lucide-react';
import { useState } from 'react';
import ProfileMenu from '../components/profile-menu';
import { Button } from '../components/ui/button';
import { addProductToCart, getCartCount } from '../lib/cart';

const formatPrice = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(amount || 0));

const getPrimaryImage = (product) => {
    if (typeof product?.image === 'string') {
        return product.image;
    }

    if (product?.image?.image) {
        return product.image.image;
    }

    if (Array.isArray(product?.images) && product.images[0]?.image) {
        return product.images[0].image;
    }

    return '/images/producs/image_1.webp';
};

export default function StoreProfile({ auth, store = null, products = [], chat_messages = [] }) {
    const user = auth?.user;
    const [messages, setMessages] = useState(Array.isArray(chat_messages) ? chat_messages : []);
    const [draft, setDraft] = useState('');
    const [cartCount, setCartCount] = useState(() => getCartCount());

    const handleAddToCart = (product) => {
        const nextItems = addProductToCart(product);
        setCartCount(nextItems.reduce((total, item) => total + Number(item.qty || 0), 0));
    };

    const handleSendMessage = (event) => {
        event.preventDefault();

        const trimmed = draft.trim();
        if (!trimmed) {
            return;
        }

        setMessages((current) => [
            ...current,
            {
                id: Date.now(),
                sender: 'buyer',
                name: user?.first_name || 'Anda',
                content: trimmed,
                created_at: new Date().toISOString(),
            },
        ]);
        setDraft('');
    };

    return (
        <main className="min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
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
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            href="/cart"
                            className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-2 text-sm font-medium text-foreground transition hover:border-primary/30 hover:text-primary"
                        >
                            <ShoppingCart className="size-4" />
                            <span className="ml-2 hidden sm:inline">Keranjang</span>
                            <span className="ml-2 inline-flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                                {cartCount}
                            </span>
                        </Link>
                        <ProfileMenu user={user} />
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                        <ArrowRight className="size-4 rotate-180" />
                        Kembali ke produk
                    </Link>
                </div>

                <section className="overflow-hidden rounded-[30px] border border-border bg-card shadow-sm">
                    <div className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
                        <div className="flex items-center justify-center rounded-[28px] border border-border bg-gradient-to-br from-primary/10 via-background to-primary/5 p-6">
                            {store?.logo ? (
                                <img src={store.logo} alt={store.name} className="h-32 w-32 rounded-[26px] object-cover ring-1 ring-border" />
                            ) : (
                                <div className="flex h-32 w-32 items-center justify-center rounded-[26px] bg-primary/10 text-primary ring-1 ring-border">
                                    <StoreIcon className="size-12" />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col justify-center">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                                <StoreIcon className="size-4" />
                                Toko resmi
                            </div>
                            <h1 className="mt-4 text-3xl font-semibold text-foreground sm:text-4xl">{store?.name || 'Toko Pasaraya'}</h1>
                            <p className="mt-2 text-sm text-muted-foreground">{store?.slug ? `@${store.slug}` : 'Toko lokal'}</p>

                            <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <StoreIcon className="size-4 text-primary" />
                                    {store?.owner_name || 'Pemilik toko'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="size-4 text-primary" />
                                    {store?.address || 'Alamat toko belum diisi'}
                                </div>
                            </div>

                            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
                                {store?.description || 'Toko ini belum menambahkan deskripsi. Silakan cek katalog produk yang tersedia di bawah ini.'}
                            </p>
                        </div>
                    </div>
                </section>

                <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <section className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Produk</p>
                                <h2 className="mt-2 text-2xl font-semibold text-foreground">Katalog toko</h2>
                            </div>
                            <span className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground">
                                {products.length} item
                            </span>
                        </div>

                        {products.length > 0 ? (
                            <div className="grid gap-5 md:grid-cols-2">
                                {products.map((product) => {
                                    const image = getPrimaryImage(product);

                                    return (
                                        <article key={product.id} className="overflow-hidden rounded-[24px] border border-border bg-background shadow-sm">
                                            <div className="relative h-48 overflow-hidden bg-primary/5">
                                                <img src={image} alt={product.name} className="h-full w-full object-cover" />
                                                <div className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary ring-1 ring-border">
                                                    {product.badge || 'Populer'}
                                                </div>
                                            </div>

                                            <div className="space-y-4 p-4">
                                                <div>
                                                    <Link href={`/products/${product.id}`} className="text-lg font-semibold text-foreground hover:text-primary">
                                                        {product.name}
                                                    </Link>
                                                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                                                </div>

                                                <div className="flex items-center justify-between gap-2">
                                                    <div>
                                                        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Harga</p>
                                                        <p className="text-xl font-semibold text-foreground">{formatPrice(product.price)}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                                                        {(product.rating ?? 4.8).toFixed(1)}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                                                    <span className="text-sm text-muted-foreground">Stok {product.stock ?? 0}</span>
                                                    <Button type="button" onClick={() => handleAddToCart(product)} className="rounded-full px-3.5 py-2 text-sm">
                                                        <ShoppingCart className="mr-2 size-4" />
                                                        Tambah
                                                    </Button>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="rounded-[22px] border border-dashed border-border bg-background px-6 py-10 text-center">
                                <p className="text-lg font-medium text-foreground">Belum ada produk di toko ini.</p>
                                <p className="mt-2 text-sm text-muted-foreground">Produk terbaru akan muncul di sini setelah toko menambahkan katalog.</p>
                            </div>
                        )}
                    </section>

                    <aside className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Chat</p>
                                <h2 className="mt-2 text-2xl font-semibold text-foreground">Chat dengan toko</h2>
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <MessageCircle className="size-5" />
                            </div>
                        </div>

                        <div className="mt-5 space-y-3 rounded-[22px] border border-border bg-background p-3">
                            {messages.length > 0 ? (
                                messages.map((message) => (
                                    <div key={message.id} className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${message.sender === 'buyer' ? 'ml-auto bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] opacity-80">{message.name}</p>
                                        <p>{message.content}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl bg-muted px-3 py-4 text-sm text-muted-foreground">
                                    Mulai chat untuk menanyakan stok atau detail produk.
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSendMessage} className="mt-5 flex gap-2">
                            <input
                                type="text"
                                value={draft}
                                onChange={(event) => setDraft(event.target.value)}
                                placeholder="Tulis pesan untuk toko..."
                                className="w-full rounded-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                            />
                            <button type="submit" className="inline-flex items-center justify-center rounded-full bg-primary p-3 text-primary-foreground transition hover:opacity-90">
                                <Send className="size-4" />
                            </button>
                        </form>
                    </aside>
                </div>
            </div>
        </main>
    );
}
