<?php
use App\Controllers\WineController;
use App\Controllers\AlcoholController;
use App\Controllers\ProductController;
use App\Controllers\UploadController;

return [
    // Wines
    'GET /wines'    => [WineController::class, 'index'],
    'POST /wines'   => [WineController::class, 'create'],
    'PUT /wines'    => [WineController::class, 'update'],
    'DELETE /wines' => [WineController::class, 'delete'],

    // Alcohols
    'GET /alcohols'    => [AlcoholController::class, 'index'],
    'POST /alcohols'   => [AlcoholController::class, 'create'],
    'PUT /alcohols'    => [AlcoholController::class, 'update'],
    'DELETE /alcohols' => [AlcoholController::class, 'delete'],

    // Products
    'GET /products'    => [ProductController::class, 'index'],
    'POST /products'   => [ProductController::class, 'create'],
    'PUT /products'    => [ProductController::class, 'update'],
    'DELETE /products' => [ProductController::class, 'delete'],

    // Upload (⚠️ sans "s")
    'POST /api/upload'    => [UploadController::class, 'upload'],
    'OPTIONS /api/upload' => [UploadController::class, 'preflight'],
];
