// Booking Page JavaScript
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
        
        // Auto-fill if user is logged in
        if (window.auth && window.auth.isAuthenticated()) {
            this.autoFillUserDetails();
        }
    }

    loadServices() {
        const servicesList = document.getElementById('services-list');
        if (!servicesList) return;

        const services = [
            { id: 1, name: "Bridal Makeup", category: "Bridal", price: 4999, duration: 120, image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400" },
            { id: 2, name: "Hair Styling", category: "Hair", price: 1999, duration: 60, image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400" },
            { id: 3, name: "Facial Treatment", category: "Skincare", price: 2499, duration: 75, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400" },
            { id: 4, name: "Nail Art", category: "Nails", price: 999, duration: 45, image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400" },
            { id: 5, name: "Party Makeup", category: "Makeup", price: 2999, duration: 90, image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400" },
            { id: 6, name: "Hair Color", category: "Hair", price: 3499, duration: 120, image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400" }
        ];

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
        const services = [
            { id: 1, name: "Bridal Makeup", price: 4999, duration: 120 },
            { id: 2, name: "Hair Styling", price: 1999, duration: 60 },
            { id: 3, name: "Facial Treatment", price: 2499, duration: 75 },
            { id: 4, name: "Nail Art", price: 999, duration: 45 },
            { id: 5, name: "Party Makeup", price: 2999, duration: 90 },
            { id: 6, name: "Hair Color", price: 3499, duration: 120 }
        ];
        
        this.bookingData.service = services.find(s => s.id === serviceId);
        
        // Update UI
        document.querySelectorAll('.service-card').forEach(card => {
            card.classList.remove('selected');
            if (card.dataset.id == serviceId) card.classList.add('selected');
        });
        
        this.showToast('Service selected!', 'success');
    }

    loadStaff() {
        const staffList = document.getElementById('staff-list');
        if (!staffList) return;

        const staff = [
            { id: 1, name: "Priya Sharma", position: "Senior Makeup Artist", specialty: "Bridal", image: "https://images.unsplash.com/photo-1494790108777-223fd4f5603d?w=200" },
            { id: 2, name: "Anjali Desai", position: "Hair Stylist", specialty: "Hair Color", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200" },
            { id: 3, name: "Meera Kapoor", position: "Skincare Expert", specialty: "Facial", image: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=200" },
            { id: 4, name: "Riya Mehta", position: "Nail Artist", specialty: "Nail Art", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200" }
        ];

        staffList.innerHTML = staff.map(s => `
            <div class="staff-card" data-id="${s.id}" onclick="bookingManager.selectStaff(${s.id})">
                <img src="${s.image}" alt="${s.name}">
                <div>
                    <h4>${s.name}</h4>
                    <p>${s.position}</p>
                    <p style="color: var(--primary);">Specialty: ${s.specialty}</p>
                </div>
            </div>
        `).join('');
    }

    selectStaff(staffId) {
        const staff = [
            { id: 1, name: "Priya Sharma", position: "Senior Makeup Artist", specialty: "Bridal" },
            { id: 2, name: "Anjali Desai", position: "Hair Stylist", specialty: "Hair Color" },
            { id: 3, name: "Meera Kapoor", position: "Skincare Expert", specialty: "Facial" },
            { id: 4, name: "Riya Mehta", position: "Nail Artist", specialty: "Nail Art" }
        ];
        
        this.bookingData.staff = staff.find(s => s.id === staffId);
        
        document.querySelectorAll('.staff-card').forEach(card => {
            card.classList.remove('selected');
            if (card.dataset.id == staffId) card.classList.add('selected');
        });
        
        this.showToast('Stylist selected!', 'success');
    }

    loadCalendar() {
        const calendar = document.getElementById('calendar');
        if (!calendar) return;

        const today = new Date();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
        
        let calendarHTML = '<div class="calendar-weekdays">';
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        weekdays.forEach(day => {
            calendarHTML += `<div class="weekday">${day}</div>`;
        });
        calendarHTML += '</div><div class="calendar-days">';
        
        for (let i = 0; i < firstDay; i++) {
            calendarHTML += `<div class="calendar-day empty"></div>`;
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(today.getFullYear(), today.getMonth(), day);
            const isPast = date < new Date(new Date().setHours(0,0,0,0));
            calendarHTML += `
                <div class="calendar-day ${isPast ? 'disabled' : 'available'}" 
                     onclick="${!isPast ? `bookingManager.selectDate(${day})` : ''}">
                    ${day}
                </div>
            `;
        }
        
        calendarHTML += '</div>';
        calendar.innerHTML = calendarHTML;
    }

    selectDate(day) {
        this.bookingData.date = new Date(new Date().getFullYear(), new Date().getMonth(), day);
        
        document.querySelectorAll('.calendar-day').forEach(dayEl => {
            dayEl.classList.remove('selected');
            if (dayEl.innerText == day && !dayEl.classList.contains('disabled')) {
                dayEl.classList.add('selected');
            }
        });
        
        this.loadTimeSlots();
        this.showToast('Date selected!', 'success');
    }

    loadTimeSlots() {
        const slotsContainer = document.getElementById('time-slots');
        if (!slotsContainer) return;

        const slots = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
        
        slotsContainer.innerHTML = slots.map(slot => `
            <div class="time-slot available" onclick="bookingManager.selectTime('${slot}')">
                ${slot}
            </div>
        `).join('');
    }

    selectTime(time) {
        this.bookingData.time = time;
        
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
            if (slot.innerText === time) slot.classList.add('selected');
        });
        
        this.showToast('Time selected!', 'success');
    }

    updateSummary() {
        const summary = document.getElementById('booking-summary');
        if (!summary || !this.bookingData.service) return;
        
        const advanceAmount = this.bookingData.service.price * 0.3;
        
        summary.innerHTML = `
            <h4>Booking Summary</h4>
            <p><strong>Service:</strong> ${this.bookingData.service.name}</p>
            <p><strong>Duration:</strong> ${this.bookingData.service.duration} mins</p>
            <p><strong>Staff:</strong> ${this.bookingData.staff?.name || 'Not selected'}</p>
            <p><strong>Date:</strong> ${this.bookingData.date?.toLocaleDateString() || 'Not selected'}</p>
            <p><strong>Time:</strong> ${this.bookingData.time || 'Not selected'}</p>
            <hr>
            <p><strong>Total Amount:</strong> ₹${this.bookingData.service.price}</p>
            <p><strong>Advance (30%):</strong> ₹${advanceAmount}</p>
            <p><strong>Balance at Salon:</strong> ₹${this.bookingData.service.price - advanceAmount}</p>
        `;
    }

    autoFillUserDetails() {
        const user = window.auth?.getUser();
        if (user) {
            const nameInput = document.getElementById('customer-name');
            const emailInput = document.getElementById('customer-email');
            
            if (nameInput) nameInput.value = user.name;
            if (emailInput) emailInput.value = user.email;
        }
    }

    validateStep() {
        switch(this.currentStep) {
            case 1:
                if (!this.bookingData.service) {
                    this.showToast('Please select a service', 'error');
                    return false;
                }
                break;
            case 2:
                if (!this.bookingData.staff) {
                    this.showToast('Please select a stylist', 'error');
                    return false;
                }
                break;
            case 3:
                if (!this.bookingData.date) {
                    this.showToast('Please select a date', 'error');
                    return false;
                }
                break;
            case 4:
                if (!this.bookingData.time) {
                    this.showToast('Please select a time', 'error');
                    return false;
                }
                break;
            case 5:
                const name = document.getElementById('customer-name')?.value;
                const email = document.getElementById('customer-email')?.value;
                const phone = document.getElementById('customer-phone')?.value;
                if (!name || !email || !phone) {
                    this.showToast('Please fill all details', 'error');
                    return false;
                }
                this.bookingData.customer = { name, email, phone, notes: document.getElementById('customer-notes')?.value };
                this.updateSummary();
                break;
            case 6:
                const terms = document.getElementById('terms')?.checked;
                if (!terms) {
                    this.showToast('Please accept terms and conditions', 'error');
                    return false;
                }
                break;
        }
        return true;
    }

    nextStep() {
        if (!this.validateStep()) return;
        
        if (this.currentStep < 6) {
            this.currentStep++;
            this.updateSteps();
        } else {
            this.processPayment();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateSteps();
        }
    }

    updateSteps() {
        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            if (index + 1 === this.currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else if (index + 1 < this.currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
        
        // Update panels
        document.querySelectorAll('.step-panel').forEach((panel, index) => {
            if (index + 1 === this.currentStep) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });
        
        // Update buttons
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (prevBtn) prevBtn.style.display = this.currentStep === 1 ? 'none' : 'inline-block';
        if (nextBtn) nextBtn.textContent = this.currentStep === 6 ? 'Confirm & Pay' : 'Next';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    processPayment() {
        if (!this.bookingData.service) return;
        
        const advanceAmount = this.bookingData.service.price * 0.3;
        
        // Here you would integrate Razorpay
        // For demo, show confirmation
        if (confirm(`Proceed to pay ₹${advanceAmount} advance?\n\nBooking Details:\nService: ${this.bookingData.service.name}\nDate: ${this.bookingData.date?.toLocaleDateString()}\nTime: ${this.bookingData.time}\nTotal: ₹${this.bookingData.service.price}`)) {
            this.showToast('Redirecting to payment...', 'info');
            
            // Simulate payment success
            setTimeout(() => {
                this.saveBooking();
            }, 2000);
        }
    }

    saveBooking() {
        // Save to localStorage for demo
        const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
        const newBooking = {
            id: Date.now(),
            ...this.bookingData,
            date: this.bookingData.date?.toISOString(),
            createdAt: new Date().toISOString(),
            status: 'confirmed'
        };
        
        bookings.push(newBooking);
        localStorage.setItem('userBookings', JSON.stringify(bookings));
        
        this.showToast('Booking confirmed! Check your email for details.', 'success');
        
        // Redirect to history page
        setTimeout(() => {
            window.location.href = 'history.html';
        }, 2000);
    }

    checkForRebooking() {
        const rebookData = localStorage.getItem('rebookData');
        if (rebookData) {
            const data = JSON.parse(rebookData);
            // Pre-fill booking data
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
    bookingManager = new BookingManager();
    window.bookingManager = bookingManager;
});
