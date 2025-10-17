<?php
// ------------------------------
// CORS (avant toute sortie !)
// ------------------------------
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Expose-Headers: Content-Length, Content-Range");
header("Vary: Origin");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // no content
    exit;
}

header("Content-Type: application/json; charset=utf-8");

// Util
function send_json($data, int $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// Routes
$routes = require __DIR__ . '/../config/routes.php';

// Autoload
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $base_dir = __DIR__ . '/../app/';
    if (strncmp($prefix, $class, strlen($prefix)) !== 0) return;
    $relative = substr($class, strlen($prefix));
    $file = $base_dir . str_replace('\\', '/', $relative) . '.php';
    if (file_exists($file)) require $file;
});

// Router
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$baseDir = '/wine-shop/backend/public';
if (str_starts_with($uri, $baseDir)) $uri = substr($uri, strlen($baseDir));
if ($uri === '') $uri = '/';

$path = $method . ' ' . $uri;

if (isset($routes[$path])) {
    [$class, $action] = $routes[$path];
    if (!class_exists($class)) send_json(['error' => "Classe $class introuvable"], 500);
    $controller = new $class();
    if (!method_exists($controller, $action)) send_json(['error' => "Méthode $action introuvable"], 500);
    $controller->$action();
    exit;
}

send_json(['error' => 'Not Found', 'path' => $path], 404);
