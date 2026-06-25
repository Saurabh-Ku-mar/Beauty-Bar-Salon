// frontend/js/customer-auth.js
// Customer Authentication System

class CustomerAuth {
    constructor() {
        this.user = null;
        this.apiUrl = 'https://beauty-bar-backend.onrender.com/api';
        this.token = localStorage.getItem('customerToken');
        this.init();
    }

    init() {
        console.log('👤 CustomerAuth initializing...');
        
        // Check if user is already logged in
        if (this.token) {
            this.verifyToken();
        }
        
        // Setup event listeners
        this.setupEventListeners();
    }

    // ============================================
    // REGISTER
    // ============================================
    async register(name, email, password, phone) {
        try {
            const response = await fetch(`${this.apiUrl}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, phone })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.setSession(data.token, data.user);
                this.showToast('Registration successful! Welcome! 🎉', 'success');
                return true;
            } else {
                this.showToast(data.message || 'Registration failed', 'error');
                return false;
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showToast('Network error. Please try again.', 'error');
            return false;
        }
    }

    // ============================================
    // LOGIN
    // ============================================
    async login(email, password) {
        try {
            const response = await fetch(`${this.apiUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.setSession(data.token, data.user);
                this.showToast(`Welcome back, ${data.user.name}! 👋`, 'success');
                return true;
            } else {
                this.showToast(data.message || 'Login failed', 'error');
                return false;
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showToast('Network error. Please try again.', 'error');
            return false;
        }
    }

    // ============================================
    // VERIFY TOKEN
    // ============================================
    async verifyToken() {
        try {
            const response = await fetch(`${this.apiUrl}/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            const data = await response.json();
            
            if (data.valid) {
                this.user = data.user;
                this.updateUI();
                console.log('✅ Customer logged in:', this.user.email);
            } else {
                this.logout();
            }
        } catch (error) {
            console.error('Token verification error:', error);
            this.logout();
        }
    }

    // ============================================
    // SESSION MANAGEMENT
    // ============================================
    setSession(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('customerToken', token);
        localStorage.setItem('customerUser', JSON.stringify(user));
        this.updateUI();
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('customerToken');
        localStorage.removeItem('customerUser');
        this.updateUI();
        this.showToast('Logged out successfully', 'info');
        setTimeout(() => window.location.reload(), 1000);
    }

    isLoggedIn() {
        return this.user !== null && this.token !== null;
    }

    getUser() {
        return this.user;
    }

    // ============================================
    // UI UPDATE
    // ============================================
    updateUI() {
        const isLoggedIn = this.isLoggedIn();
        
        // Desktop login button
        const loginBtn = document.getElementById('customerLoginBtn');
        if (loginBtn) {
            if (isLoggedIn && this.user) {
                loginBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${this.user.name.split(' ')[0]}`;
                loginBtn.classList.add('btn-primary');
                loginBtn.classList.remove('btn-outline');
                loginBtn.onclick = () => this.showLogoutConfirm();
            } else {
                loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
                loginBtn.classList.remove('btn-primary');
                loginBtn.classList.add('btn-outline');
                loginBtn.onclick = () => this.openModal();
            }
        }
        
        // Mobile login button
        const mobileLoginBtn = document.getElementById('customerLoginBtnMobile');
        if (mobileLoginBtn) {
            if (isLoggedIn && this.user) {
                mobileLoginBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${this.user.name.split(' ')[0]}`;
                mobileLoginBtn.classList.add('btn-primary');
                mobileLoginBtn.classList.remove('btn-outline');
                mobileLoginBtn.onclick = () => this.showLogoutConfirm();
            } else {
                mobileLoginBtn.innerHTML = 'Login';
                mobileLoginBtn.classList.remove('btn-primary');
                mobileLoginBtn.classList.add('btn-outline');
                mobileLoginBtn.onclick = () => this.openModal();
            }
        }
    }

    showLogoutConfirm() {
        if (confirm('Are you sure you want to logout?')) {
            this.logout();
        }
    }

    // ============================================
    // LOGIN MODAL
    // ============================================
    openModal() {
        const modal = document.getElementById('customerLoginModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.switchTab('login');
        }
    }

    closeModal() {
        const modal = document.getElementById('customerLoginModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    switchTab(tab) {
        document.querySelectorAll('.customer-tab').forEach(t => {
            t.classList.remove('active');
        });
        document.querySelectorAll('.customer-panel').forEach(p => {
            p.classList.remove('active');
        });
        
        document.querySelector(`.customer-tab[data-tab="${tab}"]`)?.classList.add('active');
        document.querySelector(`.customer-panel[data-panel="${tab}"]`)?.classList.add('active');
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================
    setupEventListeners() {
        // Close modal
        document.querySelector('#customerLoginModal .close-modal')?.addEventListener('click', () => this.closeModal());
        document.getElementById('customerLoginModal')?.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeModal();
        });
        
        // Tab switching
        document.querySelectorAll('.customer-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.tab);
            });
        });
        
        // Login form
        document.getElementById('customerLoginForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('customerLoginEmail').value;
            const password = document.getElementById('customerLoginPassword').value;
            const success = await this.login(email, password);
            if (success) this.closeModal();
        });
        
        // Register form
        document.getElementById('customerRegisterForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('customerRegName').value;
            const email = document.getElementById('customerRegEmail').value;
            const password = document.getElementById('customerRegPassword').value;
            const phone = document.getElementById('customerRegPhone').value;
            const success = await this.register(name, email, password, phone);
            if (success) this.closeModal();
        });
    }

    // ============================================
    // TOAST NOTIFICATION
    // ============================================
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };
        toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

// Initialize Customer Auth
let customerAuth;
document.addEventListener('DOMContentLoaded', () => {
    customerAuth = new CustomerAuth();
    window.customerAuth = customerAuth;
});

// Add styles
const authStyles = document.createElement('style');
authStyles.textContent = `
    .customer-tabs {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
    }
    .customer-tab {
        flex: 1;
        padding: 10px;
        border: none;
        background: #f5f5f5;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s;
    }
    .customer-tab.active {
        background: var(--primary, #B76E79);
        color: white;
    }
    .customer-panel {
        display: none;
    }
    .customer-panel.active {
        display: block;
    }
    .customer-panel .form-group {
        margin-bottom: 1rem;
    }
    .customer-panel .form-group label {
        display: block;
        margin-bottom: 0.3rem;
        font-weight: 500;
    }
    .customer-panel .form-control {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 8px;
    }
    .customer-panel .btn {
        width: 100%;
        padding: 10px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
    }
`;
document.head.appendChild(authStyles);
