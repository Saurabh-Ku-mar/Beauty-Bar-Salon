// ============================================
// BEAUTY BAR SALON - COMPLETE MAIN.JS
// All Features: Hamburger Menu, Video Slider, Services, Team, Gallery, etc.
// ============================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - Initializing all features');
    
    // Initialize hamburger menu FIRST
    initHamburgerMenu();
    
    // Load services and team from DataService
    loadServices();
    loadTeam();
    loadTestimonials();
    loadGallery();
    loadInstagramFeed();
    
    // Initialize other features
    initVideoSlider();
    initCounters();
    initNewsletter();
    initFloatingWhatsApp();
    initBackToTop();
    initPWA();
    initLoginModal();
});

// ============================================
// HAMBURGER MENU - WORKING VERSION
// ============================================

function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburgerMenu');
    const navLinks = document.getElementById('navLinks');
    const mobileLoginBtn = document.getElementById('loginBtnMobile');
    const desktopLoginBtn = document.getElementById('loginBtn');
    
    // Check if elements exist
    if (!hamburger) {
        console.log('Hamburger element not found');
        return;
    }
    
    if (!navLinks) {
        console.log('NavLinks element not found');
        return;
    }
    
    console.log('Hamburger menu initialized - elements found');
    
    // Toggle menu when hamburger is clicked
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            console.log('Menu opened');
        } else {
            document.body.style.overflow = '';
            console.log('Menu closed');
        }
    });
    
    // Close menu when clicking a navigation link
    const allLinks = navLinks.querySelectorAll('a');
    allLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
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
        mobileLoginBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showLoginModal();
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Desktop login button
    if (desktopLoginBtn) {
        desktopLoginBtn.addEventListener('click', function() {
            showLoginModal();
        });
    }
}

// ============================================
// LOGIN MODAL
// ============================================

function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('active');
        console.log('Login modal opened');
    }
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('active');
        console.log('Login modal closed');
    }
}

// Close modal on outside click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('loginModal');
    if (modal && modal.classList.contains('active') && e.target === modal) {
        closeLoginModal();
    }
});

// Close modal button
const closeModalBtn = document.getElementById('closeModal');
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeLoginModal);
}

// Google login handler
const googleLogin = document.getElementById('googleLogin');
if (googleLogin) {
    googleLogin.addEventListener('click', function() {
        alert('Google Sign-In integration. Configure your Google Client ID in auth.js');
    });
}

// ============================================
// VIDEO SLIDER FUNCTIONALITY
// ============================================

let currentVideoSlide = 0;
let totalVideoSlides = 3;
let allVideos = [];

function initVideoSlider() {
    // Get all video elements
    for (let i = 1; i <= totalVideoSlides; i++) {
        const video = document.getElementById(`video${i}`);
        if (video) {
            allVideos.push(video);
            setupVideoEvents(video, i - 1);
        }
    }
    
    // Set up indicators
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.onclick = () => goToSlide(index);
    });
    
    console.log(`Video slider initialized with ${allVideos.length} videos`);
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
    
    slides.forEach((slide, index) => {
        if (index === currentVideoSlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    
    indicators.forEach((indicator, index) => {
        if (index === currentVideoSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// ============================================
// SERVICE LOADING FROM DATA SERVICE
// ============================================

function loadServices() {
    const container = document.getElementById('services-grid');
    if (!container) {
        console.log('Services container not found');
        return;
    }
    
    console.log('Loading services...');
    
    // Try to get services from DataService
    if (window.dataService) {
        const services = window.dataService.getServices();
        if (services && services.length > 0) {
            displayServices(services);
            return;
        }
    }
    
    // Fallback services data
    const fallbackServices = [
        {
            id: 1,
            name: "Bridal Makeup",
            category: "Bridal",
            price: 4999,
            duration: 120,
            image: "https://images.pexels.com/photos/3992135/pexels-photo-3992135.jpeg?w=400&h=300&fit=crop",
            description: "Complete bridal makeup with premium products"
        },
        {
            id: 2,
            name: "Hair Styling",
            category: "Hair",
            price: 1999,
            duration: 60,
            image: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?w=400&h=300&fit=crop",
            description: "Professional hair styling for any occasion"
        },
        {
            id: 3,
            name: "Facial Treatment",
            category: "Skincare",
            price: 2499,
            duration: 75,
            image: "https://images.pexels.com/photos/3822600/pexels-photo-3822600.jpeg?w=400&h=300&fit=crop",
            description: "Deep cleansing and hydrating facial"
        },
        {
            id: 4,
            name: "Nail Art",
            category: "Nails",
            price: 999,
            duration: 45,
            image: "https://images.pexels.com/photos/3992135/pexels-photo-3992135.jpeg?w=400&h=300&fit=crop",
            description: "Creative nail designs and care"
        },
        {
            id: 5,
            name: "Party Makeup",
            category: "Makeup",
            price: 2999,
            duration: 90,
            image: "https://images.pexels.com/photos/3992135/pexels-photo-3992135.jpeg?w=400&h=300&fit=crop",
            description: "Glamorous party and event makeup"
        },
        {
            id: 6,
            name: "Hair Color",
            category: "Hair",
            price: 3499,
            duration: 120,
            image: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?w=400&h=300&fit=crop",
            description: "Professional hair coloring and highlights"
        }
    ];
    
    displayServices(fallbackServices);
}

function displayServices(services) {
    const container = document.getElementById('services-grid');
    if (!container) return;
    
    container.innerHTML = services.map(service => `
        <div class="service-card">
            <img src="${service.image}" alt="${service.name}" class="service-image" loading="lazy" onerror="this.src='https://placehold.co/400x300/B76E79/white?text=${service.name}'">
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
    
    console.log('Services loaded successfully!');
}

// ============================================
// TEAM LOADING
// ============================================

function loadTeam() {
    const container = document.getElementById('team-grid');
    if (!container) return;
    
    console.log('Loading team...');
    
    // Try to get staff from DataService
    if (window.dataService) {
        const staff = window.dataService.getStaff();
        if (staff && staff.length > 0) {
            displayTeam(staff);
            return;
        }
    }
    
    // Fallback team data
    const fallbackTeam = [
        {
            name: "Priya Sharma",
            position: "Senior Makeup Artist",
            specialty: "Bridal Makeup Expert",
            experience: "12+ years",
            image: "https://images.pexels.com/photos/1494790108777-223fd4f5603d?w=300&h=300&fit=crop"
        },
        {
            name: "Anjali Desai",
            position: "Senior Hair Stylist",
            specialty: "Color Specialist",
            experience: "8+ years",
            image: "https://images.pexels.com/photos/1534528741775-53994a69daeb?w=300&h=300&fit=crop"
        },
        {
            name: "Meera Kapoor",
            position: "Nail Art Expert",
            specialty: "Creative Nail Designs",
            experience: "6+ years",
            image: "https://images.pexels.com/photos/1517365830460-955ce3ccd263?w=300&h=300&fit=crop"
        },
        {
            name: "Riya Mehta",
            position: "Skincare Specialist",
            specialty: "Facial Treatments",
            experience: "10+ years",
            image: "https://images.pexels.com/photos/1438761681033-6461ffad8d80?w=300&h=300&fit=crop"
        }
    ];
    
    displayTeam(fallbackTeam);
}

function displayTeam(team) {
    const container = document.getElementById('team-grid');
    if (!container) return;
    
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

// ============================================
// TESTIMONIALS LOADING
// ============================================

function loadTestimonials() {
    const container = document.getElementById('testimonials-slider');
    if (!container) return;
    
    const testimonials = [
        { name: "Neha Gupta", role: "Bridal Client", image: "https://randomuser.me/api/portraits/women/1.jpg", text: "Absolutely amazing experience! The bridal makeup was perfect and the team made me feel like a princess on my special day.", rating: 5 },
        { name: "Kavita Singh", role: "Regular Client", image: "https://randomuser.me/api/portraits/women/2.jpg", text: "Best salon in town! The staff is professional, and the hygiene standards are top-notch. My go-to place for all beauty needs.", rating: 5 },
        { name: "Pooja Patel", role: "Celebrity Client", image: "https://randomuser.me/api/portraits/women/3.jpg", text: "The hair coloring service is exceptional! They understood exactly what I wanted and delivered beyond expectations.", rating: 5 }
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

// ============================================
// GALLERY LOADING
// ============================================

function loadGallery() {
    const container = document.getElementById('gallery-grid');
    if (!container) return;
    
    const images = [
        "https://images.pexels.com/photos/3992872/pexels-photo-3992872.jpeg?w=400&h=300&fit=crop",
        "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?w=400&h=300&fit=crop",
        "https://images.pexels.com/photos/3992135/pexels-photo-3992135.jpeg?w=400&h=300&fit=crop",
        "https://images.pexels.com/photos/3822600/pexels-photo-3822600.jpeg?w=400&h=300&fit=crop",
        "https://images.pexels.com/photos/4506101/pexels-photo-4506101.jpeg?w=400&h=300&fit=crop",
        "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?w=400&h=300&fit=crop"
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

// ============================================
// INSTAGRAM FEED LOADING
// ============================================

function loadInstagramFeed() {
    const container = document.getElementById('instagram-feed');
    if (!container) return;
    
    const posts = [
        "https://images.pexels.com/photos/3992872/pexels-photo-3992872.jpeg?w=200&h=200&fit=crop",
        "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?w=200&h=200&fit=crop",
        "https://images.pexels.com/photos/3992135/pexels-photo-3992135.jpeg?w=200&h=200&fit=crop",
        "https://images.pexels.com/photos/3822600/pexels-photo-3822600.jpeg?w=200&h=200&fit=crop",
        "https://images.pexels.com/photos/4506101/pexels-photo-4506101.jpeg?w=200&h=200&fit=crop",
        "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?w=200&h=200&fit=crop"
    ];
    
    container.innerHTML = posts.map(post => `
        <div class="instagram-item" onclick="window.open('https://instagram.com/sandhya.rathi6921', '_blank')">
            <img src="${post}" alt="Instagram Post" loading="lazy">
            <div class="instagram-overlay">
                <i class="fab fa-instagram"></i>
                <span>View</span>
            </div>
        </div>
    `).join('');
}

// ============================================
// COUNTER ANIMATION
// ============================================

function initCounters() {
    const counters = document.querySelectorAll('.counter-number');
    if (!counters.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.textContent);
                animateCounter(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(c => observer.observe(c));
}

function animateCounter(el, target) {
    let current = 0;
    const increment = target / 50;
    const update = () => {
        current += increment;
        if (current < target) {
            el.textContent = Math.floor(current).toLocaleString() + '+';
            requestAnimationFrame(update);
        } else {
            el.textContent = target.toLocaleString() + '+';
        }
    };
    update();
}

// ============================================
// NEWSLETTER SUBSCRIPTION
// ============================================

function initNewsletter() {
    const form = document.querySelector('.newsletter-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input')?.value;
            if (email) {
                alert(`Thank you for subscribing! You'll receive exclusive offers at ${email}`);
                form.reset();
            }
        });
    }
}

// ============================================
// FLOATING WHATSAPP BUTTON
// ============================================

function initFloatingWhatsApp() {
    const btn = document.querySelector('.whatsapp-float');
    if (btn) {
        btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.1)');
        btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
    }
}

// ============================================
// BACK TO TOP BUTTON
// ============================================

function initBackToTop() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.className = 'back-to-top';
    document.body.appendChild(btn);
    
    window.addEventListener('scroll', () => {
        btn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ============================================
// PWA INSTALL PROMPT
// ============================================

let deferredPrompt;

function initPWA() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        const installBtn = document.getElementById('installBtn');
        if (installBtn) installBtn.style.display = 'flex';
    });
    
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
        installBtn.addEventListener('click', installApp);
    }
}

function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => deferredPrompt = null);
        const installBtn = document.getElementById('installBtn');
        if (installBtn) installBtn.style.display = 'none';
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 9999;
        animation: fadeIn 0.3s;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ============================================
// MAKE FUNCTIONS GLOBALLY AVAILABLE
// ============================================

window.playVideo = playVideo;
window.nextVideo = nextVideo;
window.prevVideo = prevVideo;
window.goToSlide = goToSlide;
window.installApp = installApp;
window.showLoginModal = showLoginModal;
window.showToast = showToast;
