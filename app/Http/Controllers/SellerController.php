<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SellerController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user();

        if (! $user || $user->role !== User::ROLE_SELLER) {
            abort(403, 'Seller access required.');
        }

        $store = $this->getSellerStore();

        if (! $store) {
            return Inertia::render('SellerDashboard', [
                'store' => null,
                'stats' => [
                    'total_sales' => 0,
                    'total_orders' => 0,
                    'pending_orders' => 0,
                    'active_products' => 0,
                    'low_stock_products' => 0,
                    'monthly_revenue' => 0,
                ],
                'salesChart' => [],
                'recentOrders' => [],
                'topProducts' => [],
                'lowStockProducts' => [],
                'orderStatusSummary' => [],
            ]);
        }

        $now = now();
        $startOfMonth = $now->copy()->startOfMonth();
        $last30Days = $now->copy()->subDays(29)->startOfDay();

        $stats = [
            'total_sales' => (float) Order::query()->where('store_id', $store->id)->sum('total'),
            'total_orders' => Order::query()->where('store_id', $store->id)->count(),
            'pending_orders' => Order::query()
                ->where('store_id', $store->id)
                ->whereIn('status', [
                    Order::STATUS_PENDING_PAYMENT,
                    Order::STATUS_CONFIRMED,
                    Order::STATUS_PROCESSING,
                    Order::STATUS_READY_FOR_PICKUP,
                    Order::STATUS_OUT_FOR_DELIVERY,
                ])
                ->count(),
            'active_products' => Product::query()
                ->where('store_id', $store->id)
                ->where('status', Product::STATUS_ACTIVE)
                ->count(),
            'low_stock_products' => Product::query()
                ->where('store_id', $store->id)
                ->where('status', Product::STATUS_ACTIVE)
                ->where('stock', '<=', 5)
                ->count(),
            'monthly_revenue' => (float) Order::query()
                ->where('store_id', $store->id)
                ->whereBetween('created_at', [$startOfMonth, $now])
                ->sum('total'),
        ];

        $salesChart = Order::query()
            ->selectRaw('DATE(created_at) as day, SUM(total) as total, COUNT(*) as orders')
            ->where('store_id', $store->id)
            ->whereBetween('created_at', [$last30Days, $now])
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('day')
            ->get()
            ->map(function ($row) {
                return [
                    'label' => \Illuminate\Support\Carbon::parse($row->day)->translatedFormat('d M'),
                    'value' => (float) $row->total,
                    'orders' => (int) $row->orders,
                ];
            })
            ->values()
            ->all();

        $recentOrders = Order::query()
            ->with(['buyer', 'items'])
            ->where('store_id', $store->id)
            ->latest('created_at')
            ->limit(5)
            ->get()
            ->map(fn (Order $order) => $this->serializeOrder($order))
            ->values()
            ->all();

        $productIds = Product::query()->where('store_id', $store->id)->pluck('id');

        $topProducts = OrderItem::query()
            ->select('product_id', DB::raw('SUM(quantity) as sold_quantity'))
            ->whereIn('product_id', $productIds)
            ->groupBy('product_id')
            ->orderByDesc('sold_quantity')
            ->limit(5)
            ->get()
            ->map(function ($row) {
                $product = Product::query()->find($row->product_id);

                return [
                    'id' => $product?->id,
                    'name' => $product?->name ?? 'Unknown product',
                    'sold_quantity' => (int) $row->sold_quantity,
                    'stock' => (int) ($product?->stock ?? 0),
                    'price' => (float) ($product?->price ?? 0),
                ];
            })
            ->values()
            ->all();

        $lowStockProducts = Product::query()
            ->with('category')
            ->where('store_id', $store->id)
            ->where('status', Product::STATUS_ACTIVE)
            ->where('stock', '<=', 5)
            ->orderBy('stock')
            ->limit(5)
            ->get()
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'stock' => (int) $product->stock,
                'category' => $product->category?->name ?? 'Uncategorized',
                'price' => (float) $product->price,
            ])
            ->values()
            ->all();

        $orderStatusSummary = [
            'pending_payment' => Order::query()->where('store_id', $store->id)->where('status', Order::STATUS_PENDING_PAYMENT)->count(),
            'confirmed' => Order::query()->where('store_id', $store->id)->where('status', Order::STATUS_CONFIRMED)->count(),
            'processing' => Order::query()->where('store_id', $store->id)->where('status', Order::STATUS_PROCESSING)->count(),
            'ready_for_pickup' => Order::query()->where('store_id', $store->id)->where('status', Order::STATUS_READY_FOR_PICKUP)->count(),
            'out_for_delivery' => Order::query()->where('store_id', $store->id)->where('status', Order::STATUS_OUT_FOR_DELIVERY)->count(),
            'completed' => Order::query()->where('store_id', $store->id)->where('status', Order::STATUS_COMPLETED)->count(),
            'cancelled' => Order::query()->where('store_id', $store->id)->where('status', Order::STATUS_CANCELLED)->count(),
        ];

        return Inertia::render('SellerDashboard', [
            'store' => [
                'id' => $store->id,
                'name' => $store->name,
                'slug' => $store->slug,
                'status' => $store->status,
                'owner_name' => $store->owner?->first_name.' '.$store->owner?->last_name,
            ],
            'stats' => $stats,
            'salesChart' => $salesChart,
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
            'lowStockProducts' => $lowStockProducts,
            'orderStatusSummary' => $orderStatusSummary,
        ]);
    }

    public function products(Request $request)
    {
        $store = $this->getSellerStore();

        if (! $store) {
            return Inertia::render('SellerProducts', [
                'store' => null,
                'products' => [],
                'categories' => [],
                'filters' => ['q' => '', 'category' => 'all', 'status' => 'all'],
                'pagination' => ['current_page' => 1, 'last_page' => 1, 'total' => 0],
            ]);
        }

        $query = Product::query()->with(['category', 'images'])->where('store_id', $store->id);

        if ($request->filled('q')) {
            $term = trim((string) $request->input('q'));
            $query->where('name', 'like', "%{$term}%");
        }

        if ($request->filled('category') && $request->input('category') !== 'all') {
            $query->where('category_id', (int) $request->input('category'));
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        $sort = (string) $request->input('sort', 'created_at_desc');
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'stock_desc':
                $query->orderBy('stock', 'desc');
                break;
            default:
                $query->latest('created_at');
                break;
        }

        $products = $query->paginate(10)->withQueryString();

        $categories = Category::query()->orderBy('name')->get()->map(fn (Category $category) => [
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
        ])->values()->all();

        return Inertia::render('SellerProducts', [
            'store' => [
                'id' => $store->id,
                'name' => $store->name,
            ],
            'products' => $products->items(),
            'categories' => $categories,
            'filters' => [
                'q' => (string) $request->input('q', ''),
                'category' => (string) $request->input('category', 'all'),
                'status' => (string) $request->input('status', 'all'),
                'sort' => (string) $request->input('sort', 'created_at_desc'),
            ],
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'total' => $products->total(),
                'per_page' => $products->perPage(),
            ],
        ]);
    }

    public function storeProduct(Request $request)
    {
        $store = $this->sellerStoreOrFail();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'category_id' => ['required', 'exists:categories,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'weight_grams' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', Rule::in([Product::STATUS_DRAFT, Product::STATUS_ACTIVE, Product::STATUS_INACTIVE, Product::STATUS_OUT_OF_STOCK])],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ]);

        $slug = $this->makeUniqueSlug($store->id, $validated['name']);

        $product = Product::query()->create([
            'store_id' => $store->id,
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'weight_grams' => $validated['weight_grams'] ?? null,
            'status' => $validated['status'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if ($request->hasFile('image')) {
            $this->savePrimaryImage($product, $request->file('image'));
        }

        return redirect()->route('seller.products')->with('success', 'Produk berhasil ditambahkan.');
    }

    public function updateProduct(Request $request, Product $product)
    {
        $store = $this->sellerStoreOrFail();

        if ($product->store_id !== $store->id) {
            abort(403, 'You do not own this product.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'category_id' => ['required', 'exists:categories,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'weight_grams' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', Rule::in([Product::STATUS_DRAFT, Product::STATUS_ACTIVE, Product::STATUS_INACTIVE, Product::STATUS_OUT_OF_STOCK])],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ]);

        $product->update([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'slug' => $this->makeUniqueSlug($store->id, $validated['name'], $product->id),
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'weight_grams' => $validated['weight_grams'] ?? null,
            'status' => $validated['status'],
            'updated_at' => now(),
        ]);

        if ($request->hasFile('image')) {
            $this->savePrimaryImage($product, $request->file('image'));
        }

        return redirect()->route('seller.products')->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroyProduct(Product $product)
    {
        $store = $this->sellerStoreOrFail();

        if ($product->store_id !== $store->id) {
            abort(403, 'You do not own this product.');
        }

        $product->delete();

        return redirect()->route('seller.products')->with('success', 'Produk berhasil dihapus.');
    }

    public function orders(Request $request)
    {
        $store = $this->getSellerStore();

        if (! $store) {
            return Inertia::render('SellerOrders', [
                'store' => null,
                'orders' => [],
                'filters' => ['q' => '', 'status' => 'all'],
                'pagination' => ['current_page' => 1, 'last_page' => 1, 'total' => 0],
            ]);
        }

        $query = Order::query()->with(['buyer', 'items'])->where('store_id', $store->id);

        if ($request->filled('q')) {
            $term = trim((string) $request->input('q'));
            $query->where(function ($builder) use ($term) {
                $builder->where('order_number', 'like', "%{$term}%")
                    ->orWhere('recipient_name', 'like', "%{$term}%");
            });
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->input('start_date'));
        }

        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->input('end_date'));
        }

        $orders = $query->latest('created_at')->paginate(10)->withQueryString();

        return Inertia::render('SellerOrders', [
            'store' => [
                'id' => $store->id,
                'name' => $store->name,
            ],
            'orders' => $orders->items(),
            'filters' => [
                'q' => (string) $request->input('q', ''),
                'status' => (string) $request->input('status', 'all'),
                'start_date' => (string) $request->input('start_date', ''),
                'end_date' => (string) $request->input('end_date', ''),
            ],
            'pagination' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'total' => $orders->total(),
                'per_page' => $orders->perPage(),
            ],
            'statuses' => [
                Order::STATUS_PENDING_PAYMENT,
                Order::STATUS_CONFIRMED,
                Order::STATUS_PROCESSING,
                Order::STATUS_READY_FOR_PICKUP,
                Order::STATUS_OUT_FOR_DELIVERY,
                Order::STATUS_COMPLETED,
                Order::STATUS_CANCELLED,
            ],
        ]);
    }

    public function chat()
    {
        $store = $this->getSellerStore();

        if (! $store) {
            return Inertia::render('SellerChat', [
                'store' => null,
                'conversations' => [],
                'selectedConversation' => null,
            ]);
        }

        $conversations = Conversation::query()
            ->with(['buyer', 'product', 'messages.sender'])
            ->where('store_id', $store->id)
            ->latest('last_message_at')
            ->get()
            ->map(function (Conversation $conversation) {
                $messages = $conversation->messages
                    ->sortBy(fn (Message $message) => $message->created_at?->timestamp ?? 0)
                    ->values()
                    ->all();

                $lastMessage = $messages[count($messages) - 1] ?? null;
                $buyerName = trim(($conversation->buyer?->first_name ?? '').' '.($conversation->buyer?->last_name ?? '')) ?: ($conversation->buyer?->email ?? 'Pembeli');

                return [
                    'id' => $conversation->id,
                    'buyer_id' => $conversation->buyer_id,
                    'buyer_name' => $buyerName,
                    'buyer_email' => $conversation->buyer?->email,
                    'product_name' => $conversation->product?->name ?? 'Produk',
                    'last_message_at' => $lastMessage?->created_at?->toISOString(),
                    'last_message' => $lastMessage?->content ?? 'Belum ada pesan',
                    'unread_count' => $conversation->messages->where('sender_id', '!=', $conversation->buyer_id)->where('is_read', false)->count(),
                    'messages' => array_map(fn (Message $message) => [
                        'id' => $message->id,
                        'sender_id' => $message->sender_id,
                        'sender_name' => trim(($message->sender?->first_name ?? '').' '.($message->sender?->last_name ?? '')) ?: ($message->sender?->email ?? 'Pengguna'),
                        'is_from_buyer' => (int) $message->sender_id === (int) $conversation->buyer_id,
                        'content' => $message->content,
                        'created_at' => $message->created_at?->toISOString(),
                        'is_read' => (bool) $message->is_read,
                    ], $messages),
                ];
            })
            ->values()
            ->all();

        $selectedConversation = $conversations[0] ?? null;

        return Inertia::render('SellerChat', [
            'store' => [
                'id' => $store->id,
                'name' => $store->name,
            ],
            'conversations' => $conversations,
            'selectedConversation' => $selectedConversation,
        ]);
    }

    public function statistics(Request $request)
    {
        $store = $this->getSellerStore();

        if (! $store) {
            return Inertia::render('SellerStatistics', [
                'store' => null,
                'metrics' => [],
                'salesChart' => [],
                'topProducts' => [],
            ]);
        }

        $periodDays = max(7, (int) $request->input('days', 30));
        $startDate = now()->subDays($periodDays - 1)->startOfDay();

        $orders = Order::query()
            ->where('store_id', $store->id)
            ->where('created_at', '>=', $startDate)
            ->get();

        $salesChart = Order::query()
            ->selectRaw('DATE(created_at) as day, SUM(total) as total, COUNT(*) as orders')
            ->where('store_id', $store->id)
            ->whereBetween('created_at', [$startDate, now()])
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('day')
            ->get()
            ->map(function ($row) {
                return [
                    'label' => \Illuminate\Support\Carbon::parse($row->day)->translatedFormat('d M'),
                    'value' => (float) $row->total,
                    'orders' => (int) $row->orders,
                ];
            })
            ->values()
            ->all();

        $totalRevenue = (float) $orders->sum('total');
        $totalOrders = $orders->count();
        $totalProductsSold = (int) OrderItem::query()->whereIn('order_id', $orders->pluck('id'))->sum('quantity');
        $averageOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

        $topProducts = OrderItem::query()
            ->select('product_id', DB::raw('SUM(quantity) as sold_quantity'))
            ->whereIn('order_id', $orders->pluck('id'))
            ->groupBy('product_id')
            ->orderByDesc('sold_quantity')
            ->limit(5)
            ->get()
            ->map(function ($row) {
                $product = Product::query()->find($row->product_id);

                return [
                    'id' => $product?->id,
                    'name' => $product?->name ?? 'Produk tidak tersedia',
                    'sold_quantity' => (int) $row->sold_quantity,
                    'revenue' => (float) ($product?->price ?? 0) * (int) $row->sold_quantity,
                ];
            })
            ->values()
            ->all();

        return Inertia::render('SellerStatistics', [
            'store' => [
                'id' => $store->id,
                'name' => $store->name,
            ],
            'metrics' => [
                'total_revenue' => $totalRevenue,
                'total_orders' => $totalOrders,
                'total_products_sold' => $totalProductsSold,
                'average_order_value' => $averageOrderValue,
            ],
            'salesChart' => $salesChart,
            'topProducts' => $topProducts,
            'period' => $periodDays,
        ]);
    }

    public function storeProfile()
    {
        $store = $this->getSellerStore();

        if (! $store) {
            return Inertia::render('SellerStoreProfile', [
                'store' => null,
                'products_count' => 0,
                'orders_count' => 0,
            ]);
        }

        $productsCount = Product::query()->where('store_id', $store->id)->count();
        $ordersCount = Order::query()->where('store_id', $store->id)->count();
        $totalRevenue = (float) Order::query()->where('store_id', $store->id)->sum('total');

        return Inertia::render('SellerStoreProfile', [
            'store' => [
                'id' => $store->id,
                'name' => $store->name,
                'slug' => $store->slug,
                'description' => $store->description,
                'logo' => $store->logo,
                'phone' => $store->phone,
                'address' => $store->address,
                'status' => $store->status,
                'owner_name' => trim(($store->owner?->first_name ?? '').' '.($store->owner?->last_name ?? '')) ?: $store->owner?->email,
                'created_at' => $store->created_at?->toISOString(),
            ],
            'products_count' => $productsCount,
            'orders_count' => $ordersCount,
            'total_revenue' => $totalRevenue,
        ]);
    }

    public function account()
    {
        $user = auth()->user();

        if (! $user || $user->role !== User::ROLE_SELLER) {
            abort(403, 'Seller access required.');
        }

        $store = $this->getSellerStore();

        return Inertia::render('SellerAccount', [
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'is_active' => (bool) $user->is_active,
                'is_staff' => (bool) $user->is_staff,
                'date_joined' => $user->date_joined?->toISOString(),
            ],
            'store' => $store ? [
                'id' => $store->id,
                'name' => $store->name,
                'status' => $store->status,
                'slug' => $store->slug,
            ] : null,
        ]);
    }

    private function getSellerStore(): ?Store
    {
        $user = auth()->user();

        if (! $user || $user->role !== User::ROLE_SELLER) {
            return null;
        }

        return Store::query()->where('owner_id', $user->id)->first();
    }

    private function sellerStoreOrFail(): Store
    {
        $store = $this->getSellerStore();

        if (! $store) {
            abort(403, 'Seller store not found.');
        }

        return $store;
    }

    private function savePrimaryImage(Product $product, \Illuminate\Http\UploadedFile $file): void
    {
        $path = $file->storePubliclyAs('products', uniqid().'.'.$file->extension(), 'public');

        $product->images()->delete();
        $product->images()->create([
            'image' => Storage::url($path),
            'alt_text' => $product->name,
            'is_primary' => true,
            'sort_order' => 0,
            'created_at' => now(),
        ]);
    }

    private function makeUniqueSlug(int $storeId, string $name, ?int $excludeId = null): string
    {
        $base = Str::slug($name) ?: 'product';
        $slug = $base;
        $suffix = 1;

        while (Product::query()
            ->where('store_id', $storeId)
            ->where('slug', $slug)
            ->when($excludeId !== null, fn ($query) => $query->whereKeyNot($excludeId))
            ->exists()) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }

    private function serializeOrder(Order $order): array
    {
        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $order->status,
            'buyer_name' => $order->buyer?->first_name.' '.$order->buyer?->last_name,
            'buyer_email' => $order->buyer?->email,
            'total' => (float) $order->total,
            'subtotal' => (float) $order->subtotal,
            'items_count' => $order->items->sum('quantity'),
            'created_at' => $order->created_at?->toISOString(),
        ];
    }
}
