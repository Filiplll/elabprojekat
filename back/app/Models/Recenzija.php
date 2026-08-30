<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recenzija extends Model
{
    use HasFactory;

    protected $table = 'recenzije';

    protected $fillable = ['rezervacija_id', 'igrac_id', 'ocena', 'komentar', 'status'];

    protected $casts = [
        'ocena' => 'integer',
    ];

    public function rezervacija()
    {
        return $this->belongsTo(Rezervacija::class, 'rezervacija_id');
    }

    public function igrac()
    {
        return $this->belongsTo(User::class, 'igrac_id');
    }

    public function scopeOdobrene($query)
    {
        return $query->where('status', 'odobrena');
    }

    public function pripada(?User $user): bool
    {
        return $user !== null && $this->igrac_id === $user->id;
    }

    public function getOcenaPrikazAttribute(): string
    {
        return str_repeat('★', $this->ocena) . str_repeat('☆', 5 - $this->ocena);
    }
}
