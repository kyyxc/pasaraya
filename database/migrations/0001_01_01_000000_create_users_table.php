<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('email', 254)->unique();
            $table->string('password', 128);
            $table->string('first_name', 150);
            $table->string('last_name', 150);
            $table->string('phone', 20)->nullable();
            $table->string('role', 20)->default('buyer');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_staff')->default(false);
            $table->dateTime('date_joined');
            $table->dateTime('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
