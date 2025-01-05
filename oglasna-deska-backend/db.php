<?php
$host = 'localhost'; 
$dbname = 'oglasnadeska'; 
$username = 'root'; 
$password = ''; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Napaka pri povezovanju z bazo: " . $e->getMessage();
    exit;
}
?>
