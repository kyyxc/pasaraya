import { Link } from '@inertiajs/react';
import { ChevronDown, LogOut, MessageSquare, UserCircle } from 'lucide-react';
import { useState } from 'react';

export default function ProfileMenu({ user }) {
    const [open, setOpen] = useState(false);

    if (!user) {
        return (
            <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
                <UserCircle className="size-4" />
                <span className="hidden sm:inline">Masuk</span>
            </Link>
        );
    }

    const displayName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email || 'Akun';
    const initials = displayName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('') || 'P';

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                aria-expanded={open}
                aria-haspopup="menu"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-2.5 py-2 text-sm font-medium text-foreground transition hover:border-primary/40 hover:text-primary"
            >
                <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {initials}
                </span>
                <span className="hidden sm:inline">{displayName}</span>
                <ChevronDown className="size-4 text-muted-foreground" />
            </button>

            {open ? (
                <div className="absolute right-0 top-full z-30 mt-2 w-52 rounded-[20px] border border-border bg-card p-2 shadow-lg">
                    <Link
                        href={user?.role === 'seller' ? '/seller/account' : '/profile'}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                    >
                        <UserCircle className="size-4 text-primary" />
                        {user?.role === 'seller' ? 'Profil & Akun' : 'Profil'}
                    </Link>
                    {user?.role === 'seller' ? (
                        <Link
                            href="/seller/dashboard"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                        >
                            <UserCircle className="size-4 text-primary" />
                            Dashboard Penjual
                        </Link>
                    ) : (
                        <Link
                            href="/chat"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                        >
                            <MessageSquare className="size-4 text-primary" />
                            Chat
                        </Link>
                    )}
                    <form method="post" action="/logout" className="mt-1">
                        <input type="hidden" name="_token" value={typeof document !== 'undefined' ? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '' : ''} />
                        <button
                            type="submit"
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-foreground hover:bg-muted"
                        >
                            <LogOut className="size-4 text-primary" />
                            Keluar
                        </button>
                    </form>
                </div>
            ) : null}
        </div>
    );
}
