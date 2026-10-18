<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Automation extends Model
{
    use HasFactory;

    protected $fillable = [
        'workspace_id',
        'social_account_id',
        'name',
        'trigger_type',
        'status',
        'total_sent',
        'total_clicks',
        'total_leads',
        'settings',
    ];

    protected function casts(): array
    {
        return [
            'settings' => 'array',
            'total_sent' => 'integer',
            'total_clicks' => 'integer',
            'total_leads' => 'integer',
        ];
    }

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function socialAccount(): BelongsTo
    {
        return $this->belongsTo(SocialAccount::class);
    }

    public function triggers(): HasMany
    {
        return $this->hasMany(AutomationTrigger::class);
    }

    public function actions(): HasMany
    {
        return $this->hasMany(AutomationAction::class)->orderBy('order_index');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(AutomationLog::class)->latest();
    }
}
