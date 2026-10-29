import { Link } from '@inertiajs/react';
import { ArrowLeft, MapPin, ShieldCheck, ShoppingCart, Star } from 'lucide-react';

const formatPrice = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(amount || 0));

export default function ProductDetail({ product, related_products = [] }) {
    if (!product) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
                <div className="max-w-md rounded-[28px] border border-border bg-card p-8 text-center shadow-sm">
                    <h1 className="text-2xl font-semibold">Product not found</h1>
                    <p className="mt-2 text-sm text-muted-foreground">This item may have been removed or is unavailable.</p>
                    <Link href="/products" className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                        Back to products
                    </Link>
                </div>
            </main>
        );
    }

    const gallery = Array.isArray(product.images) && product.images.length > 0 ? product.images : [{ image: product.image || '/images/producs/image_1.webp', alt_text: product.name }];

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
                    </nav>
                    <Link href="/cart" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm font-medium text-foreground">
                        <ShoppingCart className="size-4" />
                        Cart
                    </Link>
                </div>
            </header>

            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                    <ArrowLeft className="size-4" />
                    Back to marketplace
                </Link>

                <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-4">
                        <div className="overflow-hidden rounded-[30px] border border-border bg-card shadow-sm">
                            <img src={gallery[0].image || '/images/producs/image_1.webp'} alt={product.name} className="h-[420px] w-full object-cover" />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                            {gallery.slice(0, 3).map((image, index) => (
                                <div key={`${image.image}-${index}`} className="overflow-hidden rounded-[22px] border border-border bg-card shadow-sm">
                                    <img src={image.image || '/images/producs/image_1.webp'} alt={image.alt_text || product.name} className="h-28 w-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[30px] border border-border bg-card p-6 shadow-sm sm:p-7">
                        <div className="flex items-center justify-between gap-3">
                            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                                {product.badge || 'Popular'}
                            </span>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                                {(product.rating ?? 4.8).toFixed(1)}
                            </div>
                        </div>

                        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{product.name}</h1>

                        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="size-4 text-primary" />
                            {product.city || 'Local Market'}
                        </div>

                        <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Price</p>
                                <p className="mt-2 text-3xl font-semibold text-foreground">{formatPrice(product.price)}</p>
                            </div>
                            <div className="text-right text-sm text-muted-foreground">
                                <p className="text-xs uppercase tracking-[0.15em]">Stock</p>
                                <p className="mt-2 font-semibold text-foreground">{product.stock ?? 0} available</p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <Link href="/cart" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                <ShoppingCart className="size-4" />
                                Add to cart
                            </Link>
                            <Link href="/products" className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary">
                                Continue shopping
                            </Link>
                        </div>

                        <div className="mt-8 rounded-2xl border border-border bg-background p-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                <ShieldCheck className="size-4 text-primary" />
                                Seller information
                            </div>
                            <p className="mt-3 text-lg font-semibold text-foreground">{product.seller}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{product.category_name || 'Local marketplace selection'}</p>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-lg font-semibold text-foreground">About this product</h2>
                            <p className="mt-3 text-sm leading-7 text-muted-foreground">{product.description}</p>
                        </div>
                    </div>
                </div>
            </section>

            {related_products.length > 0 ? (
                <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
                    <div className="mb-5 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">More picks</p>
                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Related products</h2>
                        </div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {related_products.map((item) => (
                            <article key={item.id} className="overflow-hidden rounded-[26px] border border-border bg-card shadow-sm">
                                <Link href={`/products/${item.id}`} className="block overflow-hidden">
                                    <img src={item.image || '/images/producs/image_1.webp'} alt={item.name} className="h-48 w-full object-cover transition hover:scale-105" />
                                </Link>
                                <div className="p-4">
                                    <Link href={`/products/${item.id}`} className="text-lg font-semibold text-foreground hover:text-primary">
                                        {item.name}
                                    </Link>
                                    <p className="mt-2 text-sm text-muted-foreground">{item.seller}</p>
                                    <div className="mt-3 flex items-center justify-between">
                                        <p className="text-base font-semibold text-foreground">{formatPrice(item.price)}</p>
                                        <Link href={`/products/${item.id}`} className="text-sm font-medium text-primary hover:underline">View</Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            ) : null}
        </main>
    );
}
