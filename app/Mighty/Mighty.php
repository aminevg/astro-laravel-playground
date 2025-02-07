<?php

namespace App\Mighty;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class Mighty
{
    /**
     * @param  array<string, mixed>  $props
     */
    public static function render(string $component, array $props = []): string
    {
        return Http::post(
            'http://localhost:9999/__mighty__/'.$component,
            [
                'props' => $props,
                'csrfToken' => csrf_token(),
                'errors' => self::resolveValidationErrors(request()),
                'session' => session()->all(),
              ]
        );
    }

    public static function resolveValidationErrors(Request $request): object
    {
        if (! $request->hasSession()) {
            return (object) [];
        }

        if (! $errors = $request->session()->get('errors')) {
            return (object) [];
        }

        return (object) collect($errors->getBags())
            ->map(function ($bag) {
                return (object) collect($bag->messages())
                    ->map(fn ($errors) => $errors[0])
                    ->toArray();
            })
            ->pipe(function ($bags) {
                if ($bags->has('default')) {
                    return $bags->get('default');
                }

                return $bags->toArray();
            });
    }
}
