// frontend/js/data-service.js
// Central Data Management System with Backend API Integration

class DataService {
    constructor() {
        this.data = {
            services: [],
            staff: [],
            bookings: []
        };
        this.listeners = [];
        this.apiUrl = 'https://beauty-bar-backend.onrender.com/api';
        this.isLoading = false;
        this.error = null;
        this.init();
    }

    async init() {
        console.log('DataService initializing...');
        console.log('API URL:', this.apiUrl);
        
        // Load data from backend
        await this.fetchAllData();
        
        // If backend fails, load from localStorage as fallback
        if (this.data.services.length === 0) {
            this.loadFromLocalStorage();
        }
        
        // If still no data, load defaults
        if (this.data.services.length === 0) {
            this.loadDefaultData();
        }
    }

    // ============================================
    // FETCH DATA FROM BACKEND API
    // ============================================

    async fetchAllData() {
        this.isLoading = true;
        this.error = null;
        
        try {
            await Promise.all([
                this.fetchServices(),
                this.fetchStaff(),
                this.fetchBookings()
            ]);
            console.log('All data fetched successfully from backend');
        } catch (error) {
            console.error('Error fetching data from backend:', error);
            this.error = error.message;
        } finally {
            this.isLoading = false;
        }
    }

    async fetchServices() {
        try {
            const response = await fetch(`${this.apiUrl}/services`);
            const result = await response.json();
            
            if (result.success && result.services) {
                this.data.services = result.services;
                console.log(`✅ Loaded ${this.data.services.length} services from backend`);
                this.saveToLocalStorage();
                this.notifyListeners();
                return true;
            } else {
                console.warn('Failed to fetch services:', result.message);
                return false;
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            return false;
        }
    }

    async fetchStaff() {
        try {
            const response = await fetch(`${this.apiUrl}/staff`);
            const result = await response.json();
            
            if (result.success && result.staff) {
                this.data.staff = result.staff;
                console.log(`✅ Loaded ${this.data.staff.length} staff from backend`);
                this.saveToLocalStorage();
                this.notifyListeners();
                return true;
            } else {
                console.warn('Failed to fetch staff:', result.message);
                return false;
            }
        } catch (error) {
            console.error('Error fetching staff:', error);
            return false;
        }
    }

    async fetchBookings() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No auth token, skipping bookings fetch');
                return false;
            }
            
            const response = await fetch(`${this.apiUrl}/bookings/my-bookings`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            
            if (result.success && result.bookings) {
                this.data.bookings = result.bookings;
                console.log(`✅ Loaded ${this.data.bookings.length} bookings from backend`);
                this.saveToLocalStorage();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error fetching bookings:', error);
            return false;
        }
    }

    // ============================================
    // CREATE/UPDATE DATA TO BACKEND
    // ============================================

    async createBooking(bookingData) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Please login to book appointment');
            }
            
            const response = await fetch(`${this.apiUrl}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bookingData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.data.bookings.unshift(result.booking);
                this.saveToLocalStorage();
                this.notifyListeners();
                return { success: true, booking: result.booking };
            } else {
                return { success: false, error: result.message };
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            return { success: false, error: error.message };
        }
    }

    async cancelBooking(bookingId) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${this.apiUrl}/bookings/${bookingId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                const index = this.data.bookings.findIndex(b => b.id === bookingId);
                if (index !== -1) {
                    this.data.bookings[index].bookingStatus = 'cancelled';
                    this.saveToLocalStorage();
                    this.notifyListeners();
                }
                return { success: true };
            } else {
                return { success: false, error: result.message };
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            return { success: false, error: error.message };
        }
    }

    // ============================================
    // LOCAL STORAGE (FALLBACK)
    // ============================================

    loadFromLocalStorage() {
        const saved = localStorage.getItem('beautyBarData');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.services && parsed.services.length > 0) {
                    this.data.services = parsed.services;
                    console.log(`📦 Loaded ${this.data.services.length} services from localStorage`);
                }
                if (parsed.staff && parsed.staff.length > 0) {
                    this.data.staff = parsed.staff;
                    console.log(`📦 Loaded ${this.data.staff.length} staff from localStorage`);
                }
                if (parsed.bookings) {
                    this.data.bookings = parsed.bookings;
                }
                this.notifyListeners();
            } catch (e) {
                console.error('Failed to parse saved data:', e);
            }
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('beautyBarData', JSON.stringify(this.data));
    }

    // ============================================
    // DEFAULT DATA (FALLBACK)
    // ============================================

    loadDefaultData() {
        console.log('📁 Loading default data...');
        
        this.data.services = [
            {
                id: 1,
                name: "Bridal Makeup",
                category: "Bridal",
                price: 4999,
                duration: 120,
                image: "https://images.pexels.com/photos/3992135/pexels-photo-3992135.jpeg?w=400&h=300&fit=crop",
                description: "Complete bridal makeup with premium products",
                isActive: true,
                popular: true
            },
            {
                id: 2,
                name: "Hair Styling",
                category: "Hair",
                price: 1999,
                duration: 60,
                image: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?w=400&h=300&fit=crop",
                description: "Professional hair styling for any occasion",
                isActive: true,
                popular: true
            },
            {
                id: 3,
                name: "Facial Treatment",
                category: "Skincare",
                price: 2499,
                duration: 75,
                image: "https://images.pexels.com/photos/3822600/pexels-photo-3822600.jpeg?w=400&h=300&fit=crop",
                description: "Deep cleansing and hydrating facial",
                isActive: true,
                popular: false
            },
            {
                id: 4,
                name: "Nail Art",
                category: "Nails",
                price: 999,
                duration: 45,
                image: "https://images.pexels.com/photos/3992135/pexels-photo-3992135.jpeg?w=400&h=300&fit=crop",
                description: "Creative nail designs and care",
                isActive: true,
                popular: false
            },
            {
                id: 5,
                name: "Party Makeup",
                category: "Makeup",
                price: 2999,
                duration: 90,
                image: "https://images.pexels.com/photos/3992135/pexels-photo-3992135.jpeg?w=400&h=300&fit=crop",
                description: "Glamorous party and event makeup",
                isActive: true,
                popular: true
            },
            {
                id: 6,
                name: "Hair Color",
                category: "Hair",
                price: 3499,
                duration: 120,
                image: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?w=400&h=300&fit=crop",
                description: "Professional hair coloring and highlights",
                isActive: true,
                popular: false
            }
        ];

        this.data.staff = [
            {
                id: 1,
                name: "Priya Sharma",
                position: "Senior Makeup Artist",
                specialty: "Bridal Makeup",
                experience: "12+ years",
                image: "https://images.pexels.com/photos/1494790108777-223fd4f5603d?w=300&h=300&fit=crop",
                services: [1, 5],
                isActive: true,
                rating: 4.9,
                reviews: 128
            },
            {
                id: 2,
                name: "Anjali Desai",
                position: "Senior Hair Stylist",
                specialty: "Hair Color & Styling",
                experience: "8+ years",
                image: "https://images.pexels.com/photos/1534528741775-53994a69daeb?w=300&h=300&fit=crop",
                services: [2, 6],
                isActive: true,
                rating: 4.8,
                reviews: 95
            },
            {
                id: 3,
                name: "Meera Kapoor",
                position: "Nail Art Expert",
                specialty: "Nail Art & Design",
                experience: "6+ years",
                image: "https://images.pexels.com/photos/1517365830460-955ce3ccd263?w=300&h=300&fit=crop",
                services: [4],
                isActive: true,
                rating: 4.7,
                reviews: 78
            },
            {
                id: 4,
                name: "Riya Mehta",
                position: "Skincare Specialist",
                specialty: "Facial Treatments",
                experience: "10+ years",
                image: "https://images.pexels.com/photos/1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
                services: [3],
                isActive: true,
                rating: 4.9,
                reviews: 112
            }
        ];

        this.data.bookings = [];
        this.saveToLocalStorage();
        this.notifyListeners();
    }

    // ============================================
    // GETTER METHODS
    // ============================================

    getServices() {
        return this.data.services.filter(s => s.isActive !== false);
    }

    getAllServices() {
        return this.data.services;
    }

    getServiceById(id) {
        return this.data.services.find(s => s.id === parseInt(id));
    }

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
        return this.data.staff.filter(s => 
            s.services && s.services.includes(parseInt(serviceId)) && s.isActive !== false
        );
    }

    getBookings() {
        return this.data.bookings;
    }

    getBookingById(id) {
        return this.data.bookings.find(b => b.id === id);
    }

    // ============================================
    // ADMIN METHODS (for local data management)
    // ============================================

    addService(service) {
        const newId = Math.max(...this.data.services.map(s => s.id), 0) + 1;
        const newService = { 
            ...service, 
            id: newId, 
            createdAt: new Date().toISOString(),
            isActive: true
        };
        this.data.services.push(newService);
        this.saveToLocalStorage();
        this.notifyListeners();
        return newService;
    }

    updateService(id, updatedData) {
        const index = this.data.services.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            this.data.services[index] = { ...this.data.services[index], ...updatedData };
            this.saveToLocalStorage();
            this.notifyListeners();
            return this.data.services[index];
        }
        return null;
    }

    deleteService(id) {
        this.data.services = this.data.services.filter(s => s.id !== parseInt(id));
        this.saveToLocalStorage();
        this.notifyListeners();
    }

    addStaff(staff) {
        const newId = Math.max(...this.data.staff.map(s => s.id), 0) + 1;
        const newStaff = { 
            ...staff, 
            id: newId, 
            createdAt: new Date().toISOString(),
            isActive: true
        };
        this.data.staff.push(newStaff);
        this.saveToLocalStorage();
        this.notifyListeners();
        return newStaff;
    }

    updateStaff(id, updatedData) {
        const index = this.data.staff.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            this.data.staff[index] = { ...this.data.staff[index], ...updatedData };
            this.saveToLocalStorage();
            this.notifyListeners();
            return this.data.staff[index];
        }
        return null;
    }

    deleteStaff(id) {
        this.data.staff = this.data.staff.filter(s => s.id !== parseInt(id));
        this.saveToLocalStorage();
        this.notifyListeners();
    }

    // ============================================
    // DASHBOARD STATS
    // ============================================

    getStats() {
        const services = this.getServices();
        const staff = this.getStaff();
        const bookings = this.data.bookings;
        
        const totalRevenue = bookings
            .filter(b => b.bookingStatus === 'confirmed' || b.bookingStatus === 'completed')
            .reduce((sum, b) => sum + (b.advanceAmount || 0), 0);
        
        const pendingBookings = bookings.filter(b => b.bookingStatus === 'pending').length;
        
        return {
            totalServices: services.length,
            totalStaff: staff.length,
            totalBookings: bookings.length,
            totalRevenue: totalRevenue,
            pendingBookings: pendingBookings
        };
    }

    // ============================================
    // SUBSCRIBER METHODS
    // ============================================

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.data));
    }

    // ============================================
    // UTILITY METHODS
    // ============================================

    isLoadingData() {
        return this.isLoading;
    }

    getError() {
        return this.error;
    }

    async refreshData() {
        console.log('Refreshing data...');
        await this.fetchAllData();
        if (this.data.services.length === 0) {
            this.loadFromLocalStorage();
        }
        if (this.data.services.length === 0) {
            this.loadDefaultData();
        }
        this.notifyListeners();
    }

    resetToDefault() {
        this.loadDefaultData();
        this.saveToLocalStorage();
        this.notifyListeners();
        window.location.reload();
    }
}

// Create global instance
window.dataService = new DataService();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataService;
                }
