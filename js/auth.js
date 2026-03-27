// Google Authentication Module
class GoogleAuth {
    constructor() {
        this.user = null;
        this.init();
    }

    init() {
        // Check for existing session
        this.checkSession();
        
        // Load Google Identity Services
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        script.onload = () => {
            this.initializeGoogleSignIn();
        };
        
        // Setup login button
        this.setupLoginButton();
    }

    initializeGoogleSignIn() {
        if (typeof google !== 'undefined') {
            google.accounts.id.initialize({
                client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google Client ID
                callback: this.handleCredentialResponse.bind(this),
                auto_select: false,
                cancel_on_tap_outside: true
            });
        }
    }

    async handleCredentialResponse(response) {
        try {
            // Send credential to backend for verification
            const verifyResponse = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ credential: response.credential })
            });

            const data = await verifyResponse.json();

            if (data.success) {
                this.user = data.user;
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                this.showToast('Login successful! Welcome back!', 'success');
                this.closeModal();
                this.updateUIForLoggedInUser();
                
                // Redirect if on booking page
                if (window.location.pathname.includes('booking.html')) {
                    this.loadUserDetails();
                }
            } else {
                this.showToast(data.message || 'Login failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showToast('Login failed. Please try again.', 'error');
        }
    }

    checkSession() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token && user) {
            this.user = JSON.parse(user);
            this.updateUIForLoggedInUser();
            this.verifyToken(token);
        }
    }

    async verifyToken(token) {
        try {
            const response = await fetch('/api/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                this.logout();
            }
        } catch (error) {
            console.error('Token verification failed:', error);
        }
    }

    setupLoginButton() {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                if (this.isAuthenticated()) {
                    this.showLogoutConfirm();
                } else {
                    this.openModal();
                }
            });
        }
        
        // Setup modal close
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
        
        // Setup Google login button in modal
        const googleLogin = document.getElementById('googleLogin');
        if (googleLogin) {
            googleLogin.addEventListener('click', () => {
                if (typeof google !== 'undefined') {
                    google.accounts.id.prompt();
                } else {
                    this.showToast('Loading Google Sign-In...', 'info');
                }
            });
        }
    }

    openModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    updateUIForLoggedInUser() {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn && this.user) {
            loginBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${this.user.name.split(' ')[0]}`;
            loginBtn.classList.remove('btn-outline');
            loginBtn.classList.add('btn-primary');
        }
        
        // Update any user-specific elements
        const userGreeting = document.getElementById('userGreeting');
        if (userGreeting) {
            userGreeting.textContent = `Welcome, ${this.user.name}!`;
        }
    }

    showLogoutConfirm() {
        if (confirm('Do you want to logout?')) {
            this.logout();
        }
    }

    logout() {
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.innerHTML = 'Login';
            loginBtn.classList.add('btn-outline');
            loginBtn.classList.remove('btn-primary');
        }
        
        this.showToast('Logged out successfully', 'info');
        
        // Reload page if on booking page
        if (window.location.pathname.includes('booking.html')) {
            window.location.reload();
        }
    }

    loadUserDetails() {
        if (this.user) {
            const nameInput = document.getElementById('customer-name');
            const emailInput = document.getElementById('customer-email');
            
            if (nameInput) nameInput.value = this.user.name;
            if (emailInput) emailInput.value = this.user.email;
        }
    }

    showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    isAuthenticated() {
        return this.user !== null;
    }

    getUser() {
        return this.user;
    }
}

// Initialize authentication when page loads
let auth;
document.addEventListener('DOMContentLoaded', () => {
    auth = new GoogleAuth();
});

// Export for use in other files
window.auth = auth;
