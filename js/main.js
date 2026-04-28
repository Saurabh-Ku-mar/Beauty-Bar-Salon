// ============================================
// BEAUTY BAR SALON - MAIN.JS
// LOADS DATA FROM CENTRAL DATA SERVICE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Homepage loading...');
    
    // Wait for data service
    const waitForData = setInterval(() => {
        if (window.dataService) {
            clearInterval(waitForData);
            console.log('✅ Data service ready, loading content...');
            loadAllContent();
        }
    }, 100);
    
    // Initialize UI components
    initHamburgerMenu();
    initBackToTop();
    initNewsletter();
    initFloatingWhatsApp();
    initCounters();
    initVideoSlider();
    
    // Listen for data changes
    if (window.dataService) {
        window.dataService.subscribe(() => {
            console.log('📢 Data changed, refreshing homepage...');
            loadServices();
            loadTeam();
        });
    }
});

function loadAllContent() {
    loadServices();
    loadTeam();
    loadTestimonials();
    loadGallery();
    loadInstagramFeed();
}

// ========== LOAD SERVICES ==========
function loadServices() {
    const container = document.getElementById('services-grid');
    if (!container) return;
    
    const services = window.dataService.getServices();
    console.log(`📋 Loading ${services.length} services`);
    
    if (services.length === 0) {
        container.innerHTML = '<p style="text-align: center;">No services available. Please check back later.</p>';
        return;
    }
    
    container.innerHTML = services.map(service => `
        <div class="service-card">
            <img src="${service.image}" alt="${service.name}" class="service-image" loading="lazy" onerror="this.src='https://placehold.co/400x300/B76E79/white?text=${service.name}'">
            <div class="service-content">
                <span class="service-category">${service.category}</span>
                <h3 class="service-title">${service.name}</h3>
                <p>${service.description || 'Premium salon service'}</p>
                <p>⏱️ ${service.duration} mins</p>
                <div class="service-price">₹${service.price}</div>
                <a href="booking.html?service=${service.id}" class="btn btn-primary">Book Now</a>
            </div>
        </div>
    `).join('');
}

// ========== LOAD TEAM ==========
function loadTeam() {
    const container = document.getElementById('team-grid');
    if (!container) return;
    
    const staff = window.dataService.getStaff();
    console.log(`👥 Loading ${staff.length} team members`);
    
    if (staff.length === 0) {
        container.innerHTML = '<p style="text-align: center;">No team members available.</p>';
        return;
    }
    
    container.innerHTML = staff.map(member => `
        <div class="team-card">
            <img src="${member.image}" alt="${member.name}" class="team-image" loading="lazy" onerror="this.src='https://placehold.co/300x300/B76E79/white?text=${member.name}'">
            <div class="team-info">
                <h3>${member.name}</h3>
                <div class="position">${member.position}</div>
                <div class="specialty">${member.specialty}</div>
                <p>⭐ ${member.experience} experience</p>
                <div class="team-social">
                    <a href="#"><i class="fab fa-instagram"></i></a>
                </div>
            </div>
        </div>
    `).join('');
}

// ========== LOAD TESTIMONIALS ==========
function loadTestimonials() {
    const container = document.getElementById('testimonials-slider');
    if (!container) return;
    
    const testimonials = [
        { name: "Neha Gupta", role: "Bridal Client", image: "https://randomuser.me/api/portraits/women/1.jpg", text: "Absolutely amazing experience! The bridal makeup was perfect.", rating: 5 },
        { name: "Kavita Singh", role: "Regular Client", image: "https://randomuser.me/api/portraits/women/2.jpg", text: "Best salon in town! The staff is professional and friendly.", rating: 5 },
        { name: "Pooja Patel", role: "Celebrity Client", image: "https://randomuser.me/api/portraits/women/3.jpg", text: "The hair coloring service is exceptional!", rating: 5 }
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

// ========== LOAD GALLERY ==========
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

// ========== LOAD INSTAGRAM FEED ==========
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
        <div class="instagram-item" onclick="window.open('https://instagram.com/', '_blank')">
            <img src="${post}" alt="Instagram Post" loading="lazy">
            <div class="instagram-overlay">
                <i class="fab fa-instagram"></i>
                <span>View</span>
            </div>
        </div>
    `).join('');
}

// ========== VIDEO SLIDER ==========
let currentVideoSlide = 0;
let totalVideoSlides = 3;
let allVideos = [];

function initVideoSlider() {
    for (let i = 1; i <= totalVideoSlides; i++) {
        const video = document.getElementById(`video${i}`);
        if (video) {
            allVideos.push(video);
            setupVideoEvents(video, i - 1);
        }
    }
    
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.onclick = () => goToSlide(index);
    });
}

function setupVideoEvents(video, index) {
    video.addEventListener('play', () => {
        allVideos.forEach((v, i) => {
            if (i !== index && v && !v.paused) v.pause();
        });
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
    allVideos.forEach((v, i) => {
        if (i !== index && v && !v.paused) v.pause();
    });
    if (video.paused) video.play(); else video.pause();
}

function nextVideo() {
    if (currentVideoSlide < totalVideoSlides - 1) {
        if (allVideos[currentVideoSlide] && !allVideos[currentVideoSlide].paused) allVideos[currentVideoSlide].pause();
        currentVideoSlide++;
        updateVideoSlide();
    }
}

function prevVideo() {
    if (currentVideoSlide > 0) {
        if (allVideos[currentVideoSlide] && !allVideos[currentVideoSlide].paused) allVideos[currentVideoSlide].pause();
        currentVideoSlide--;
        updateVideoSlide();
    }
}

function goToSlide(index) {
    if (index !== currentVideoSlide && index >= 0 && index < totalVideoSlides) {
        if (allVideos[currentVideoSlide] && !allVideos[currentVideoSlide].paused) allVideos[currentVideoSlide].pause();
        currentVideoSlide = index;
        updateVideoSlide();
    }
}

function updateVideoSlide() {
    const slides = document.querySelectorAll('.video-slide');
    const indicators = document.querySelectorAll('.indicator');
    slides.forEach((slide, index) => {
        if (index === currentVideoSlide) slide.classList.add('active');
        else slide.classList.remove('active');
    });
    indicators.forEach((indicator, index) => {
        if (index === currentVideoSlide) indicator.classList.add('active');
        else indicator.classList.remove('active');
    });
}

// ========== COUNTER ANIMATION ==========
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

// ========== HAMBURGER MENU ==========
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburgerMenu');
    const navLinks = document.getElementById('navLinks');
    
    if (!hamburger || !navLinks) return;
    
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    document.addEventListener('click', function(e) {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ========== BACK TO TOP ==========
function initBackToTop() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.className = 'back-to-top';
    btn.style.cssText = `position:fixed;bottom:100px;right:30px;background:#B76E79;color:white;width:45px;height:45px;border-radius:50%;border:none;cursor:pointer;display:none;z-index:998;box-shadow:0 2px 10px rgba(0,0,0,0.2);`;
    document.body.appendChild(btn);
    
    window.addEventListener('scroll', () => {
        btn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ========== NEWSLETTER ==========
function initNewsletter() {
    const form = document.querySelector('.newsletter-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input')?.value;
            if (email) alert(`Thank you for subscribing! You'll receive exclusive offers at ${email}`);
            form.reset();
        });
    }
}

// ========== FLOATING WHATSAPP ==========
function initFloatingWhatsApp() {
    const btn = document.querySelector('.whatsapp-float');
    if (btn) {
        btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.1)');
        btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
    }
}

// Make functions global
window.playVideo = playVideo;
window.nextVideo = nextVideo;
window.prevVideo = prevVideo;
window.goToSlide = goToSlide;
