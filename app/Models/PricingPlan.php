<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PricingPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'price_monthly',
        'price_annual',
        'description',
        'features',
        'is_popular',
        'is_active',
        'order_index',
        'cta_text',
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'is_popular' => 'boolean',
            'is_active' => 'boolean',
            'price_monthly' => 'integer',
            'price_annual' => 'integer',
            'order_index' => 'integer',
        ];
    }
}
