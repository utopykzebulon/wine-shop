<?php
namespace App\Core;

use PDO;
use PDOException;

class Database {
    private static $pdo;

    public static function getInstance() {
        if (!self::$pdo) {
            $dsn = "mysql:host=localhost;dbname=epicerie_du_coin;charset=utf8mb4";
            $user = "root";
            $pass = "root";
            try {
                self::$pdo = new PDO($dsn, $user, $pass, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]);
            } catch (PDOException $e) {
                die("Erreur DB: " . $e->getMessage());
            }
        }
        return self::$pdo;
    }
}
