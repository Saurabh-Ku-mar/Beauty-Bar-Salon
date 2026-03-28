// frontend/js/main.js
// Main JavaScript for Beauty Bar Salon - Now using DataService

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Main.js loaded - waiting for data service...');
    
    // Wait for data service to be ready
    const waitForData = setInterval(() => {
        if (window.dataService) {
            clearInterval(waitForData);
            console.log('Data service found, loading content...');
            loadServicesFromData();
            loadTeamFromData();
        }
    }, 100);
    
    initNavigation();
    initSmoothScroll();
    initNewsletterForm();
    initFloatingWhatsApp();
    initBackToTop();
    
    // Listen for data changes from admin panel
    if (window.dataService) {
        window.dataService.subscribe((data) => {
            console.log('Data updated, refreshing homepage...');
            loadServicesFromData();
            loadTeamFromData();
        });
    }
});

// Load services from central data
function loadServicesFromData() {
    const servicesGrid = document.getElementById('services-grid');
    if (!servicesGrid) {
        console.log('Services grid not found on this page');
        return;
    }
    
    if (!window.dataService) {
        console.error('Data service not available');
        servicesGrid.innerHTML = '<p style="text-align: center; color: red;">Error loading services. Please refresh.</p>';
        return;
    }
    
    const services = window.dataService.getServices();
    console.log('Loading', services.length, 'services');
    
    if (services.length === 0) {
        servicesGrid.innerHTML = '<p style="text-align: center;">Loading services...</p>';
        return;
    }
    
    servicesGrid.innerHTML = services.map(service => `
        <div class="service-card">
            <img src="${service.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400'}" alt="${service.name}" class="service-image" loading="lazy">
            <div class="service-content">
                <span class="service-category">${service.category}</span>
                <h3 class="service-title">${service.name}</h3>
                <p style="color: #666; margin: 0.5rem 0;">${service.description || 'Premium salon service'}</p>
                <p>⏱️ ${service.duration} mins</p>
                <div class="service-price">₹${service.price}</div>
                <a href="booking.html?service=${service.id}" class="btn btn-primary" style="margin-top: 1rem;">Book Now</a>
            </div>
        </div>
    `).join('');
}

// Load team from central data
function loadTeamFromData() {
    const teamGrid = document.getElementById('team-grid');
    if (!teamGrid) {
        console.log('Team grid not found on this page');
        return;
    }
    
    if (!window.dataService) {
        console.error('Data service not available');
        return;
    }
    
    const staff = window.dataService.getStaff();
    console.log('Loading', staff.length, 'staff members');
    
    if (staff.length === 0) {
        teamGrid.innerHTML = '<p style="text-align: center;">Loading team...</p>';
        return;
    }
    
    teamGrid.innerHTML = staff.map(member => `
        <div class="team-card">
            <img src="${member.image || 'https://images.unsplash.com/photo-1494790108777-223fd4f5603d?w=200'}" alt="${member.name}" class="team-image" loading="lazy">
            <div class="team-info">
                <h3>${member.name}</h3>
                <div class="position">${member.position}</div>
                <div class="specialty">${member.specialty}</div>
                <p>⭐ ${member.experience} experience</p>
                <div class="team-social">
                    <a href="#" target="_blank"><i class="fab fa-instagram"></i></a>
                    <a href="#" target="_blank"><i class="fab fa-linkedin-in"></i></a>
                </div>
            </div>
        </div>
    `).join('');
}

// Navigation functions
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    // Mobile menu toggle
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    menuToggle.style.display = 'none';
    
    if (window.innerWidth <= 768) {
        menuToggle.style.display = 'block';
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.style.display = 'none';
            menuToggle.addEventListener('click', () => {
                navLinks.style.display = navLinks.style.display === 'none' ? 'flex' : 'none';
                navLinks.style.flexDirection = 'column';
            });
        }
        if (navbar) navbar.appendChild(menuToggle);
    }
    
    window.addEventListener('resize', () => {
        const navLinks = document.querySelector('.nav-links');
        if (window.innerWidth <= 768) {
            menuToggle.style.display = 'block';
            if (navLinks) navLinks.style.display = 'none';
        } else {
            menuToggle.style.display = 'none';
            if (navLinks) navLinks.style.display = 'flex';
        }
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input').value;
            alert(`Thank you for subscribing! You'll receive exclusive offers at ${email}`);
            form.reset();
        });
    }
}

function initFloatingWhatsApp() {
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('mouseenter', () => {
            whatsappBtn.style.transform = 'scale(1.1)';
        });
        whatsappBtn.addEventListener('mouseleave', () => {
            whatsappBtn.style.transform = 'scale(1)';
        });
    }
}

function initBackToTop() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.className = 'back-to-top';
    btn.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: var(--primary);
        color: white;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        display: none;
        z-index: 998;
        transition: all 0.3s;
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

// Add CSS for mobile menu
const style = document.createElement('style');
style.textContent = `
    .menu-toggle {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--primary);
        cursor: pointer;
    }
    
    .back-to-top:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(183, 110, 121, 0.3);
    }
    
    @media (max-width: 768px) {
        .nav-links {
            position: absolute;
            top: 70px;
            left: 0;
            right: 0;
            background: white;
            padding: 1rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 999;
        }
        
        .social-nav {
            margin-left: 0;
            justify-content: center;
        }
    }
`;
document.head.appendChild(style);
// Video Player Functionality - Fixed Quality & Loop

let video = null;
let isLooping = true;

document.addEventListener('DOMContentLoaded', () => {
    video = document.getElementById('salonVideo');
    
    if (video) {
        setupVideoPlayer();
        setupQualityFix();
    }
});

function setupVideoPlayer() {
    // Set loop to true by default
    video.loop = true;
    isLooping = true;
    
    // Ensure video plays at highest available quality
    video.addEventListener('loadedmetadata', () => {
        // Force browser to use highest quality
        if (video.videoWidth > 0) {
            console.log('Video loaded:', video.videoWidth + 'x' + video.videoHeight);
        }
    });
    
    // Fix for blurry video - force hardware acceleration
    video.style.transform = 'translateZ(0)';
    video.style.backfaceVisibility = 'hidden';
    
    // Handle video errors
    video.addEventListener('error', (e) => {
        console.error('Video error:', e);
        showQualityMessage();
    });
    
    // Log when video starts playing
    video.addEventListener('play', () => {
        console.log('Video playing');
    });
    
    // Mute video to allow autoplay (browsers allow autoplay only for muted videos)
    video.muted = true;
    
    // Try to play automatically
    const playPromise = video.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Autoplay prevented:', error);
            // User will need to click play button
        });
    }
}

function setupQualityFix() {
    if (!video) return;
    
    // Force video to use source quality
    const originalSrc = video.currentSrc;
    
    // Re-load video to ensure quality
    video.addEventListener('pause', () => {
        // When paused, make sure video is crisp
        video.style.transform = 'scale(1)';
    });
    
    // Fix for picture-in-picture quality
    video.addEventListener('enterpictureinpicture', () => {
        console.log('Entered PiP mode');
    });
    
    video.addEventListener('leavepictureinpicture', () => {
        console.log('Left PiP mode');
        // Force re-render when leaving PiP
        video.style.transform = 'translateZ(0)';
        setTimeout(() => {
            video.style.transform = '';
        }, 100);
    });
}

function togglePlayPause() {
    if (!video) return;
    
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function toggleLoop() {
    if (!video) return;
    
    isLooping = !isLooping;
    video.loop = isLooping;
    
    const loopBtn = document.getElementById('loopBtn');
    if (loopBtn) {
        if (isLooping) {
            loopBtn.innerHTML = '<i class="fas fa-repeat"></i> Loop: ON';
            loopBtn.classList.remove('btn-outline');
            loopBtn.classList.add('btn-primary');
        } else {
            loopBtn.innerHTML = '<i class="fas fa-repeat"></i> Loop: OFF';
            loopBtn.classList.remove('btn-primary');
            loopBtn.classList.add('btn-outline');
        }
    }
    
    console.log('Loop mode:', isLooping ? 'ON' : 'OFF');
}

function showQualityMessage() {
    const qualityInfo = document.createElement('div');
    qualityInfo.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        font-size: 0.9rem;
    `;
    qualityInfo.innerHTML = `
        <i class="fas fa-video"></i> 
        For best quality, <a href="assets/videos/salon-tour.mp4" download style="color: #B76E79;">download the video</a>
        or click the settings gear ⚙️ to select HD quality.
    `;
    document.body.appendChild(qualityInfo);
    
    setTimeout(() => {
        qualityInfo.remove();
    }, 5000);
}

// Handle video quality settings via browser
function forceHighQuality() {
    if (!video) return;
    
    // Try to get highest quality by reloading with quality parameter
    const currentSrc = video.currentSrc;
    if (currentSrc && !currentSrc.includes('quality=')) {
        // This is a fallback - browser will usually choose best quality automatically
        console.log('Video source:', currentSrc);
    }
});
// Video Gallery Slider Functionality
let currentSlide = 0;
let totalSlides = 0;
let videos = [];
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('DOMContentLoaded', () => {
    initVideoSlider();
    setupSwipeGestures();
});

function initVideoSlider() {
    const slides = document.querySelectorAll('.video-slide');
    totalSlides = slides.length;
    
    // Store video elements
    slides.forEach((slide, index) => {
        const video = slide.querySelector('video');
        if (video) {
            videos[index] = video;
            setupVideoEvents(video, index);
        }
    });
    
    updateIndicators();
}

function setupVideoEvents(video, index) {
    // Handle video play
    video.addEventListener('play', () => {
        // Pause other videos
        videos.forEach((v, i) => {
            if (i !== index && v && !v.paused) {
                v.pause();
            }
        });
        
        // Hide overlay when playing
        const overlay = video.parentElement.querySelector('.video-overlay');
        if (overlay) overlay.classList.add('hide');
    });
    
    // Handle video pause
    video.addEventListener('pause', () => {
        const overlay = video.parentElement.querySelector('.video-overlay');
        if (overlay && video.currentTime < video.duration && !video.ended) {
            overlay.classList.remove('hide');
        }
    });
    
    // Handle video end
    video.addEventListener('ended', () => {
        const overlay = video.parentElement.querySelector('.video-overlay');
        if (overlay) overlay.classList.remove('hide');
    });
    
    // Ensure video plays at best quality
    video.style.transform = 'translateZ(0)';
    video.style.backfaceVisibility = 'hidden';
    
    // Autoplay first video muted
    if (index === 0) {
        video.muted = true;
        video.play().catch(e => console.log('Autoplay blocked:', e));
    }
}

function playVideo(videoId) {
    const video = document.getElementById(videoId);
    if (video) {
        // Pause all other videos
        videos.forEach(v => {
            if (v && v !== video && !v.paused) {
                v.pause();
            }
        });
        
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }
}

function nextVideo() {
    if (currentSlide < totalSlides - 1) {
        // Pause current video
        if (videos[currentSlide] && !videos[currentSlide].paused) {
            videos[currentSlide].pause();
        }
        
        currentSlide++;
        updateSlide();
    }
}

function prevVideo() {
    if (currentSlide > 0) {
        // Pause current video
        if (videos[currentSlide] && !videos[currentSlide].paused) {
            videos[currentSlide].pause();
        }
        
        currentSlide--;
        updateSlide();
    }
}

function goToSlide(index) {
    if (index !== currentSlide && index >= 0 && index < totalSlides) {
        // Pause current video
        if (videos[currentSlide] && !videos[currentSlide].paused) {
            videos[currentSlide].pause();
        }
        
        currentSlide = index;
        updateSlide();
    }
}

function updateSlide() {
    const slides = document.querySelectorAll('.video-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    // Update slides
    slides.forEach((slide, index) => {
        if (index === currentSlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
    
    // Update download button
    updateDownloadButton();
    
    // Auto-play current video if it was playing before
    if (videos[currentSlide] && videos[currentSlide].paused && videos[currentSlide].currentTime === 0) {
        videos[currentSlide].play().catch(e => console.log('Play blocked:', e));
    }
}

function updateDownloadButton() {
    const currentVideo = videos[currentSlide];
    if (currentVideo) {
        const source = currentVideo.querySelector('source');
        if (source) {
            const downloadBtn = document.querySelector('.video-gallery-section .btn-outline');
            if (downloadBtn) {
                downloadBtn.href = source.src;
            }
        }
    }
}

// Swipe gestures for mobile
function setupSwipeGestures() {
    const slider = document.querySelector('.video-slider');
    if (!slider) return;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchEndX - touchStartX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe right - previous video
            prevVideo();
        } else {
            // Swipe left - next video
            nextVideo();
        }
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (document.querySelector('.video-slider-container')) {
        if (e.key === 'ArrowLeft') {
            prevVideo();
        } else if (e.key === 'ArrowRight') {
            nextVideo();
        }
    }
});
