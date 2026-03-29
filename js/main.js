// frontend/js/main.js
// Complete Main JavaScript for Beauty Bar Salon
// Hamburger Menu Functionality
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburgerMenu');
    const navLinks = document.getElementById('navLinks');
    const mobileLoginBtn = document.getElementById('loginBtnMobile');
    const desktopLoginBtn = document.getElementById('loginBtn');
    
    if (!hamburger || !navLinks) {
        console.log('Hamburger or navLinks not found');
        return;
    }
    
    // Toggle menu when hamburger is clicked
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking a link
    const allLinks = navLinks.querySelectorAll('a');
    allLinks.forEach(link => {
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
        mobileLoginBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.auth) {
                if (window.auth.isAuthenticated()) {
                    if (confirm('Do you want to logout?')) {
                        window.auth.logout();
                    }
                } else {
                    window.auth.openModal();
                }
            }
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Desktop login button
    if (desktopLoginBtn) {
        desktopLoginBtn.addEventListener('click', () => {
            if (window.auth) {
                if (window.auth.isAuthenticated()) {
                    if (confirm('Do you want to logout?')) {
                        window.auth.logout();
                    }
                } else {
                    window.auth.openModal();
                }
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initHamburgerMenu();
});

// Update login button UI
function updateLoginButtons() {
    const desktopBtn = document.getElementById('loginBtn');
    const mobileBtn = document.getElementById('loginBtnMobile');
    
    if (!window.auth) return;
    
    const isLoggedIn = window.auth.isAuthenticated();
    const userName = window.auth.getUser()?.name?.split(' ')[0] || '';
    
    if (desktopBtn) {
        if (isLoggedIn) {
            desktopBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${userName}`;
            desktopBtn.classList.remove('btn-outline');
            desktopBtn.classList.add('btn-primary');
        } else {
            desktopBtn.innerHTML = 'Login';
            desktopBtn.classList.add('btn-outline');
            desktopBtn.classList.remove('btn-primary');
        }
    }
    
    if (mobileBtn) {
        if (isLoggedIn) {
            mobileBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${userName}`;
            mobileBtn.classList.remove('btn-outline');
            mobileBtn.classList.add('btn-primary');
        } else {
            mobileBtn.innerHTML = 'Login';
            mobileBtn.classList.add('btn-outline');
            mobileBtn.classList.remove('btn-primary');
        }
    }
}

// ============================================
// VIDEO GALLERY SLIDER FUNCTIONALITY
// ============================================

let currentSlide = 0;
let totalSlides = 0;
let videos = [];
let touchStartX = 0;
let touchEndX = 0;

function initVideoSlider() {
    const slides = document.querySelectorAll('.video-slide');
    if (slides.length === 0) return;
    
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
    setupSwipeGestures();
    
    // Autoplay first video muted
    if (videos[0]) {
        videos[0].muted = true;
        videos[0].play().catch(e => console.log('Autoplay blocked:', e));
    }
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
        const overlay = video.parentElement?.querySelector('.video-overlay');
        if (overlay) overlay.classList.add('hide');
    });
    
    // Handle video pause
    video.addEventListener('pause', () => {
        const overlay = video.parentElement?.querySelector('.video-overlay');
        if (overlay && video.currentTime < video.duration && !video.ended) {
            overlay.classList.remove('hide');
        }
    });
    
    // Handle video end
    video.addEventListener('ended', () => {
        const overlay = video.parentElement?.querySelector('.video-overlay');
        if (overlay) overlay.classList.remove('hide');
    });
    
    // Ensure video plays at best quality
    video.style.transform = 'translateZ(0)';
    video.style.backfaceVisibility = 'hidden';
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
        if (videos[currentSlide] && !videos[currentSlide].paused) {
            videos[currentSlide].pause();
        }
        currentSlide++;
        updateSlide();
    }
}

function prevVideo() {
    if (currentSlide > 0) {
        if (videos[currentSlide] && !videos[currentSlide].paused) {
            videos[currentSlide].pause();
        }
        currentSlide--;
        updateSlide();
    }
}

function goToSlide(index) {
    if (index !== currentSlide && index >= 0 && index < totalSlides) {
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
    
    slides.forEach((slide, index) => {
        if (index === currentSlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    
    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
    
    updateDownloadButton();
    
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

function updateIndicators() {
    const indicatorsContainer = document.getElementById('videoIndicators');
    if (!indicatorsContainer) return;
    
    indicatorsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('span');
        indicator.className = 'indicator' + (i === currentSlide ? ' active' : '');
        indicator.onclick = () => goToSlide(i);
        indicatorsContainer.appendChild(indicator);
    }
}

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
            prevVideo();
        } else {
            nextVideo();
        }
    }
}

// ============================================
// VIDEO PLAYER FUNCTIONS
// ============================================

function togglePlayPause() {
    const video = document.getElementById('salonVideo');
    if (video) {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }
}

function toggleLoop() {
    const video = document.getElementById('salonVideo');
    if (!video) return;
    
    const isLooping = !video.loop;
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
}

function downloadVideo() {
    const videoUrl = 'assets/videos/salon-tour.mp4';
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = 'beauty-bar-salon-tour.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ============================================
// NAVIGATION & UI FUNCTIONS
// ============================================

function initNavigation() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    // Handle window resize for mobile menu
    function handleResize() {
        const navLinks = document.querySelector('.nav-links');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (window.innerWidth > 768) {
            if (navLinks) navLinks.style.display = 'flex';
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

function initBackToTop() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.className = 'back-to-top';
    btn.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: #B76E79;
        color: white;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        display: none;
        z-index: 998;
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

function initNewsletterForm() {
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

// ============================================
// SERVICE & TEAM LOADING (using DataService)
// ============================================

function loadServicesFromData() {
    const servicesGrid = document.getElementById('services-grid');
    if (!servicesGrid) return;
    
    if (!window.dataService) {
        servicesGrid.innerHTML = '<p style="text-align: center;">Loading services...</p>';
        return;
    }
    
    const services = window.dataService.getServices();
    
    if (services.length === 0) {
        servicesGrid.innerHTML = '<p style="text-align: center;">No services available yet.</p>';
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

function loadTeamFromData() {
    const teamGrid = document.getElementById('team-grid');
    if (!teamGrid) return;
    
    if (!window.dataService) {
        teamGrid.innerHTML = '<p style="text-align: center;">Loading team...</p>';
        return;
    }
    
    const staff = window.dataService.getStaff();
    
    if (staff.length === 0) {
        teamGrid.innerHTML = '<p style="text-align: center;">No team members available yet.</p>';
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

// ============================================
// KEYBOARD NAVIGATION
// ============================================

function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (document.querySelector('.video-slider-container')) {
            if (e.key === 'ArrowLeft') {
                if (typeof prevVideo === 'function') prevVideo();
            } else if (e.key === 'ArrowRight') {
                if (typeof nextVideo === 'function') nextVideo();
            }
        }
        
        if (e.key === 'Escape') {
            const modal = document.getElementById('loginModal');
            if (modal && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    });
}

// ============================================
// PWA INSTALL PROMPT
// ============================================

let deferredPrompt;

function initPWA() {
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('beforeinstallprompt fired');
        e.preventDefault();
        deferredPrompt = e;
        showInstallButton();
    });
    
    window.addEventListener('appinstalled', () => {
        console.log('App installed');
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
// SERVICE WORKER REGISTRATION
// ============================================

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
            .then(registration => {
                console.log('Service Worker registered:', registration);
                
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('New service worker installing...');
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                       console.log('New update available!');
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }
}

function showUpdateNotification() {
    const notif = document.createElement('div');
    notif.innerHTML = `
        <div style="position: fixed; bottom: 80px; right: 20px; background: white; padding: 12px 20px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); z-index: 9999; display: flex; gap: 12px; align-items: center;">
            <span>✨ New update available!</span>
            <button onclick="location.reload()" style="background: #B76E79; color: white; border: none; padding: 6px 16px; border-radius: 30px; cursor: pointer;">Update</button>
        </div>
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 10000);
}

// ============================================
// IOS INSTALL INSTRUCTIONS
// ============================================

function showIOSInstallInstructions() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS && !window.navigator.standalone) {
        setTimeout(() => {
            const iosPrompt = document.createElement('div');
            iosPrompt.className = 'ios-prompt';
            iosPrompt.innerHTML = `
                <div class="ios-prompt-content">
                    <i class="fab fa-apple"></i>
                    <h4>Install Beauty Bar App</h4>
                    <p>Tap <i class="fas fa-share-alt"></i> Share → "Add to Home Screen"</p>
                    <button onclick="this.parentElement.parentElement.remove()">Got it</button>
                </div>
            `;
            document.body.appendChild(iosPrompt);
            setTimeout(() => iosPrompt.remove(), 8000);
        }, 2000);
    }
}

// ============================================
// ADD CSS STYLES
// ============================================

function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Install Button */
        #installBtn {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: linear-gradient(135deg, #B76E79, #F8D7DA);
            color: white;
            border: none;
            border-radius: 50px;
            padding: 12px 24px;
            cursor: pointer;
            z-index: 999;
            display: none;
            font-weight: 500;
            gap: 8px;
            align-items: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        
        #installBtn:hover {
            transform: translateY(-2px);
        }
        
        /* iOS Prompt */
        .ios-prompt {
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            z-index: 1000;
            max-width: 320px;
            animation: slideUp 0.3s;
        }
        
        .ios-prompt-content {
            padding: 16px;
            text-align: center;
        }
        
        .ios-prompt-content h4 {
            margin: 8px 0;
            color: #B76E79;
        }
        
        .ios-prompt-content button {
            width: 100%;
            padding: 10px;
            background: #B76E79;
            color: white;
            border: none;
            border-radius: 40px;
            cursor: pointer;
            margin-top: 12px;
            font-weight: 500;
        }
        
        /* Back to Top Button */
        .back-to-top:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 12px rgba(183, 110, 121, 0.3);
        }
        
        /* Mobile Menu Styles */
        @media (max-width: 768px) {
            #installBtn {
                bottom: 80px;
                left: 50%;
                transform: translateX(-50%);
                white-space: nowrap;
            }
            
            .nav-links {
                position: fixed;
                top: 70px;
                left: -100%;
                width: 80%;
                height: calc(100vh - 70px);
                background: white;
                flex-direction: column;
                padding: 2rem;
                transition: left 0.3s ease;
                box-shadow: 2px 0 20px rgba(0,0,0,0.1);
                z-index: 999;
            }
            
            .nav-links.active {
                left: 0;
            }
        }
        
        @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateX(-50%) translateY(20px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Main.js loaded - Initializing all features');
    
    // Add styles
    addStyles();
    
    // Initialize navigation
    initNavigation();
    initSmoothScroll();
    initBackToTop();
    initNewsletterForm();
    initFloatingWhatsApp();
    setupKeyboardNavigation();
    
    // Initialize hamburger menu
    initHamburgerMenu();
    
    // Initialize video slider if it exists
    initVideoSlider();
    
    // Initialize PWA features
    initPWA();
    registerServiceWorker();
    showIOSInstallInstructions();
    
    // Wait for data service to load services and team
    const waitForData = setInterval(() => {
        if (window.dataService) {
            clearInterval(waitForData);
            console.log('Data service found, loading content...');
            loadServicesFromData();
            loadTeamFromData();
            
            // Listen for data changes from admin panel
            window.dataService.subscribe(() => {
                console.log('Data updated, refreshing homepage...');
                loadServicesFromData();
                loadTeamFromData();
            });
        }
    }, 100);
    
    // Update login buttons
    updateLoginButtons();
    
    // Listen for auth changes
    if (window.auth) {
        const originalUpdate = window.auth.updateUIForLoggedInUser;
        window.auth.updateUIForLoggedInUser = function() {
            if (originalUpdate) originalUpdate.call(window.auth);
            updateLoginButtons();
        };
    }
});

// Export functions for global use
window.playVideo = playVideo;
window.nextVideo = nextVideo;
window.prevVideo = prevVideo;
window.goToSlide = goToSlide;
window.togglePlayPause = togglePlayPause;
window.toggleLoop = toggleLoop;
window.downloadVideo = downloadVideo;
