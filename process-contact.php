<?php
// 1. Cấu hình hiển thị lỗi ẩn (không cho xuất ra HTML làm hỏng JSON)
error_reporting(0);
ini_set('display_errors', 0);

// 2. Khai báo Header trả về định dạng JSON bắt buộc
header('Content-Type: application/json; charset=utf-8');

// 3. Nhúng file kết nối database
require_once 'db.php';

// 4. Kiểm tra phương thức gửi dữ liệu
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "status" => "error", 
        "message" => "Phương thức truy cập không hợp lệ!"
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// 5. Lấy dữ liệu an toàn từ Form gửi lên
$fullname = isset($_POST['fullname']) ? trim($_POST['fullname']) : '';
$email    = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone    = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$subject  = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message  = isset($_POST['message']) ? trim($_POST['message']) : '';

// 6. Kiểm tra điều kiện bắt buộc
if (empty($fullname) || empty($email) || empty($message)) {
    echo json_encode([
        "status" => "error", 
        "message" => "Vui lòng điền đầy đủ các trường bắt buộc (*)"
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// 7. Chèn dữ liệu vào bảng 'contacts' trong database webcobank24
$sql = "INSERT INTO contacts (fullname, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if ($stmt) {
    $stmt->bind_param("sssss", $fullname, $email, $phone, $subject, $message);
    
    if ($stmt->execute()) {
        echo json_encode([
            "status" => "success", 
            "message" => "🎉 Cảm ơn bạn! Thông tin liên hệ đã được gửi đến ban quản trị Đại Ngàn thành công."
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode([
            "status" => "error", 
            "message" => "Lỗi lưu dữ liệu: " . $stmt->error
        ], JSON_UNESCAPED_UNICODE);
    }
    $stmt->close();
} else {
    echo json_encode([
        "status" => "error", 
        "message" => "Lỗi chuẩn bị câu lệnh SQL: " . $conn->error
    ], JSON_UNESCAPED_UNICODE);
}

$conn->close();
?>