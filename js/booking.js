// frontend/js/booking.js - Updated to use DataService

class BookingManager {
    constructor() {
        this.currentStep = 1;
        this.bookingData = {
            service: null,
            staff: null,
            date: null,
            time: null,
            customer: null
        };
        this.init();
    }

    init() {
        this.loadServices();
        this.loadStaff();
        this.loadCalendar();
        this.setupEventListeners();
        this.checkForRebooking();
        
        // Listen for data changes
        if (window.dataService) {
            window.dataService.subscribe(() => {
                this.loadServices();
                this.loadStaff();
            });
        }
        
        // Auto-fill if user is logged in
        if (window.auth && window.auth.isAuthenticated()) {
            this.autoFillUserDetails();
        }
    }

    loadServices() {
        const servicesList = document.getElementById('services-list');
        if (!servicesList) return;
        
        const services = window.dataService ? window.dataService.getServices() : [];
        
        if (services.length === 0) {
            servicesList.innerHTML = '<p style="text-align: center;">Loading services...</p>';
            return;
        }
        
        servicesList.innerHTML = services.map(service => `
            <div class="service-card" data-id="${service.id}" onclick="bookingManager.selectService(${service.id})">
                <img src="${service.image}" alt="${service.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
                <h4 style="margin: 0.5rem 0;">${service.name}</h4>
                <p>${service.duration} mins</p>
                <p style="color: var(--primary); font-weight: bold;">₹${service.price}</p>
            </div>
        `).join('');
    }

    selectService(serviceId) {
        const services = window.dataService ? window.dataService.getAllServices() : [];
        this.bookingData.service = services.find(s => s.id === serviceId);
        
        // Update UI
        document.querySelectorAll('.service-card').forEach(card => {
            card.classList.remove('selected');
            if (card.dataset.id == serviceId) card.classList.add('selected');
        });
        
        // Load staff for this service
        this.loadStaffForService(serviceId);
        
        this.showToast('Service selected!', 'success');
    }

    loadStaff() {
        const staffList = document.getElementById('staff-list');
        if (!staffList) return;
        
        const staff = window.dataService ? window.dataService.getStaff() : [];
        
        if (staff.length === 0) {
            staffList.innerHTML = '<p style="text-align: center;">Loading staff...</p>';
            return;
        }
        
        staffList.innerHTML = staff.map(s => `
            <div class="staff-card" data-id="${s.id}" onclick="bookingManager.selectStaff(${s.id})">
                <img src="${s.image}" alt="${s.name}">
                <div>
                    <h4>${s.name}</h4>
                    <p>${s.position}</p>
                    <p style="color: var(--primary);">Specialty: ${s.specialty}</p>
                    <p>⭐ ${s.rating || 4.8} (${s.reviews || 100}+ reviews)</p>
                </div>
            </div>
        `).join('');
    }

    loadStaffForService(serviceId) {
        // Filter staff who can perform this service
        const allStaff = window.dataService ? window.dataService.getAllStaff() : [];
        const filteredStaff = allStaff.filter(s => 
            s.services && s.services.includes(serviceId)
        );
        
        const staffList = document.getElementById('staff-list');
        if (staffList && filteredStaff.length > 0) {
            staffList.innerHTML = filteredStaff.map(s => `
                <div class="staff-card" data-id="${s.id}" onclick="bookingManager.selectStaff(${s.id})">
                    <img src="${s.image}" alt="${s.name}">
                    <div>
                        <h4>${s.name}</h4>
                        <p>${s.position}</p>
                        <p style="color: var(--primary);">Specialty: ${s.specialty}</p>
                        <p>⭐ ${s.rating || 4.8} (${s.reviews || 100}+ reviews)</p>
                    </div>
                </div>
            `).join('');
        }
    }

    selectStaff(staffId) {
        const staff = window.dataService ? window.dataService.getAllStaff() : [];
        this.bookingData.staff = staff.find(s => s.id === staffId);
        
        document.querySelectorAll('.staff-card').forEach(card => {
            card.classList.remove('selected');
            if (card.dataset.id == staffId) card.classList.add('selected');
        });
        
        this.showToast('Stylist selected!', 'success');
    }

    // Rest of the methods remain the same...
    loadCalendar() { /* existing code */ }
    selectDate(day) { /* existing code */ }
    loadTimeSlots() { /* existing code */ }
    selectTime(time) { /* existing code */ }
    updateSummary() { /* existing code */ }
    autoFillUserDetails() { /* existing code */ }
    validateStep() { /* existing code */ }
    nextStep() { /* existing code */ }
    prevStep() { /* existing code */ }
    updateSteps() { /* existing code */ }
    
    processPayment() {
        if (!this.bookingData.service) return;
        
        const advanceAmount = this.bookingData.service.price * 0.3;
        
        if (confirm(`Proceed to pay ₹${advanceAmount} advance?\n\nBooking Details:\nService: ${this.bookingData.service.name}\nDate: ${this.bookingData.date?.toLocaleDateString()}\nTime: ${this.bookingData.time}\nTotal: ₹${this.bookingData.service.price}`)) {
            this.showToast('Redirecting to payment...', 'info');
            
            setTimeout(() => {
                this.saveBooking();
            }, 2000);
        }
    }

    saveBooking() {
        const booking = {
            serviceId: this.bookingData.service.id,
            staffId: this.bookingData.staff?.id,
            customerName: document.getElementById('customer-name')?.value,
            customerEmail: document.getElementById('customer-email')?.value,
            customerPhone: document.getElementById('customer-phone')?.value,
            notes: document.getElementById('customer-notes')?.value,
            date: this.bookingData.date?.toISOString().split('T')[0],
            time: this.bookingData.time,
            amount: this.bookingData.service.price,
            advancePaid: this.bookingData.service.price * 0.3,
            status: 'confirmed'
        };
        
        if (window.dataService) {
            window.dataService.addBooking(booking);
        }
        
        this.showToast('Booking confirmed! Check your email for details.', 'success');
        
        setTimeout(() => {
            window.location.href = 'history.html';
        }, 2000);
    }

    checkForRebooking() {
        const rebookData = localStorage.getItem('rebookData');
        if (rebookData) {
            const data = JSON.parse(rebookData);
            localStorage.removeItem('rebookData');
            this.showToast('Rebooking previous appointment...', 'info');
        }
    }

    setupEventListeners() {
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        
        if (nextBtn) nextBtn.onclick = () => this.nextStep();
        if (prevBtn) prevBtn.onclick = () => this.prevStep();
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
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize booking manager
let bookingManager;
document.addEventListener('DOMContentLoaded', () => {
    // Wait for data service
    const waitForDataService = setInterval(() => {
        if (window.dataService) {
            clearInterval(waitForDataService);
            bookingManager = new BookingManager();
            window.bookingManager = bookingManager;
        }
    }, 100);
});
