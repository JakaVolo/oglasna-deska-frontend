<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

session_start(); 


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); 
    echo json_encode(["status" => "error", "message" => "Dovoljena je samo POST zahteva."]);
    exit;
}


$host = 'localhost';
$dbname = 'oglasnadeska';
$user = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Napaka pri povezavi z bazo: " . $e->getMessage()]);
    exit;
}

// Preberemo podatke iz POST zahteve
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['username'], $data['password'], $data['email'])) {
    http_response_code(400); 
    echo json_encode(["status" => "error", "message" => "Manjkajo podatki za prijavo."]);
    exit;
}

$username = trim($data['username']);
$password = trim($data['password']);
$email = trim($data['email']);

// Preverjanje uporabnika v bazi
try {
    $stmt = $pdo->prepare("SELECT user_id, username, role, password FROM user WHERE username = :username AND email = :email");
    $stmt->execute(['username' => $username, 'email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        unset($user['password']); // Odstranimo geslo iz odziva
        $_SESSION['user_id'] = $user['user_id']; // Shranimo uporabnikov ID v sejo
        $_SESSION['role'] = $user['role']; // Shranimo uporabnikovo vlogo v sejo
        echo json_encode([
            "status" => "success",
            "message" => "Prijava uspešna.",
            "user" => [
                "user_id" => $user['user_id'],
                "username" => $user['username'],
                "role" => $user['role']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Napačno uporabniško ime, geslo ali e-pošta."]);
    }
} catch (PDOException $e) {
    http_response_code(500); 
    echo json_encode(["status" => "error", "message" => "Napaka pri prijavi: " . $e->getMessage()]);
    exit;
}

