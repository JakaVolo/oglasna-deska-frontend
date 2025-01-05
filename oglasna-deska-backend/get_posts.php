<?php

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400'); 


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); 
    exit;
}

include 'db.php';
header('Content-Type: application/json');

// Funkcija za pridobivanje objav
function getPosts() {
    global $pdo;
    try {
        
        $stmt = $pdo->prepare("SELECT Post.*, User.username, Category.name AS category_name 
                               FROM Post 
                               JOIN User ON Post.user_id = User.user_id 
                               JOIN Category ON Post.category_id = Category.category_id 
                               ORDER BY Post.date_time DESC");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        error_log("Napaka pri pridobivanju objav: " . $e->getMessage());
        return [];
    }
}


$posts = getPosts();
echo json_encode($posts);
?>
