import { Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    ChevronDown,
    Heart,
    MapPin,
    Menu,
    Search,
    ShoppingCart,
    SlidersHorizontal,
    Sparkles,
    Star,
    User,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import ProfileMenu from '../components/profile-menu';
import { Button } from '../components/ui/button';

const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price_asc', label: 'Price: Low to high' },
    { value: 'price_desc', label: 'Price: High to low' },
    { value: 'name', label: 'Name' },
];

const formatPrice = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(amount || 0));

function ProductCard({ product, isAdded, isSaved, onAddToCart, onToggleSave }) {
    return (
        <article className="group overflow-hidden rounded-[26px] border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
            <div className="relative h-52 overflow-hidden border-b border-border bg-gradient-to-br from-primary/10 via-background to-primary/5">
                <span className="absolute left-3 top-3 z-10 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary ring-1 ring-border">
                    {product.badge || 'Popular'}
                </span>
                <button
                    type="button"
                    aria-label={isSaved ? `Remove ${product.name} from saved list` : `Save ${product.name}`}
                    onClick={() => onToggleSave(product.id)}
                    className={`absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full ring-1 transition ${
                        isSaved
                            ? 'bg-primary text-primary-foreground ring-primary'
                            : 'bg-background text-muted-foreground ring-border hover:text-primary'
                    }`}
                >
                    <Heart className={`size-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                <Link href={`/products/${product.id}`} className="block h-full w-full">
                    <img
                        src={product.image || '/images/producs/image_1.webp'}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                </Link>
            </div>

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-secondary-foreground">
                        {product.category_name || 'Local'}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                        {(product.rating ?? 4.8).toFixed(1)}
                    </div>
                </div>

                <div>
                    <Link href={`/products/${product.id}`} className="text-lg font-semibold text-foreground hover:text-primary">
                        {product.name}
                    </Link>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{product.description}</p>
                </div>

                <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                    <div>
                        <p className="font-medium text-foreground">{product.seller}</p>
                        <div className="mt-1 flex items-center gap-1">
                            <MapPin className="size-3.5" />
                            {product.city || 'Local Market'}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Stock</p>
                        <p className="font-medium text-foreground">{product.stock ?? 0} left</p>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Price</p>
                        <p className="text-xl font-semibold text-foreground">{formatPrice(product.price)}</p>
                    </div>
                    <Button
                        type="button"
                        onClick={() => onAddToCart(product.id)}
                        className="rounded-full px-4 py-2.5 text-sm font-medium"
                    >
                        {isAdded ? 'Added' : 'Add to cart'}
                    </Button>
                </div>
            </div>
        </article>
    );
}

function EmptyState({ onReset }) {
    return (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[30px] border border-dashed border-border bg-card px-6 py-10 text-center shadow-sm">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Search className="size-6" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold text-foreground">No products match your filters</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Try a different keyword, switch categories, or reset your search to see more local favorites.
            </p>
            <Button type="button" onClick={onReset} className="mt-6 rounded-full px-5 py-2.5">
                Reset filters
            </Button>
        </div>
    );
}

export default function Products({
    message = 'Browse products',
    categories: categoryList = [],
    products: productList = [],
    filters = {},
    pagination = {},
    auth,
}) {
    const user = auth?.user;
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [cartCount, setCartCount] = useState(3);
    const [addedProductId, setAddedProductId] = useState(null);
    const [savedProductIds, setSavedProductIds] = useState([]);

    const categories = useMemo(() => [{ id: 'all', name: 'All', slug: 'all', items: productList.length ?? 0 }, ...categoryList], [categoryList, productList.length]);
    const currentCategory = filters.category || 'all';
    const currentQuery = filters.q || '';
    const currentSort = filters.sort || 'featured';

    const updateFilters = (nextValues = {}) => {
        const params = {};
        const q = (nextValues.q ?? currentQuery).trim();
        const category = nextValues.category ?? currentCategory;
        const sort = nextValues.sort ?? currentSort;

        if (q) params.q = q;
        if (category && category !== 'all') params.category = category;
        if (sort && sort !== 'featured') params.sort = sort;

        router.get('/products', params, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const handleResetFilters = () => {
        router.get('/products', {}, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const handleAddToCart = (productId) => {
        setCartCount((current) => current + 1);
        setAddedProductId(productId);
        window.setTimeout(() => setAddedProductId(null), 1200);
    };

    const handleToggleSave = (productId) => {
        setSavedProductIds((currentIds) =>
            currentIds.includes(productId)
                ? currentIds.filter((id) => id !== productId)
                : [...currentIds, productId],
        );
    };

    const displayedProducts = productList ?? [];

    return (
        <main className="min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/images/logo.png" alt="Pasaraya logo" className="size-10 rounded-xl border border-border bg-background object-contain p-1.5" />
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Pasaraya</p>
                            <p className="text-[10px] text-muted-foreground">Local marketplace</p>
                        </div>
                    </Link>

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
                            aria-label="Search products"
                            value={currentQuery}
                            onChange={(event) => updateFilters({ q: event.target.value })}
                            placeholder="Search products, sellers, or neighborhoods"
                            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="rounded-full md:hidden"
                            aria-label={mobileFiltersOpen ? 'Close filters' : 'Open filters'}
                            onClick={() => setMobileFiltersOpen((current) => !current)}
                        >
                            {mobileFiltersOpen ? <X className="size-4" /> : <Menu className="size-4" />}
                        </Button>
                        <Link href="/cart" className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-2 text-sm font-medium text-foreground transition hover:border-primary/30 hover:text-primary">
                            <ShoppingCart className="size-4" />
                            <span className="ml-2 hidden sm:inline">Cart</span>
                            <span className="ml-2 inline-flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                                {cartCount}
                            </span>
                        </Link>
                        <ProfileMenu user={user} />
                    </div>
                </div>
            </header>

            {mobileFiltersOpen ? (
                <div className="border-b border-border bg-card md:hidden">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
                        <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                            <Search className="size-4" />
                            <input
                                type="text"
                                aria-label="Search products on mobile"
                                value={currentQuery}
                                onChange={(event) => updateFilters({ q: event.target.value })}
                                placeholder="Search here"
                                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
            ) : null}

            <section className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-[30px] border border-border bg-card shadow-sm">
                    <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
                        <div className="flex flex-col justify-center">
                            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
                                <Sparkles className="size-4" />
                                Fresh finds from your neighborhood
                            </div>
                            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                Discover trusted local essentials.
                            </h1>
                            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                                Explore curated products from neighborhood sellers, support local UMKM businesses, and enjoy a faster way to shop what your community already loves.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <a href="#catalog" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
                                    Shop the market
                                    <ArrowRight className="size-4" />
                                </a>
                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/40 hover:text-primary"
                                >
                                    Browse all products
                                </button>
                            </div>

                            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">✓</span>
                                    Verified sellers
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">⚡</span>
                                    Fast local delivery
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="w-full max-w-md rounded-[28px] border border-border bg-gradient-to-br from-primary/10 via-background to-primary/5 p-4 shadow-sm">
                                <div className="rounded-[22px] border border-border bg-card p-3">
                                    <div className="relative overflow-hidden rounded-[18px] bg-muted">
                                        <img
                                            src="/images/producs/image_1.webp"
                                            alt="Local market assortment"
                                            className="h-72 w-full object-cover"
                                        />
                                        <div className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary ring-1 ring-border">
                                            Today’s picks
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Most loved</p>
                                            <p className="mt-1 text-xl font-semibold text-foreground">Local pantry trio</p>
                                        </div>
                                        <div className="rounded-full bg-secondary px-2.5 py-1 text-sm font-semibold text-secondary-foreground">
                                            {formatPrice(228000)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:hidden lg:px-8">
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {categories.map((category) => (
                        <button
                            key={category.slug || category.id || 'all'}
                            type="button"
                            onClick={() => updateFilters({ category: category.slug || 'all' })}
                            className={`shrink-0 rounded-full border px-3 py-2 text-sm font-medium transition ${
                                currentCategory === (category.slug || 'all')
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border bg-card text-foreground'
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </section>

            <section id="catalog" className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
                <aside className="hidden rounded-[28px] border border-border bg-card p-5 shadow-sm lg:block">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">Categories</h3>
                        <div className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                            {categories.length - 1} types
                        </div>
                    </div>

                    <div className="mt-4 space-y-2">
                        {categories.map((category) => (
                            <button
                                key={category.slug || category.id || 'all'}
                                type="button"
                                onClick={() => updateFilters({ category: category.slug || 'all' })}
                                className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition ${
                                    currentCategory === (category.slug || 'all')
                                        ? 'border-primary bg-primary/5 text-primary shadow-sm'
                                        : 'border-border bg-background text-foreground hover:border-primary/30 hover:text-primary'
                                }`}
                            >
                                <span>{category.name}</span>
                                <span className="text-xs text-muted-foreground">{category.items ?? 0}</span>
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 rounded-2xl border border-border bg-background p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <SlidersHorizontal className="size-4 text-primary" />
                            Filters
                        </div>
                        <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                            <div className="flex items-center justify-between">
                                <span>Local sellers</span>
                                <span className="font-medium text-foreground">Only nearby</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Support UMKM</span>
                                <span className="font-medium text-foreground">Verified</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Delivery</span>
                                <span className="font-medium text-foreground">Same day</span>
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="space-y-5">
                    <div className="flex flex-col gap-3 rounded-[24px] border border-border bg-card p-4 shadow-sm sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{message}</p>
                            <p className="mt-1 text-sm text-foreground">
                                Showing <span className="font-semibold">{displayedProducts.length}</span> products
                                {currentCategory !== 'all' ? ` in ${categories.find((category) => (category.slug || category.id) === currentCategory)?.name || 'selected category'}` : ''}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                                <Search className="size-4" />
                                <input
                                    type="text"
                                    aria-label="Filter product list"
                                    value={currentQuery}
                                    onChange={(event) => updateFilters({ q: event.target.value })}
                                    placeholder="Search products"
                                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                                />
                            </div>
                            <div className="relative">
                                <select
                                    aria-label="Sort products"
                                    value={currentSort}
                                    onChange={(event) => updateFilters({ sort: event.target.value })}
                                    className="appearance-none rounded-full border border-border bg-background px-3 py-2 pr-9 text-sm font-medium text-foreground focus:outline-none"
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                        </div>
                    </div>

                    {displayedProducts.length > 0 ? (
                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {displayedProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    isAdded={addedProductId === product.id}
                                    isSaved={savedProductIds.includes(product.id)}
                                    onAddToCart={handleAddToCart}
                                    onToggleSave={handleToggleSave}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState onReset={handleResetFilters} />
                    )}

                    {pagination && pagination.last_page > 1 ? (
                        <div className="flex items-center justify-between rounded-[24px] border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                            <span>
                                Page {pagination.current_page} of {pagination.last_page}
                            </span>
                            <div className="flex items-center gap-2">
                                <a
                                    href={pagination.prev_page_url || '#'}
                                    className={`rounded-full border px-3 py-1.5 ${pagination.prev_page_url ? 'border-border text-foreground hover:border-primary/40' : 'pointer-events-none border-border/60 text-muted-foreground/60'}`}
                                >
                                    Previous
                                </a>
                                <a
                                    href={pagination.next_page_url || '#'}
                                    className={`rounded-full border px-3 py-1.5 ${pagination.next_page_url ? 'border-border text-foreground hover:border-primary/40' : 'pointer-events-none border-border/60 text-muted-foreground/60'}`}
                                >
                                    Next
                                </a>
                            </div>
                        </div>
                    ) : null}
                </div>
            </section>
        </main>
    );
}
