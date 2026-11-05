<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable([
    'email',
    'password',
    'first_name',
    'last_name',
    'google_id',
    'avatar',
    'phone',
    'role',
    'is_active',
    'is_staff',
    'date_joined',
    'updated_at',
])]
#[Hidden(['password'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    public const ROLE_BUYER = 'buyer';

    public const ROLE_SELLER = 'seller';

    public const ROLE_ADMIN = 'admin';

    public const CREATED_AT = 'date_joined';

    public const UPDATED_AT = 'updated_at';

    /**
     * The table associated with the model.
     */
    protected $table = 'users';

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_staff' => 'boolean',
            'date_joined' => 'datetime',
            'updated_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected function setEmailAttribute(string $value): void
    {
        $this->attributes['email'] = mb_strtolower(trim($value));
    }

    protected function setRoleAttribute(string $value): void
    {
        $this->attributes['role'] = strtolower(trim($value));
    }

    /**
     * @return array<int, string>
     */
    public static function roles(): array
    {
        return [
            self::ROLE_BUYER,
            self::ROLE_SELLER,
            self::ROLE_ADMIN,
        ];
    }
}
