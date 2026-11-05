import { Link } from '@inertiajs/react';
import { MessageSquare, Phone, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ProfileMenu from '../../components/profile-menu';
import SellerSidebar from '../../components/seller-sidebar';

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
    const [localConversations, setLocalConversations] = useState(conversations);
    const [search, setSearch] = useState('');
    const [draft, setDraft] = useState('');
    const [selectedId, setSelectedId] = useState(selectedConversation?.id ?? conversations[0]?.id ?? null);

    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    useEffect(() => {
        if (!localConversations.length) {
            setSelectedId(null);
            return;
        }

        if (!localConversations.some((conversation) => conversation.id === selectedId)) {
            setSelectedId(localConversations[0].id);
        }
    }, [localConversations, selectedId]);

    const filteredConversations = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) {
            return localConversations;
        }

        return localConversations.filter((conversation) => {
            const haystack = [
                conversation.buyer_name,
                conversation.product_name,
                conversation.last_message,
                conversation.buyer_email,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return haystack.includes(term);
        });
    }, [localConversations, search]);

    const activeConversation = useMemo(
        () => filteredConversations.find((conversation) => conversation.id === selectedId) ?? filteredConversations[0] ?? null,
        [filteredConversations, selectedId],
    );

    const handleSendMessage = (event) => {
        event.preventDefault();

        const trimmed = draft.trim();
        if (!trimmed || !activeConversation) {
            return;
        }

        const timestamp = new Date().toISOString();
        const newMessage = {
            id: Date.now(),
            sender_id: user?.id ?? 999,
            sender_name: 'Anda',
            is_from_buyer: false,
            content: trimmed,
            created_at: timestamp,
            is_read: true,
        };

        setLocalConversations((current) => current.map((conversation) => {
            if (conversation.id !== activeConversation.id) {
                return conversation;
            }

            return {
                ...conversation,
                last_message_at: timestamp,
                last_message: trimmed,
                unread_count: 0,
                messages: [...(conversation.messages ?? []), newMessage],
            };
        }));

        setDraft('');
    };

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
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Cari pembeli"
                                        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                                    />
                                </div>

                                <div className="max-h-[70vh] overflow-y-auto p-3">
                                    {!filteredConversations.length ? (
                                        <div className="rounded-2xl border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
                                            Tidak ada chat yang cocok dengan pencarian.
                                        </div>
                                    ) : (
                                        filteredConversations.map((conversation) => (
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
                                        ))
                                    )}
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
                                                                ? 'border-border bg-background text-black'
                                                                : 'border-primary/20 bg-primary/5 text-black',
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

                                        <form onSubmit={handleSendMessage} className="border-t border-border bg-background p-4">
                                            <div className="flex items-end gap-3">
                                                <textarea
                                                    value={draft}
                                                    onChange={(event) => setDraft(event.target.value)}
                                                    rows={2}
                                                    placeholder="Ketik balasan Anda..."
                                                    className="min-h-[48px] flex-1 resize-none rounded-2xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                                                />
                                                <button
                                                    type="submit"
                                                    className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                                                    disabled={!draft.trim()}
                                                >
                                                    Kirim
                                                </button>
                                            </div>
                                        </form>
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
