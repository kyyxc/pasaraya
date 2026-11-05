import { Link } from '@inertiajs/react';
import { MapPin, Package, Phone, ShieldCheck, Store } from 'lucide-react';
import ProfileMenu from '../../components/profile-menu';
import SellerSidebar from '../../components/seller-sidebar';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(amount || 0));

const formatDate = (value) => {
    if (!value) {
        return '—';
    }

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
    }).format(new Date(value));
};

export default function SellerStoreProfile({ auth, store = null, products_count = 0, orders_count = 0, total_revenue = 0 }) {
    const user = auth?.user;

    return (
        <main className="min-h-screen bg-background text-foreground">
            <SellerSidebar currentPath="/seller/store-profile" store={store} />

            <div className="lg:pl-72">
                <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-sm">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Toko</p>
                            <h1 className="mt-1 text-2xl font-semibold text-foreground">Profil Toko</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/seller/dashboard" className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-primary/30 hover:text-primary">
                                Kembali ke dashboard
                            </Link>
                            <ProfileMenu user={user} />
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <section className="rounded-[30px] border border-border bg-card p-6 shadow-sm">
                        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    {store?.logo ? <img src={store.logo} alt={store.name} className="size-16 rounded-2xl object-cover" /> : <Store className="size-8" />}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Penjual Pasaraya</p>
                                    <h2 className="mt-2 text-3xl font-semibold text-foreground">{store?.name ?? 'Toko belum dibuat'}</h2>
                                    <p className="mt-1 text-sm text-muted-foreground">{store?.slug ? `@${store.slug}` : 'Belum ada slug toko'}</p>
                                </div>
                            </div>

                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
                                <ShieldCheck className="size-4" />
                                {store?.status === 'active' ? 'Aktif' : store?.status === 'inactive' ? 'Tidak aktif' : 'Menunggu verifikasi'}
                            </div>
                        </div>
                    </section>

                    <section className="mt-6 grid gap-4 md:grid-cols-3">
                        <div className="rounded-[26px] border border-border bg-card p-5 shadow-sm">
                            <p className="text-sm text-muted-foreground">Total produk</p>
                            <p className="mt-3 text-3xl font-semibold text-foreground">{products_count}</p>
                        </div>
                        <div className="rounded-[26px] border border-border bg-card p-5 shadow-sm">
                            <p className="text-sm text-muted-foreground">Total pesanan</p>
                            <p className="mt-3 text-3xl font-semibold text-foreground">{orders_count}</p>
                        </div>
                        <div className="rounded-[26px] border border-border bg-card p-5 shadow-sm">
                            <p className="text-sm text-muted-foreground">Omzet toko</p>
                            <p className="mt-3 text-3xl font-semibold text-foreground">{formatCurrency(total_revenue)}</p>
                        </div>
                    </section>

                    <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-foreground">Deskripsi toko</h3>
                            <p className="mt-4 text-sm leading-7 text-muted-foreground">
                                {store?.description || 'Belum ada deskripsi toko. Tambahkan informasi tentang produk unggulan, lokasi, dan layanan yang ditawarkan.'}
                            </p>
                        </div>

                        <div className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-foreground">Informasi kontak</h3>
                            <div className="mt-5 space-y-4 text-sm text-muted-foreground">
                                <div className="flex items-start gap-3">
                                    <Phone className="mt-0.5 size-4 text-primary" />
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Nomor telepon</p>
                                        <p className="mt-1 text-foreground">{store?.phone || 'Belum diisi'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 size-4 text-primary" />
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Alamat</p>
                                        <p className="mt-1 text-foreground">{store?.address || 'Alamat toko belum diisi'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Package className="mt-0.5 size-4 text-primary" />
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Pemilik</p>
                                        <p className="mt-1 text-foreground">{store?.owner_name || 'Belum tersedia'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mt-6 rounded-[28px] border border-border bg-card p-6 shadow-sm">
                        <h3 className="text-xl font-semibold text-foreground">Informasi toko</h3>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-border bg-background p-4">
                                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Status toko</p>
                                <p className="mt-2 text-lg font-semibold text-foreground">{store?.status === 'active' ? 'Aktif' : store?.status === 'inactive' ? 'Tidak aktif' : 'Menunggu verifikasi'}</p>
                            </div>
                            <div className="rounded-2xl border border-border bg-background p-4">
                                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Tanggal dibuat</p>
                                <p className="mt-2 text-lg font-semibold text-foreground">{formatDate(store?.created_at)}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
