// frontend/js/main.js
// Complete Main JavaScript for Beauty Bar Salon

// ============================================
// PWA INSTALL PROMPT & NOTIFICATIONS
// ============================================

let deferredPrompt;

// Show install prompt
function initInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('Before install prompt triggered');
        e.preventDefault();
        deferredPrompt = e;
        
        // Show custom install button
        showInstallButton();
    });
    
    window.addEventListener('appinstalled', (evt) => {
        console.log('App was installed');
        hideInstallButton();
        showToast('Beauty Bar Salon installed successfully! 🎉', 'success');
        playNotificationSound();
    });
}

function showInstallButton() {
    let installBtn = document.getElementById('installAppBtn');
    if (!installBtn) {
        installBtn = document.createElement('button');
        installBtn.id = 'installAppBtn';
        installBtn.className = 'install-app-btn';
        installBtn.innerHTML = '<i class="fas fa-download"></i> Install App';
        installBtn.onclick = installApp;
        document.body.appendChild(installBtn);
    }
    installBtn.style.display = 'flex';
}

function hideInstallButton() {
    const installBtn = document.getElementById('installAppBtn');
    if (installBtn) {
        installBtn.style.display = 'none';
    }
}

function installApp() {
    if (!deferredPrompt) {
        console.log('No install prompt available');
        return;
    }
    
    deferredPrompt.prompt();
    
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted install prompt');
            playNotificationSound();
        } else {
            console.log('User dismissed install prompt');
        }
        deferredPrompt = null;
    });
}

// ============================================
// NOTIFICATION SOUND & PUSH NOTIFICATIONS
// ============================================

function playNotificationSound() {
    const audio = document.getElementById('notificationSound');
    if (audio) {
        audio.play().catch(e => console.log('Sound play failed:', e));
    }
}

// Request notification permission
async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return false;
    }
    
    if (Notification.permission === 'granted') {
        console.log('Notification permission already granted');
        return true;
    }
    
    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }
    
    return false;
}

// Show local notification
function showLocalNotification(title, body, url = '/') {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        return;
    }
    
    playNotificationSound();
    
    const options = {
        body: body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        data: { url: url },
        actions: [
            { action: 'view', title: 'View' },
            { action: 'dismiss', title: 'Dismiss' }
        ]
    };
    
    const notification = new Notification(title, options);
    
    notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        window.location.href = url;
        notification.close();
    };
    
    setTimeout(() => {
        notification.close();
    }, 10000);
}

// Booking reminder notification
function scheduleBookingReminder(booking) {
    const bookingDate = new Date(booking.date);
    const reminderTime = new Date(bookingDate.getTime() - 24 * 60 * 60 * 1000);
    
    if (reminderTime > new Date()) {
        const timeUntilReminder = reminderTime - new Date();
        
        setTimeout(() => {
            showLocalNotification(
                'Upcoming Appointment Reminder',
                `You have a ${booking.serviceName} appointment tomorrow at ${booking.time}`,
                '/history.html'
            );
        }, timeUntilReminder);
    }
}

// Send push notification to server (for future use)
async function sendPushNotification(subscription, payload) {
    try {
        const response = await fetch('/api/notifications/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subscription, payload }),
        });
        return response.ok;
    } catch (error) {
        console.error('Failed to send push notification:', error);
        return false;
    }
}

// Subscribe to push notifications
async function subscribeToPushNotifications() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.log('Push notifications not supported');
        return;
    }
    
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
        });
        
        console.log('Push subscription:', subscription);
        
        // Send subscription to server
        await fetch('/api/notifications/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription),
        });
        
        return subscription;
    } catch (error) {
        console.error('Failed to subscribe to push notifications:', error);
    }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// ============================================
// PWA REGISTRATION
// ============================================

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
                
                // Check for updates
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
                
                // Check for existing push subscription
                registration.pushManager.getSubscription().then(subscription => {
                    if (subscription) {
                        console.log('Already subscribed to push notifications');
                    }
                });
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
        
        // Handle messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
            console.log('Message from service worker:', event.data);
            if (event.data.type === 'SYNC_BOOKINGS') {
                showLocalNotification(
                    'Bookings Synced',
                    'Your offline bookings have been synced successfully!',
                    '/history.html'
                );
            }
        });
    }
}

function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <div class="update-content">
            <i class="fas fa-sync-alt"></i>
            <span>New version available!</span>
            <button onclick="location.reload()">Update Now</button>
            <button onclick="this.parentElement.parentElement.remove()">Later</button>
        </div>
    `;
    document.body.appendChild(notification);
    
    playNotificationSound();
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 10000);
}

// ============================================
// IOS INSTALL INSTRUCTION
// ============================================

function showIOSInstallInstructions() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS && !window.navigator.standalone) {
        const iosPrompt = document.createElement('div');
        iosPrompt.className = 'ios-install-prompt';
        iosPrompt.innerHTML = `
            <div class="ios-prompt-content">
                <i class="fab fa-apple"></i>
                <h4>Install Beauty Bar App</h4>
                <ol>
                    <li>Tap <i class="fas fa-square"></i> Share button</li>
                    <li>Tap "Add to Home Screen"</li>
                    <li>Tap "Add" to install</li>
                </ol>
                <button onclick="this.parentElement.parentElement.remove()">Got it</button>
            </div>
        `;
        document.body.appendChild(iosPrompt);
        
        setTimeout(() => {
            if (iosPrompt.parentElement) {
                iosPrompt.remove();
            }
        }, 10000);
    }
}

// ============================================
// TOAST NOTIFICATION
// ============================================

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    playNotificationSound();
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// CSS STYLES FOR PWA ELEMENTS
// ============================================

const pwaStyles = document.createElement('style');
pwaStyles.textContent = `
    /* Install App Button */
    .install-app-btn {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: var(--gradient);
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 24px;
        cursor: pointer;
        z-index: 1000;
        display: none;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        font-weight: 500;
        font-size: 0.9rem;
        gap: 8px;
        align-items: center;
        transition: all 0.3s;
    }
    
    .install-app-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(183, 110, 121, 0.4);
    }
    
    /* Update Notification */
    .update-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s;
        border-left: 4px solid var(--primary);
    }
    
    .update-content {
        padding: 15px 20px;
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
    }
    
    .update-content button {
        padding: 6px 15px;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        background: var(--primary);
        color: white;
    }
    
    .update-content button:last-child {
        background: #ddd;
        color: #666;
    }
    
    /* iOS Install Prompt */
    .ios-install-prompt {
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 1000;
        max-width: 320px;
        animation: slideIn 0.3s;
    }
    
    .ios-prompt-content {
        padding: 15px;
        text-align: center;
    }
    
    .ios-prompt-content h4 {
        margin: 10px 0;
        color: var(--primary);
    }
    
    .ios-prompt-content ol {
        margin: 10px 0;
        padding-left: 20px;
        text-align: left;
    }
    
    .ios-prompt-content button {
        width: 100%;
        padding: 8px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        margin-top: 10px;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @media (max-width: 768px) {
        .install-app-btn {
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            white-space: nowrap;
        }
        
        .install-app-btn:hover {
            transform: translateX(-50%) translateY(-2px);
        }
    }
`;
document.head.appendChild(pwaStyles);

// ============================================
// INITIALIZE PWA FEATURES
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Register Service Worker
    registerServiceWorker();
    
    // Initialize install prompt
    initInstallPrompt();
    
    // Show iOS install instructions
    showIOSInstallInstructions();
    
    // Request notification permission
    setTimeout(() => {
        requestNotificationPermission();
    }, 5000);
    
    // Add install button to floating WhatsApp button area
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (whatsappFloat) {
        const installHint = document.createElement('div');
        installHint.className = 'install-hint';
        installHint.innerHTML = '<i class="fas fa-download"></i> Install App';
        installHint.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 20px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.7rem;
            z-index: 997;
            cursor: pointer;
        `;
        installHint.onclick = installApp;
        document.body.appendChild(installHint);
        
        setTimeout(() => {
            installHint.remove();
        }, 5000);
    }
});
// ============================================
// HAMBURGER MENU FUNCTIONALITY - FIXED
// ============================================

function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburgerMenu');
    const navLinks = document.getElementById('navLinks');
    const mobileLoginBtn = document.getElementById('loginBtnMobile');
    const desktopLoginBtn = document.getElementById('loginBtn');
    
    if (!hamburger || !navLinks) {
        console.log('Hamburger or navLinks not found');
        return;
    }
    
    console.log('Hamburger menu initialized');
    
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
            // Close menu
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initHamburgerMenu();
    updateLoginButtons();
    
    // Update login buttons when auth changes
    if (window.auth) {
        const originalUpdate = window.auth.updateUIForLoggedInUser;
        window.auth.updateUIForLoggedInUser = function() {
            if (originalUpdate) originalUpdate.call(window.auth);
            updateLoginButtons();
        };
    }
});
        
        // Also check periodically for auth changes
        setInterval(() => {
            updateLoginButtonUI();
        }, 500);
    }
});
// frontend/js/main.js - Add these functions

function initMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    const mobileLoginBtn = document.getElementById('loginBtnMobile');
    const desktopLoginBtn = document.getElementById('loginBtn');
    
    // Mobile menu toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Change icon when menu is open
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Mobile login button - open modal
    if (mobileLoginBtn) {
        mobileLoginBtn.addEventListener('click', () => {
            if (window.auth && window.auth.isAuthenticated()) {
                // If logged in, show logout option
                if (confirm('Do you want to logout?')) {
                    window.auth.logout();
                }
            } else {
                // Open login modal
                if (window.auth) {
                    window.auth.openModal();
                }
                // Close mobile menu after clicking login
                if (navLinks) navLinks.classList.remove('active');
                if (menuToggle) {
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
    
    // Desktop login button
    if (desktopLoginBtn) {
        desktopLoginBtn.addEventListener('click', () => {
            if (window.auth && window.auth.isAuthenticated()) {
                if (confirm('Do you want to logout?')) {
                    window.auth.logout();
                }
            } else {
                if (window.auth) window.auth.openModal();
            }
        });
    }
}

// Update the login button UI based on auth state
function updateLoginButtonUI() {
    const desktopLoginBtn = document.getElementById('loginBtn');
    const mobileLoginBtn = document.getElementById('loginBtnMobile');
    
    if (!window.auth) return;
    
    const isLoggedIn = window.auth.isAuthenticated();
    const userName = window.auth.getUser()?.name?.split(' ')[0] || '';
    
    if (desktopLoginBtn) {
        if (isLoggedIn) {
            desktopLoginBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${userName}`;
            desktopLoginBtn.classList.remove('btn-outline');
            desktopLoginBtn.classList.add('btn-primary');
        } else {
            desktopLoginBtn.innerHTML = 'Login';
            desktopLoginBtn.classList.add('btn-outline');
            desktopLoginBtn.classList.remove('btn-primary');
        }
    }
    
    if (mobileLoginBtn) {
        if (isLoggedIn) {
            mobileLoginBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${userName}`;
            mobileLoginBtn.classList.remove('btn-outline');
            mobileLoginBtn.classList.add('btn-primary');
        } else {
            mobileLoginBtn.innerHTML = 'Login';
            mobileLoginBtn.classList.add('btn-outline');
            mobileLoginBtn.classList.remove('btn-primary');
        }
    }
}

// Add to your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Update login button UI
    updateLoginButtonUI();
    
    // Listen for auth changes
    if (window.auth) {
        // Create a custom event listener for auth changes
        const originalUpdateUI = window.auth.updateUIForLoggedInUser;
        window.auth.updateUIForLoggedInUser = function() {
            if (originalUpdateUI) originalUpdateUI.call(window.auth);
            updateLoginButtonUI();
        };
        
        // Also check on interval for auth changes
        setInterval(() => {
            updateLoginButtonUI();
        }, 1000);
    }
});

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
                if (navLinks.style.display === 'none') {
                    navLinks.style.display = 'flex';
                    navLinks.style.flexDirection = 'column';
                } else {
                    navLinks.style.display = 'none';
                }
            });
        }
        navbar.appendChild(menuToggle);
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
        servicesGrid.innerHTML = '<p style="text-align: center; color: red;">Loading services...</p>';
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
        // Video slider navigation
        if (document.querySelector('.video-slider-container')) {
            if (e.key === 'ArrowLeft') {
                if (typeof prevVideo === 'function') prevVideo();
            } else if (e.key === 'ArrowRight') {
                if (typeof nextVideo === 'function') nextVideo();
            }
        }
        
        // Escape key to close modals
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
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Main.js loaded');
    
    // Initialize all components
    initNavigation();
    initSmoothScroll();
    initBackToTop();
    initNewsletterForm();
    initFloatingWhatsApp();
    setupKeyboardNavigation();
    
    // Initialize video slider if it exists
    initVideoSlider();
    
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
});

// ============================================
// ADD CSS FOR MOBILE MENU & BACK TO TOP
// ============================================

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
    
    /* Toast Notifications */
    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        padding: 12px 20px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 2000;
        animation: slideIn 0.3s ease;
    }
    
    .toast.success {
        border-left: 4px solid #4CAF50;
    }
    
    .toast.error {
        border-left: 4px solid #f44336;
    }
    
    .toast.info {
        border-left: 4px solid var(--primary);
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
