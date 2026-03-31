// frontend/js/auth.js - Complete Google Authentication

class GoogleAuth {
    constructor() {
        this.user = null;
        this.apiUrl = 'https://beauty-bar-backend.onrender.com/api';
        // REPLACE WITH YOUR ACTUAL GOOGLE CLIENT ID
        this.clientId = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
        this.init();
    }

    init() {
        console.log('🔐 GoogleAuth initializing...');
        
        // Check for existing session
        this.checkSession();
        
        // Load Google Identity Services
        this.loadGoogleScript();
        
        // Setup UI elements
        this.setupEventListeners();
    }

    loadGoogleScript() {
        // Remove existing script if any
        const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        if (existingScript) existingScript.remove();
        
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
            console.log('✅ Google Identity Services loaded');
            this.initializeGoogleSignIn();
        };
        script.onerror = () => {
            console.error('❌ Failed to load Google Identity Services');
            this.showToast('Failed to load Google Sign-In. Please refresh the page.', 'error');
        };
        document.head.appendChild(script);
    }

    initializeGoogleSignIn() {
        if (typeof google === 'undefined') {
            console.error('❌ Google SDK not loaded');
            return;
        }

        try {
            // Initialize Google Identity Services
            google.accounts.id.initialize({
                client_id: this.clientId,
                callback: this.handleCredentialResponse.bind(this),
                auto_select: false,
                cancel_on_tap_outside: true,
                context: 'signin',
                ux_mode: 'popup'
            });

            // Render the Google Sign-In button
            const buttonContainer = document.getElementById('googleSignInButton');
            if (buttonContainer) {
                google.accounts.id.renderButton(buttonContainer, {
                    theme: 'outline',
                    size: 'large',
                    text: 'continue_with',
                    shape: 'rectangular',
                    width: 300
                });
                console.log('✅ Google Sign-In button rendered');
            }

            // Also attach click handler to custom button
            const googleLoginBtn = document.getElementById('googleLogin');
            if (googleLoginBtn) {
                googleLoginBtn.addEventListener('click', () => {
                    console.log('🖱️ Custom Google login button clicked');
                    google.accounts.id.prompt();
                });
            }

            console.log('✅ Google Sign-In initialized');
        } catch (error) {
            console.error('❌ Failed to initialize Google Sign-In:', error);
            this.showToast('Failed to initialize Google Sign-In', 'error');
        }
    }

    async handleCredentialResponse(response) {
        console.log('🔑 Google credential received');
        
        // Show loading state
        this.showLoading(true);
        
        try {
            // Send credential to your backend for verification
            const apiResponse = await fetch(`${this.apiUrl}/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    credential: response.credential
                })
            });

            const data = await apiResponse.json();

            if (data.success) {
                console.log('✅ Login successful:', data.user.email);
                
                // Store user data
                this.user = data.user;
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('loginTime', Date.now().toString());
                
                // Update UI
                this.updateUIForLoggedInUser();
                this.closeModal();
                this.showToast(`Welcome back, ${this.user.name}! 🎉`, 'success');
                
                // Redirect if on specific pages
                this.handleRedirect();
                
                // Trigger any custom events
                document.dispatchEvent(new CustomEvent('userLoggedIn', { detail: this.user }));
                
                // Reload page to update all elements
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                console.error('❌ Login failed:', data.message);
                this.showToast(data.message || 'Login failed. Please try again.', 'error');
                this.resetGoogleState();
            }
        } catch (error) {
            console.error('❌ Login error:', error);
            this.showToast('Network error. Please check your connection.', 'error');
            this.resetGoogleState();
        } finally {
            this.showLoading(false);
        }
    }

    resetGoogleState() {
        if (typeof google !== 'undefined') {
            google.accounts.id.cancel();
            setTimeout(() => {
                google.accounts.id.initialize({
                    client_id: this.clientId,
                    callback: this.handleCredentialResponse.bind(this),
                    auto_select: false
                });
            }, 1000);
        }
    }

    checkSession() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        const loginTime = localStorage.getItem('loginTime');
        
        const isValidSession = loginTime && (Date.now() - parseInt(loginTime) < 7 * 24 * 60 * 60 * 1000);
        
        if (token && user && isValidSession) {
            this.user = JSON.parse(user);
            this.updateUIForLoggedInUser();
            this.verifyToken(token);
            console.log('✅ Session restored for:', this.user.email);
        } else if (token && user && !isValidSession) {
            console.log('⚠️ Session expired');
            this.logout();
        }
    }

    async verifyToken(token) {
        try {
            const response = await fetch(`${this.apiUrl}/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Token verification failed');
            }
            
            const data = await response.json();
            if (data.valid === false) {
                console.log('⚠️ Token invalid, logging out');
                this.logout();
            } else {
                console.log('✅ Token verified');
            }
        } catch (error) {
            console.error('❌ Token verification error:', error);
        }
    }

    setupEventListeners() {
        // Desktop login button
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                console.log('🖱️ Desktop login button clicked');
                if (this.isAuthenticated()) {
                    this.showLogoutConfirm();
                } else {
                    this.openModal();
                }
            });
        }
        
        // Mobile login button
        const mobileLoginBtn = document.getElementById('loginBtnMobile');
        if (mobileLoginBtn) {
            mobileLoginBtn.addEventListener('click', () => {
                console.log('📱 Mobile login button clicked');
                if (this.isAuthenticated()) {
                    this.showLogoutConfirm();
                } else {
                    this.openModal();
                }
            });
        }
        
        // Close modal button
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }
        
        // Close modal on outside click
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
        }
    }

    openModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('🔓 Login modal opened');
        }
    }

    closeModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            console.log('🔒 Login modal closed');
        }
    }

    updateUIForLoggedInUser() {
        const desktopLoginBtn = document.getElementById('loginBtn');
        const mobileLoginBtn = document.getElementById('loginBtnMobile');
        
        if (this.user) {
            const userName = this.user.name.split(' ')[0];
            const userAvatar = this.user.picture ? `<img src="${this.user.picture}" style="width: 32px; height: 32px; border-radius: 50%; margin-right: 8px;">` : '<i class="fas fa-user-circle"></i>';
            
            if (desktopLoginBtn) {
                desktopLoginBtn.innerHTML = `${userAvatar} ${userName}`;
                desktopLoginBtn.classList.remove('btn-outline');
                desktopLoginBtn.classList.add('btn-primary');
            }
            
            if (mobileLoginBtn) {
                mobileLoginBtn.innerHTML = `${userAvatar} ${userName}`;
                mobileLoginBtn.classList.remove('btn-outline');
                mobileLoginBtn.classList.add('btn-primary');
            }
            
            console.log('✅ UI updated for logged-in user:', userName);
        }
    }

    showLogoutConfirm() {
        if (confirm('Are you sure you want to logout?')) {
            this.logout();
        }
    }

    logout() {
        if (typeof google !== 'undefined') {
            google.accounts.id.disableAutoSelect();
        }
        
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('loginTime');
        
        const desktopLoginBtn = document.getElementById('loginBtn');
        const mobileLoginBtn = document.getElementById('loginBtnMobile');
        
        if (desktopLoginBtn) {
            desktopLoginBtn.innerHTML = 'Login';
            desktopLoginBtn.classList.add('btn-outline');
            desktopLoginBtn.classList.remove('btn-primary');
        }
        
        if (mobileLoginBtn) {
            mobileLoginBtn.innerHTML = 'Login';
            mobileLoginBtn.classList.add('btn-outline');
            mobileLoginBtn.classList.remove('btn-primary');
        }
        
        this.showToast('Logged out successfully', 'info');
        console.log('🔓 User logged out');
        
        // Reload page to reset state
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    handleRedirect() {
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
            sessionStorage.removeItem('redirectAfterLogin');
            window.location.href = redirectUrl;
        }
    }

    isAuthenticated() {
        return this.user !== null && localStorage.getItem('token') !== null;
    }

    getUser() {
        return this.user;
    }

    getToken() {
        return localStorage.getItem('token');
    }

    showLoading(show) {
        const modal = document.getElementById('loginModal');
        if (modal) {
            if (show) {
                modal.classList.add('loading');
                const spinner = document.createElement('div');
                spinner.className = 'loading-spinner';
                spinner.id = 'loginSpinner';
                modal.appendChild(spinner);
            } else {
                modal.classList.remove('loading');
                const spinner = document.getElementById('loginSpinner');
                if (spinner) spinner.remove();
            }
        }
    }

    showToast(message, type = 'info') {
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };
        
        toast.innerHTML = `
            <i class="fas ${icons[type] || icons.info}"></i>
            <span>${message}</span>
        `;
        
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#2196F3'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize auth
let auth;
document.addEventListener('DOMContentLoaded', () => {
    auth = new GoogleAuth();
    window.auth = auth;
});

// Add animation styles
const addAuthStyles = () => {
    if (!document.querySelector('#auth-styles')) {
        const style = document.createElement('style');
        style.id = 'auth-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .modal.loading .modal-content {
                opacity: 0.5;
                pointer-events: none;
            }
            .loading-spinner {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 40px;
                height: 40px;
                border: 3px solid var(--secondary);
                border-top-color: var(--primary);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                z-index: 1001;
            }
            @keyframes spin {
                to { transform: translate(-50%, -50%) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
};

addAuthStyles();
