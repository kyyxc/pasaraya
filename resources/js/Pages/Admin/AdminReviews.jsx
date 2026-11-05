import { Link } from '@inertiajs/react';
import { AlertCircle, BadgeCheck, Search, Star } from 'lucide-react';
import AdminSidebar from '../../components/admin-sidebar';

export default function AdminReviews({ reviews = [], reports = [] }) {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <AdminSidebar currentPath="/admin/reviews" />

            <div className="lg:pl-72">
                <div className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 lg:px-6">
                    <header className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">Reviews</p>
                                <h1 className="mt-2 text-3xl font-semibold tracking-tight">Review & Report Management</h1>
                            </div>
                            <Link href="/admin/dashboard" className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary">
                                Dashboard
                            </Link>
                        </div>
                    </header>

                    <section className="grid gap-4 md:grid-cols-3">
                        {reports.map((item) => (
                            <div key={item.label} className="rounded-[24px] border border-border bg-card p-4 shadow-sm">
                                <p className="text-sm text-muted-foreground">{item.label}</p>
                                <p className="mt-3 text-2xl font-semibold">{item.count}</p>
                            </div>
                        ))}
                    </section>

                    <section className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-xl font-semibold">Semua review</h2>
                            <div className="relative w-full max-w-xs">
                                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <input type="text" placeholder="Cari review" className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm" />
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            {reviews.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-border bg-background p-8 text-center text-sm text-muted-foreground">
                                    Belum ada review yang masuk.
                                </div>
                            ) : null}

                            {reviews.map((review) => (
                                <div key={review.id} className="rounded-2xl border border-border bg-background p-4">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <p className="text-lg font-semibold">{review.product}</p>
                                            <p className="text-sm text-muted-foreground">{review.store}</p>
                                            <p className="mt-1 text-xs text-muted-foreground">{review.user} • {review.date}</p>
                                        </div>
                                        <div className="flex items-center gap-2 rounded-full bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-700">
                                            <Star className="size-3.5 fill-current" /> {review.rating}/5
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm text-foreground">{review.review}</p>
                                    <div className="mt-4 flex items-center justify-between gap-3">
                                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${review.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-700' : review.status === 'Needs Review' ? 'bg-amber-500/10 text-amber-700' : 'bg-rose-500/10 text-rose-700'}`}>
                                            {review.status}
                                        </span>
                                        <button type="button" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm font-medium hover:border-primary/40 hover:text-primary">
                                            <AlertCircle className="size-4" /> Tindak lanjuti
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
