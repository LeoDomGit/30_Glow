<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Gallery extends Model
{
    use HasFactory;

    protected $table = 'gallery';

    protected $primaryKey = "id";

    protected $fillable = [
        'image',
        'id_parent',
        'status',
        'created_at',
        'updated_at',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Products::class, 'id_parent', 'id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    public function scopeFindParent($query, $parent)
    {
        return $query->where('id_parent', $parent);
    }
}
