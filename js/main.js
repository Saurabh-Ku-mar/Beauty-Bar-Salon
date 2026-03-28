// frontend/js/main.js - Updated to use DataService

document.addEventListener('DOMContentLoaded', async () => {
    // Wait for data service to be ready
    if (window.dataService) {
        await loadServicesFromData();
        await loadTeamFromData();
    }
    
    initNavigation();
    initSmoothScroll();
    initNewsletterForm();
    initFloatingWhatsApp();
    initBackToTop();
    
    // Listen for data changes
    window.dataService.subscribe((data) => {
        console.log('Data updated, refreshing UI...');
        loadServicesFromData();
        loadTeamFromData();
    });
});

// Load services from central data
async function loadServicesFromData() {
    const servicesGrid = document.getElementById('services-grid');
    if (!servicesGrid) return;
    
    const services = window.dataService.getServices();
    
    if (services.length === 0) {
        servicesGrid.innerHTML = '<p style="text-align: center;">Loading services...</p>';
        return;
    }
    
    servicesGrid.innerHTML = services.map(service => `
        <div class="service-card">
            <img src="${service.image}" alt="${service.name}" class="service-image" loading="lazy">
            <div class="service-content">
                <span class="service-category">${service.category}</span>
                <h3 class="service-title">${service.name}</h3>
                <p style="color: #666; margin: 0.5rem 0;">${service.description || 'Premium salon service'}</p>
                <p>⏱️ ${service.duration} mins</p>
                <div class="service-price">₹${service.price}</div>
                <a href="booking.html?service=${service.id}" class="btn btn-primary" style="margin-top: 1rem;">Book Now</a>
            </div>
        </div>
    `).join('');
}

// Load team from central data
async function loadTeamFromData() {
    const teamGrid = document.getElementById('team-grid');
    if (!teamGrid) return;
    
    const staff = window.dataService.getStaff();
    
    if (staff.length === 0) {
        teamGrid.innerHTML = '<p style="text-align: center;">Loading team...</p>';
        return;
    }
    
    teamGrid.innerHTML = staff.map(member => `
        <div class="team-card">
            <img src="${member.image}" alt="${member.name}" class="team-image" loading="lazy">
            <div class="team-info">
                <h3>${member.name}</h3>
                <div class="position">${member.position}</div>
                <div class="specialty">${member.specialty}</div>
                <p>⭐ ${member.experience} experience</p>
                <div class="team-social">
                    <a href="#" target="_blank"><i class="fab fa-instagram"></i></a>
                    <a href="#" target="_blank"><i class="fab fa-linkedin-in"></i></a>
                </div>
            </div>
        </div>
    `).join('');
}

// Rest of your existing functions...
function initNavigation() {
    // ... existing code
}

function initSmoothScroll() {
    // ... existing code
}

function initNewsletterForm() {
    // ... existing code
}

function initFloatingWhatsApp() {
    // ... existing code
}

function initBackToTop() {
    // ... existing code
);
