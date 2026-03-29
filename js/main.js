// ============================================
// BEAUTY BAR SALON - COMPLETE MAIN.JS
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                document.getElementById("locationText").innerText =
                    "Latitude: " + lat + ", Longitude: " + lon;

                console.log(lat, lon);
            },
            (error) => {
                alert("Location access denied!");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});
// All Features: Hamburger Menu, Video Player, PWA, Dynamic Content
// ============================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - Initializing all features');
    
    // Initialize all components
    initHamburgerMenu();
    initVideoPlayer();
    initCounters();
    initNewsletter();
    initFloatingWhatsApp();
    initBackToTop();
    initPWA();
    
    // Load dynamic content from DataService
    loadServices();
    loadTeam();
    loadTestimonials();
    loadGallery();
    loadInstagramFeed();
});

// ============================================
// HAMBURGER MENU (Left Side)
// ============================================
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburgerMenu');
    const navLinks = document.getElementById('navLinks');
    const mobileLoginBtn = document.getElementById('loginBtnMobile');
    const desktopLoginBtn = document.getElementById('loginBtn');
    
    if (!hamburger || !navLinks) return;
    
    // Toggle menu
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Mobile login button
    if (mobileLoginBtn) {
        mobileLoginBtn.addEventListener('click', () => {
            showLoginModal();
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Desktop login button
    if (desktopLoginBtn) {
        desktopLoginBtn.addEventListener('click', showLoginModal);
    }
}

// ============================================
// LOGIN MODAL
// ============================================
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.add('active');
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.remove('active');
}

// Close modal on outside click and close button
document.addEventListener('click', (e) => {
    const modal = document.getElementById('loginModal');
    if (modal && modal.classList.contains('active') && e.target === modal) {
        closeLoginModal();
    }
});

const closeModalBtn = document.getElementById('closeModal');
if (closeModalBtn) closeModalBtn.addEventListener('click', closeLoginModal);

// Google login handler
const googleLogin = document.getElementById('googleLogin');
if (googleLogin) {
    googleLogin.addEventListener('click', () => {
        alert('Google Sign-In integration. Configure your Google Client ID in auth.js');
    });
}

// ============================================
// VIDEO GALLERY - MULTIPLE VIDEOS
// ============================================

let currentVideoSlide = 0;
let totalVideoSlides = 3;
let allVideos = [];
let videoIntervals = [];

function initVideoGallery() {
    // Get all video elements
    for (let i = 1; i <= totalVideoSlides; i++) {
        const video = document.getElementById(`video${i}`);
        if (video) {
            allVideos.push(video);
            setupVideoEvents(video, i - 1);
        }
    }
    
    // Set current slide from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const videoParam = urlParams.get('video');
    if (videoParam && parseInt(videoParam) <= totalVideoSlides) {
        currentVideoSlide = parseInt(videoParam) - 1;
        updateVideoSlide();
    }
}

function setupVideoEvents(video, index) {
    video.addEventListener('play', () => {
        // Pause all other videos
        allVideos.forEach((v, i) => {
            if (i !== index && v && !v.paused) {
                v.pause();
            }
        });
        
        // Hide overlay when playing
        const slide = document.querySelectorAll('.video-slide')[index];
        const overlay = slide?.querySelector('.video-play-overlay');
        if (overlay) overlay.classList.add('hide');
    });
    
    video.addEventListener('pause', () => {
        const slide = document.querySelectorAll('.video-slide')[index];
        const overlay = slide?.querySelector('.video-play-overlay');
        if (overlay && video.currentTime < video.duration && !video.ended) {
            overlay.classList.remove('hide');
        }
    });
    
    video.addEventListener('ended', () => {
        const slide = document.querySelectorAll('.video-slide')[index];
        const overlay = slide?.querySelector('.video-play-overlay');
        if (overlay) overlay.classList.remove('hide');
    });
    
    // Quality fix
    video.style.transform = 'translateZ(0)';
    video.style.backfaceVisibility = 'hidden';
}

function playVideo(videoId) {
    const video = document.getElementById(videoId);
    if (!video) return;
    
    const index = parseInt(videoId.replace('video', '')) - 1;
    
    // Pause all other videos
    allVideos.forEach((v, i) => {
        if (i !== index && v && !v.paused) {
            v.pause();
        }
    });
    
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function nextVideo() {
    if (currentVideoSlide < totalVideoSlides - 1) {
        // Pause current video
        if (allVideos[currentVideoSlide] && !allVideos[currentVideoSlide].paused) {
            allVideos[currentVideoSlide].pause();
        }
        currentVideoSlide++;
        updateVideoSlide();
    }
}

function prevVideo() {
    if (currentVideoSlide > 0) {
        if (allVideos[currentVideoSlide] && !allVideos[currentVideoSlide].paused) {
            allVideos[currentVideoSlide].pause();
        }
        currentVideoSlide--;
        updateVideoSlide();
    }
}

function goToSlide(index) {
    if (index !== currentVideoSlide && index >= 0 && index < totalVideoSlides) {
        if (allVideos[currentVideoSlide] && !allVideos[currentVideoSlide].paused) {
            allVideos[currentVideoSlide].pause();
        }
        currentVideoSlide = index;
        updateVideoSlide();
    }
}

function updateVideoSlide() {
    const slides = document.querySelectorAll('.video-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    // Update slides
    slides.forEach((slide, index) => {
        if (index === currentVideoSlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        if (index === currentVideoSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
    
    // Update download button
    updateDownloadButton();
}

function updateDownloadButton() {
    const downloadBtn = document.getElementById('downloadCurrentVideoBtn');
    if (!downloadBtn) return;
    
    const videoFiles = ['tour.mp4', 'tour1.mp4', 'tour2.mp4'];
    const currentVideo = videoFiles[currentVideoSlide];
    downloadBtn.onclick = () => downloadCurrentVideo(currentVideo);
}

function downloadCurrentVideo(videoFile) {
    const link = document.createElement('a');
    link.href = `assets/videos/${videoFile}`;
    link.download = `beauty-bar-${videoFile}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function playAllVideos() {
    allVideos.forEach(video => {
        if (video.paused) {
            video.play();
        }
    });
}

function pauseAllVideos() {
    allVideos.forEach(video => {
        if (!video.paused) {
            video.pause();
        }
    });
}

// Swipe gestures for mobile
let touchStartVideoX = 0;
let touchEndVideoX = 0;

function setupVideoSwipe() {
    const slider = document.querySelector('.video-slider');
    if (!slider) return;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartVideoX = e.changedTouches[0].screenX;
    });
    
    slider.addEventListener('touchend', (e) => {
        touchEndVideoX = e.changedTouches[0].screenX;
        handleVideoSwipe();
    });
}

function handleVideoSwipe() {
    const swipeThreshold = 50;
    const diff = touchEndVideoX - touchStartVideoX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            prevVideo();
        } else {
            nextVideo();
        }
    }
}

// Keyboard navigation for videos
document.addEventListener('keydown', (e) => {
    if (document.querySelector('.video-slider-container')) {
        if (e.key === 'ArrowLeft') {
            prevVideo();
        } else if (e.key === 'ArrowRight') {
            nextVideo();
        }
    }
});

// Initialize video gallery when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initVideoGallery();
    setupVideoSwipe();
    
    // Update indicators when clicking
    document.querySelectorAll('.indicator').forEach((indicator, index) => {
        indicator.onclick = () => goToSlide(index);
    });
});

// ============================================
// COUNTER ANIMATION
// ============================================
function initCounters() {
    const counters = document.querySelectorAll('.counter-number');
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.textContent);
                animateCounter(element, target);
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString() + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString() + '+';
        }
    };
    updateCounter();
}

// ============================================
// NEWSLETTER SUBSCRIPTION
// ============================================
function initNewsletter() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input')?.value;
        if (email) {
            alert(`Thank you for subscribing! You'll receive exclusive offers at ${email}`);
            form.reset();
        }
    });
}

// ============================================
// FLOATING WHATSAPP
// ============================================
function initFloatingWhatsApp() {
    const whatsapp = document.querySelector('.whatsapp-float');
    if (whatsapp) {
        whatsapp.addEventListener('mouseenter', () => {
            whatsapp.style.transform = 'scale(1.1)';
        });
        whatsapp.addEventListener('mouseleave', () => {
            whatsapp.style.transform = 'scale(1)';
        });
    }
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
function initBackToTop() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.className = 'back-to-top';
    btn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary);
        color: white;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        display: none;
        z-index: 997;
        transition: all 0.3s;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(btn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.style.display = 'block';
        } else {
            btn.style.display = 'none';
        }
    });
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// PWA INSTALL PROMPT
// ============================================
let deferredPrompt;

function initPWA() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallButton();
    });
    
    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        hideInstallButton();
        showToast('Beauty Bar installed successfully! 🎉');
    });
}

function showInstallButton() {
    const btn = document.getElementById('installBtn');
    if (btn) {
        btn.style.display = 'flex';
        btn.onclick = async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log('Install prompt outcome:', outcome);
            deferredPrompt = null;
            hideInstallButton();
        };
    }
}

function hideInstallButton() {
    const btn = document.getElementById('installBtn');
    if (btn) btn.style.display = 'none';
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #4CAF50;
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        z-index: 9999;
        font-size: 14px;
        animation: fadeInUp 0.3s;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ============================================
// DYNAMIC CONTENT LOADING
// ============================================

function loadServices() {
    const container = document.getElementById('services-grid');
    if (!container) return;
    
    const services = [
        { id: 1, name: "Bridal Makeup", category: "Bridal", price: 4999, duration: 120, image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400", description: "Complete bridal makeup with premium products" },
        { id: 2, name: "Hair Styling", category: "Hair", price: 1999, duration: 60, image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400", description: "Professional hair styling for any occasion" },
        { id: 3, name: "Facial Treatment", category: "Skincare", price: 2499, duration: 75, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400", description: "Deep cleansing and hydrating facial" },
        { id: 4, name: "Nail Art", category: "Nails", price: 999, duration: 45, image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400", description: "Creative nail designs and care" },
        { id: 5, name: "Party Makeup", category: "Makeup", price: 2999, duration: 90, image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400", description: "Glamorous party and event makeup" },
        { id: 6, name: "Hair Color", category: "Hair", price: 3499, duration: 120, image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400", description: "Professional hair coloring and highlights" }
    ];
    
    container.innerHTML = services.map(service => `
        <div class="service-card">
            <img src="${service.image}" alt="${service.name}" class="service-image" loading="lazy">
            <div class="service-content">
                <span class="service-category">${service.category}</span>
                <h3 class="service-title">${service.name}</h3>
                <p style="color: #666; margin: 0.5rem 0;">${service.description}</p>
                <p>⏱️ ${service.duration} mins</p>
                <div class="service-price">₹${service.price}</div>
                <a href="booking.html?service=${service.id}" class="btn btn-primary" style="margin-top: 1rem;">Book Now</a>
            </div>
        </div>
    `).join('');
}

function loadTeam() {
    const container = document.getElementById('team-grid');
    if (!container) return;
    
    const team = [
        { name: "Priya Sharma", position: "Senior Makeup Artist", specialty: "Bridal Makeup Expert", experience: "12+ years", image: "https://images.unsplash.com/photo-1494790108777-223fd4f5603d?w=300" },
        { name: "Anjali Desai", position: "Senior Hair Stylist", specialty: "Color Specialist", experience: "8+ years", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300" },
        { name: "Meera Kapoor", position: "Nail Art Expert", specialty: "Creative Nail Designs", experience: "6+ years", image: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=300" },
        { name: "Riya Mehta", position: "Skincare Specialist", specialty: "Facial Treatments", experience: "10+ years", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300" }
    ];
    
    container.innerHTML = team.map(member => `
        <div class="team-card">
            <img src="${member.image}" alt="${member.name}" class="team-image" loading="lazy">
            <div class="team-info">
                <h3>${member.name}</h3>
                <div class="position">${member.position}</div>
                <div class="specialty">${member.specialty}</div>
                <p>⭐ ${member.experience} experience</p>
            </div>
        </div>
    `).join('');
}

function loadTestimonials() {
    const container = document.getElementById('testimonials-slider');
    if (!container) return;
    
    const testimonials = [
        { name: "Neha Gupta", role: "Bridal Client", image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150", text: "Absolutely amazing experience! The bridal makeup was perfect.", rating: 5 },
        { name: "Kavita Singh", role: "Regular Client", image: "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=150", text: "Best salon in town! The staff is professional and friendly.", rating: 5 },
        { name: "Pooja Patel", role: "Celebrity Client", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150", text: "The hair coloring service is exceptional!", rating: 5 }
    ];
    
    container.innerHTML = testimonials.map(t => `
        <div class="testimonial-card">
            <img src="${t.image}" alt="${t.name}" class="testimonial-image">
            <div class="testimonial-rating">${'★'.repeat(t.rating)}</div>
            <div class="testimonial-text">"${t.text}"</div>
            <div class="testimonial-author">${t.name}</div>
            <div class="testimonial-role">${t.role}</div>
        </div>
    `).join('');
}

function loadGallery() {
    const container = document.getElementById('gallery-grid');
    if (!container) return;
    
    const images = [
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1522337660859-02fbefca4700?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1595476108010-4b1727f2dfc2?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1621607512214-68297480165e?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1582095133179-bfd8e68866bf?w=400&h=300&fit=crop"
    ];
    
    container.innerHTML = images.map(img => `
        <div class="gallery-item">
            <img src="${img}" alt="Salon Gallery" loading="lazy">
            <div class="gallery-overlay">
                <h3>Beauty Bar Salon</h3>
                <p>Luxury Experience</p>
            </div>
        </div>
    `).join('');
}

function loadInstagramFeed() {
    const container = document.getElementById('instagram-feed');
    if (!container) return;
    
    const posts = [
        "https://images.unsplash.com/photo-1605493625526-54acb523e3eb?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1622288432450-0a7b3d3b8b3b?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1622306006963-b0c4f0a7c3a3?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1622306117306-4d6f3c4b0b3c?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1622306117306-4d6f3c4b0b3d?w=200&h=200&fit=crop"
    ];
    
    container.innerHTML = posts.map(post => `
        <div class="instagram-item" onclick="window.open('https://instagram.com/beautybarsalon', '_blank')">
            <img src="${post}" alt="Instagram Post" loading="lazy">
            <div class="instagram-overlay">
                <i class="fab fa-instagram"></i>
                <span>View on Instagram</span>
            </div>
        </div>
    `).join('');
}

// Add CSS for back-to-top button
const style = document.createElement('style');
style.textContent = `
    .back-to-top:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 15px rgba(183, 110, 121, 0.4);
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Make functions globally available
window.togglePlayPause = togglePlayPause;
window.toggleLoop = toggleLoop;
