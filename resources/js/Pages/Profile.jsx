export default function Profile({ message }) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-900">
            <div className="rounded-2xl bg-white p-10 text-center shadow-lg ring-1 ring-slate-200">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-600">Pasaraya</p>
                <h1 className="mt-4 text-4xl font-bold tracking-tight">{message}</h1>
                <p className="mt-3 text-base text-slate-600">
                    Inertia + React is now connected to Laravel.
                </p>
            </div>
        </main>
    );
}
