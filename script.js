
// 1. Navbar: trong suốt trên hero, xanh khi scroll
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
  updateNav(); // chạy ngay khi load
}

// 2. Scroll animation (fade-up khi xuất hiện trên màn hình)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
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

// 3. Smooth scroll khi click nút khám phá
const exploreBtn = document.getElementById('exploreBtn');
if (exploreBtn) {
  exploreBtn.addEventListener('click', () => {
    const target = document.getElementById('intro') || document.querySelector('.intro-section');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// 4. Active nav link theo trang hiện tại
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.style.color = 'var(--amber-gold)';
  }
});