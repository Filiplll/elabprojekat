<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teren extends Model
{
    use HasFactory;

    protected $table = 'tereni';

    protected $fillable = [
        'vlasnik_id',
        'naziv',
        'grad',
        'adresa',
        'cena_po_satu',
        'natkriven',
        'aktivan',
        'opis',
    ];

    protected $casts = [
        'cena_po_satu' => 'decimal:2',
        'natkriven' => 'boolean',
        'aktivan' => 'boolean',
    ];

    public function vlasnik()
    {
        return $this->belongsTo(User::class, 'vlasnik_id');
    }

    public function sportovi()
    {
        return $this->belongsToMany(Sport::class, 'teren_sport', 'teren_id', 'sport_id')
            ->withTimestamps();
    }

    public function radnoVreme()
    {
        return $this->hasMany(RadnoVreme::class, 'teren_id')->orderBy('dan_u_nedelji');
    }

    public function rezervacije()
    {
        return $this->hasMany(Rezervacija::class, 'teren_id');
    }

    public function recenzije()
    {
        return $this->hasManyThrough(Recenzija::class, Rezervacija::class, 'teren_id', 'rezervacija_id');
    }

    public function pripada(?User $user): bool
    {
        return $user !== null && $user->isVlasnik() && $this->vlasnik_id === $user->id;
    }

    public function scopeAktivni($query)
    {
        return $query->where('aktivan', true);
    }

    public function getFormatiranaCenaAttribute(): string
    {
        return number_format($this->cena_po_satu, 2, ',', '.') . ' RSD';
    }
}
