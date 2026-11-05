<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_access_buyer_pages(): void
    {
        $response = $this->get(route('home'));

        $response->assertOk();
    }

    public function test_admin_is_redirected_away_from_buyer_pages(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin);

        $this->get(route('home'))
            ->assertRedirect(route('admin.dashboard'));
    }

    public function test_seller_is_redirected_away_from_buyer_pages(): void
    {
        $seller = User::factory()->seller()->create();

        $this->actingAs($seller);

        $this->get(route('home'))
            ->assertRedirect(route('seller.dashboard'));
    }

    public function test_admin_login_redirects_to_admin_dashboard(): void
    {
        $admin = User::factory()->admin()->create([
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);

        $this->from('/login')->post(route('login.store'), [
            'email' => $admin->email,
            'password' => 'password',
        ])
            ->assertRedirect(route('admin.dashboard'));
    }
}
