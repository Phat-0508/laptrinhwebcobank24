/**
 * ĐẠI NGÀN HOMESTAY - CORE JAVASCRIPT (PHIÊN BẢN TỔNG HỢP NÂNG CẤP)
 */

// =========================================================================
// 1. NAVBAR HỮU HIỆU: Trong suốt trên Hero, đổi màu xanh Đại Ngàn khi cuộn
// =========================================================================
const nav = document.querySelector('.navbar');
function updateNav() {
  if (window.scrollY > 80) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}
if (nav) {
  window.addEventListener('scroll', updateNav);
  updateNav(); // Chạy ngay khi tải trang đề phòng người dùng reload ở giữa trang
}

// =========================================================================
// 2. SCROLL ANIMATION: Hiệu ứng fade-up trượt hiện hình khi cuộn chuột tới
// =========================================================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // Hiện xong thì ngừng theo dõi để tối ưu hiệu năng
    }
  });
}, { threshold: 0.12 });

const animatedEls = document.querySelectorAll(
  '.room-item, .activity-card, .highlight-item, .room-detail-card, .contact-info, .contact-wrapper .contact-form'
);
animatedEls.forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// =========================================================================
// 3. SMOOTH SCROLL: Cuộn trang mượt mà khi bấm nút khám phá ở trang chủ
// =========================================================================
const exploreBtn = document.getElementById('exploreBtn');
if (exploreBtn) {
  exploreBtn.addEventListener('click', () => {
    const target = document.getElementById('intro') || document.querySelector('.intro-section');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// =========================================================================
// 4. ACTIVE NAV LINK: Tự động tô màu vàng ô Menu theo trang hiện tại
// =========================================================================
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.style.color = 'var(--amber-gold)';
  }
});

// =========================================================================
// 5. NÚT ĐĂNG KÝ TRẢI NGHIỆM: Chuyển trang & Truyền dữ liệu (Dùng cho act.html)
// =========================================================================
function redirectToContact(subjectValue, messageValue) {
  // Mã hóa ký tự tiếng Việt có dấu để đưa lên thanh URL an toàn
  const encodedSubject = encodeURIComponent(subjectValue);
  const encodedMessage = encodeURIComponent(messageValue);
  
  // Chuyển hướng sang trang contact.html kèm tham số
  window.location.href = `contact.html?subject=${encodedSubject}&message=${encodedMessage}`;
}

// Xử lý nút "Nhận tư vấn" ở khung nhận Combo cuối trang act.html
document.addEventListener('DOMContentLoaded', () => {
  const consultBtn = document.getElementById('consultBtn');
  const feedback = document.getElementById('formFeedback');
  
  if (consultBtn && feedback) {
    consultBtn.addEventListener('click', function() {
      const email = document.getElementById('contactEmail').value.trim();
      const phone = document.getElementById('contactPhone').value.trim();
      
      if (!email && !phone) {
        feedback.textContent = '⚠️ Vui lòng nhập email hoặc số điện thoại để nhận tư vấn.';
        return;
      }
      
      const comboMsg = `Tôi muốn nhận tư vấn gói combo tích hợp nhiều hoạt động. Email: ${email || 'Trống'}, SĐT: ${phone || 'Trống'}.`;
      redirectToContact('Hoạt động cắm trại, câu cá', comboMsg);
    });
  }
});

// =========================================================================
// 6. TỰ ĐỘNG ĐIỀN FORM & GỬI FORM NGẦM (Dùng cho contact.html)
// =========================================================================
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const subjectParam = urlParams.get('subject');
  const messageParam = urlParams.get('message');
  
  // Điền chủ đề tự động vào thẻ select
  if (subjectParam) {
    const subjectSelect = document.getElementById('subject');
    if (subjectSelect) {
      for (let option of subjectSelect.options) {
        if (option.value.includes(subjectParam) || subjectParam.includes(option.value)) {
          option.selected = true;
          break;
        }
      }
    }
  }
  
  // Điền lời nhắn tự động vào ô textarea
  if (messageParam) {
    const messageTextArea = document.getElementById('message');
    if (messageTextArea) {
      messageTextArea.value = messageParam;
    }
  }
});

// Hàm xử lý gửi ngầm form liên hệ lên file PHP bằng AJAX (Fetch API)
function handleSubmit(e) {
  e.preventDefault(); // Ngăn hành động tải lại trang làm gián đoạn trải nghiệm
  
  const form = e.target;
  const button = form.querySelector('button[type=submit]');
  const formData = new FormData(form);
  
  // Khóa nút bấm, tạo hiệu ứng xoay loading chờ server xử lý dữ liệu
  button.disabled = true;
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi dữ liệu...';
  
  fetch('process-contact.php', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Máy chủ phản hồi lỗi HTTP: ' + response.status);
    }
    return response.text(); // Đọc dạng chuỗi để bắt được cả lỗi cú pháp từ file PHP nếu có
  })
  .then(text => {
    try {
      const data = JSON.parse(text);
      
      if (data.status === 'success') {
        form.reset(); // Xóa sạch dữ liệu vừa nhập thành công
        alert("🎉 Cảm ơn bạn! Thông tin liên hệ đã được gửi đến ban quản trị.");
      } else {
        alert("⚠️ Thất bại:\n" + data.message);
      }
    } catch (jsonError) {
      // Báo lỗi trực quan nếu file PHP bị crash do lỗi kết nối CSDL MySQL (db.php)
      alert("❌ Lỗi hệ thống từ file PHP!\n\nNội dung lỗi chi tiết:\n" + text.replace(/<[^>]*>/g, ''));
    }
    
    // Khôi phục lại trạng thái ban đầu của nút bấm
    button.disabled = false;
    button.innerHTML = '<i class="fas fa-paper-plane"></i> Gửi liên hệ ngay';
  })
  .catch(error => {
    alert("🚨 Không thể kết nối tới máy chủ:\n" + error.message);
    button.disabled = false;
    button.innerHTML = '<i class="fas fa-paper-plane"></i> Gửi liên hệ ngay';
  });
}
