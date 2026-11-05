import { Link } from '@inertiajs/react';
import { ArrowRight, Menu, Search, ShoppingCart, Sparkles, Ticket, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import ProfileMenu from '../components/profile-menu';
import { Button } from '../components/ui/button';

export default function Deals({ message = 'Promo hari ini', auth, deals: dealList = [] }) {
    const user = auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [claimedOffers, setClaimedOffers] = useState([]);
    const deals = Array.isArray(dealList) ? dealList : [];

    const filteredDeals = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return deals;
        }

        return deals.filter((deal) =>
            `${deal.title ?? ''} ${deal.description ?? ''} ${deal.discount ?? ''}`.toLowerCase().includes(query),
        );
    }, [deals, searchQuery]);

    const toggleOffer = (title) => {
        setClaimedOffers((current) =>
            current.includes(title) ? current.filter((item) => item !== title) : [...current, title],
        );
    };

    return (
        <main className="min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/images/logo.png" alt="Pasaraya logo" className="size-10 rounded-xl border border-border bg-background object-contain p-1.5" />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Pasaraya</p>
                            <p className="text-[10px] text-muted-foreground">Marketplace lokal</p>
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
                        <Link href="/">Beranda</Link>
                        <Link href="/products">Produk</Link>
                        <Link href="/categories">Kategori</Link>
                        <Link href="/sell">Jual</Link>
                        <Link href="/deals" className="text-foreground">Promo</Link>
                    </nav>

                    <div className="hidden flex-1 max-w-xl items-center rounded-full border border-border bg-card px-3 py-2 shadow-sm md:flex">
                        <Search className="mr-2 size-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Cari promo dan kupon harian"
                            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="rounded-full md:hidden"
                            aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
                            onClick={() => setMobileMenuOpen((current) => !current)}
                        >
                            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
                        </Button>
                        <Link href="/cart" className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-2 text-sm font-medium text-foreground transition hover:border-primary/30 hover:text-primary">
                            <ShoppingCart className="size-4" />
                            <span className="ml-2 hidden sm:inline">Keranjang</span>
                        </Link>
                        <ProfileMenu user={user} />
                    </div>
                </div>

                {mobileMenuOpen ? (
                    <div className="border-t border-border bg-card md:hidden">
                        <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 text-sm font-medium text-muted-foreground sm:px-6">
                            <Link href="/" className="rounded-lg px-2 py-2">Beranda</Link>
                            <Link href="/products" className="rounded-lg px-2 py-2">Produk</Link>
                            <Link href="/categories" className="rounded-lg px-2 py-2">Kategori</Link>
                            <Link href="/sell" className="rounded-lg px-2 py-2">Jual</Link>
                            <Link href="/deals" className="rounded-lg px-2 py-2 text-foreground">Promo</Link>
                        </nav>
                    </div>
                ) : null}
            </header>

            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-[28px] border border-border bg-card p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Promo</p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{message}</h1>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
                            <Sparkles className="size-4" />
                            Diperbarui hari ini
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-12 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
                {filteredDeals.length > 0 ? (
                    filteredDeals.map((deal) => (
                        <article key={deal.id ?? deal.title} className="overflow-hidden rounded-[26px] border border-border bg-card shadow-sm">
                            <div className={`relative h-44 bg-gradient-to-br ${deal.accent ?? 'from-emerald-500/15 to-emerald-500/5'} p-5`}>
                                {deal.image_url ? (
                                    <img src={deal.image_url} alt={deal.title} className="absolute inset-0 h-full w-full object-cover" />
                                ) : null}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                <div className="absolute left-4 top-4 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary ring-1 ring-border">
                                    {deal.discount ?? 'Promo'}
                                </div>
                                <div className="absolute bottom-4 left-4 flex size-10 items-center justify-center rounded-2xl bg-background/80 ring-1 ring-border">
                                    <Ticket className="size-5 text-primary" />
                                </div>
                            </div>
                            <div className="space-y-3 p-5">
                                <h2 className="text-xl font-semibold text-foreground">{deal.title}</h2>
                                <p className="text-sm leading-6 text-muted-foreground">{deal.description}</p>
                                {deal.button_link ? (
                                    <Link
                                        href={deal.button_link}
                                        className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                                    >
                                        {deal.button_text ?? 'Lihat promo'}
                                        <ArrowRight className="size-4" />
                                    </Link>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={() => toggleOffer(deal.id ?? deal.title)}
                                        className="gap-2 rounded-full px-4 py-2 text-sm"
                                    >
                                        {claimedOffers.includes(deal.id ?? deal.title) ? 'Promo tersimpan' : 'Klaim promo'}
                                        <ArrowRight className="size-4" />
                                    </Button>
                                )}
                            </div>
                        </article>
                    ))
                ) : (
                    <div className="col-span-full rounded-[26px] border border-dashed border-border bg-card p-8 text-center shadow-sm">
                        <p className="text-xl font-semibold text-foreground">Tidak ada promo yang cocok dengan pencarian Anda</p>
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                        >
                            Hapus pencarian
                        </button>
                    </div>
                )}
            </section>
        </main>
    );
}
