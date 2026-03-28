// frontend/js/data-service.js
// Central Data Management System

class DataService {
    constructor() {
        this.data = {
            services: [],
            staff: [],
            bookings: []
        };
        this.listeners = [];
        this.init();
    }

    init() {
        // Load from localStorage or use defaults
        this.loadData();
        
        // If no data, load defaults
        if (this.data.services.length === 0) {
            this.loadDefaultData();
        }
        
        console.log('DataService initialized with', this.data.services.length, 'services and', this.data.staff.length, 'staff');
    }

    loadData() {
        const saved = localStorage.getItem('beautyBarData');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.data = { ...this.data, ...parsed };
                console.log('Data loaded from localStorage');
            } catch (e) {
                console.error('Failed to parse saved data:', e);
            }
        }
    }

    loadDefaultData() {
        console.log('Loading default data...');
        
        // Default services
        this.data.services = [
            {
                id: 1,
                name: "Bridal Makeup",
                category: "Bridal",
                price: 4999,
                duration: 120,
                description: "Complete bridal makeup with premium products",
                image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
                isActive: true,
                popular: true
            },
            {
                id: 2,
                name: "Hair Styling",
                category: "Hair",
                price: 1999,
                duration: 60,
                description: "Professional hair styling for any occasion",
                image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400",
                isActive: true,
                popular: true
            },
            {
                id: 3,
                name: "Facial Treatment",
                category: "Skincare",
                price: 2499,
                duration: 75,
                description: "Deep cleansing and hydrating facial",
                image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400",
                isActive: true,
                popular: false
            },
            {
                id: 4,
                name: "Nail Art",
                category: "Nails",
                price: 999,
                duration: 45,
                description: "Creative nail designs and care",
                image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400",
                isActive: true,
                popular: false
            },
            {
                id: 5,
                name: "Party Makeup",
                category: "Makeup",
                price: 2999,
                duration: 90,
                description: "Glamorous party and event makeup",
                image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400",
                isActive: true,
                popular: true
            },
            {
                id: 6,
                name: "Hair Color",
                category: "Hair",
                price: 3499,
                duration: 120,
                description: "Professional hair coloring and highlights",
                image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400",
                isActive: true,
                popular: false
            }
        ];

        // Default staff
        this.data.staff = [
            {
                id: 1,
                name: "Priya Sharma",
                position: "Senior Makeup Artist",
                specialty: "Bridal Makeup",
                experience: "12+ years",
                image: "https://images.unsplash.com/photo-1494790108777-223fd4f5603d?w=200",
                services: [1, 5],
                isActive: true,
                rating: 4.9,
                reviews: 128
            },
            {
                id: 2,
                name: "Anjali Desai",
                position: "Hair Stylist",
                specialty: "Hair Color & Styling",
                experience: "8+ years",
                image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
                services: [2, 6],
                isActive: true,
                rating: 4.8,
                reviews: 95
            },
            {
                id: 3,
                name: "Meera Kapoor",
                position: "Skincare Expert",
                specialty: "Facial Treatments",
                experience: "10+ years",
                image: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=200",
                services: [3],
                isActive: true,
                rating: 4.9,
                reviews: 112
            },
            {
                id: 4,
                name: "Riya Mehta",
                position: "Nail Artist",
                specialty: "Nail Art & Design",
                experience: "6+ years",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
                services: [4],
                isActive: true,
                rating: 4.7,
                reviews: 78
            }
        ];

        this.data.bookings = [];
        this.saveData();
    }

    saveData() {
        localStorage.setItem('beautyBarData', JSON.stringify(this.data));
        console.log('Data saved to localStorage');
        this.notifyListeners();
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.data));
    }

    // Service Methods
    getServices() {
        return this.data.services.filter(s => s.isActive !== false);
    }

    getAllServices() {
        return this.data.services;
    }

    getServiceById(id) {
        return this.data.services.find(s => s.id === parseInt(id));
    }

    addService(service) {
        const newId = Math.max(...this.data.services.map(s => s.id), 0) + 1;
        const newService = { ...service, id: newId, createdAt: new Date().toISOString() };
        this.data.services.push(newService);
        this.saveData();
        return newService;
    }

    updateService(id, updatedData) {
        const index = this.data.services.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            this.data.services[index] = { ...this.data.services[index], ...updatedData };
            this.saveData();
            return this.data.services[index];
        }
        return null;
    }

    deleteService(id) {
        this.data.services = this.data.services.filter(s => s.id !== parseInt(id));
        this.saveData();
    }

    // Staff Methods
    getStaff() {
        return this.data.staff.filter(s => s.isActive !== false);
    }

    getAllStaff() {
        return this.data.staff;
    }

    getStaffById(id) {
        return this.data.staff.find(s => s.id === parseInt(id));
    }

    addStaff(staff) {
        const newId = Math.max(...this.data.staff.map(s => s.id), 0) + 1;
        const newStaff = { ...staff, id: newId, createdAt: new Date().toISOString() };
        this.data.staff.push(newStaff);
        this.saveData();
        return newStaff;
    }

    updateStaff(id, updatedData) {
        const index = this.data.staff.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            this.data.staff[index] = { ...this.data.staff[index], ...updatedData };
            this.saveData();
            return this.data.staff[index];
        }
        return null;
    }

    deleteStaff(id) {
        this.data.staff = this.data.staff.filter(s => s.id !== parseInt(id));
        this.saveData();
    }

    // Booking Methods
    getBookings() {
        return this.data.bookings;
    }

    addBooking(booking) {
        const newId = Math.max(...this.data.bookings.map(b => b.id), 1000) + 1;
        const newBooking = { ...booking, id: newId, createdAt: new Date().toISOString() };
        this.data.bookings.push(newBooking);
        this.saveData();
        return newBooking;
    }

    // Dashboard Stats
    getStats() {
        const services = this.getServices();
        const staff = this.getStaff();
        const bookings = this.data.bookings;
        
        const totalRevenue = bookings
            .filter(b => b.status === 'confirmed' || b.status === 'completed')
            .reduce((sum, b) => sum + (b.advancePaid || 0), 0);
        
        const pendingBookings = bookings.filter(b => b.status === 'pending').length;
        
        return {
            totalServices: services.length,
            totalStaff: staff.length,
            totalBookings: bookings.length,
            totalRevenue: totalRevenue,
            monthlyRevenue: totalRevenue,
            pendingBookings: pendingBookings,
            confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
            completedBookings: bookings.filter(b => b.status === 'completed').length
        };
    }
}

// Create global instance
window.dataService = new DataService();
