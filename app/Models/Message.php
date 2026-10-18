<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'conversation_id',
        'direction',
        'sender_type',
        'content',
        'media_url',
        'buttons_payload',
        'is_read',
        'sent_at',
    ];

    protected function casts(): array
    {
        return [
            'buttons_payload' => 'array',
            'is_read' => 'boolean',
            'sent_at' => 'datetime',
        ];
    }

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }
}
