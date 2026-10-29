import { Link } from '@inertiajs/react';
import { MessageSquare, Phone, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ProfileMenu from '../components/profile-menu';
import SellerSidebar from '../components/seller-sidebar';

const formatDateTime = (value) => {
    if (!value) {
        return '—';
    }

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
};

export default function SellerChat({ auth, store = null, conversations = [], selectedConversation = null }) {
    const user = auth?.user;
    const [selectedId, setSelectedId] = useState(selectedConversation?.id ?? conversations[0]?.id ?? null);

    useEffect(() => {
        if (!conversations.length) {
            setSelectedId(null);
            return;
        }

        if (!conversations.some((conversation) => conversation.id === selectedId)) {
            setSelectedId(conversations[0].id);
        }
    }, [conversations, selectedId]);

    const activeConversation = useMemo(
        () => conversations.find((conversation) => conversation.id === selectedId) ?? conversations[0] ?? null,
        [conversations, selectedId],
    );

    return (
        <main className="min-h-screen bg-background text-foreground">
            <SellerSidebar currentPath="/seller/chat" store={store} />

            <div className="lg:pl-72">
                <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-sm">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Chat</p>
                            <h1 className="mt-1 text-2xl font-semibold text-foreground">Chat dengan Pembeli</h1>
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
                    {!conversations.length ? (
                        <section className="rounded-[28px] border border-dashed border-border bg-card p-12 text-center shadow-sm">
                            <MessageSquare className="mx-auto size-12 text-muted-foreground" />
                            <h2 className="mt-4 text-xl font-semibold text-foreground">Belum ada percakapan</h2>
                            <p className="mt-2 text-sm text-muted-foreground">Pembeli yang menghubungi toko Anda akan muncul di sini.</p>
                        </section>
                    ) : (
                        <section className="grid min-h-[70vh] gap-4 overflow-hidden rounded-[30px] border border-border bg-card shadow-sm lg:grid-cols-[340px_minmax(0,1fr)]">
                            <aside className="border-b border-border bg-background/70 lg:border-r lg:border-b-0">
                                <div className="flex items-center gap-3 border-b border-border px-4 py-4">
                                    <Search className="size-4 text-muted-foreground" />
                                    <input
                                        value=""
                                        readOnly
                                        placeholder="Cari pembeli"
                                        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                                    />
                                </div>

                                <div className="max-h-[70vh] overflow-y-auto p-3">
                                    {conversations.map((conversation) => (
                                        <button
                                            key={conversation.id}
                                            type="button"
                                            onClick={() => setSelectedId(conversation.id)}
                                            className={[
                                                'w-full rounded-2xl border p-3 text-left transition',
                                                conversation.id === activeConversation?.id
                                                    ? 'border-primary/30 bg-primary/5'
                                                    : 'border-transparent bg-transparent hover:bg-muted',
                                            ].join(' ')}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold text-foreground">{conversation.buyer_name}</p>
                                                    <p className="mt-1 text-xs text-muted-foreground">{conversation.product_name}</p>
                                                </div>
                                                {conversation.unread_count ? (
                                                    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                                                        {conversation.unread_count}
                                                    </span>
                                                ) : null}
                                            </div>
                                            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{conversation.last_message}</p>
                                            <p className="mt-2 text-[11px] text-muted-foreground">{formatDateTime(conversation.last_message_at)}</p>
                                        </button>
                                    ))}
                                </div>
                            </aside>

                            <div className="flex min-h-0 flex-col">
                                {activeConversation ? (
                                    <>
                                        <div className="flex items-center justify-between border-b border-border px-5 py-4">
                                            <div>
                                                <h2 className="text-lg font-semibold text-foreground">{activeConversation.buyer_name}</h2>
                                                <p className="text-sm text-muted-foreground">{activeConversation.product_name}</p>
                                            </div>
                                            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground">
                                                <Phone className="size-3.5" />
                                                {activeConversation.buyer_email || 'Pembeli'}
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-4 overflow-y-auto bg-background/40 p-5">
                                            {activeConversation.messages.map((message) => (
                                                <div key={message.id} className={`flex ${message.is_from_buyer ? 'justify-start' : 'justify-end'}`}>
                                                    <div
                                                        className={[
                                                            'max-w-[80%] rounded-2xl border px-3 py-2.5 shadow-sm',
                                                            message.is_from_buyer
                                                                ? 'border-border bg-background text-foreground'
                                                                : 'border-primary/20 bg-primary/5 text-primary-foreground',
                                                        ].join(' ')}
                                                    >
                                                        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                                                            {message.is_from_buyer ? 'Pembeli' : 'Anda'}
                                                        </p>
                                                        <p className="mt-2 text-sm leading-relaxed">{message.content}</p>
                                                        <p className="mt-2 text-[10px] text-muted-foreground">{formatDateTime(message.created_at)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : null}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </main>
    );
}
