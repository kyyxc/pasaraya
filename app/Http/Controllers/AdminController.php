<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Notification;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Promotion;
use App\Models\Store;
use App\Models\User;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        $now = now();
        $startOfMonth = $now->copy()->startOfMonth();
        $monthsBack = [];

        for ($i = 5; $i >= 0; $i--) {
            $month = $now->copy()->subMonths($i)->startOfMonth();
            $monthsBack[] = $month;
        }

        $revenueChart = [];
        $transactionChart = [];
        $userGrowth = [];
        $sellerGrowth = [];

        foreach ($monthsBack as $month) {
            $monthStart = $month->copy()->startOfMonth();
            $monthEnd = $month->copy()->endOfMonth();

            $monthlyRevenue = (float) Order::query()->whereBetween('created_at', [$monthStart, $monthEnd])->sum('total');
            $monthlyOrders = Order::query()->whereBetween('created_at', [$monthStart, $monthEnd])->count();

            $revenueChart[] = [
                'label' => $month->translatedFormat('M'),
                'value' => $monthlyRevenue,
            ];

            $transactionChart[] = [
                'label' => $month->translatedFormat('M'),
                'value' => $monthlyOrders,
            ];

            $buyerCount = User::query()->where('role', User::ROLE_BUYER)->whereBetween('date_joined', [$monthStart, $monthEnd])->count();
            $sellerCount = User::query()->where('role', User::ROLE_SELLER)->whereBetween('date_joined', [$monthStart, $monthEnd])->count();

            $userGrowth[] = [
                'month' => $month->translatedFormat('M'),
                'buyers' => $buyerCount,
                'sellers' => $sellerCount,
            ];

            $sellerGrowth[] = [
                'month' => $month->translatedFormat('M'),
                'value' => $sellerCount,
            ];
        }

        $orderStatus = [
            ['label' => 'Menunggu Pembayaran', 'value' => Order::query()->where('status', Order::STATUS_PENDING_PAYMENT)->count(), 'color' => '#f59e0b'],
            ['label' => 'Diproses', 'value' => Order::query()->where('status', Order::STATUS_PROCESSING)->count(), 'color' => '#8b5cf6'],
            ['label' => 'Dalam Pengiriman', 'value' => Order::query()->where('status', Order::STATUS_OUT_FOR_DELIVERY)->count(), 'color' => '#38bdf8'],
            ['label' => 'Selesai', 'value' => Order::query()->where('status', Order::STATUS_COMPLETED)->count(), 'color' => '#10b981'],
            ['label' => 'Dibatalkan', 'value' => Order::query()->where('status', Order::STATUS_CANCELLED)->count(), 'color' => '#ef4444'],
        ];

        $bestProducts = OrderItem::query()
            ->select('product_id', DB::raw('SUM(quantity) as sales'), DB::raw('SUM(subtotal) as revenue'))
            ->groupBy('product_id')
            ->orderByDesc('sales')
            ->limit(4)
            ->get()
            ->map(function ($row) {
                $product = Product::query()->find($row->product_id);

                return [
                    'name' => $product?->name ?? 'Produk tidak ditemukan',
                    'sales' => (int) ($row->sales ?? 0),
                    'revenue' => (float) ($row->revenue ?? 0),
                ];
            })
            ->values()
            ->all();

        $topStores = Order::query()
            ->select('store_id', DB::raw('SUM(total) as gmv'), DB::raw('COUNT(*) as orders'))
            ->groupBy('store_id')
            ->orderByDesc('gmv')
            ->limit(4)
            ->get()
            ->map(function ($row) {
                $store = Store::query()->find($row->store_id);

                return [
                    'name' => $store?->name ?? 'Toko tidak ditemukan',
                    'gmv' => (float) ($row->gmv ?? 0),
                    'orders' => (int) ($row->orders ?? 0),
                ];
            })
            ->values()
            ->all();

        $recentSeller = User::query()->where('role', User::ROLE_SELLER)->latest('date_joined')->first();
        $recentProduct = Product::query()->latest('created_at')->first();
        $latestOrder = Order::query()->latest('created_at')->first();
        $pendingStore = Store::query()->where('status', Store::STATUS_PENDING)->latest('created_at')->first();

        $recentActivity = [
            [
                'type' => 'seller_new',
                'title' => 'Seller baru mendaftar',
                'detail' => $recentSeller ? $recentSeller->first_name.' '.$recentSeller->last_name.' berhasil mendaftar.' : 'Belum ada seller baru.',
                'time' => $recentSeller ? $recentSeller->date_joined?->diffForHumans() : 'baru saja',
            ],
            [
                'type' => 'product_new',
                'title' => 'Produk baru ditambahkan',
                'detail' => $recentProduct ? $recentProduct->name.' dipublikasikan ke marketplace.' : 'Belum ada produk baru.',
                'time' => $recentProduct ? $recentProduct->created_at?->diffForHumans() : 'baru saja',
            ],
            [
                'type' => 'transaction',
                'title' => 'Transaksi terbaru',
                'detail' => $latestOrder ? 'Order '.$latestOrder->order_number.' berhasil diproses.' : 'Belum ada transaksi.',
                'time' => $latestOrder ? $latestOrder->created_at?->diffForHumans() : 'baru saja',
            ],
            [
                'type' => 'verification',
                'title' => 'Pengajuan verifikasi toko',
                'detail' => $pendingStore ? $pendingStore->name.' menunggu review admin.' : 'Tidak ada toko menunggu verifikasi.',
                'time' => $pendingStore ? $pendingStore->created_at?->diffForHumans() : 'baru saja',
            ],
            [
                'type' => 'report',
                'title' => 'Laporan pengguna',
                'detail' => '3 laporan baru masuk dari pelanggan.',
                'time' => '3 jam lalu',
            ],
        ];

        $users = User::query()->latest('date_joined')->limit(5)->get()->map(function (User $user) {
            return [
                'name' => trim($user->first_name.' '.$user->last_name),
                'email' => $user->email,
                'phone' => $user->phone ?? '-',
                'role' => ucfirst($user->role),
                'status' => $user->is_active ? 'Active' : 'Inactive',
                'joined' => $user->date_joined?->format('Y-m-d'),
                'orders' => Order::query()->where('buyer_id', $user->id)->count(),
            ];
        })->values()->all();

        $pendingVerifications = Store::query()->where('status', Store::STATUS_PENDING)->latest('created_at')->limit(2)->get()->map(function (Store $store) {
            return [
                'store' => $store->name,
                'owner' => trim(($store->owner?->first_name ?? '').' '.($store->owner?->last_name ?? '')) ?: 'Owner',
                'date' => $store->created_at?->format('Y-m-d'),
            ];
        })->values()->all();

        $totalRevenue = (float) Order::query()->sum('total');
        $stats = [
            'total_users' => User::query()->count(),
            'total_stores' => Store::query()->count(),
            'total_products' => Product::query()->count(),
            'total_transactions' => Order::query()->count(),
            'total_revenue' => $totalRevenue,
            'total_gmv' => $totalRevenue,
            'total_commission' => $totalRevenue * 0.05,
            'active_transactions' => Order::query()->whereIn('status', [
                Order::STATUS_PENDING_PAYMENT,
                Order::STATUS_CONFIRMED,
                Order::STATUS_PROCESSING,
                Order::STATUS_READY_FOR_PICKUP,
                Order::STATUS_OUT_FOR_DELIVERY,
            ])->count(),
        ];

        return Inertia::render('Admin/AdminDashboard', [
            'stats' => $stats,
            'revenueChart' => $revenueChart,
            'transactionChart' => $transactionChart,
            'userGrowth' => $userGrowth,
            'sellerGrowth' => $sellerGrowth,
            'orderStatus' => $orderStatus,
            'bestProducts' => $bestProducts,
            'topStores' => $topStores,
            'recentActivity' => $recentActivity,
            'users' => $users,
            'pendingVerifications' => $pendingVerifications,
        ]);
    }

    public function storeProduct(Request $request)
    {
        $validated = $request->validate([
            'store_id' => ['required', 'exists:stores,id'],
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'weight_grams' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', Rule::in([Product::STATUS_DRAFT, Product::STATUS_ACTIVE, Product::STATUS_INACTIVE, Product::STATUS_OUT_OF_STOCK])],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ]);

        $store = Store::query()->findOrFail($validated['store_id']);
        $product = Product::query()->create([
            'store_id' => $store->id,
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'slug' => $this->makeUniqueSlug($store->id, $validated['name']),
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

        return redirect()->route('admin.products')->with('success', 'Produk berhasil ditambahkan.');
    }

    public function updateProduct(Request $request, Product $product)
    {
        $validated = $request->validate([
            'store_id' => ['nullable', 'exists:stores,id'],
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'weight_grams' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', Rule::in([Product::STATUS_DRAFT, Product::STATUS_ACTIVE, Product::STATUS_INACTIVE, Product::STATUS_OUT_OF_STOCK])],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ]);

        $storeId = $validated['store_id'] ?? $product->store_id;
        $product->update([
            'store_id' => $storeId,
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'slug' => $this->makeUniqueSlug($storeId, $validated['name'], $product->id),
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

        return redirect()->route('admin.products')->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroyProduct(Product $product)
    {
        $product->delete();

        return redirect()->route('admin.products')->with('success', 'Produk berhasil dihapus.');
    }

    public function products(Request $request)
    {
        $query = Product::query()->with(['store', 'category']);

        if ($request->filled('q')) {
            $term = trim((string) $request->input('q'));
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', "%{$term}%")
                    ->orWhere('slug', 'like', "%{$term}%")
                    ->orWhereHas('store', function ($storeQuery) use ($term) {
                        $storeQuery->where('name', 'like', "%{$term}%");
                    });
            });
        }

        if ($request->filled('category') && $request->input('category') !== 'all') {
            $categoryName = trim((string) $request->input('category'));
            $category = Category::query()->where('name', $categoryName)->first();

            if ($category) {
                $query->where('category_id', $category->id);
            }
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $status = (string) $request->input('status');

            if ($status === 'low_stock') {
                $query->where('stock', '>', 0)->where('stock', '<=', 5);
            } elseif ($status === 'out_of_stock') {
                $query->where(function ($stockQuery) {
                    $stockQuery->where('stock', '<=', 0)
                        ->orWhere('status', Product::STATUS_OUT_OF_STOCK);
                });
            } else {
                $query->where('status', $status);
            }
        }

        $query->orderByDesc('created_at');

        $categories = Category::query()->orderBy('name')->pluck('name')->all();
        array_unshift($categories, 'Semua Kategori');

        $categoryOptions = Category::query()->orderBy('name')->get()->map(fn (Category $category) => [
            'id' => $category->id,
            'name' => $category->name,
        ])->values()->all();

        $stores = Store::query()->orderBy('name')->get()->map(fn (Store $store) => [
            'id' => $store->id,
            'name' => $store->name,
        ])->values()->all();

        $products = $query->get()->map(function (Product $product) {
            return [
                'id' => $product->id,
                'store_id' => $product->store_id,
                'category_id' => $product->category_id,
                'name' => $product->name,
                'description' => $product->description,
                'category' => $product->category?->name ?? 'Uncategorized',
                'seller' => $product->store?->name ?? 'Unknown Seller',
                'stock' => (int) $product->stock,
                'price' => (float) $product->price,
                'weight_grams' => $product->weight_grams,
                'status' => $this->productStatusLabel($product),
                'status_value' => $product->status,
                'rating' => $this->productRating($product),
                'image' => $product->images()->first()?->image ?? null,
                'created_at' => $product->created_at?->toISOString(),
            ];
        })->values()->all();

        $filters = [
            'q' => (string) $request->input('q', ''),
            'category' => (string) $request->input('category', 'Semua Kategori'),
            'status' => (string) $request->input('status', 'all'),
        ];

        return Inertia::render('Admin/AdminProducts', [
            'stats' => [
                'total_products' => Product::query()->count(),
                'active_products' => Product::query()->where('status', Product::STATUS_ACTIVE)->count(),
                'out_of_stock' => Product::query()->where(function ($q) {
                    $q->where('stock', '<=', 0)->orWhere('status', Product::STATUS_OUT_OF_STOCK);
                })->count(),
                'low_stock' => Product::query()->where('stock', '>', 0)->where('stock', '<=', 5)->count(),
                'rejected_products' => Product::query()->where('status', Product::STATUS_INACTIVE)->count(),
            ],
            'categories' => $categories,
            'categoryOptions' => $categoryOptions,
            'stores' => $stores,
            'filters' => $filters,
            'products' => $products,
        ]);
    }

    public function updateStoreStatus(Request $request, Store $store)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(Store::statuses())],
        ]);

        $store->update([
            'status' => $validated['status'],
            'updated_at' => now(),
        ]);

        return redirect()->route('admin.stores')->with('success', 'Status toko berhasil diperbarui.');
    }

    public function destroyStore(Store $store)
    {
        $store->delete();

        return redirect()->route('admin.stores')->with('success', 'Toko berhasil dihapus.');
    }

    public function stores(Request $request)
    {
        $query = Store::query()->with(['owner', 'products']);

        if ($request->filled('q')) {
            $term = trim((string) $request->input('q'));
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', "%{$term}%")
                    ->orWhereHas('owner', function ($ownerQuery) use ($term) {
                        $ownerQuery->where('first_name', 'like', "%{$term}%")
                            ->orWhere('last_name', 'like', "%{$term}%");
                    });
            });
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $status = (string) $request->input('status');
            $query->where('status', $this->mapStoreStatusValue($status));
        }

        $stores = $query->orderByDesc('created_at')->get()->map(function (Store $store) {
            return [
                'id' => $store->id,
                'name' => $store->name,
                'owner' => trim(($store->owner?->first_name ?? '').' '.($store->owner?->last_name ?? '')) ?: 'Owner',
                'owner_id' => $store->owner_id,
                'description' => $store->description ?: 'Tidak ada deskripsi toko.',
                'address' => $store->address ?: 'Alamat belum diisi',
                'phone' => $store->phone ?: '-',
                'status' => $this->storeStatusLabel($store->status),
                'status_value' => $store->status,
                'products' => $store->products()->count(),
                'sales' => $this->formatShortCurrency((float) Order::query()->where('store_id', $store->id)->sum('total')),
                'rating' => $this->storeRating($store).' / 5',
                'verification' => $this->storeVerificationLabel($store->status),
            ];
        })->values()->all();

        $summary = [
            'total_stores' => Store::query()->count(),
            'active_stores' => Store::query()->where('status', Store::STATUS_ACTIVE)->count(),
            'pending_stores' => Store::query()->where('status', Store::STATUS_PENDING)->count(),
            'total_sales' => (float) Order::query()->sum('total'),
        ];

        return Inertia::render('Admin/AdminStores', [
            'summary' => $summary,
            'stores' => $stores,
        ]);
    }

    private function savePrimaryImage(Product $product, UploadedFile $file): void
    {
        $path = $file->storePubliclyAs('products', uniqid().'.'.$file->extension(), 'public');
        $imageUrl = Storage::disk('public')->url($path);

        $product->images()->delete();
        $product->images()->create([
            'image' => $imageUrl,
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

    private function makeCategorySlug(string $name, ?int $excludeId = null): string
    {
        $base = Str::slug($name) ?: 'kategori';
        $slug = $base;
        $suffix = 1;

        while (Category::query()
            ->where('slug', $slug)
            ->when($excludeId !== null, fn ($query) => $query->whereKeyNot($excludeId))
            ->exists()) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }

    private function productStatusLabel(Product $product): string
    {
        if ($product->stock <= 0 || $product->status === Product::STATUS_OUT_OF_STOCK) {
            return 'Out of Stock';
        }

        if ($product->stock > 0 && $product->stock <= 5) {
            return 'Low Stock';
        }

        if ($product->status === Product::STATUS_INACTIVE) {
            return 'Inactive';
        }

        return 'Active';
    }

    private function productRating(Product $product): float
    {
        return (float) DB::table('reviews')
            ->join('order_items', 'order_items.id', '=', 'reviews.order_item_id')
            ->where('order_items.product_id', $product->id)
            ->avg('reviews.rating') ?? 0;
    }

    private function storeStatusLabel(string $status): string
    {
        return match ($status) {
            Store::STATUS_ACTIVE => 'Active',
            Store::STATUS_SUSPENDED => 'Suspended',
            Store::STATUS_PENDING => 'Pending',
            default => ucfirst((string) $status),
        };
    }

    private function mapStoreStatusValue(string $status): string
    {
        return match ($status) {
            'active' => Store::STATUS_ACTIVE,
            'pending' => Store::STATUS_PENDING,
            'suspended' => Store::STATUS_SUSPENDED,
            default => Store::STATUS_PENDING,
        };
    }

    private function storeVerificationLabel(string $status): string
    {
        return match ($status) {
            Store::STATUS_ACTIVE => 'Verified',
            Store::STATUS_PENDING => 'Review',
            Store::STATUS_SUSPENDED => 'Hold',
            default => 'Review',
        };
    }

    private function storeRating(Store $store): float
    {
        return (float) DB::table('reviews')
            ->join('order_items', 'order_items.id', '=', 'reviews.order_item_id')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->where('products.store_id', $store->id)
            ->avg('reviews.rating') ?? 0;
    }

    private function notificationTargetLabel(string $target): string
    {
        return match ($target) {
            'all' => 'Semua',
            'buyer' => 'Buyer',
            'seller' => 'Seller',
            'admin' => 'Admin',
            default => ucfirst($target),
        };
    }

    private function promotionStatusLabel(string $status): string
    {
        return match ($status) {
            Promotion::STATUS_ACTIVE => 'Active',
            Promotion::STATUS_SCHEDULED => 'Scheduled',
            Promotion::STATUS_DRAFT => 'Draft',
            default => 'Inactive',
        };
    }

    private function promotionPeriodLabel(Promotion $promotion): string
    {
        $start = $promotion->starts_at ? $promotion->starts_at->translatedFormat('d M Y') : 'Segera';
        $end = $promotion->ends_at ? $promotion->ends_at->translatedFormat('d M Y') : 'Tidak dibatasi';

        return $start.' - '.$end;
    }

    private function formatShortCurrency(float $amount): string
    {
        if ($amount >= 1000000) {
            return 'Rp '.number_format($amount / 1000000, 1, ',', '.').'M';
        }

        if ($amount >= 1000) {
            return 'Rp '.number_format($amount / 1000, 1, ',', '.').'K';
        }

        return 'Rp '.number_format((int) $amount, 0, ',', '.');
    }

    private function orderStatusLabel(Order $order, ?Payment $payment = null): string
    {
        if ($payment && $payment->status === Payment::STATUS_REFUNDED) {
            return 'Refunded';
        }

        return match ($order->status) {
            Order::STATUS_PENDING_PAYMENT => 'Pending',
            Order::STATUS_CONFIRMED => 'Paid',
            Order::STATUS_PROCESSING => 'Processing',
            Order::STATUS_READY_FOR_PICKUP => 'Ready for Pickup',
            Order::STATUS_OUT_FOR_DELIVERY => 'Shipped',
            Order::STATUS_COMPLETED => 'Completed',
            Order::STATUS_CANCELLED => 'Cancelled',
            default => 'Pending',
        };
    }

    private function paymentStatusLabel(string $status): string
    {
        return match ($status) {
            Payment::STATUS_PAID => 'Success',
            Payment::STATUS_PENDING => 'Pending',
            Payment::STATUS_REFUNDED, Payment::STATUS_PARTIALLY_REFUNDED => 'Refunded',
            Payment::STATUS_FAILED => 'Failed',
            default => ucfirst(str_replace('_', ' ', $status)),
        };
    }

    private function paymentMethodLabel(?string $method): string
    {
        return match ($method) {
            Payment::METHOD_BANK_TRANSFER => 'Transfer Bank',
            Payment::METHOD_E_WALLET => 'E-Wallet',
            Payment::METHOD_CASH_PICKUP => 'Cash Pickup',
            Payment::METHOD_CASH_ON_DELIVERY => 'Cash on Delivery',
            default => 'Belum ditentukan',
        };
    }

    private function deliveryModeLabel(Order $order): string
    {
        return in_array($order->status, [Order::STATUS_READY_FOR_PICKUP, Order::STATUS_OUT_FOR_DELIVERY], true)
            ? 'Pickup'
            : 'Delivery';
    }

    public function updateOrderStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in([
                Order::STATUS_PENDING_PAYMENT,
                Order::STATUS_CONFIRMED,
                Order::STATUS_PROCESSING,
                Order::STATUS_READY_FOR_PICKUP,
                Order::STATUS_OUT_FOR_DELIVERY,
                Order::STATUS_COMPLETED,
                Order::STATUS_CANCELLED,
            ])],
        ]);

        $order->update([
            'status' => $validated['status'],
            'completed_at' => $validated['status'] === Order::STATUS_COMPLETED ? ($order->completed_at ?? now()) : null,
            'updated_at' => now(),
        ]);

        return redirect()->route('admin.orders')->with('success', 'Status pesanan berhasil diperbarui.');
    }

    public function orders(Request $request)
    {
        $query = Order::query()->with(['buyer', 'store', 'items.product']);

        if ($request->filled('q')) {
            $term = trim((string) $request->input('q'));
            $query->where(function ($orderQuery) use ($term) {
                $orderQuery->where('order_number', 'like', "%{$term}%")
                    ->orWhereHas('buyer', function ($buyerQuery) use ($term) {
                        $buyerQuery->where('first_name', 'like', "%{$term}%")
                            ->orWhere('last_name', 'like', "%{$term}%")
                            ->orWhere('email', 'like', "%{$term}%");
                    })
                    ->orWhereHas('store', function ($storeQuery) use ($term) {
                        $storeQuery->where('name', 'like', "%{$term}%");
                    });
            });
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', (string) $request->input('status'));
        }

        $statuses = [
            'all',
            Order::STATUS_PENDING_PAYMENT,
            Order::STATUS_CONFIRMED,
            Order::STATUS_PROCESSING,
            Order::STATUS_READY_FOR_PICKUP,
            Order::STATUS_OUT_FOR_DELIVERY,
            Order::STATUS_COMPLETED,
            Order::STATUS_CANCELLED,
        ];

        $orders = $query->latest('created_at')->get()->map(function (Order $order) {
            $payment = Payment::query()->where('order_id', $order->id)->latest('paid_at')->first();
            $buyerName = trim(($order->buyer?->first_name ?? '').' '.($order->buyer?->last_name ?? '')) ?: 'Pembeli';
            $sellerName = $order->store?->name ?? 'Toko';
            $itemCount = $order->items()->sum('quantity');

            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'buyer' => $buyerName,
                'seller' => $sellerName,
                'status' => $this->orderStatusLabel($order, $payment),
                'status_value' => $order->status,
                'date' => $order->created_at?->translatedFormat('d M Y') ?? '-',
                'payment' => $payment ? $this->paymentStatusLabel($payment->status) : 'Belum bayar',
                'delivery' => $this->deliveryModeLabel($order),
                'total' => 'Rp '.number_format((float) $order->total, 0, ',', '.'),
                'pickup' => in_array($order->status, [Order::STATUS_READY_FOR_PICKUP, Order::STATUS_OUT_FOR_DELIVERY], true),
                'paymentMethod' => $this->paymentMethodLabel($payment?->method),
                'address' => $order->delivery_address ?: 'Alamat belum diisi',
                'items' => $itemCount.' item',
                'recipient_name' => $order->recipient_name ?: $buyerName,
                'recipient_phone' => $order->recipient_phone ?? '-',
                'subtotal' => (float) $order->subtotal,
                'delivery_fee' => (float) $order->delivery_fee,
                'discount_amount' => (float) $order->discount_amount,
            ];
        })->values()->all();

        $summary = [
            'total_orders' => Order::query()->count(),
            'paid_orders' => Order::query()->whereIn('status', [
                Order::STATUS_CONFIRMED,
                Order::STATUS_PROCESSING,
                Order::STATUS_READY_FOR_PICKUP,
                Order::STATUS_OUT_FOR_DELIVERY,
                Order::STATUS_COMPLETED,
            ])->count(),
            'processing_orders' => Order::query()->where('status', Order::STATUS_PROCESSING)->count(),
            'shipped_orders' => Order::query()->where('status', Order::STATUS_OUT_FOR_DELIVERY)->count(),
            'completed_orders' => Order::query()->where('status', Order::STATUS_COMPLETED)->count(),
        ];

        return Inertia::render('Admin/AdminOrders', [
            'summary' => $summary,
            'orders' => $orders,
            'filters' => [
                'q' => (string) $request->input('q', ''),
                'status' => (string) $request->input('status', 'all'),
            ],
            'statuses' => $statuses,
        ]);
    }

    public function users()
    {
        $users = User::query()->latest('date_joined')->get()->map(function (User $user) {
            return [
                'name' => trim(($user->first_name ?? '').' '.($user->last_name ?? '')) ?: 'User',
                'email' => $user->email,
                'phone' => $user->phone ?? '-',
                'role' => ucfirst($user->role),
                'status' => $user->is_active ? 'Active' : 'Suspended',
                'joined' => $user->date_joined?->format('Y-m-d') ?? '-',
                'orders' => Order::query()->where('buyer_id', $user->id)->count(),
            ];
        })->values()->all();

        return Inertia::render('Admin/AdminUsers', [
            'users' => $users,
        ]);
    }

    public function revenue()
    {
        $gmv = (float) Order::query()->sum('total');
        $platformCommission = $gmv * 0.05;
        $sellerRevenue = $gmv - $platformCommission;
        $pendingPayout = (float) Order::query()
            ->whereIn('status', [
                Order::STATUS_PENDING_PAYMENT,
                Order::STATUS_CONFIRMED,
                Order::STATUS_PROCESSING,
                Order::STATUS_READY_FOR_PICKUP,
                Order::STATUS_OUT_FOR_DELIVERY,
            ])
            ->sum('total');
        $refundTotal = (float) Payment::query()->where('status', 'refunded')->sum('amount');

        $payments = Payment::query()
            ->with('order.buyer')
            ->latest('created_at')
            ->limit(10)
            ->get()
            ->map(function (Payment $payment) {
                $buyerName = trim(($payment->order?->buyer?->first_name ?? '').' '.($payment->order?->buyer?->last_name ?? '')) ?: 'Pembeli';

                return [
                    'id' => 'PAY-'.$payment->id,
                    'order' => $payment->order?->order_number ?? '- ',
                    'buyer' => $buyerName,
                    'amount' => 'Rp '.number_format((float) $payment->amount, 0, ',', '.'),
                    'status' => $this->paymentStatusLabel($payment->status),
                    'method' => $this->paymentMethodLabel($payment->method),
                ];
            })
            ->values()
            ->all();

        return Inertia::render('Admin/AdminRevenue', [
            'totals' => [
                'gmv' => $gmv,
                'marketplace_revenue' => $gmv * 0.05,
                'platform_commission' => $platformCommission,
                'seller_revenue' => $sellerRevenue,
                'refund' => $refundTotal,
                'pending_payout' => $pendingPayout,
            ],
            'payments' => $payments,
            'commissionRules' => [
                ['label' => 'Komisi Pasaraya', 'value' => '5%', 'note' => 'Standar default'],
                ['label' => 'Komisi UMKM', 'value' => '3%', 'note' => 'Untuk toko prioritas'],
            ],
        ]);
    }

    public function categories(Request $request)
    {
        $query = Category::query()->withCount('products');

        if ($request->filled('q')) {
            $term = trim((string) $request->input('q'));
            $query->where(function ($categoryQuery) use ($term) {
                $categoryQuery->where('name', 'like', "%{$term}%")
                    ->orWhere('description', 'like', "%{$term}%");
            });
        }

        $categories = $query->orderBy('name')->get()->map(function (Category $category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description ?: 'Tidak ada deskripsi.',
                'status' => $category->is_active ? 'Active' : 'Inactive',
                'status_value' => $category->is_active ? 'active' : 'inactive',
                'products_count' => (int) $category->products_count,
            ];
        })->values()->all();

        return Inertia::render('Admin/AdminCategories', [
            'categories' => $categories,
            'filters' => [
                'q' => (string) $request->input('q', ''),
            ],
        ]);
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:categories,name'],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['required', 'boolean'],
        ]);

        Category::query()->create([
            'name' => trim($validated['name']),
            'slug' => $this->makeCategorySlug(trim($validated['name'])),
            'description' => $validated['description'] ?? null,
            'is_active' => (bool) $validated['is_active'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->route('admin.categories')->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function updateCategory(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', Rule::unique('categories', 'name')->ignore($category->id)],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['required', 'boolean'],
        ]);

        $category->update([
            'name' => trim($validated['name']),
            'slug' => $this->makeCategorySlug(trim($validated['name']), $category->id),
            'description' => $validated['description'] ?? null,
            'is_active' => (bool) $validated['is_active'],
            'updated_at' => now(),
        ]);

        return redirect()->route('admin.categories')->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroyCategory(Category $category)
    {
        if ($category->products()->exists()) {
            return redirect()->route('admin.categories')->withErrors([
                'category' => 'Kategori tidak dapat dihapus karena masih memiliki produk terkait.',
            ]);
        }

        $category->delete();

        return redirect()->route('admin.categories')->with('success', 'Kategori berhasil dihapus.');
    }

    public function reviews()
    {
        $reviews = Review::query()
            ->with(['user', 'orderItem.product.store'])
            ->latest('created_at')
            ->get()
            ->map(function (Review $review) {
                $product = $review->orderItem?->product;
                $store = $product?->store;
                $rating = (int) $review->rating;

                return [
                    'id' => $review->id,
                    'product' => $product?->name ?? 'Produk tidak tersedia',
                    'store' => $store?->name ?? 'Toko tidak tersedia',
                    'rating' => $rating,
                    'review' => $review->comment ?: 'Tidak ada komentar dari pembeli.',
                    'status' => match (true) {
                        $rating >= 4 => 'Approved',
                        $rating >= 2 => 'Needs Review',
                        default => 'Reported',
                    },
                    'user' => trim(($review->user?->first_name ?? '').' '.($review->user?->last_name ?? '')) ?: 'Pembeli',
                    'date' => $review->created_at?->translatedFormat('d M Y') ?? '-',
                ];
            })
            ->values()
            ->all();

        $reports = [
            ['label' => 'Approved', 'count' => Review::query()->where('rating', '>=', 4)->count()],
            ['label' => 'Needs Review', 'count' => Review::query()->whereBetween('rating', [2, 3])->count()],
            ['label' => 'Reported', 'count' => Review::query()->where('rating', '<=', 1)->count()],
        ];

        return Inertia::render('Admin/AdminReviews', [
            'reviews' => $reviews,
            'reports' => $reports,
        ]);
    }

    public function promotions()
    {
        $banners = Promotion::query()
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->get()
            ->map(function (Promotion $promotion) {
                return [
                    'id' => $promotion->id,
                    'title' => $promotion->title,
                    'subtitle' => $promotion->subtitle,
                    'description' => $promotion->description,
                    'image_url' => $promotion->image_url,
                    'button_text' => $promotion->button_text,
                    'button_link' => $promotion->button_link,
                    'status' => $this->promotionStatusLabel($promotion->status),
                    'status_value' => $promotion->status,
                    'period' => $this->promotionPeriodLabel($promotion),
                    'starts_at' => $promotion->starts_at?->toISOString(),
                    'ends_at' => $promotion->ends_at?->toISOString(),
                ];
            })
            ->values()
            ->all();

        return Inertia::render('Admin/AdminPromotions', [
            'banners' => $banners,
            'featured' => [
                ['name' => 'Toko Terpopuler', 'count' => Store::query()->where('status', Store::STATUS_ACTIVE)->count()],
                ['name' => 'Rekomendasi Produk Lokal', 'count' => Product::query()->where('status', Product::STATUS_ACTIVE)->count()],
            ],
        ]);
    }

    public function storePromotion(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'subtitle' => ['nullable', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'image_url' => ['nullable', 'url', 'max:500'],
            'button_text' => ['nullable', 'string', 'max:80'],
            'button_link' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(Promotion::statuses())],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        Promotion::query()->create([
            'title' => trim($validated['title']),
            'subtitle' => $validated['subtitle'] ?? null,
            'description' => $validated['description'] ?? null,
            'image_url' => $validated['image_url'] ?? null,
            'button_text' => $validated['button_text'] ?? 'Lihat detail',
            'button_link' => $validated['button_link'] ?? '/',
            'status' => $validated['status'],
            'starts_at' => $validated['starts_at'] ?? null,
            'ends_at' => $validated['ends_at'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->route('admin.promotions')->with('success', 'Banner promosi berhasil ditambahkan.');
    }

    public function updatePromotion(Request $request, Promotion $promotion)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'subtitle' => ['nullable', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'image_url' => ['nullable', 'url', 'max:500'],
            'button_text' => ['nullable', 'string', 'max:80'],
            'button_link' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(Promotion::statuses())],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $promotion->update([
            'title' => trim($validated['title']),
            'subtitle' => $validated['subtitle'] ?? null,
            'description' => $validated['description'] ?? null,
            'image_url' => $validated['image_url'] ?? null,
            'button_text' => $validated['button_text'] ?? 'Lihat detail',
            'button_link' => $validated['button_link'] ?? '/',
            'status' => $validated['status'],
            'starts_at' => $validated['starts_at'] ?? null,
            'ends_at' => $validated['ends_at'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
            'updated_at' => now(),
        ]);

        return redirect()->route('admin.promotions')->with('success', 'Banner promosi berhasil diperbarui.');
    }

    public function destroyPromotion(Promotion $promotion)
    {
        $promotion->delete();

        return redirect()->route('admin.promotions')->with('success', 'Banner promosi berhasil dihapus.');
    }

    public function notifications()
    {
        $notifications = Notification::query()
            ->with('user')
            ->latest('created_at')
            ->get()
            ->map(function (Notification $notification) {
                return [
                    'id' => $notification->id,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'target' => $this->notificationTargetLabel($notification->reference_type ?? $notification->type),
                    'type' => $notification->type,
                    'status' => $notification->is_read ? 'Read' : 'Sent',
                    'created_at' => $notification->created_at?->format('d M Y H:i'),
                ];
            })
            ->unique(fn (array $notification) => $notification['title'].'|'.$notification['message'].'|'.$notification['target'].'|'.$notification['type'])
            ->values()
            ->all();

        if ($notifications === []) {
            $notifications = [
                [
                    'id' => 0,
                    'title' => 'Belum ada notifikasi',
                    'message' => 'Admin belum mengirimkan notifikasi apapun.',
                    'target' => 'Semua',
                    'type' => 'system',
                    'status' => 'Draft',
                    'created_at' => now()->format('d M Y H:i'),
                ],
            ];
        }

        return Inertia::render('Admin/AdminNotifications', [
            'notifications' => $notifications,
        ]);
    }

    public function storeNotification(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'message' => ['required', 'string', 'max:2000'],
            'type' => ['required', 'string', 'max:50'],
            'target' => ['required', Rule::in(['all', 'buyer', 'seller', 'admin'])],
        ]);

        $userIds = match ($validated['target']) {
            'all' => User::query()->pluck('id'),
            'buyer' => User::query()->where('role', User::ROLE_BUYER)->pluck('id'),
            'seller' => User::query()->where('role', User::ROLE_SELLER)->pluck('id'),
            'admin' => User::query()->where('role', User::ROLE_ADMIN)->pluck('id'),
        };

        $createdCount = 0;

        if ($validated['target'] === 'all') {
            Notification::query()->create([
                'user_id' => auth()->id() ?? User::query()->value('id'),
                'type' => $validated['type'],
                'title' => trim($validated['title']),
                'message' => trim($validated['message']),
                'reference_type' => 'all',
                'reference_id' => null,
                'is_read' => false,
                'created_at' => now(),
            ]);

            $createdCount = 1;
        } else {
            foreach ($userIds as $userId) {
                Notification::query()->create([
                    'user_id' => $userId,
                    'type' => $validated['type'],
                    'title' => trim($validated['title']),
                    'message' => trim($validated['message']),
                    'reference_type' => $validated['target'],
                    'reference_id' => null,
                    'is_read' => false,
                    'created_at' => now(),
                ]);

                $createdCount++;
            }
        }

        if ($createdCount === 0) {
            return back()->withErrors([
                'target' => 'Tidak ada penerima untuk target notifikasi yang dipilih.',
            ]);
        }

        return redirect()->route('admin.notifications')->with('success', 'Notifikasi berhasil dikirim ke '.$createdCount.' penerima.');
    }

    public function reports()
    {
        $totalSales = (float) Order::query()->sum('total');
        $platformRevenue = $totalSales * 0.05;
        $commission = $platformRevenue * 0.6;
        $newUsersThisMonth = User::query()->whereBetween('date_joined', [now()->startOfMonth(), now()->endOfDay()])->count();

        $performance = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthStart = now()->copy()->subMonths($i)->startOfMonth();
            $monthEnd = now()->copy()->subMonths($i)->endOfMonth();

            $sales = (float) Order::query()->whereBetween('created_at', [$monthStart, $monthEnd])->sum('total');
            $revenue = $sales * 0.05;

            $performance[] = [
                'label' => $monthStart->translatedFormat('M'),
                'sales' => $sales,
                'revenue' => $revenue,
                'users' => User::query()->whereBetween('date_joined', [$monthStart, $monthEnd])->count(),
            ];
        }

        $topProducts = OrderItem::query()
            ->select('product_id', DB::raw('SUM(quantity) as sales'), DB::raw('SUM(subtotal) as revenue'))
            ->groupBy('product_id')
            ->orderByDesc('sales')
            ->limit(3)
            ->get()
            ->map(function ($row) {
                $product = Product::query()->find($row->product_id);

                return [
                    'name' => $product?->name ?? 'Produk tidak ditemukan',
                    'sales' => (int) ($row->sales ?? 0),
                    'revenue' => (float) ($row->revenue ?? 0),
                ];
            })
            ->values()
            ->all();

        $lowStockWarning = Product::query()->where('stock', '<=', 10)->count();
        $shippingIssues = Order::query()->whereIn('status', [
            Order::STATUS_OUT_FOR_DELIVERY,
            Order::STATUS_READY_FOR_PICKUP,
        ])->count();
        $pendingCommissions = Order::query()->whereIn('status', [
            Order::STATUS_PENDING_PAYMENT,
            Order::STATUS_CONFIRMED,
            Order::STATUS_PROCESSING,
        ])->count();

        return Inertia::render('Admin/AdminReports', [
            'summary' => [
                'sales' => $totalSales,
                'revenue' => $platformRevenue,
                'commission' => $commission,
                'new_users' => $newUsersThisMonth,
            ],
            'periods' => ['Harian', 'Mingguan', 'Bulanan', 'Tahunan', 'Custom'],
            'filters' => [
                ['label' => 'Penjualan', 'value' => 'Rp '.number_format($totalSales / 1000000, 1, ',', '.').' Juta'],
                ['label' => 'Pendapatan marketplace', 'value' => 'Rp '.number_format($platformRevenue / 1000000, 1, ',', '.').' Juta'],
                ['label' => 'Komisi', 'value' => 'Rp '.number_format($commission / 1000000, 1, ',', '.').' Juta'],
                ['label' => 'Pertumbuhan pengguna', 'value' => '+'.number_format((float) (($newUsersThisMonth / max(1, User::query()->count())) * 100), 1, ',', '.').' %'],
            ],
            'performance' => $performance,
            'topProducts' => $topProducts,
            'alerts' => [
                ['title' => 'Laporan produk bermasalah', 'count' => $lowStockWarning],
                ['title' => 'Keluhan pengiriman', 'count' => $shippingIssues],
                ['title' => 'Komisi tertunda', 'count' => $pendingCommissions],
            ],
        ]);
    }

    public function settings()
    {
        return Inertia::render('Admin/AdminSettings', [
            'marketplace' => [
                'name' => 'Pasaraya',
                'email' => 'hello@pasaraya.id',
                'phone' => '+62 812-3456-7890',
                'commission' => '5%',
                'tax' => '0%',
                'currency' => 'IDR',
            ],
            'sections' => [
                ['title' => 'Nama Marketplace', 'value' => 'Pasaraya', 'status' => 'Aktif'],
                ['title' => 'Logo & Favicon', 'value' => 'Terupload', 'status' => 'Lengkap'],
                ['title' => 'Kontak & Informasi', 'value' => 'Aktif', 'status' => 'Tersedia'],
                ['title' => 'Komisi Marketplace', 'value' => '5%', 'status' => 'Default'],
                ['title' => 'Metode Pembayaran', 'value' => 'Transfer, E-Wallet, COD', 'status' => 'Aktif'],
                ['title' => 'Metode Pengiriman', 'value' => 'Delivery & Pickup', 'status' => 'Aktif'],
            ],
            'security' => [
                ['label' => '2FA Admin', 'value' => 'Diaktifkan'],
                ['label' => 'Login Session', 'value' => '30 menit'],
                ['label' => 'Role & Permission', 'value' => 'Terkonfigurasi'],
            ],
        ]);
    }
}
