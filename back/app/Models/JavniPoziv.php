<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JavniPoziv extends Model
{
    use HasFactory;

    protected $table = 'javni_pozivi';

    protected $fillable = ['rezervacija_id', 'broj_slobodnih_mesta', 'opis', 'aktivan'];

    protected $casts = [
        'broj_slobodnih_mesta' => 'integer',
        'aktivan' => 'boolean',
    ];

    public function rezervacija()
    {
        return $this->belongsTo(Rezervacija::class, 'rezervacija_id');
    }

    public function ucesnici()
    {
        return $this->hasMany(PozivUcesnik::class, 'poziv_id');
    }

    public function igraci()
    {
        return $this->belongsToMany(User::class, 'poziv_ucesnici', 'poziv_id', 'igrac_id')
            ->withPivot('status')
            ->withTimestamps();
    }

    public function scopeAktivni($query)
    {
        return $query->where('aktivan', true);
    }

    public function scopePredstojeci($query)
    {
        return $query->whereHas('rezervacija', fn ($q) => $q->neotkazane()->whereNot(fn ($w) => $w->prosle()));
    }

    public function pripada(?User $user): bool
    {
        return $user !== null && $this->rezervacija?->igrac_id === $user->id;
    }

    public function getBrojPrijavljenihAttribute(): int
    {
        return $this->relationLoaded('ucesnici')
            ? $this->ucesnici->where('status', 'prijavljen')->count()
            : $this->ucesnici()->prijavljeni()->count();
    }

    public function getSlobodnoMestaAttribute(): int
    {
        return max(0, $this->broj_slobodnih_mesta - $this->broj_prijavljenih);
    }

    public function jeOtvoren(): bool
    {
        return $this->aktivan
            && $this->rezervacija !== null
            && ! $this->rezervacija->isOtkazana()
            && ! $this->rezervacija->jePocela();
    }
}
