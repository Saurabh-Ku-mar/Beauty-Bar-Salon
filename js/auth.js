// Google Authentication Module
class GoogleAuth {
    constructor() {
        this.user = null;
        this.init();
    }

    init() {
        // Load Google Identity Services
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        script.onload = () => {
            this.initializeGoogleSignIn();
        };

        // Check for existing session
        this.checkSession();
    }

    initializeGoogleSignIn() {
        google.accounts.id.initialize({
            client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google Client ID
            callback: this.handleCredentialResponse.bind(this),
            auto_select: false,
            cancel_on_tap_outside: true
        });

        // Attach click handler to Google login button
        document.getElementById('googleLogin')?.addEventListener('click', () => {
            google.accounts.id.prompt();
        });
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
                
                this.showToast('Login successful!', 'success');
                document.getElementById('loginModal').classList.remove('active');
                this.updateUIForLoggedInUser();
            } else {
                this.showToast('Login failed. Please try again.', 'error');
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
        }
    }

    updateUIForLoggedInUser() {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn && this.user) {
            loginBtn.textContent = this.user.email.split('@')[0];
            loginBtn.classList.remove('btn-outline');
            loginBtn.classList.add('btn-primary');
        }
    }

    logout() {
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.textContent = 'Login';
            loginBtn.classList.add('btn-outline');
            loginBtn.classList.remove('btn-primary');
        }

        this.showToast('Logged out successfully', 'info');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    isAuthenticated() {
        return this.user !== null;
    }

    getUser() {
        return this.user;
    }
}

// Initialize authentication
const auth = new GoogleAuth();

// Login button event listener
document.getElementById('loginBtn')?.addEventListener('click', () => {
    if (auth.isAuthenticated()) {
        // Show logout option or profile
        if (confirm('Do you want to logout?')) {
            auth.logout();
        }
    } else {
        document.getElementById('loginModal').classList.add('active');
    }
});

// Close modal
document.getElementById('closeModal')?.addEventListener('click', () => {
    document.getElementById('loginModal').classList.remove('active');
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('loginModal');
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});
