<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rezervacija extends Model
{
    use HasFactory;

    protected $table = 'rezervacije';

    protected $fillable = [
        'teren_id',
        'igrac_id',
        'datum',
        'vreme_od',
        'vreme_do',
        'cena_ukupno',
        'status',
    ];

    protected $casts = [
        'datum' => 'date',
        'cena_ukupno' => 'decimal:2',
    ];

    public function teren()
    {
        return $this->belongsTo(Teren::class, 'teren_id');
    }

    public function igrac()
    {
        return $this->belongsTo(User::class, 'igrac_id');
    }

    public function javniPoziv()
    {
        return $this->hasOne(JavniPoziv::class, 'rezervacija_id');
    }

    public function recenzije()
    {
        return $this->hasMany(Recenzija::class, 'rezervacija_id');
    }

    public function scopeNeotkazane($query)
    {
        return $query->where('status', '!=', 'otkazana');
    }

    public function scopeProsle($query)
    {
        $danas = now()->format('Y-m-d');
        $sada = now()->format('H:i:s');

        return $query->where(fn ($q) => $q->where('datum', '<', $danas)
            ->orWhere(fn ($w) => $w->where('datum', $danas)->where('vreme_do', '<=', $sada)));
    }

    public function pripada(?User $user): bool
    {
        return $user !== null && $this->igrac_id === $user->id;
    }

    public function naTerenuVlasnika(?User $user): bool
    {
        return $user !== null && $this->teren?->vlasnik_id === $user->id;
    }

    public function pocetak(): Carbon
    {
        return Carbon::parse($this->datum->format('Y-m-d') . ' ' . $this->vreme_od);
    }

    public function kraj(): Carbon
    {
        return Carbon::parse($this->datum->format('Y-m-d') . ' ' . $this->vreme_do);
    }

    public function getTrajanjeUMinutimaAttribute(): int
    {
        return (int) $this->pocetak()->diffInMinutes($this->kraj());
    }

    public function getTrajanjeAttribute(): string
    {
        $minuta = $this->trajanje_u_minutima;
        $sati = intdiv($minuta, 60);
        $ostatak = $minuta % 60;

        return $ostatak === 0 ? "{$sati}h" : "{$sati}h {$ostatak}min";
    }

    public function getTerminAttribute(): string
    {
        return $this->datum->format('d.m.Y.') . ' ' . substr((string) $this->vreme_od, 0, 5) . ' - ' . substr((string) $this->vreme_do, 0, 5);
    }

    public function getFormatiranaCenaAttribute(): string
    {
        return number_format($this->cena_ukupno, 2, ',', '.') . ' RSD';
    }

    public function getNazivDanaAttribute(): string
    {
        return RadnoVreme::nazivDana($this->datum->dayOfWeekIso - 1);
    }

    public function isOtkazana(): bool
    {
        return $this->status === 'otkazana';
    }

    public function isOdigrana(): bool
    {
        return $this->status === 'odigrana';
    }

    public function jePocela(): bool
    {
        return $this->pocetak()->isPast();
    }

    public function jeUcesnik(?User $user): bool
    {
        if ($user === null) {
            return false;
        }

        if ($this->igrac_id === $user->id) {
            return true;
        }

        return PozivUcesnik::where('igrac_id', $user->id)
            ->prijavljeni()
            ->whereHas('poziv', fn ($q) => $q->where('rezervacija_id', $this->id))
            ->exists();
    }

    public function imaJavniPoziv(): bool
    {
        return $this->relationLoaded('javniPoziv')
            ? $this->javniPoziv !== null
            : $this->javniPoziv()->exists();
    }

    public function recenzijaOd(?User $user): ?Recenzija
    {
        if ($user === null) {
            return null;
        }

        return $this->relationLoaded('recenzije')
            ? $this->recenzije->firstWhere('igrac_id', $user->id)
            : $this->recenzije()->where('igrac_id', $user->id)->first();
    }

    public function mozeSeMenjati(): bool
    {
        return ! $this->isOtkazana() && ! $this->isOdigrana() && ! $this->jePocela();
    }
}
