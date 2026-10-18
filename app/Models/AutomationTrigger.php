<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AutomationTrigger extends Model
{
    use HasFactory;

    protected $fillable = [
        'automation_id',
        'trigger_type',
        'keywords',
        'match_type',
        'post_id',
        'post_url',
        'post_media_url',
        'conditions',
    ];

    protected function casts(): array
    {
        return [
            'keywords' => 'array',
            'conditions' => 'array',
        ];
    }

    public function automation(): BelongsTo
    {
        return $this->belongsTo(Automation::class);
    }
}
