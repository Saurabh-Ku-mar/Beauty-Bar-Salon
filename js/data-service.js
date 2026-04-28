// ============================================
// CENTRAL DATA SERVICE - SINGLE SOURCE OF TRUTH
// ALL DATA IS STORED HERE AND SYNCED EVERYWHERE
// ============================================

class DataService {
    constructor() {
        this.listeners = [];
        this.init();
    }

    init() {
        console.log('📦 DataService initializing...');
        
        // Initialize data structure if not exists
        if (!localStorage.getItem('beautyBarData')) {
            this.loadDefaultData();
        } else {
            this.data = JSON.parse(localStorage.getItem('beautyBarData'));
        }
        
        // Make sure data has all required properties
        this.ensureDataStructure();
        
        console.log(`✅ DataService ready: ${this.data.services.length} services, ${this.data.staff.length} staff`);
    }

    ensureDataStructure() {
        if (!this.data) {
            this.data = {};
        }
        if (!this.data.services) this.data.services = [];
        if (!this.data.staff) this.data.staff = [];
        if (!this.data.bookings) this.data.bookings = [];
        if (!this.data.settings) this.data.settings = {};
        
        // Ensure each service has required fields
        this.data.services = this.data.services.map(s => ({
            id: s.id,
            name: s.name || 'Untitled',
            category: s.category || 'Other',
            price: s.price || 0,
            duration: s.duration || 60,
            image: s.image || 'https://images.pexels.com/photos/3992135/pexels-photo-3992135.jpeg?w=400&h=300&fit=crop',
            description: s.description || '',
            isActive: s.isActive !== false,
            popular: s.popular || false,
            order: s.order || 0
        }));
        
        // Ensure each staff has required fields
        this.data.staff = this.data.staff.map(s => ({
            id: s.id,
            name: s.name || 'Staff',
            position: s.position || 'Stylist',
            specialty: s.specialty || '',
            experience: s.experience || '',
            image: s.image || 'https://images.pexels.com/photos/1494790108777-223fd4f5603d?w=300&h=300&fit=crop',
            services: s.services || [],
            rating: s.rating || 4.8,
            reviews: s.reviews || 100,
            isActive: s.isActive !== false
        }));
        
        this.saveToLocalStorage();
    }

    loadDefaultData() {
        console.log('📁 Loading default data...');
        
        this.data = {
            services: [
                { id: 1, name: "Bridal Makeup", category: "Bridal", price: 4999, duration: 120, image: "https://images.pexels.com/photos/3992135/pexels-photo-3992135.jpeg?w=400&h=300&fit=crop", description: "Complete bridal makeup with premium products", isActive: true, popular: true, order: 1 },
                { id: 2, name: "Hair Styling", category: "Hair", price: 1999, duration: 60, image: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?w=400&h=300&fit=crop", description: "Professional hair styling for any occasion", isActive: true, popular: true, order: 2 },
                { id: 3, name: "Facial Treatment", category: "Skincare", price: 2499, duration: 75, image: "https://images.pexels.com/photos/3822600/pexels-photo-3822600.jpeg?w=400&h=300&fit=crop", description: "Deep cleansing and hydrating facial", isActive: true, popular: false, order: 3 },
                { id: 4, name: "Nail Art", category: "Nails", price: 999, duration: 45, image: "https://images.pexels.com/photos/3992135/pexels-photo-3992135.jpeg?w=400&h=300&fit=crop", description: "Creative nail designs and care", isActive: true, popular: false, order: 4 },
                { id: 5, name: "Party Makeup", category: "Makeup", price: 2999, duration: 90, image: "https://images.pexels.com/photos/3992135/pexels-photo-3992135.jpeg?w=400&h=300&fit=crop", description: "Glamorous party and event makeup", isActive: true, popular: true, order: 5 },
                { id: 6, name: "Hair Color", category: "Hair", price: 3499, duration: 120, image: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?w=400&h=300&fit=crop", description: "Professional hair coloring and highlights", isActive: true, popular: false, order: 6 }
            ],
            staff: [
                { id: 1, name: "Priya Sharma", position: "Senior Makeup Artist", specialty: "Bridal Makeup Expert", experience: "12+ years", image: "https://images.pexels.com/photos/1494790108777-223fd4f5603d?w=300&h=300&fit=crop", services: [1, 5], rating: 4.9, reviews: 128, isActive: true },
                { id: 2, name: "Anjali Desai", position: "Senior Hair Stylist", specialty: "Color Specialist", experience: "8+ years", image: "https://images.pexels.com/photos/1534528741775-53994a69daeb?w=300&h=300&fit=crop", services: [2, 6], rating: 4.8, reviews: 95, isActive: true },
                { id: 3, name: "Meera Kapoor", position: "Nail Art Expert", specialty: "Creative Nail Designs", experience: "6+ years", image: "https://images.pexels.com/photos/1517365830460-955ce3ccd263?w=300&h=300&fit=crop", services: [4], rating: 4.7, reviews: 78, isActive: true },
                { id: 4, name: "Riya Mehta", position: "Skincare Specialist", specialty: "Facial Treatments", experience: "10+ years", image: "https://images.pexels.com/photos/1438761681033-6461ffad8d80?w=300&h=300&fit=crop", services: [3], rating: 4.9, reviews: 112, isActive: true }
            ],
            bookings: [],
            settings: {}
        };
        
        this.saveToLocalStorage();
    }

    saveToLocalStorage() {
        localStorage.setItem('beautyBarData', JSON.stringify(this.data));
        this.notifyListeners();
    }

    // Subscribe to data changes
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.data));
    }

    // ========== SERVICE METHODS ==========
    getServices() {
        return this.data.services.filter(s => s.isActive !== false);
    }

    getAllServices() {
        return [...this.data.services];
    }

    getServiceById(id) {
        return this.data.services.find(s => s.id === parseInt(id));
    }

    addService(service) {
        const newId = Math.max(...this.data.services.map(s => s.id), 0) + 1;
        const newService = { 
            ...service, 
            id: newId, 
            isActive: true,
            createdAt: new Date().toISOString()
        };
        this.data.services.push(newService);
        this.saveToLocalStorage();
        console.log('✅ Service added:', newService.name);
        return newService;
    }

    updateService(id, updatedData) {
        const index = this.data.services.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            this.data.services[index] = { ...this.data.services[index], ...updatedData };
            this.saveToLocalStorage();
            console.log('✅ Service updated:', this.data.services[index].name);
            return this.data.services[index];
        }
        return null;
    }

    deleteService(id) {
        const service = this.data.services.find(s => s.id === parseInt(id));
        if (service) {
            this.data.services = this.data.services.filter(s => s.id !== parseInt(id));
            this.saveToLocalStorage();
            console.log('✅ Service deleted:', service.name);
        }
    }

    // ========== STAFF METHODS ==========
    getStaff() {
        return this.data.staff.filter(s => s.isActive !== false);
    }

    getAllStaff() {
        return [...this.data.staff];
    }

    getStaffById(id) {
        return this.data.staff.find(s => s.id === parseInt(id));
    }

    getStaffByService(serviceId) {
        return this.data.staff.filter(s => 
            s.services && s.services.includes(parseInt(serviceId)) && s.isActive !== false
        );
    }

    addStaff(staff) {
        const newId = Math.max(...this.data.staff.map(s => s.id), 0) + 1;
        const newStaff = { 
            ...staff, 
            id: newId, 
            isActive: true,
            services: staff.services || [],
            rating: staff.rating || 4.8,
            reviews: staff.reviews || 100,
            createdAt: new Date().toISOString()
        };
        this.data.staff.push(newStaff);
        this.saveToLocalStorage();
        console.log('✅ Staff added:', newStaff.name);
        return newStaff;
    }

    updateStaff(id, updatedData) {
        const index = this.data.staff.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            this.data.staff[index] = { ...this.data.staff[index], ...updatedData };
            this.saveToLocalStorage();
            console.log('✅ Staff updated:', this.data.staff[index].name);
            return this.data.staff[index];
        }
        return null;
    }

    deleteStaff(id) {
        const staff = this.data.staff.find(s => s.id === parseInt(id));
        if (staff) {
            this.data.staff = this.data.staff.filter(s => s.id !== parseInt(id));
            this.saveToLocalStorage();
            console.log('✅ Staff deleted:', staff.name);
        }
    }

    // ========== BOOKING METHODS ==========
    getBookings() {
        return this.data.bookings;
    }

    addBooking(booking) {
        const newId = Math.max(...this.data.bookings.map(b => b.id), 1000) + 1;
        const newBooking = { 
            ...booking, 
            id: newId, 
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        this.data.bookings.unshift(newBooking);
        this.saveToLocalStorage();
        return newBooking;
    }

    updateBookingStatus(id, status) {
        const index = this.data.bookings.findIndex(b => b.id === parseInt(id));
        if (index !== -1) {
            this.data.bookings[index].status = status;
            this.saveToLocalStorage();
            return this.data.bookings[index];
        }
        return null;
    }

    // ========== STATS METHODS ==========
    getStats() {
        const bookings = this.data.bookings;
        const totalBookings = bookings.length;
        const pendingBookings = bookings.filter(b => b.status === 'pending').length;
        const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
        const totalRevenue = bookings
            .filter(b => b.status === 'confirmed' || b.status === 'completed')
            .reduce((sum, b) => sum + (b.advanceAmount || b.service?.price * 0.3 || 0), 0);
        
        return {
            totalServices: this.getServices().length,
            totalStaff: this.getStaff().length,
            totalBookings,
            pendingBookings,
            confirmedBookings,
            totalRevenue
        };
    }
}

// Create global instance
window.dataService = new DataService();
