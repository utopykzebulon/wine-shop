<?php
namespace App\Controllers;

class UploadController
{
    public function preflight()
    {
        // CORS pour OPTIONS
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        http_response_code(204);
        exit;
    }

    public function upload()
    {
        header("Access-Control-Allow-Origin: *");

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['ok' => false, 'error' => 'Méthode non autorisée']);
            return;
        }

        // ⚠️ le champ doit s’appeler "image" côté front
        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'Aucun fichier valide reçu (champ "image")']);
            return;
        }

        $file = $_FILES['image'];

        // Taille max 5 Mo
        if ($file['size'] > 5 * 1024 * 1024) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'Fichier trop volumineux (max 5 Mo)']);
            return;
        }

        // Dossier cible (sans "s")
        $uploadDir = __DIR__ . '/../../public/upload';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0775, true);

        // Détection type réel
        $type = @exif_imagetype($file['tmp_name']);
        $allowed = [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP, IMAGETYPE_GIF];
        if (!in_array($type, $allowed, true)) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'Format non autorisé']);
            return;
        }

        // Conversion → webp (nom unique)
        $name = uniqid('img_', true) . '.webp';
        $dest = $uploadDir . '/' . $name;

        switch ($type) {
            case IMAGETYPE_JPEG: $src = imagecreatefromjpeg($file['tmp_name']); break;
            case IMAGETYPE_PNG:
                $src = imagecreatefrompng($file['tmp_name']);
                imagepalettetotruecolor($src);
                imagealphablending($src, true);
                imagesavealpha($src, true);
                break;
            case IMAGETYPE_GIF:  $src = imagecreatefromgif($file['tmp_name']);  break;
            case IMAGETYPE_WEBP:
                // déjà webp → déplacement direct
                move_uploaded_file($file['tmp_name'], $dest);
                $src = null;
                break;
            default: $src = null;
        }

        if ($src) {
            imagewebp($src, $dest, 90);
            imagedestroy($src);
        }

        if (!file_exists($dest)) {
            http_response_code(500);
            echo json_encode(['ok' => false, 'error' => 'Erreur conversion WebP']);
            return;
        }

        // URL publique (→ /upload/)
        $baseUrl = sprintf(
            "%s://%s%s",
            (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http',
            $_SERVER['HTTP_HOST'],
            rtrim(dirname($_SERVER['SCRIPT_NAME']), '/')
        );

        $publicUrl = $baseUrl . '/upload/' . $name;

        echo json_encode(['ok' => true, 'url' => $publicUrl], JSON_UNESCAPED_SLASHES);
    }
}
