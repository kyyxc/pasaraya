<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete();
            $table->string('name', 200);
            $table->string('slug', 220);
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2);
            $table->unsignedInteger('stock')->default(0);
            $table->unsignedInteger('weight_grams')->nullable();
            $table->string('status', 20)->default('draft');
            $table->dateTime('created_at');
            $table->dateTime('updated_at');

            $table->unique(['store_id', 'slug']);
        });

        DB::statement('ALTER TABLE `products` ADD CONSTRAINT `chk_products_price_non_negative` CHECK (`price` >= 0)');
        DB::statement('ALTER TABLE `products` ADD CONSTRAINT `chk_products_stock_non_negative` CHECK (`stock` >= 0)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
