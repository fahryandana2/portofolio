/**
 * PORTOFOLIO JAVASCRIPT
 * Developer: M. Fahri Putra Andana
 * Functions: Mobile Nav, Smooth Scroll, Reveal Animation, Form Handling, & Modal Cert
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SELEKTOR UTAMA ---
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.getElementById('menu-overlay');
    const header = document.querySelector('header');

    // --- 2. FUNGSI NAVIGASI MOBILE ---
    const toggleMenu = () => {
        const isActive = navLinks.classList.toggle('active');
        menuToggle.classList.toggle('is-active');
        
        if (overlay) {
            overlay.classList.toggle('active');
        }

        // Lock scroll saat menu mobile terbuka agar tidak berantakan
        document.body.style.overflow = isActive ? 'hidden' : 'auto';
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    // Tutup menu jika klik di overlay
    if (overlay) {
        overlay.addEventListener('click', toggleMenu);
    }

    // Tutup menu otomatis saat link navigasi diklik
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('is-active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // --- 3. SMOOTH SCROLL DENGAN OFFSET ---
    // (Mencegah teks tertutup navbar saat pindah section)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = 70; // Sesuaikan dengan tinggi navbar kamu
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 4. REVEAL ON SCROLL (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px" // Muncul sedikit sebelum menyentuh viewport
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                // Berhenti mengamati setelah elemen muncul (untuk optimasi)
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const setupReveal = () => {
        const elementsToReveal = document.querySelectorAll(
            '.hero-content, .hero-image, .about-card, .project-card, .cert-card, .section-title, .toolkit-row, .skill-item'
        );

        elementsToReveal.forEach(el => {
            // Beri class hidden jika belum punya class reveal spesifik
            if (!el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
                el.classList.add('reveal-hidden');
            }
            observer.observe(el);
        });
    };

    setupReveal();

    // --- 5. CONTACT FORM HANDLING ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Kamu bisa menambahkan proses integrasi EmailJS di sini nantinya
            alert('Terima kasih, Fahri akan segera menghubungi Anda!');
            contactForm.reset();
        });
    }

    // --- 6. NAVBAR BACKGROUND CHANGE SAAT SCROLL ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = "0 5px 20px rgba(0,0,0,0.1)";
            header.style.backgroundColor = "rgba(255, 255, 255, 0.98)";
        } else {
            header.style.boxShadow = "none";
            header.style.backgroundColor = "rgba(245, 245, 245, 0.9)";
        }
    });
});

// --- 7. MODAL SYSTEM (Global Scope agar bisa dipanggil onclick dari HTML) ---
function openModal(imgSrc) {
    const modal = document.getElementById("certModal");
    const modalImg = document.getElementById("imgFull");
    
    if (modal && modalImg) {
        modal.style.display = "flex"; // Gunakan flex untuk centering
        modalImg.src = imgSrc;
        document.body.style.overflow = "hidden"; // Kunci scroll
        
        // Tambahkan animasi fade sederhana
        modal.style.opacity = "0";
        setTimeout(() => {
            modal.style.transition = "opacity 0.3s ease";
            modal.style.opacity = "1";
        }, 10);
    }
}

function closeModal() {
    const modal = document.getElementById("certModal");
    if (modal) {
        modal.style.opacity = "0";
        setTimeout(() => {
            modal.style.display = "none";
            document.body.style.overflow = "auto"; // Aktifkan scroll kembali
        }, 300);
    }
}

// Tutup modal jika user klik area gelap (di luar gambar)
window.onclick = function(event) {
    const modal = document.getElementById("certModal");
    if (event.target == modal) {
        closeModal();
    }
};

// Tutup modal dengan tombol Escape
document.addEventListener('keydown', function(e) {
    if (e.key === "Escape") closeModal();
});