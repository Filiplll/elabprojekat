<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TerenFactory extends Factory
{
    public function definition(): array
    {
        return [
            'vlasnik_id' => User::factory()->vlasnik(),
            'naziv' => fake()->company() . ' teren',
            'grad' => fake()->city(),
            'adresa' => fake()->streetAddress(),
            'cena_po_satu' => fake()->numberBetween(1000, 3000),
            'natkriven' => fake()->boolean(),
            'aktivan' => true,
            'opis' => fake()->sentence(),
        ];
    }

    public function neaktivan(): static
    {
        return $this->state(fn (array $attributes) => [
            'aktivan' => false,
        ]);
    }
}
