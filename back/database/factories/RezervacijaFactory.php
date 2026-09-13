<?php

namespace Database\Factories;

use App\Models\Teren;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class RezervacijaFactory extends Factory
{
    public function definition(): array
    {
        return [
            'teren_id' => Teren::factory(),
            'igrac_id' => User::factory(),
            'datum' => fake()->dateTimeBetween('+1 day', '+1 month')->format('Y-m-d'),
            'vreme_od' => '10:00',
            'vreme_do' => '11:00',
            'cena_ukupno' => 2000,
            'status' => 'na_cekanju',
        ];
    }

    public function potvrdjena(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'potvrdjena',
        ]);
    }

    public function otkazana(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'otkazana',
        ]);
    }

    public function odigrana(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'odigrana',
            'datum' => fake()->dateTimeBetween('-1 month', '-1 day')->format('Y-m-d'),
        ]);
    }
}
