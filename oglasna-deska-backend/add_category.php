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
$category_name = $data['category_name'] ?? "";


if (empty($category_name)) {
    echo json_encode(["status" => "error", "message" => "Ime kategorije ne sme biti prazno."]);
    exit();
}

$stmt = $conn->prepare("SELECT category_id FROM category WHERE name = ?");
$stmt->bind_param("s", $category_name);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Kategorija že obstaja."]);
    exit();
}

// Vstavi novo kategorijo v bazo podatkov
$stmt = $conn->prepare("INSERT INTO category (name) VALUES (?)");
$stmt->bind_param("s", $category_name);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Kategorija je bila uspešno dodana."]);
} else {
    echo json_encode(["status" => "error", "message" => "Napaka pri dodajanju kategorije."]);
}

$stmt->close();
$conn->close();
?>
