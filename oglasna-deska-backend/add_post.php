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


if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Uporabnik ni prijavljen."]);
    exit;
}

$user_id = $_SESSION['user_id'];


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

if (!isset($data['title'], $data['content'], $data['location'], $data['category_id'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Manjkajo podatki za oglas."]);
    exit;
}

$title = trim($data['title']);
$content = trim($data['content']);
$location = trim($data['location']);
$category_id = intval($data['category_id']);


try {
    $stmt = $pdo->prepare("INSERT INTO Post (title, content, location, date_time, user_id, category_id) 
                           VALUES (:title, :content, :location, NOW(), :user_id, :category_id)");
    $stmt->execute([
        'title' => $title,
        'content' => $content,
        'location' => $location,
        'user_id' => $user_id,
        'category_id' => $category_id,
    ]);

    echo json_encode(["status" => "success", "message" => "Oglas uspešno dodan.", "post" => $data]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Napaka pri dodajanju oglasa: " . $e->getMessage()]);
}
?>
