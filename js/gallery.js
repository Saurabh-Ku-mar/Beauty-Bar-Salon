// Gallery Data with Beautiful Images
const galleryImages = [
    {
        src: 'https://unsplash.com/photos/top-view-of-young-woman-is-lying-on-massage-table-with-closed-eyes-on-her-face-is-applied-white-mask-cosmetologist-is-standing-behind-her-selective-focus-lqBnWjN2BZ8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Luxury Interior',
        category: 'Salon'
    },
    {
        src: 'https://images.unsplash.com/photo-1522337660859-02fbefca4700?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Hair Styling Station',
        category: 'Services'
    },
    {
        src: 'https://images.unsplash.com/photo-1595476108010-4b1727f2dfc2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Makeup Studio',
        category: 'Makeup'
    },
    {
        src: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Nail Art',
        category: 'Nails'
    },
    {
        src: 'https://images.unsplash.com/photo-1621607512214-68297480165e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Facial Room',
        category: 'Skincare'
    },
    {
        src: 'https://images.unsplash.com/photo-1582095133179-bfd8e68866bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Bridal Suite',
        category: 'Bridal'
    }
];

// Team Members Data
const teamMembers = [
    {
        name: 'Priya Sharma',
        position: 'Creative Director',
        specialty: 'Bridal Makeup Expert',
        image: 'https://images.unsplash.com/photo-1494790108777-223fd4f5603d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        instagram: '#',
        experience: '12+ years'
    },
    {
        name: 'Anjali Desai',
        position: 'Senior Hair Stylist',
        specialty: 'Color Specialist',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        instagram: '#',
        experience: '8+ years'
    },
    {
        name: 'Meera Kapoor',
        position: 'Nail Art Expert',
        specialty: 'Creative Nail Designs',
        image: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        instagram: '#',
        experience: '6+ years'
    },
    {
        name: 'Riya Mehta',
        position: 'Skincare Specialist',
        specialty: 'Facial Treatments',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        instagram: '#',
        experience: '10+ years'
    }
];

// Testimonials Data
const testimonials = [
    {
        name: 'Neha Gupta',
        role: 'Bridal Client',
        image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        text: 'Absolutely amazing experience! The bridal makeup was perfect, and the team made me feel like a princess on my special day.',
        rating: 5
    },
    {
        name: 'Kavita Singh',
        role: 'Regular Client',
        image: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        text: 'Best salon in town! The staff is professional, and the hygiene standards are top-notch. My go-to place for all beauty needs.',
        rating: 5
    },
    {
        name: 'Pooja Patel',
        role: 'Celebrity Client',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        text: 'The hair coloring service is exceptional! They understood exactly what I wanted and delivered beyond expectations.',
        rating: 5
    }
];

// Before/After Transformations
const transformations = [
    {
        before: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        after: 'https://images.unsplash.com/photo-1522336572468-97b06e8ef143?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Hair Color Transformation'
    },
    {
        before: 'https://images.unsplash.com/photo-1504700610630-ac6aba0e687d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        after: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Bridal Makeover'
    },
    {
        before: 'https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        after: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Skin Treatment Results'
    }
];

// Load Gallery
function loadGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid) {
        galleryGrid.innerHTML = galleryImages.map((img, index) => `
            <div class="gallery-item" onclick="openLightbox(${index})">
                <img src="${img.src}" alt="${img.title}" loading="lazy">
                <div class="gallery-overlay">
                    <h3>${img.title}</h3>
                    <p>${img.category}</p>
                </div>
            </div>
        `).join('');
    }
}

// Load Team Members
function loadTeam() {
    const teamGrid = document.getElementById('team-grid');
    if (teamGrid) {
        teamGrid.innerHTML = teamMembers.map(member => `
            <div class="team-card">
                <img src="${member.image}" alt="${member.name}" class="team-image">
                <div class="team-info">
                    <h3>${member.name}</h3>
                    <div class="position">${member.position}</div>
                    <div class="specialty">${member.specialty}</div>
                    <p>Experience: ${member.experience}</p>
                    <div class="team-social">
                        <a href="${member.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Load Testimonials
function loadTestimonials() {
    const slider = document.getElementById('testimonials-slider');
    if (slider) {
        slider.innerHTML = testimonials.map(testimonial => `
            <div class="testimonial-card">
                <img src="${testimonial.image}" alt="${testimonial.name}" class="testimonial-image">
                <div class="testimonial-rating">
                    ${Array(testimonial.rating).fill('<i class="fas fa-star"></i>').join('')}
                </div>
                <div class="testimonial-text">"${testimonial.text}"</div>
                <div class="testimonial-author">${testimonial.name}</div>
                <div class="testimonial-role">${testimonial.role}</div>
            </div>
        `).join('');
    }
}

// Load Transformations
function loadTransformations() {
    const container = document.getElementById('transformations');
    if (container) {
        container.innerHTML = transformations.map(trans => `
            <div class="comparison-slider">
                <img src="${trans.before}" alt="Before" class="comparison-image before">
                <img src="${trans.after}" alt="After" class="comparison-image after">
                <div class="slider-handle"></div>
                <div style="position: absolute; bottom: 10px; left: 10px; background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 5px;">Before</div>
                <div style="position: absolute; bottom: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 5px;">After</div>
            </div>
        `).join('');

        // Add slider functionality
        document.querySelectorAll('.comparison-slider').forEach(setupSlider);
    }
}

// Setup comparison slider
function setupSlider(slider) {
    const handle = slider.querySelector('.slider-handle');
    const beforeImg = slider.querySelector('.before');
    let isDragging = false;

    handle.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const rect = slider.getBoundingClientRect();
        let x = e.clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        
        const percentage = (x / rect.width) * 100;
        handle.style.left = `${percentage}%`;
        beforeImg.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

// Lightbox functionality
let currentImageIndex = 0;

function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const counter = document.getElementById('lightbox-counter');
    
    lightboxImg.src = galleryImages[index].src;
    counter.textContent = `${index + 1}/${galleryImages.length}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function changeImage(direction) {
    currentImageIndex += direction;
    
    if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    } else if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    }
    
    const lightboxImg = document.getElementById('lightbox-img');
    const counter = document.getElementById('lightbox-counter');
    
    lightboxImg.src = galleryImages[currentImageIndex].src;
    counter.textContent = `${currentImageIndex + 1}/${galleryImages.length}`;
}

// Video play functionality
function playVideo() {
    const video = document.querySelector('.video-container video');
    const overlay = document.querySelector('.video-overlay');
    
    if (video.paused) {
        video.play();
        overlay.style.opacity = '0';
    } else {
        video.pause();
        overlay.style.opacity = '1';
    }
}

// Newsletter subscription
function subscribeNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input').value;
    
    // Show success message
    alert('Thank you for subscribing! You will receive exclusive offers soon.');
    event.target.reset();
    
    return false;
}

// Instagram Feed Loader
function loadInstagramFeed() {
    const feed = document.getElementById('instagram-feed');
    if (feed) {
        // Demo Instagram posts - in production, fetch from Instagram API
        const instagramPosts = [
            'https://images.unsplash.com/photo-1605493625526-54acb523e3eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1622288432450-0a7b3d3b8b3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1622306006963-b0c4f0a7c3a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1622306117306-4d6f3c4b0b3c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1622306117306-4d6f3c4b0b3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ];
        
        feed.innerHTML = instagramPosts.map(post => `
            <div class="instagram-item">
                <img src="${post}" alt="Instagram Post" loading="lazy">
                <div class="instagram-overlay">
                    <i class="fab fa-instagram"></i>
                    <i class="fas fa-heart"></i>
                </div>
            </div>
        `).join('');
    }
}

// Counter animation
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.innerText = Math.floor(progress * (end - start) + start).toLocaleString() + '+';
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize all when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadGallery();
    loadTeam();
    loadTestimonials();
    loadTransformations();
    loadInstagramFeed();
    
    // Animate counters
    setTimeout(() => {
        animateCounter(document.getElementById('happyClients'), 0, 15000, 2000);
        animateCounter(document.getElementById('servicesDone'), 0, 45000, 2000);
        animateCounter(document.getElementById('expertStylists'), 0, 25, 2000);
        animateCounter(document.getElementById('awardsWon'), 0, 12, 2000);
    }, 500);
});

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    if (document.getElementById('lightbox').classList.contains('active')) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            changeImage(-1);
        } else if (e.key === 'ArrowRight') {
            changeImage(1);
        }
    }
});
