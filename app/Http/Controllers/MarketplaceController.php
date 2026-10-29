<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
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

        $products = Product::query()
            ->with(['category', 'store', 'images'])
            ->where('status', Product::STATUS_ACTIVE)
            ->orderByDesc('created_at')
            ->limit(6)
            ->get()
            ->map(fn (Product $product) => $this->serializeProduct($product));

        return Inertia::render('Home', [
            'message' => 'Welcome to Pasaraya',
            'categories' => $categories,
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
            'message' => 'Explore categories',
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
            'message' => 'Browse products',
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

    protected function serializeProduct(Product $product): array
    {
        $city = '';
        $address = $product->store?->address;
        if (is_string($address) && $address !== '') {
            $parts = explode(',', $address);
            $city = trim($parts[count($parts) - 2] ?? $parts[0] ?? '');
        }

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
            'city' => $city ?: 'Local Market',
            'badge' => $product->stock > 15 ? 'Popular' : ($product->stock > 8 ? 'Best seller' : 'New'),
            'image' => $product->images->first()?->image ?? '/images/producs/image_1.webp',
            'images' => $product->images->map(fn ($image) => [
                'id' => $image->id,
                'image' => $image->image,
                'alt_text' => $image->alt_text,
            ])->values()->all(),
        ];
    }
}
