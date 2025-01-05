<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");

try {
    $pdo = new PDO("mysql:host=localhost;dbname=oglasnadeska;charset=utf8", "root", "");
    $stmt = $pdo->query("SELECT category_id, name FROM category");
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "categories" => $categories
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Napaka pri pridobivanju kategorij: " . $e->getMessage()
    ]);
}
?>
