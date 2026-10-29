<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'test@example.com',
            'role' => User::ROLE_BUYER,
            'is_active' => true,
            'is_staff' => false,
            'date_joined' => now(),
            'updated_at' => now(),
        ]);

        $this->call(MarketplaceSeeder::class);
    }
}
