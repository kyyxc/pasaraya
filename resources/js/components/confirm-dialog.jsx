import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({
    open = false,
    title = 'Konfirmasi',
    description = 'Apakah Anda yakin ingin melanjutkan?',
    confirmText = 'Ya, lanjutkan',
    cancelText = 'Batal',
    onConfirm,
    onCancel,
    loading = false,
}) {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4">
            <div className="w-full max-w-md rounded-[28px] border border-border bg-card p-5 shadow-xl">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="flex size-10 items-center justify-center rounded-2xl bg-red-500/10 text-red-600">
                            <AlertTriangle className="size-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                        </div>
                    </div>
                    <button type="button" onClick={onCancel} className="rounded-full border border-border bg-background p-2 text-muted-foreground hover:text-foreground">
                        <X className="size-4" />
                    </button>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onCancel} className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary">
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Memproses...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
