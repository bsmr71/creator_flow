<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AutomationAction extends Model
{
    use HasFactory;

    protected $fillable = [
        'automation_id',
        'action_type',
        'message_body',
        'buttons',
        'quick_replies',
        'delay_seconds',
        'order_index',
    ];

    protected function casts(): array
    {
        return [
            'buttons' => 'array',
            'quick_replies' => 'array',
            'delay_seconds' => 'integer',
            'order_index' => 'integer',
        ];
    }

    public function automation(): BelongsTo
    {
        return $this->belongsTo(Automation::class);
    }
}
