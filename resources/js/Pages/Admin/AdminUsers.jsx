import { Link } from '@inertiajs/react';
import { Search, ShieldCheck, UserCog } from 'lucide-react';
import AdminSidebar from '../../components/admin-sidebar';

const statusTone = {
    Active: 'bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300',
    Pending: 'bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20 dark:text-amber-300',
    Suspended: 'bg-rose-500/10 text-rose-700 ring-1 ring-rose-500/20 dark:text-rose-300',
};

export default function AdminUsers({ users = [] }) {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <AdminSidebar currentPath="/admin/users" />

            <div className="lg:pl-72">
                <div className="mx-auto max-w-[1500px] px-4 py-6 lg:px-6">
                    <header className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">Users</p>
                                <h1 className="mt-2 text-3xl font-semibold tracking-tight">User Management</h1>
                            </div>
                            <Link href="/admin/dashboard" className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary">
                                Dashboard
                            </Link>
                        </div>
                    </header>

                    <section className="mt-6 rounded-[28px] border border-border bg-card p-5 shadow-sm">
                        <div className="relative max-w-md">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Cari nama atau email"
                                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20"
                            />
                        </div>
                    </section>

                    <section className="mt-6 overflow-hidden rounded-[28px] border border-border bg-card shadow-sm">
                        <div className="border-b border-border px-5 py-4">
                            <h2 className="text-xl font-semibold">All Users</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-muted/40">
                                    <tr className="text-muted-foreground">
                                        <th className="px-5 py-3 font-medium">Nama</th>
                                        <th className="px-5 py-3 font-medium">Email</th>
                                        <th className="px-5 py-3 font-medium">Role</th>
                                        <th className="px-5 py-3 font-medium">Status</th>
                                        <th className="px-5 py-3 font-medium">Transaksi</th>
                                        <th className="px-5 py-3 font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.email} className="border-t border-border/80">
                                            <td className="px-5 py-4 font-medium">{user.name}</td>
                                            <td className="px-5 py-4 text-muted-foreground">{user.email}</td>
                                            <td className="px-5 py-4 text-muted-foreground">{user.role}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusTone[user.status] || 'bg-muted text-muted-foreground'}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">{user.orders}</td>
                                            <td className="px-5 py-4">
                                                <button type="button" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium hover:border-primary/40 hover:text-primary">
                                                    <UserCog className="size-3.5" /> Manage
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
