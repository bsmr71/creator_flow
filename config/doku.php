<?php

return [
    /*
    |--------------------------------------------------------------------------
    | DOKU Payment Gateway Credentials & Config
    |--------------------------------------------------------------------------
    |
    | DOKU is Indonesia's licensed payment gateway provider.
    | Obtain your Client ID and Secret Key from the DOKU Back Office (Jokul).
    |
    */

    'client_id' => env('DOKU_CLIENT_ID', 'DOKU-SANDBOX-CLIENT-ID'),
    'secret_key' => env('DOKU_SECRET_KEY', 'DOKU-SANDBOX-SECRET-KEY'),
    'environment' => env('DOKU_ENV', 'sandbox'), // sandbox | production

    'api_base_url' => env('DOKU_ENV', 'sandbox') === 'production'
        ? 'https://api.doku.com'
        : 'https://api-sandbox.doku.com',

    'checkout_path' => '/checkout/v1/payment',

    'notification_url' => env('DOKU_NOTIFICATION_URL', env('APP_URL').'/api/webhooks/doku'),
];
