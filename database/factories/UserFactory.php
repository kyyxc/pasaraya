<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'password' => static::$password ??= Hash::make('password'),
            'phone' => fake()->optional()->phoneNumber(),
            'role' => User::ROLE_BUYER,
            'is_active' => true,
            'is_staff' => false,
            'date_joined' => now(),
            'updated_at' => now(),
        ];
    }

    public function buyer(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => User::ROLE_BUYER,
        ]);
    }

    public function seller(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => User::ROLE_SELLER,
        ]);
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => User::ROLE_ADMIN,
            'is_staff' => true,
        ]);
    }
}
