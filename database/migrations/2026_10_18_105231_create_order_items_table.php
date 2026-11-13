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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->string('product_name', 200);
            $table->decimal('unit_price', 12, 2);
            $table->unsignedInteger('quantity');
            $table->decimal('subtotal', 12, 2);
            $table->dateTime('created_at');
            $table->dateTime('updated_at');

            $table->index(['order_id', 'product_id']);
        });

        DB::statement('ALTER TABLE "order_items" ADD CONSTRAINT "chk_order_items_quantity_minimum" CHECK ("quantity" >= 1)');
        DB::statement('ALTER TABLE "order_items" ADD CONSTRAINT "chk_order_items_unit_price_non_negative" CHECK ("unit_price" >= 0)');
        DB::statement('ALTER TABLE "order_items" ADD CONSTRAINT "chk_order_items_subtotal_non_negative" CHECK ("subtotal" >= 0)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
