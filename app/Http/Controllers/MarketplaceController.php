<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Conversation;
use App\Models\Product;
use App\Models\Promotion;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MarketplaceController extends Controller
{
    public function home()
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
            ]);

        $banners = Promotion::query()
            ->where(function ($query) {
                $query->where('status', Promotion::STATUS_ACTIVE)
                    ->orWhere(function ($scheduledQuery) {
                        $scheduledQuery->where('status', Promotion::STATUS_SCHEDULED)
                            ->where('starts_at', '<=', now())
                            ->where(function ($dateQuery) {
                                $dateQuery->whereNull('ends_at')
                                    ->orWhere('ends_at', '>=', now());
                            });
                    });
            })
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Promotion $promotion) => [
                'id' => $promotion->id,
                'title' => $promotion->title,
                'subtitle' => $promotion->subtitle,
                'description' => $promotion->description,
                'image_url' => $promotion->image_url,
                'button_text' => $promotion->button_text,
                'button_link' => $promotion->button_link,
                'status' => $promotion->status,
            ]);

        $products = Product::query()
            ->with(['category', 'store', 'images'])
            ->where('status', Product::STATUS_ACTIVE)
            ->orderByDesc('created_at')
            ->limit(6)
            ->get()
            ->map(fn (Product $product) => $this->serializeProduct($product));

        return Inertia::render('Home', [
            'message' => 'Selamat datang di Pasaraya',
            'categories' => $categories,
            'banners' => $banners,
            'products' => $products,
        ]);
    }

    public function categories()
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'items' => $category->products()->where('status', Product::STATUS_ACTIVE)->count(),
            ]);

        return Inertia::render('Categories', [
            'message' => 'Jelajahi kategori',
            'categories' => $categories,
        ]);
    }

    public function index(Request $request)
    {
        $query = Product::query()
            ->with(['category', 'store', 'images'])
            ->where('status', Product::STATUS_ACTIVE);

        if ($request->filled('q')) {
            $search = trim($request->string('q'));
            $query->where(function ($builder) use ($search) {
                $builder->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category')) {
            $categorySlug = trim((string) $request->get('category'));
            $category = Category::query()->where('slug', $categorySlug)->first();

            if ($category) {
                $query->where('category_id', $category->id);
            }
        }

        $sort = $request->get('sort', 'featured');
        if ($sort === 'price_asc') {
            $query->orderBy('price', 'asc');
        } elseif ($sort === 'price_desc') {
            $query->orderBy('price', 'desc');
        } elseif ($sort === 'name') {
            $query->orderBy('name', 'asc');
        } else {
            $query->orderByDesc('created_at');
        }

        $products = $query->paginate(12)->withQueryString();

        $categories = Category::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'items' => $category->products()->where('status', Product::STATUS_ACTIVE)->count(),
            ]);

        return Inertia::render('Products', [
            'message' => 'Jelajahi produk',
            'categories' => $categories,
            'products' => $products->items(),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'total' => $products->total(),
                'per_page' => $products->perPage(),
                'next_page_url' => $products->nextPageUrl(),
                'prev_page_url' => $products->previousPageUrl(),
            ],
            'filters' => [
                'q' => (string) $request->get('q', ''),
                'category' => (string) $request->get('category', 'all'),
                'sort' => $sort,
            ],
        ]);
    }

    public function show(Product $product)
    {
        $product->load(['category', 'store', 'images']);

        return Inertia::render('ProductDetail', [
            'product' => $this->serializeProduct($product),
            'related_products' => Product::query()
                ->with(['category', 'store', 'images'])
                ->where('status', Product::STATUS_ACTIVE)
                ->where('category_id', $product->category_id)
                ->whereKeyNot($product->id)
                ->limit(4)
                ->get()
                ->map(fn (Product $related) => $this->serializeProduct($related)),
        ]);
    }

    public function deals()
    {
        $deals = Promotion::query()
            ->where(function ($query) {
                $query->where('status', Promotion::STATUS_ACTIVE)
                    ->orWhere(function ($scheduledQuery) {
                        $scheduledQuery->where('status', Promotion::STATUS_SCHEDULED)
                            ->where('starts_at', '<=', now())
                            ->where(function ($dateQuery) {
                                $dateQuery->whereNull('ends_at')
                                    ->orWhere('ends_at', '>=', now());
                            });
                    });
            })
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->get()
            ->map(function (Promotion $promotion, int $index) {
                $imageUrl = $promotion->image_url;

                if ($imageUrl && ! str_starts_with($imageUrl, 'http://') && ! str_starts_with($imageUrl, 'https://')) {
                    $imageUrl = Storage::disk('public')->url($imageUrl);
                }

                $accentPalette = [
                    'from-emerald-500/15 to-emerald-500/5',
                    'from-violet-500/15 to-violet-500/5',
                    'from-sky-500/15 to-sky-500/5',
                    'from-amber-500/15 to-amber-500/5',
                ];

                return [
                    'id' => $promotion->id,
                    'title' => $promotion->title,
                    'description' => $promotion->description ?: $promotion->subtitle,
                    'discount' => $promotion->subtitle ?: ($promotion->button_text ?: 'Promo'),
                    'button_text' => $promotion->button_text ?: 'Lihat promo',
                    'image_url' => $imageUrl,
                    'button_link' => $promotion->button_link,
                    'accent' => $accentPalette[$index % count($accentPalette)],
                ];
            })
            ->values()
            ->all();

        return Inertia::render('Deals', [
            'message' => 'Promo hari ini',
            'deals' => $deals,
        ]);
    }

    public function store(Store $store)
    {
        $store->load(['owner', 'products' => fn ($query) => $query->where('status', Product::STATUS_ACTIVE)->with(['category', 'images'])]);

        $products = $store->products
            ->sortByDesc('created_at')
            ->map(fn (Product $product) => $this->serializeProduct($product))
            ->values()
            ->all();

        $chatMessages = [
            [
                'id' => 1,
                'sender' => 'store',
                'name' => $store->name,
                'content' => 'Halo! Produk yang Anda lihat tersedia dan bisa dikirim hari ini. Mau cek stok atau kategori lain?',
                'created_at' => now()->subMinutes(24)->toISOString(),
            ],
            [
                'id' => 2,
                'sender' => 'buyer',
                'name' => auth()->user()?->first_name ?? 'Anda',
                'content' => 'Saya ingin menanyakan apakah masih tersedia untuk produk unggulan ini.',
                'created_at' => now()->subMinutes(18)->toISOString(),
            ],
        ];

        return Inertia::render('StoreProfile', [
            'store' => [
                'id' => $store->id,
                'name' => $store->name,
                'slug' => $store->slug,
                'description' => $store->description,
                'logo' => $store->logo,
                'phone' => $store->phone,
                'address' => $store->address,
                'status' => $store->status,
                'owner_name' => trim(($store->owner?->first_name ?? '').' '.($store->owner?->last_name ?? '')) ?: ($store->owner?->email ?? 'Pemilik toko'),
            ],
            'products' => $products,
            'chat_messages' => $chatMessages,
        ]);
    }

    public function chat(Request $request)
    {
        $user = $request->user();

        $conversations = Conversation::query()
            ->where('buyer_id', $user->id)
            ->with(['store.owner', 'product', 'messages.sender'])
            ->orderByDesc('last_message_at')
            ->get()
            ->map(function (Conversation $conversation) use ($user) {
                $messages = $conversation->messages
                    ->sortBy(fn ($message) => $message->created_at?->timestamp ?? 0)
                    ->values()
                    ->all();

                $lastMessage = $messages[count($messages) - 1] ?? null;
                $sellerName = $conversation->store?->name ?? 'Toko';

                return [
                    'id' => $conversation->id,
                    'seller_id' => $conversation->store?->owner?->id ?? $conversation->store_id,
                    'seller_name' => $sellerName,
                    'seller_email' => $conversation->store?->owner?->email,
                    'product_name' => $conversation->product?->name ?? 'Produk',
                    'last_message_at' => $lastMessage?->created_at?->toISOString(),
                    'last_message' => $lastMessage?->content ?? 'Belum ada pesan',
                    'unread_count' => collect($messages)->where('sender_id', '!=', $user->id)->where('is_read', false)->count(),
                    'messages' => array_map(function ($message) use ($user) {
                        $senderName = trim(($message->sender?->first_name ?? '').' '.($message->sender?->last_name ?? '')) ?: ($message->sender?->email ?? 'Pengguna');

                        return [
                            'id' => $message->id,
                            'sender_id' => $message->sender_id,
                            'sender_name' => $senderName,
                            'is_from_buyer' => (int) $message->sender_id === (int) $user->id,
                            'content' => $message->content,
                            'created_at' => $message->created_at?->toISOString(),
                            'is_read' => (bool) $message->is_read,
                        ];
                    }, $messages),
                ];
            })
            ->values()
            ->all();

        return Inertia::render('User/UserChat', [
            'message' => 'Chat dengan penjual',
            'conversations' => $conversations,
            'selectedConversation' => $conversations[0] ?? null,
        ]);
    }

    protected function serializeProduct(Product $product): array
    {
        $city = '';
        $address = $product->store?->address;
        if (is_string($address) && $address !== '') {
            $parts = explode(',', $address);
            $city = trim($parts[count($parts) - 2] ?? $parts[0] ?? '');
        }

        $primaryImage = $this->normalizeProductImage($product->images->first()?->image);

        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'price' => (float) $product->price,
            'stock' => (int) $product->stock,
            'status' => $product->status,
            'category_id' => $product->category_id,
            'category_name' => $product->category?->name,
            'category_slug' => $product->category?->slug,
            'seller' => $product->store?->name ?? 'Pasaraya Seller',
            'store_id' => $product->store_id,
            'store_slug' => $product->store?->slug,
            'city' => $city ?: 'Local Market',
            'badge' => $product->stock > 15 ? 'Popular' : ($product->stock > 8 ? 'Best seller' : 'New'),
            'image' => $primaryImage ?: '/images/producs/image_1.webp',
            'images' => $product->images->map(fn ($image) => [
                'id' => $image->id,
                'image' => $this->normalizeProductImage($image->image) ?: '/images/producs/image_1.webp',
                'alt_text' => $image->alt_text,
            ])->values()->all(),
        ];
    }

    protected function normalizeProductImage(?string $imagePath): ?string
    {
        if (blank($imagePath)) {
            return null;
        }

        if (str_starts_with($imagePath, 'http://') || str_starts_with($imagePath, 'https://') || str_starts_with($imagePath, '/')) {
            return $imagePath;
        }

        return Storage::disk('public')->url($imagePath);
    }
}
