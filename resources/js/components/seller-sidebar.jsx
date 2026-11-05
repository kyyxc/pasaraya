import { Link } from '@inertiajs/react';
import {
    BarChart3,
    Boxes,
    MessageSquare,
    Package,
    PanelLeftClose,
    PanelLeftOpen,
    Settings,
    ShoppingBag,
    ShoppingCart,
    Store,
    UserCircle2,
} from 'lucide-react';
import { useState } from 'react';

export default function SellerSidebar({ store = null, currentPath = '/seller/dashboard' }) {
    const [collapsed, setCollapsed] = useState(false);

    const menuGroups = [
        {
            label: 'Ringkasan',
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
        <>
            <style>{`
                @media (min-width: 1024px) {
                    main:has(> aside[data-collapsed="true"]) > div {
                        padding-left: 5rem !important;
                    }

                    main:has(> aside[data-collapsed="false"]) > div {
                        padding-left: 18rem !important;
                    }
                }
            `}</style>
            <aside
                data-collapsed={collapsed}
                className={[
                    'fixed inset-y-0 left-0 z-30 hidden border-r border-border bg-card/95 backdrop-blur-sm lg:flex lg:flex-col',
                    collapsed ? 'w-20 px-3 py-4' : 'w-72 px-5 py-6',
                ].join(' ')}
            >
                <div className="flex items-center justify-between gap-3 px-2">
                    <div className={['flex items-center gap-3', collapsed ? 'justify-center w-full' : ''].join(' ')}>
                        {!collapsed && (
                            <>
                                <img src="/images/logo.png" alt="Pasaraya logo" className="size-10 rounded-2xl border border-border bg-background object-contain p-1.5" />
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Pasaraya</p>
                                    <p className="text-sm font-medium text-foreground">Pusat Penjual</p>
                                </div>
                            </>
                        )}
                        {collapsed && (
                            <img src="/images/logo.png" alt="Pasaraya logo" className="size-9 rounded-xl border border-border bg-background object-contain p-1.5" />
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => setCollapsed((value) => !value)}
                        className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition hover:text-foreground"
                        aria-label={collapsed ? 'Buka sidebar' : 'Tutup sidebar'}
                    >
                        {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
                    </button>
                </div>

                <nav className="mt-8 space-y-6 text-sm">
                    {menuGroups.map((group) => (
                        <div key={group.label}>
                            {!collapsed && <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{group.label}</p>}
                            <div className="mt-3 space-y-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.href);

                                    return (
                                        <Link
                                            key={`${group.label}-${item.label}`}
                                            href={item.href}
                                            title={collapsed ? item.label : undefined}
                                            className={[
                                                'flex items-center rounded-xl transition-colors',
                                                collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2',
                                                active
                                                    ? 'bg-primary/10 font-medium text-primary'
                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                            ].join(' ')}
                                        >
                                            <Icon className="size-4 shrink-0" />
                                            {!collapsed && <span>{item.label}</span>}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className={['mt-auto rounded-[24px] border border-border bg-background p-4', collapsed ? 'px-2 py-3' : ''].join(' ')}>
                    {!collapsed && (
                        <>
                            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Toko</p>
                            <p className="mt-2 text-lg font-semibold text-foreground">{store?.name ?? 'Toko belum dibuat'}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{store ? 'Status aktif' : 'Belum tersedia'}</p>
                        </>
                    )}
                    {collapsed && <p className="text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Toko</p>}
                </div>
            </aside>
        </>
    );
}
