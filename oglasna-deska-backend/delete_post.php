<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

try {
    $pdo = new PDO("mysql:host=localhost;dbname=oglasnadeska;charset=utf8", "root", "");
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['post_id']) || !isset($data['user_id']) || !isset($data['role'])) {
        echo json_encode([
            "status" => "error",
            "message" => "Manjkajoči podatki (post_id, user_id ali role)."
        ]);
        exit;
    }

    $postId = $data['post_id'];
    $userId = $data['user_id'];
    $role = $data['role'];

    // Preveri, ali je uporabnik avtor objave ali administrator
    $stmt = $pdo->prepare("SELECT user_id FROM post WHERE post_id = :id");
    $stmt->execute(['id' => $postId]);
    $post = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$post) {
        echo json_encode([
            "status" => "error",
            "message" => "Objava ne obstaja."
        ]);
        exit;
    }

    if ($role !== 'moderator' && $post['user_id'] != $userId) {
        echo json_encode([
            "status" => "error",
            "message" => "Nimate dovoljenja za brisanje te objave."
        ]);
        exit;
    }

    // Izbriši objavo
    $stmt = $pdo->prepare("DELETE FROM post WHERE post_id = :id");
    $stmt->execute(['id' => $postId]);

    echo json_encode([
        "status" => "success",
        "message" => "Objava uspešno izbrisana."
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Napaka pri brisanju objave: " . $e->getMessage()
    ]);
}
?>
