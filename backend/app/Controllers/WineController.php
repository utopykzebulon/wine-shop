<?php
namespace App\Controllers;
use App\Models\Wine;

class WineController {
    public function index() {
        header('Content-Type: application/json');
        echo json_encode(['ok' => true, 'wines' => Wine::getAll()]);
    }

public function create() {
    header('Content-Type: application/json; charset=utf-8');

    try {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || !isset($data['name'])) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'Champs manquants']);
            return;
        }

        $wine = new Wine($data);
        $wine->save();

        echo json_encode(['ok' => true]);
    } catch (\Throwable $e) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
    }
}



    public function update() {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'ID manquant']);
            return;
        }
        $wine = new Wine($data);
        $wine->update();
        echo json_encode(['ok' => true]);
    }

    public function delete() {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'ID manquant']);
            return;
        }
        Wine::deleteById($data['id']);
        echo json_encode(['ok' => true]);
    }
}
