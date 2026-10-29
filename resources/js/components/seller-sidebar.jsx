import { Link } from '@inertiajs/react';
import {
    BarChart3,
    Boxes,
    MessageSquare,
    Package,
    Settings,
    ShoppingBag,
    ShoppingCart,
    Store,
    UserCircle2,
} from 'lucide-react';

export default function SellerSidebar({ store = null, currentPath = '/seller/dashboard' }) {
    const menuGroups = [
        {
            label: 'Overview',
            items: [
                { label: 'Dashboard', href: '/seller/dashboard', icon: ShoppingCart },
            ],
        },
        {
            label: 'Manajemen Produk',
            items: [
                { label: 'Semua Produk', href: '/seller/products', icon: Package },
            ],
        },
        {
            label: 'Pesanan',
            items: [
                { label: 'Pesanan Baru', href: '/seller/orders', icon: ShoppingBag },
            ],
        },
        {
            label: 'Manajemen Stok',
            items: [
                { label: 'Stok Produk', href: '/seller/products', icon: Boxes },
            ],
        },
        {
            label: 'Analitik',
            items: [
                { label: 'Statistik Penjualan', href: '/seller/statistics', icon: BarChart3 },
            ],
        },
        {
            label: 'Chat & Ulasan',
            items: [
                { label: 'Chat dengan Pembeli', href: '/seller/chat', icon: MessageSquare },
            ],
        },
        {
            label: 'Pengaturan Toko',
            items: [
                { label: 'Profil Toko', href: '/seller/store-profile', icon: Store },
                { label: 'Pengaturan Toko', href: '/seller/store-profile', icon: Settings },
            ],
        },
        {
            label: 'Akun',
            items: [
                { label: 'Profil & Akun', href: '/seller/account', icon: UserCircle2 },
            ],
        },
    ];

    const isActive = (href) => {
        if (href === '/seller/dashboard') {
            return currentPath === '/seller/dashboard' || currentPath.startsWith('/seller/dashboard');
        }

        if (href === '/seller/store-profile') {
            return currentPath === '/seller/store-profile' || currentPath.startsWith('/seller/store-profile');
        }

        return currentPath === href || currentPath.startsWith(href);
    };

    return (
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-border bg-card/95 px-5 py-6 backdrop-blur-sm lg:flex lg:flex-col">
            <div className="flex items-center gap-3 px-2">
                <img src="/images/logo.png" alt="Pasaraya logo" className="size-10 rounded-2xl border border-border bg-background object-contain p-1.5" />
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Pasaraya</p>
                    <p className="text-sm font-medium text-foreground">Seller Center</p>
                </div>
            </div>

            <nav className="mt-8 space-y-6 text-sm">
                {menuGroups.map((group) => (
                    <div key={group.label}>
                        <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{group.label}</p>
                        <div className="mt-3 space-y-1">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);

                                return (
                                    <Link
                                        key={`${group.label}-${item.label}`}
                                        href={item.href}
                                        className={[
                                            'flex items-center gap-3 rounded-xl px-3 py-2 transition-colors',
                                            active
                                                ? 'bg-primary/10 font-medium text-primary'
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                        ].join(' ')}
                                    >
                                        <Icon className="size-4" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="mt-auto rounded-[24px] border border-border bg-background p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Toko</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{store?.name ?? 'Toko belum dibuat'}</p>
                <p className="mt-1 text-sm text-muted-foreground">{store ? 'Status aktif' : 'Belum tersedia'}</p>
            </div>
        </aside>
    );
}
