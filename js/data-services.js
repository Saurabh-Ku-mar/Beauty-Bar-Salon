// frontend/js/data-service.js
// Central data management for all services, staff, and bookings

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
        
        // Setup auto-save
        this.setupAutoSave();
        
        // Initialize with default data if empty
        if (this.data.services.length === 0) {
            this.loadDefaultData();
        }
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
                this.loadDefaultData();
            }
        }
    }

    loadDefaultData() {
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

        // Default bookings (sample)
        this.data.bookings = [
            {
                id: 1001,
                serviceId: 1,
                staffId: 1,
                customerName: "Neha Gupta",
                customerEmail: "neha@example.com",
                customerPhone: "9876543210",
                date: "2024-12-20",
                time: "10:00 AM",
                amount: 4999,
                advancePaid: 1500,
                status: "confirmed",
                createdAt: new Date().toISOString()
            }
        ];

        this.saveData();
    }

    saveData() {
        localStorage.setItem('beautyBarData', JSON.stringify(this.data));
        console.log('Data saved to localStorage');
        
        // Notify all listeners
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

    setupAutoSave() {
        // Auto-save every 5 seconds (for safety)
        setInterval(() => {
            this.saveData();
        }, 5000);
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

    getStaffByService(serviceId) {
        return this.data.staff.filter(s => s.services.includes(parseInt(serviceId)) && s.isActive !== false);
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

    updateBookingStatus(id, status) {
        const index = this.data.bookings.findIndex(b => b.id === parseInt(id));
        if (index !== -1) {
            this.data.bookings[index].status = status;
            this.data.bookings[index].updatedAt = new Date().toISOString();
            this.saveData();
            return this.data.bookings[index];
        }
        return null;
    }

    // Dashboard Stats
    getStats() {
        const services = this.getServices();
        const staff = this.getStaff();
        const bookings = this.data.bookings;
        
        const totalRevenue = bookings
            .filter(b => b.status === 'confirmed' || b.status === 'completed')
            .reduce((sum, b) => sum + b.advancePaid, 0);
        
        const pendingBookings = bookings.filter(b => b.status === 'pending').length;
        const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
        const completedBookings = bookings.filter(b => b.status === 'completed').length;
        
        // Monthly revenue
        const currentMonth = new Date().getMonth();
        const monthlyRevenue = bookings
            .filter(b => {
                const bookingDate = new Date(b.date);
                return bookingDate.getMonth() === currentMonth && 
                       (b.status === 'confirmed' || b.status === 'completed');
            })
            .reduce((sum, b) => sum + b.advancePaid, 0);
        
        return {
            totalServices: services.length,
            totalStaff: staff.length,
            totalBookings: bookings.length,
            totalRevenue,
            monthlyRevenue,
            pendingBookings,
            confirmedBookings,
            completedBookings
        };
    }

    // Reset to default (for testing)
    resetToDefault() {
        this.loadDefaultData();
        this.saveData();
        window.location.reload();
    }
}

// Create global instance
window.dataService = new DataService();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataService;
                    }
