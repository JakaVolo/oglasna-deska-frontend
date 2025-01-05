<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);


header("Access-Control-Allow-Origin: http://localhost:3000"); 
header("Access-Control-Allow-Methods: POST, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type"); 
header("Access-Control-Allow-Credentials: true"); 
header("Content-Type: application/json"); 


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

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['username'], $data['password'], $data['email'])) {
    http_response_code(400); 
    echo json_encode(["status" => "error", "message" => "Manjkajo podatki za registracijo."]);
    exit;
}

$username = trim($data['username']);
$password = trim($data['password']);
$email = trim($data['email']);

// Preverjanje, ali uporabnik že obstaja
try {
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM user WHERE username = :username OR email = :email");
    $stmt->execute(['username' => $username, 'email' => $email]);
    $userExists = $stmt->fetchColumn();

    if ($userExists) {
        http_response_code(409); 
        echo json_encode(["status" => "error", "message" => "Uporabnik z istim imenom ali e-pošto že obstaja."]);
        exit;
    }

    // Ustvarjanje hash-a gesla
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    // Vstavljanje novega uporabnika
    $stmt = $pdo->prepare("INSERT INTO user (username, password, email, role) VALUES (:username, :password, :email, 'user')");
    $stmt->execute([
        'username' => $username,
        'password' => $passwordHash,
        'email' => $email,
    ]);

    
    http_response_code(201); 
    echo json_encode(["status" => "success", "message" => "Registracija uspešna."]);
} catch (PDOException $e) {
    http_response_code(500); 
    echo json_encode(["status" => "error", "message" => "Napaka pri registraciji: " . $e->getMessage()]);
    exit;
}
?>
