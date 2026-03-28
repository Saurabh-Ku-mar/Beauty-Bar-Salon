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
// Video Player Functionality - Fixed Version
function playVideo() {
    const video = document.getElementById('salonVideo');
    
    if (video) {
        // Try to play the video
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Video playing successfully');
                // Hide any overlay if exists
                const overlay = document.getElementById('videoOverlay');
                if (overlay) overlay.style.display = 'none';
            }).catch(error => {
                console.log('Playback failed:', error);
                // Show user-friendly message
                alert('Please click the video play button to watch. Autoplay is blocked by your browser.');
            });
        }
    } else {
        console.error('Video element not found');
        alert('Video not found. Please check if the video file exists in assets/videos/');
    }
}

function downloadVideo() {
    const videoUrl = 'assets/tour.mp4';
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = 'assets/tour.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Alternative: Show play button overlay on video
function setupVideoWithControls() {
    const video = document.getElementById('salonVideo');
    
    if (video) {
        // Add click-to-play functionality
        video.addEventListener('click', () => {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });
        
        // Log when video starts playing
        video.addEventListener('play', () => {
            console.log('Video started playing');
        });
        
        // Log when video ends
        video.addEventListener('ended', () => {
            console.log('Video finished');
        });
        
        // Handle errors
        video.addEventListener('error', (e) => {
            console.error('Video error:', e);
            const errorMessage = document.createElement('div');
            errorMessage.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
            `;
            errorMessage.innerHTML = `
                <i class="fas fa-exclamation-circle" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <p>Video cannot be played.</p>
                <p>Please <a href="assets/tour.mp4" download style="color: var(--primary);">download the video</a> to watch.</p>
            `;
            video.parentElement.appendChild(errorMessage);
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    setupVideoWithControls();
    
    // Check if video exists
    const video = document.getElementById('salonVideo');
    if (video) {
        // Test if video source loads
        video.addEventListener('loadeddata', () => {
            console.log('Video loaded successfully');
        });
        
        video.addEventListener('error', () => {
            console.error('Video failed to load');
            // Show download link if video fails
            const container = video.parentElement;
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                text-align: center;
                padding: 40px;
                background: #f8f9fa;
                border-radius: 20px;
                margin-top: 20px;
            `;
            errorDiv.innerHTML = `
                <i class="fas fa-video-slash" style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;"></i>
                <h3>Video Preview Not Available</h3>
                <p>Click below to download and watch our salon tour</p>
                <a href="assets/videos/salon-tour.mp4" download class="btn btn-primary" style="margin-top: 1rem;">
                    <i class="fas fa-download"></i> Download Video (45 sec)
                </a>
            `;
            container.parentElement.appendChild(errorDiv);
        });
    }
});
