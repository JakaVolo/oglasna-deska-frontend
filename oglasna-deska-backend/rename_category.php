<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
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
$old_name = $data['old_name'] ?? null;
$new_name = $data['new_name'] ?? null;

if (empty($old_name) || empty($new_name)) {
    echo json_encode(["status" => "error", "message" => "Staro in novo ime kategorije morata biti posredovana."]);
    exit();
}

$stmt = $conn->prepare("SELECT category_id FROM category WHERE name = ?");
$stmt->bind_param("s", $old_name);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "Kategorija z imenom '$old_name' ne obstaja."]);
    exit();
}

$stmt = $conn->prepare("UPDATE category SET name = ? WHERE name = ?");
$stmt->bind_param("ss", $new_name, $old_name);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Kategorija je bila uspešno preimenovana."]);
} else {
    echo json_encode(["status" => "error", "message" => "Napaka pri preimenovanju kategorije."]);
}

$stmt->close();
$conn->close();
?>
