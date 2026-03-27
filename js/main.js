// Main JavaScript for Beauty Bar Salon
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initSmoothScroll();
    initServiceLoader();
    initNewsletterForm();
    initFloatingWhatsApp();
    initBackToTop();
});

// Navigation and mobile menu
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    menuToggle.style.display = 'none';
    
    if (window.innerWidth <= 768) {
        menuToggle.style.display = 'block';
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.style.display = 'none';
            menuToggle.addEventListener('click', () => {
                navLinks.style.display = navLinks.style.display === 'none' ? 'flex' : 'none';
                navLinks.style.flexDirection = 'column';
            });
        }
        if (navbar) navbar.appendChild(menuToggle);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const navLinks = document.querySelector('.nav-links');
        if (window.innerWidth <= 768) {
            menuToggle.style.display = 'block';
            if (navLinks) navLinks.style.display = 'none';
        } else {
            menuToggle.style.display = 'none';
            if (navLinks) navLinks.style.display = 'flex';
        }
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Load services dynamically
async function initServiceLoader() {
    const servicesGrid = document.getElementById('services-grid');
    if (!servicesGrid) return;
    
    // Sample services data
    const services = [
        {
            id: 1,
            name: "Bridal Makeup",
            category: "Bridal",
            price: 4999,
            duration: 120,
            image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
            description: "Complete bridal makeup with premium products"
        },
        {
            id: 2,
            name: "Hair Styling",
            category: "Hair",
            price: 1999,
            duration: 60,
            image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400",
            description: "Professional hair styling for any occasion"
        },
        {
            id: 3,
            name: "Facial Treatment",
            category: "Skincare",
            price: 2499,
            duration: 75,
            image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400",
            description: "Deep cleansing and hydrating facial"
        },
        {
            id: 4,
            name: "Nail Art",
            category: "Nails",
            price: 999,
            duration: 45,
            image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400",
            description: "Creative nail designs and care"
        },
        {
            id: 5,
            name: "Party Makeup",
            category: "Makeup",
            price: 2999,
            duration: 90,
            image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400",
            description: "Glamorous party and event makeup"
        },
        {
            id: 6,
            name: "Hair Color",
            category: "Hair",
            price: 3499,
            duration: 120,
            image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400",
            description: "Professional hair coloring and highlights"
        }
    ];
    
    servicesGrid.innerHTML = services.map(service => `
        <div class="service-card">
            <img src="${service.image}" alt="${service.name}" class="service-image">
            <div class="service-content">
                <span class="service-category">${service.category}</span>
                <h3 class="service-title">${service.name}</h3>
                <p style="color: #666; margin: 0.5rem 0;">${service.description}</p>
                <p>⏱️ ${service.duration} mins</p>
                <div class="service-price">₹${service.price}</div>
                <a href="booking.html?service=${service.id}" class="btn btn-primary" style="margin-top: 1rem;">Book Now</a>
            </div>
        </div>
    `).join('');
}

// Newsletter subscription
function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = form.querySelector('input').value;
            
            // Simulate API call
            alert(`Thank you for subscribing! You'll receive exclusive offers at ${email}`);
            form.reset();
        });
    }
}

// Floating WhatsApp button enhancement
function initFloatingWhatsApp() {
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
        // Add service selection if on booking page
        if (window.location.pathname.includes('booking.html')) {
            const serviceName = new URLSearchParams(window.location.search).get('service');
            if (serviceName) {
                whatsappBtn.href = `https://wa.me/1234567890?text=Hello%20Beauty%20Bar%20Salon%2C%20I%20want%20to%20book%20${serviceName}`;
            }
        }
        
        // Add hover effect
        whatsappBtn.addEventListener('mouseenter', () => {
            whatsappBtn.style.transform = 'scale(1.1)';
        });
        whatsappBtn.addEventListener('mouseleave', () => {
            whatsappBtn.style.transform = 'scale(1)';
        });
    }
}

// Back to top button
function initBackToTop() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.className = 'back-to-top';
    btn.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: var(--primary);
        color: white;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        display: none;
        z-index: 998;
        transition: all 0.3s;
    `;
    
    document.body.appendChild(btn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.style.display = 'block';
        } else {
            btn.style.display = 'none';
        }
    });
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Add CSS for mobile menu
const style = document.createElement('style');
style.textContent = `
    .menu-toggle {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--primary);
        cursor: pointer;
    }
    
    .back-to-top:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(183, 110, 121, 0.3);
    }
    
    @media (max-width: 768px) {
        .nav-links {
            position: absolute;
            top: 70px;
            left: 0;
            right: 0;
            background: white;
            padding: 1rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 999;
        }
        
        .social-nav {
            margin-left: 0;
            justify-content: center;
        }
    }
`;
document.head.appendChild(style);
