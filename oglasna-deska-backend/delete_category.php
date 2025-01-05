<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

$host = "localhost";
$username = "root"; 
$password = ""; 
$database = "oglasnadeska"; 

$conn = new mysqli($host, $username, $password, $database);


if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Napaka pri povezavi z bazo: " . $conn->connect_error]));
}


$data = json_decode(file_get_contents("php://input"), true);
$category_id = $data['category_id'] ?? null;


if (empty($category_id)) {
    echo json_encode(["status" => "error", "message" => "ID kategorije ne sme biti prazen."]);
    exit();
}

// Preveri, ali kategorija obstaja
$stmt = $conn->prepare("SELECT category_id FROM category WHERE category_id = ?");
$stmt->bind_param("i", $category_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "Kategorija ne obstaja."]);
    exit();
}


$stmt = $conn->prepare("DELETE FROM category WHERE category_id = ?");
$stmt->bind_param("i", $category_id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Kategorija je bila uspešno izbrisana."]);
} else {
    echo json_encode(["status" => "error", "message" => "Napaka pri brisanju kategorije."]);
}


$stmt->close();
$conn->close();
?>
