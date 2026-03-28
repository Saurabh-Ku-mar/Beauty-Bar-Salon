// frontend/js/booking.js
// Booking Manager - Fully Working Version

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
        this.services = [];
        this.staff = [];
        this.filteredServices = [];
        this.currentCategory = 'all';
        this.init();
    }

    init() {
        console.log('BookingManager initializing...');
        
        // Wait for data service
        const waitForData = setInterval(() => {
            if (window.dataService) {
                clearInterval(waitForData);
                console.log('Data service found, loading booking data...');
                this.loadServices();
                this.loadStaff();
                this.loadCalendar();
                this.setupEventListeners();
                
                // Listen for data changes from admin
                window.dataService.subscribe(() => {
                    console.log('Data updated, refreshing booking page...');
                    this.loadServices();
                    this.loadStaff();
                });
            }
        }, 100);
        
        // Auto-fill if user is logged in
        if (window.auth && window.auth.isAuthenticated()) {
            this.autoFillUserDetails();
        }
    }

    loadServices() {
        const servicesList = document.getElementById('services-list');
        if (!servicesList) return;
        
        if (!window.dataService) {
            servicesList.innerHTML = '<p style="text-align: center; color: red;">Error loading services</p>';
            return;
        }
        
        this.services = window.dataService.getServices();
        this.filteredServices = [...this.services];
        console.log('Loaded', this.services.length, 'services for booking');
        
        if (this.services.length === 0) {
            servicesList.innerHTML = '<p style="text-align: center;">No services available. Please check back later.</p>';
            return;
        }
        
        this.renderServices();
    }

    renderServices() {
        const servicesList = document.getElementById('services-list');
        if (!servicesList) return;
        
        const servicesToShow = this.currentCategory === 'all' 
            ? this.filteredServices 
            : this.filteredServices.filter(s => s.category === this.currentCategory);
        
        if (servicesToShow.length === 0) {
            servicesList.innerHTML = '<p style="text-align: center;">No services in this category</p>';
            return;
        }
        
        servicesList.innerHTML = servicesToShow.map(service => `
            <div class="service-card" data-id="${service.id}" onclick="bookingManager.selectService(${service.id})">
                <img src="${service.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400'}" alt="${service.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
                <h4 style="margin: 0.5rem 0;">${service.name}</h4>
                <p>${service.duration} mins</p>
                <p style="color: var(--primary); font-weight: bold;">₹${service.price}</p>
                <p style="font-size: 0.8rem; color: #666; margin-top: 0.5rem;">${service.description || ''}</p>
            </div>
        `).join('');
    }

    filterByCategory(category) {
        console.log('Filtering by category:', category);
        this.currentCategory = category;
        this.renderServices();
        
        // Update active state on buttons
        document.querySelectorAll('.category-filter').forEach(btn => {
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    selectService(serviceId) {
        this.bookingData.service = this.services.find(s => s.id === serviceId);
        console.log('Selected service:', this.bookingData.service);
        
        // Update UI - highlight selected service
        document.querySelectorAll('.service-card').forEach(card => {
            card.classList.remove('selected');
            if (card.dataset.id == serviceId) {
                card.classList.add('selected');
            }
        });
        
        // Filter staff for this service
        this.filterStaffByService(serviceId);
        
        this.showToast('Service selected!', 'success');
    }

    filterStaffByService(serviceId) {
        const allStaff = window.dataService ? window.dataService.getAllStaff() : [];
        const filteredStaff = allStaff.filter(s => 
            s.services && s.services.includes(parseInt(serviceId))
        );
        
        const staffList = document.getElementById('staff-list');
        if (staffList) {
            if (filteredStaff.length > 0) {
                staffList.innerHTML = filteredStaff.map(s => `
                    <div class="staff-card" data-id="${s.id}" onclick="bookingManager.selectStaff(${s.id})">
                        <img src="${s.image || 'https://images.unsplash.com/photo-1494790108777-223fd4f5603d?w=200'}" alt="${s.name}">
                        <div>
                            <h4>${s.name}</h4>
                            <p>${s.position}</p>
                            <p style="color: var(--primary);">Specialty: ${s.specialty}</p>
                            <p>⭐ ${s.rating || 4.8} (${s.reviews || 100}+ reviews)</p>
                        </div>
                    </div>
                `).join('');
            } else {
                staffList.innerHTML = '<p style="text-align: center; padding: 2rem;">No staff available for this service. Please select another service.</p>';
            }
        }
    }

    loadStaff() {
        const staffList = document.getElementById('staff-list');
        if (!staffList) return;
        
        if (!window.dataService) {
            staffList.innerHTML = '<p style="text-align: center; color: red;">Error loading staff</p>';
            return;
        }
        
        this.staff = window.dataService.getStaff();
        console.log('Loaded', this.staff.length, 'staff members for booking');
        
        if (this.staff.length === 0) {
            staffList.innerHTML = '<p style="text-align: center;">No staff available. Please check back later.</p>';
            return;
        }
        
        staffList.innerHTML = this.staff.map(s => `
            <div class="staff-card" data-id="${s.id}" onclick="bookingManager.selectStaff(${s.id})">
                <img src="${s.image || 'https://images.unsplash.com/photo-1494790108777-223fd4f5603d?w=200'}" alt="${s.name}">
                <div>
                    <h4>${s.name}</h4>
                    <p>${s.position}</p>
                    <p style="color: var(--primary);">Specialty: ${s.specialty}</p>
                    <p>⭐ ${s.rating || 4.8} (${s.reviews || 100}+ reviews)</p>
                </div>
            </div>
        `).join('');
    }

    selectStaff(staffId) {
        this.bookingData.staff = this.staff.find(s => s.id === staffId);
        console.log('Selected staff:', this.bookingData.staff);
        
        // Update UI
        document.querySelectorAll('.staff-card').forEach(card => {
            card.classList.remove('selected');
            if (card.dataset.id == staffId) {
                card.classList.add('selected');
            }
        });
        
        this.showToast('Stylist selected!', 'success');
    }

    loadCalendar() {
        const calendar = document.getElementById('calendar');
        if (!calendar) return;

        const today = new Date();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
        
        let calendarHTML = '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; margin-bottom: 0.5rem;">';
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        weekdays.forEach(day => {
            calendarHTML += `<div style="text-align: center; font-weight: bold; padding: 8px;">${day}</div>`;
        });
        calendarHTML += '</div><div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem;">';
        
        for (let i = 0; i < firstDay; i++) {
            calendarHTML += `<div class="calendar-day empty" style="visibility: hidden;"></div>`;
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(today.getFullYear(), today.getMonth(), day);
            const isPast = date < new Date(new Date().setHours(0,0,0,0));
            calendarHTML += `
                <div class="calendar-day ${isPast ? 'disabled' : 'available'}" 
                     onclick="${!isPast ? `bookingManager.selectDate(${day})` : ''}"
                     style="text-align: center; padding: 10px; border: 1px solid #ddd; border-radius: 8px; cursor: ${isPast ? 'not-allowed' : 'pointer'}; background: ${isPast ? '#f0f0f0' : 'white'};">
                    ${day}
                </div>
            `;
        }
        
        calendarHTML += '</div>';
        calendar.innerHTML = calendarHTML;
    }

    selectDate(day) {
        this.bookingData.date = new Date(new Date().getFullYear(), new Date().getMonth(), day);
        console.log('Selected date:', this.bookingData.date);
        
        // Update UI
        document.querySelectorAll('.calendar-day').forEach(dayEl => {
            dayEl.classList.remove('selected');
            if (dayEl.innerText == day && !dayEl.classList.contains('disabled')) {
                dayEl.classList.add('selected');
                dayEl.style.background = 'var(--primary)';
                dayEl.style.color = 'white';
            } else if (!dayEl.classList.contains('disabled')) {
                dayEl.style.background = 'white';
                dayEl.style.color = 'inherit';
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
        console.log('Selected time:', time);
        
        // Update UI
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
            if (slot.innerText === time) {
                slot.classList.add('selected');
                slot.style.background = 'var(--primary)';
                slot.style.color = 'white';
            } else {
                slot.style.background = '';
                slot.style.color = '';
            }
        });
        
        this.showToast('Time selected!', 'success');
    }

    updateSummary() {
        const summary = document.getElementById('booking-summary');
        if (!summary) return;
        
        if (!this.bookingData.service) {
            summary.innerHTML = '<p style="text-align: center;">Please select a service to see summary</p>';
            return;
        }
        
        const advanceAmount = this.bookingData.service.price * 0.3;
        
        summary.innerHTML = `
            <h4>Booking Summary</h4>
            <p><strong>Service:</strong> ${this.bookingData.service.name}</p>
            <p><strong>Duration:</strong> ${this.bookingData.service.duration} mins</p>
            <p><strong>Staff:</strong> ${this.bookingData.staff?.name || 'Not selected'}</p>
            <p><strong>Date:</strong> ${this.bookingData.date?.toLocaleDateString() || 'Not selected'}</p>
            <p><strong>Time:</strong> ${this.bookingData.time || 'Not selected'}</p>
            <hr style="margin: 1rem 0;">
            <p><strong>Total Amount:</strong> ₹${this.bookingData.service.price}</p>
            <p><strong>Advance (30%):</strong> ₹${advanceAmount}</p>
            <p><strong>Balance at Salon:</strong> ₹${this.bookingData.service.price - advanceAmount}</p>
        `;
        
        // Enable pay button if terms are checked
        const termsCheckbox = document.getElementById('terms');
        const payBtn = document.getElementById('pay-btn');
        if (termsCheckbox && payBtn) {
            termsCheckbox.onchange = () => {
                payBtn.disabled = !termsCheckbox.checked;
            };
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
        console.log('Validating step:', this.currentStep);
        
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
                this.bookingData.customer = { 
                    name, 
                    email, 
                    phone, 
                    notes: document.getElementById('customer-notes')?.value 
                };
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
        console.log('Next button clicked, current step:', this.currentStep);
        
        if (!this.validateStep()) return;
        
        if (this.currentStep < 6) {
            this.currentStep++;
            this.updateSteps();
        } else {
            this.processPayment();
        }
    }

    prevStep() {
        console.log('Previous button clicked');
        
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateSteps();
        }
    }

    updateSteps() {
        console.log('Updating to step:', this.currentStep);
        
        // Update step indicators
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
        
        if (prevBtn) {
            prevBtn.style.display = this.currentStep === 1 ? 'none' : 'inline-block';
        }
        if (nextBtn) {
            nextBtn.textContent = this.currentStep === 6 ? 'Confirm & Pay' : 'Next';
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    processPayment() {
        if (!this.bookingData.service) return;
        
        const advanceAmount = this.bookingData.service.price * 0.3;
        
        if (confirm(`Proceed to pay ₹${advanceAmount} advance?\n\nBooking Details:\nService: ${this.bookingData.service.name}\nStaff: ${this.bookingData.staff?.name}\nDate: ${this.bookingData.date?.toLocaleDateString()}\nTime: ${this.bookingData.time}\nTotal: ₹${this.bookingData.service.price}`)) {
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
            this.showToast('Booking confirmed! Check your email for details.', 'success');
            
            setTimeout(() => {
                window.location.href = 'history.html';
            }, 2000);
        } else {
            this.showToast('Error saving booking. Please try again.', 'error');
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Next and Previous buttons
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        
        if (nextBtn) {
            nextBtn.onclick = () => this.nextStep();
            console.log('Next button listener attached');
        } else {
            console.error('Next button not found!');
        }
        
        if (prevBtn) {
            prevBtn.onclick = () => this.prevStep();
        }
        
        // Category filters
        const categoryBtns = document.querySelectorAll('.category-filter');
        console.log('Found', categoryBtns.length, 'category buttons');
        
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
      
