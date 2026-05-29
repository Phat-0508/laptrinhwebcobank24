<?php
$host = "localhost";
$username = "root";
$password = "";
$dbname = "webcobank24"; 

// Khởi tạo kết nối
$conn = new mysqli($host, $username, $password, $dbname);

$conn->set_charset("utf8mb4");

// Kiểm tra kết nối
if ($conn->connect_error) {
    die("Kết nối cơ sở dữ liệu thất bại: " . $conn->connect_error);
}
?>