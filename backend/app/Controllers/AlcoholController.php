<?php
namespace App\Controllers;
use App\Models\Alcohol;

class AlcoholController {
    public function index() {
        header('Content-Type: application/json');
        echo json_encode(['ok' => true, 'alcohols' => Alcohol::getAll()]);
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

            $alcohol = new Alcohol($data);
            $alcohol->save();

            echo json_encode(['ok' => true]);
        } catch (\Throwable $e) {
            http_response_code(500);
            echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
        }
    }

    public function update() {
        header('Content-Type: application/json; charset=utf-8');

        try {
            $data = json_decode(file_get_contents("php://input"), true);
            if (!isset($data['id'])) {
                http_response_code(400);
                echo json_encode(['ok' => false, 'error' => 'ID manquant']);
                return;
            }

            $alcohol = new Alcohol($data);
            $alcohol->update();

            echo json_encode(['ok' => true]);
        } catch (\Throwable $e) {
            http_response_code(500);
            echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
        }
    }

    public function delete() {
        header('Content-Type: application/json; charset=utf-8');

        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['id'])) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'ID manquant']);
            return;
        }
        Alcohol::deleteById($data['id']);
        echo json_encode(['ok' => true]);
    }
}
