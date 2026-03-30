// frontend/js/booking.js - Complete with Real Razorpay Payment

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
        this.apiUrl = 'https://beauty-bar-backend.onrender.com/api';
        this.init();
    }

    init() {
        console.log('BookingManager initializing...');
        
        // Load data
        this.loadServices();
        this.loadStaff();
        this.loadCalendar();
        this.setupEventListeners();
        
        // Check for selected service from URL
        const urlParams = new URLSearchParams(window.location.search);
        const serviceId = urlParams.get('service');
        if (serviceId) {
            setTimeout(() => this.selectServiceById(parseInt(serviceId)), 500);
        }
        
        // Auto-fill if user is logged in
        if (window.auth && window.auth.isAuthenticated()) {
            this.autoFillUserDetails();
        }
    }

    async loadServices() {
        const container = document.getElementById('services-list');
        if (!container) return;
        
        try {
            const response = await fetch(`${this.apiUrl}/services`);
            const result = await response.json();
            
            if (result.success && result.services) {
                this.services = result.services;
                this.displayServices(this.services);
            } else {
                this.loadFallbackServices();
            }
        } catch (error) {
            console.error('Error loading services:', error);
            this.loadFallbackServices();
        }
    }

    loadFallbackServices() {
        this.services = [
            { id: 1, name: "Bridal Makeup", category: "Bridal", price: 4999, duration: 120, image: "https://images.pexels.com/photos/3992135/pexels-photo-3992135.jpeg?w=400&h=300&fit=crop", description: "Complete bridal makeup with premium products" },
            { id: 2, name: "Hair Styling", category: "Hair", price: 1999, duration: 60, image: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?w=400&h=300&fit=crop", description: "Professional hair styling for any occasion" },
            { id: 3, name: "Facial Treatment", category: "Skincare", price: 2499, duration: 75, image: "https://images.pexels.com/photos/3822600/pexels-photo-3822600.jpeg?w=400&h=300&fit=crop", description: "Deep cleansing and hydrating facial" },
            { id: 4, name: "Nail Art", category: "Nails", price: 999, duration: 45, image: "https://images.pexels.com/photos/3992135/pexels-photo-3992135.jpeg?w=400&h=300&fit=crop", description: "Creative nail designs and care" },
            { id: 5, name: "Party Makeup", category: "Makeup", price: 2999, duration: 90, image: "https://images.pexels.com/photos/3992135/pexels-photo-3992135.jpeg?w=400&h=300&fit=crop", description: "Glamorous party and event makeup" },
            { id: 6, name: "Hair Color", category: "Hair", price: 3499, duration: 120, image: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?w=400&h=300&fit=crop", description: "Professional hair coloring and highlights" }
        ];
        this.displayServices(this.services);
    }

    displayServices(services) {
        const container = document.getElementById('services-list');
        if (!container) return;
        
        container.innerHTML = services.map(service => `
            <div class="service-card" data-id="${service.id}" onclick="bookingManager.selectService(${service.id})">
                <img src="${service.image}" alt="${service.name}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px;">
                <h4 style="margin: 0.5rem 0;">${service.name}</h4>
                <p>${service.duration} mins</p>
                <p style="color: var(--primary); font-weight: bold;">₹${service.price}</p>
                <p style="font-size: 0.8rem; color: #666;">${service.description}</p>
            </div>
        `).join('');
    }

    selectServiceById(id) {
        const service = this.services.find(s => s.id === id);
        if (service) {
            this.selectService(id);
        }
    }

    selectService(serviceId) {
        this.bookingData.service = this.services.find(s => s.id === serviceId);
        
        document.querySelectorAll('.service-card').forEach(card => {
            card.classList.remove('selected');
            if (card.dataset.id == serviceId) card.classList.add('selected');
        });
        
        // Show selected badge
        const selectedDisplay = document.getElementById('selectedServiceDisplay');
        if (selectedDisplay && this.bookingData.service) {
            selectedDisplay.innerHTML = `
                <div class="selected-service-badge" style="background: var(--primary); color: white; padding: 8px 15px; border-radius: 30px; display: inline-block; margin-bottom: 1rem;">
                    <i class="fas fa-check-circle"></i> Selected: ${this.bookingData.service.name} - ₹${this.bookingData.service.price}
                </div>
            `;
        }
        
        this.showToast('Service selected!', 'success');
    }

    async loadStaff() {
        const container = document.getElementById('staff-list');
        if (!container) return;
        
        try {
            const response = await fetch(`${this.apiUrl}/staff`);
            const result = await response.json();
            
            if (result.success && result.staff) {
                this.staff = result.staff;
                this.displayStaff(this.staff);
            } else {
                this.loadFallbackStaff();
            }
        } catch (error) {
            console.error('Error loading staff:', error);
            this.loadFallbackStaff();
        }
    }

    loadFallbackStaff() {
        this.staff = [
            { id: 1, name: "Priya Sharma", position: "Senior Makeup Artist", specialty: "Bridal Makeup", image: "https://images.pexels.com/photos/1494790108777-223fd4f5603d?w=200&h=200&fit=crop", services: [1, 5], rating: 4.9 },
            { id: 2, name: "Anjali Desai", position: "Senior Hair Stylist", specialty: "Hair Color", image: "https://images.pexels.com/photos/1534528741775-53994a69daeb?w=200&h=200&fit=crop", services: [2, 6], rating: 4.8 },
            { id: 3, name: "Meera Kapoor", position: "Nail Art Expert", specialty: "Nail Art", image: "https://images.pexels.com/photos/1517365830460-955ce3ccd263?w=200&h=200&fit=crop", services: [4], rating: 4.7 },
            { id: 4, name: "Riya Mehta", position: "Skincare Specialist", specialty: "Facial", image: "https://images.pexels.com/photos/1438761681033-6461ffad8d80?w=200&h=200&fit=crop", services: [3], rating: 4.9 }
        ];
        this.displayStaff(this.staff);
    }

    displayStaff(staff) {
        const container = document.getElementById('staff-list');
        if (!container) return;
        
        container.innerHTML = staff.map(s => `
            <div class="staff-card" data-id="${s.id}" onclick="bookingManager.selectStaff(${s.id})">
                <img src="${s.image}" alt="${s.name}">
                <div>
                    <h4>${s.name}</h4>
                    <p>${s.position}</p>
                    <p style="color: var(--primary);">Specialty: ${s.specialty}</p>
                    <p>⭐ ${s.rating}</p>
                </div>
            </div>
        `).join('');
    }

    selectStaff(staffId) {
        this.bookingData.staff = this.staff.find(s => s.id === staffId);
        
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
        
        let html = '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; margin-bottom: 0.5rem;">';
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        weekdays.forEach(day => {
            html += `<div style="text-align: center; font-weight: bold;">${day}</div>`;
        });
        html += '</div><div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem;">';
        
        for (let i = 0; i < firstDay; i++) {
            html += `<div></div>`;
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(today.getFullYear(), today.getMonth(), day);
            const isPast = date < new Date(new Date().setHours(0,0,0,0));
            html += `
                <div class="calendar-day ${isPast ? 'disabled' : 'available'}" 
                     onclick="${!isPast ? `bookingManager.selectDate(${day})` : ''}"
                     style="text-align: center; padding: 10px; border: 1px solid #ddd; border-radius: 8px; cursor: ${isPast ? 'not-allowed' : 'pointer'}; background: ${isPast ? '#f0f0f0' : 'white'};">
                    ${day}
                </div>
            `;
        }
        html += '</div>';
        calendar.innerHTML = html;
    }

    selectDate(day) {
        this.bookingData.date = new Date(new Date().getFullYear(), new Date().getMonth(), day);
        
        document.querySelectorAll('.calendar-day').forEach(el => {
            el.classList.remove('selected');
            if (el.innerText == day && !el.classList.contains('disabled')) {
                el.classList.add('selected');
                el.style.background = 'var(--primary)';
                el.style.color = 'white';
            }
        });
        
        this.loadTimeSlots();
        this.showToast('Date selected!', 'success');
    }

    loadTimeSlots() {
        const slots = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
        const container = document.getElementById('time-slots');
        if (container) {
            container.innerHTML = slots.map(slot => `
                <div class="time-slot available" onclick="bookingManager.selectTime('${slot}')">${slot}</div>
            `).join('');
        }
    }

    selectTime(time) {
        this.bookingData.time = time;
        
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
            if (slot.innerText === time) {
                slot.classList.add('selected');
                slot.style.background = 'var(--primary)';
                slot.style.color = 'white';
            }
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
            <p><strong>Staff:</strong> ${this.bookingData.staff?.name || 'Not selected'}</p>
            <p><strong>Date:</strong> ${this.bookingData.date?.toLocaleDateString() || 'Not selected'}</p>
            <p><strong>Time:</strong> ${this.bookingData.time || 'Not selected'}</p>
            <hr>
            <p><strong>Total Amount:</strong> ₹${this.bookingData.service.price}</p>
            <p><strong>Advance (30%):</strong> ₹${advanceAmount}</p>
            <p><strong>Balance at Salon:</strong> ₹${this.bookingData.service.price - advanceAmount}</p>
        `;
        
        const termsCheckbox = document.getElementById('terms');
        const payBtn = document.getElementById('pay-btn');
        if (termsCheckbox && payBtn) {
            termsCheckbox.onchange = () => payBtn.disabled = !termsCheckbox.checked;
        }
    }

    async createRazorpayOrder(amount) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                this.showToast('Please login to continue', 'error');
                window.auth.openModal();
                return null;
            }
            
            const response = await fetch(`${this.apiUrl}/payments/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    amount: amount,
                    bookingId: Date.now().toString()
                })
            });
            
            const data = await response.json();
            if (data.success) {
                return data;
            } else {
                this.showToast('Failed to create order', 'error');
                return null;
            }
        } catch (error) {
            console.error('Error creating order:', error);
            this.showToast('Payment server error', 'error');
            return null;
        }
    }

    async processPayment() {
        if (!this.bookingData.service) return;
        
        const advanceAmount = this.bookingData.service.price * 0.3;
        
        // Check if user is logged in
        if (!window.auth || !window.auth.isAuthenticated()) {
            this.showToast('Please login to complete booking', 'error');
            window.auth.openModal();
            return;
        }
        
        this.showToast('Initializing payment...', 'info');
        
        try {
            // Create Razorpay order
            const orderData = await this.createRazorpayOrder(advanceAmount);
            
            if (!orderData) return;
            
            // Initialize Razorpay
            const options = {
                key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your actual Razorpay Key ID
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Beauty Bar Salon',
                description: `${this.bookingData.service.name} - 30% Advance`,
                order_id: orderData.orderId,
                handler: async (response) => {
                    await this.verifyPayment(response);
                },
                prefill: {
                    name: this.bookingData.customer?.name || '',
                    email: this.bookingData.customer?.email || '',
                    contact: this.bookingData.customer?.phone || ''
                },
                theme: {
                    color: '#B76E79'
                },
                modal: {
                    ondismiss: () => {
                        this.showToast('Payment cancelled', 'info');
                    }
                }
            };
            
            const razorpay = new Razorpay(options);
            razorpay.open();
            
        } catch (error) {
            console.error('Payment error:', error);
            this.showToast('Payment initialization failed', 'error');
        }
    }

    async verifyPayment(paymentResponse) {
        try {
            const token = localStorage.getItem('token');
            
            const bookingPayload = {
                serviceId: this.bookingData.service.id,
                staffId: this.bookingData.staff?.id,
                date: this.bookingData.date?.toISOString().split('T')[0],
                time: this.bookingData.time,
                totalAmount: this.bookingData.service.price,
                advanceAmount: this.bookingData.service.price * 0.3,
                customerName: document.getElementById('customer-name')?.value,
                customerEmail: document.getElementById('customer-email')?.value,
                customerPhone: document.getElementById('customer-phone')?.value,
                notes: document.getElementById('customer-notes')?.value,
                razorpayOrderId: paymentResponse.razorpay_order_id,
                razorpayPaymentId: paymentResponse.razorpay_payment_id,
                razorpaySignature: paymentResponse.razorpay_signature
            };
            
            const response = await fetch(`${this.apiUrl}/payments/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...paymentResponse,
                    bookingId: Date.now().toString()
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Save booking
                await this.saveBooking(bookingPayload);
                this.showToast('Payment successful! Booking confirmed.', 'success');
                setTimeout(() => {
                    window.location.href = 'history.html';
                }, 2000);
            } else {
                this.showToast('Payment verification failed', 'error');
            }
        } catch (error) {
            console.error('Verification error:', error);
            this.showToast('Payment verification failed', 'error');
        }
    }

    async saveBooking(bookingData) {
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${this.apiUrl}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bookingData)
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Save booking error:', error);
        }
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
        document.querySelectorAll('.step').forEach((step, index) => {
            const stepNum = index + 1;
            if (stepNum === this.currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else if (stepNum < this.currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
        
        document.querySelectorAll('.step-panel').forEach((panel, index) => {
            if (index + 1 === this.currentStep) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });
        
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        if (prevBtn) prevBtn.style.display = this.currentStep === 1 ? 'none' : 'inline-block';
        if (nextBtn) nextBtn.textContent = this.currentStep === 6 ? 'Confirm & Pay' : 'Next';
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setupEventListeners() {
        document.getElementById('next-btn').onclick = () => this.nextStep();
        document.getElementById('prev-btn').onclick = () => this.prevStep();
        
        // Category filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.onclick = () => {
                const category = btn.dataset.category;
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterServices(category);
            };
        });
    }

    filterServices(category) {
        const container = document.getElementById('services-list');
        if (!container) return;
        
        const filtered = category === 'all' 
            ? this.services 
            : this.services.filter(s => s.category === category);
        
        this.displayServices(filtered);
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
       