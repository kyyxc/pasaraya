<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MarketplaceSeeder extends Seeder
{
    public function run(): void
    {
        $seller = User::firstOrCreate(
            ['email' => 'seller@pasaraya.local'],
            [
                'first_name' => 'Pasaraya',
                'last_name' => 'Seller',
                'phone' => '081234567890',
                'password' => Hash::make('password123'),
                'role' => User::ROLE_SELLER,
                'is_active' => true,
                'is_staff' => false,
                'date_joined' => now(),
                'updated_at' => now(),
            ],
        );

        $buyer = User::firstOrCreate(
            ['email' => 'buyer@pasaraya.local'],
            [
                'first_name' => 'Pasaraya',
                'last_name' => 'Buyer',
                'phone' => '081298765432',
                'password' => Hash::make('password123'),
                'role' => User::ROLE_BUYER,
                'is_active' => true,
                'is_staff' => false,
                'date_joined' => now(),
                'updated_at' => now(),
            ],
        );

        $store = Store::firstOrCreate(
            ['owner_id' => $seller->id],
            [
                'name' => 'Toko Pasaraya',
                'slug' => 'toko-pasaraya',
                'description' => 'Local favorites for everyday essentials and artisan goods.',
                'logo' => '/images/logo.png',
                'phone' => '081234567890',
                'address' => 'Jl. Merdeka No. 24, Bandung',
                'latitude' => -6.914744,
                'longitude' => 107.609810,
                'status' => Store::STATUS_ACTIVE,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        );

        $categories = [
            ['name' => 'Groceries', 'slug' => 'groceries', 'description' => 'Daily staples and pantry essentials'],
            ['name' => 'Fashion', 'slug' => 'fashion', 'description' => 'Clothing, accessories, and local wear'],
            ['name' => 'Electronics', 'slug' => 'electronics', 'description' => 'Useful gadgets and practical tech'],
            ['name' => 'Home & Living', 'slug' => 'home-living', 'description' => 'Home goods and daily living essentials'],
            ['name' => 'Beauty', 'slug' => 'beauty', 'description' => 'Wellness, skincare, and personal care'],
            ['name' => 'Handcrafted', 'slug' => 'handcrafted', 'description' => 'Authentic handmade finds from local artisans'],
        ];

        $categoryMap = [];
        foreach ($categories as $categoryData) {
            $categoryMap[$categoryData['slug']] = Category::firstOrCreate(
                ['slug' => $categoryData['slug']],
                [
                    'name' => $categoryData['name'],
                    'description' => $categoryData['description'],
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            );
        }

        $products = [
            [
                'name' => 'Organic Coconut Rice',
                'slug' => 'organic-coconut-rice',
                'category' => 'groceries',
                'price' => 84000,
                'stock' => 18,
                'description' => 'Premium local rice sourced from farmers in West Java with a rich, natural aroma.',
                'image' => '/images/producs/image_1.webp',
            ],
            [
                'name' => 'Handwoven Batik Sarong',
                'slug' => 'handwoven-batik-sarong',
                'category' => 'fashion',
                'price' => 175000,
                'stock' => 9,
                'description' => 'Breathable cotton sarong featuring an authentic batik motif made by local artisans.',
                'image' => '/images/producs/image_1.webp',
            ],
            [
                'name' => 'Portable Food Blender',
                'slug' => 'portable-food-blender',
                'category' => 'electronics',
                'price' => 249000,
                'stock' => 11,
                'description' => 'Compact travel blender for smoothies and quick meal prep with USB charging.',
                'image' => '/images/producs/image_1.webp',
            ],
            [
                'name' => 'Ceramic Mug Set',
                'slug' => 'ceramic-mug-set',
                'category' => 'home-living',
                'price' => 132000,
                'stock' => 14,
                'description' => 'Warm-toned ceramic mugs designed for daily tea rituals and cozy home moments.',
                'image' => '/images/producs/image_1.webp',
            ],
            [
                'name' => 'Citrus Ginger Tea',
                'slug' => 'citrus-ginger-tea',
                'category' => 'beauty',
                'price' => 52000,
                'stock' => 27,
                'description' => 'An herbal wellness blend with ginger and citrus notes to support your daily routine.',
                'image' => '/images/producs/image_1.webp',
            ],
            [
                'name' => 'Rustic Woven Lamp',
                'slug' => 'rustic-woven-lamp',
                'category' => 'handcrafted',
                'price' => 215000,
                'stock' => 7,
                'description' => 'Soft ambient lighting with natural fibers and handcrafted details for warm interiors.',
                'image' => '/images/producs/image_1.webp',
            ],
            [
                'name' => 'Local Honey 500g',
                'slug' => 'local-honey-500g',
                'category' => 'groceries',
                'price' => 96000,
                'stock' => 20,
                'description' => 'Pure forest honey from local beekeepers, naturally harvested and minimally filtered.',
                'image' => '/images/producs/image_1.webp',
            ],
            [
                'name' => 'Leather Sling Bag',
                'slug' => 'leather-sling-bag',
                'category' => 'fashion',
                'price' => 189000,
                'stock' => 12,
                'description' => 'A modern crossbody bag in genuine leather with a refined but practical finish.',
                'image' => '/images/producs/image_1.webp',
            ],
        ];

        foreach ($products as $item) {
            $category = $categoryMap[$item['category']];

            $product = Product::firstOrCreate(
                ['store_id' => $store->id, 'slug' => $item['slug']],
                [
                    'store_id' => $store->id,
                    'category_id' => $category->id,
                    'name' => $item['name'],
                    'slug' => $item['slug'],
                    'description' => $item['description'],
                    'price' => $item['price'],
                    'stock' => $item['stock'],
                    'status' => Product::STATUS_ACTIVE,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            );

            ProductImage::firstOrCreate(
                ['product_id' => $product->id, 'is_primary' => true],
                [
                    'product_id' => $product->id,
                    'image' => $item['image'],
                    'alt_text' => $item['name'],
                    'is_primary' => true,
                    'sort_order' => 0,
                    'created_at' => now(),
                ],
            );
        }

        $this->command->info('Marketplace demo data seeded for '.Product::count().' products across '.Category::count().' categories.');
    }
}
