import { Link } from '@inertiajs/react';
import { BadgeCheck, CalendarDays, Mail, Phone, ShieldCheck, UserCircle } from 'lucide-react';

const formatDate = (value) => {
    if (!value) {
        return 'Not available';
    }

    return new Intl.DateTimeFormat('en-ID', {
        dateStyle: 'medium',
    }).format(new Date(value));
};

export default function Profile({ message = 'Welcome to your profile', user = null }) {
    const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Pasaraya Member';
    const initials = fullName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('') || 'P';

    return (
        <main className="min-h-screen bg-background text-foreground">
            <header className="border-b border-border bg-background/80 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/images/logo.png" alt="Pasaraya logo" className="size-10 rounded-xl border border-border bg-background object-contain p-1.5" />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Pasaraya</p>
                            <p className="text-[10px] text-muted-foreground">Your account</p>
                        </div>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link href="/products" className="text-sm font-medium text-muted-foreground hover:text-primary">
                            Marketplace
                        </Link>
                        <form method="post" action="/logout">
                            <input type="hidden" name="_token" value={typeof document !== 'undefined' ? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '' : ''} />
                            <button type="submit" className="rounded-full border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary">
                                Logout
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-[30px] border border-border bg-card p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
                                {initials}
                            </div>
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Profile</p>
                                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{message}</h1>
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
                            <BadgeCheck className="size-4" />
                            {user?.is_active ? 'Active account' : 'Account status unavailable'}
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-5xl gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
                <div className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <UserCircle className="size-5 text-primary" />
                        <h2 className="text-xl font-semibold text-foreground">Account overview</h2>
                    </div>
                    <div className="mt-6 space-y-5">
                        <div>
                            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Full name</p>
                            <p className="mt-2 text-lg font-semibold text-foreground">{fullName}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Role</p>
                            <p className="mt-2 text-lg font-semibold capitalize text-foreground">{user?.role || 'buyer'}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Account status</p>
                            <p className="mt-2 inline-flex items-center gap-2 text-lg font-semibold text-foreground">
                                <ShieldCheck className="size-4 text-primary" />
                                {user?.is_active ? 'Verified and active' : 'Pending review'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-foreground">Contact details</h2>
                    <div className="mt-6 space-y-4">
                        <div className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                            <Mail className="mt-0.5 size-5 text-primary" />
                            <div>
                                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Email</p>
                                <p className="mt-2 text-base font-medium text-foreground">{user?.email || 'Not available'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                            <Phone className="mt-0.5 size-5 text-primary" />
                            <div>
                                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Phone</p>
                                <p className="mt-2 text-base font-medium text-foreground">{user?.phone || 'Not provided'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                            <CalendarDays className="mt-0.5 size-5 text-primary" />
                            <div>
                                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Member since</p>
                                <p className="mt-2 text-base font-medium text-foreground">{formatDate(user?.date_joined)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
                        Profile editing is not available in the current backend. Your account information is shown in read-only form.
                    </div>
                </div>
            </section>
        </main>
    );
}
