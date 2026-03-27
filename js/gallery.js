// Gallery Module - Handles all image galleries, sliders, and visual effects
class GalleryManager {
    constructor() {
        this.currentImageIndex = 0;
        this.galleryImages = [];
        this.init();
    }

    init() {
        this.loadGallery();
        this.loadTransformations();
        this.loadTeamMembers();
        this.loadTestimonials();
        this.loadInstagramFeed();
        this.setupVideoPlayer();
        this.setupLightbox();
        this.startCounterAnimation();
    }

    // Load main gallery images
    loadGallery() {
        const galleryGrid = document.getElementById('gallery-grid');
        if (!galleryGrid) return;

        this.galleryImages = [
            {
                src: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=600&fit=crop',
                title: 'Luxury Interior',
                category: 'Salon'
            },
            {
                src: 'https://images.unsplash.com/photo-1522337660859-02fbefca4700?w=800&h=600&fit=crop',
                title: 'Hair Styling Station',
                category: 'Services'
            },
            {
                src: 'https://images.unsplash.com/photo-1595476108010-4b1727f2dfc2?w=800&h=600&fit=crop',
                title: 'Makeup Studio',
                category: 'Makeup'
            },
            {
                src: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&h=600&fit=crop',
                title: 'Nail Art',
                category: 'Nails'
            },
            {
                src: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&h=600&fit=crop',
                title: 'Facial Room',
                category: 'Skincare'
            },
            {
                src: 'https://images.unsplash.com/photo-1582095133179-bfd8e68866bf?w=800&h=600&fit=crop',
                title: 'Bridal Suite',
                category: 'Bridal'
            }
        ];

        galleryGrid.innerHTML = this.galleryImages.map((img, index) => `
            <div class="gallery-item" onclick="galleryManager.openLightbox(${index})">
                <img src="${img.src}" alt="${img.title}" loading="lazy">
                <div class="gallery-overlay">
                    <h3>${img.title}</h3>
                    <p>${img.category}</p>
                </div>
            </div>
        `).join('');
    }

    // Load before/after transformations with slider
    loadTransformations() {
        const container = document.getElementById('transformations');
        if (!container) return;

        const transformations = [
            {
                before: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&h=400&fit=crop',
                after: 'https://images.unsplash.com/photo-1522336572468-97b06e8ef143?w=600&h=400&fit=crop',
                title: 'Hair Color Transformation'
            },
            {
                before: 'https://images.unsplash.com/photo-1504700610630-ac6aba0e687d?w=600&h=400&fit=crop',
                after: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&h=400&fit=crop',
                title: 'Bridal Makeover'
            },
            {
                before: 'https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?w=600&h=400&fit=crop',
                after: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=400&fit=crop',
                title: 'Skin Treatment Results'
            }
        ];

        container.innerHTML = transformations.map(trans => `
            <div class="comparison-slider">
                <img src="${trans.before}" alt="Before" class="comparison-image before">
                <img src="${trans.after}" alt="After" class="comparison-image after">
                <div class="slider-handle"></div>
                <div class="comparison-label before-label">Before</div>
                <div class="comparison-label after-label">After</div>
                <h4 style="text-align: center; margin-top: 1rem;">${trans.title}</h4>
            </div>
        `).join('');

        // Setup sliders
        document.querySelectorAll('.comparison-slider').forEach(slider => this.setupComparisonSlider(slider));
    }

    setupComparisonSlider(slider) {
        const handle = slider.querySelector('.slider-handle');
        const beforeImg = slider.querySelector('.before');
        let isDragging = false;

        const updateSlider = (x) => {
            const rect = slider.getBoundingClientRect();
            let percentage = ((x - rect.left) / rect.width) * 100;
            percentage = Math.max(0, Math.min(percentage, 100));
            handle.style.left = `${percentage}%`;
            beforeImg.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
        };

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updateSlider(e.clientX);
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Touch support for mobile
        handle.addEventListener('touchstart', (e) => {
            isDragging = true;
            e.preventDefault();
        });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            updateSlider(e.touches[0].clientX);
        });

        document.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    // Load team members
    loadTeamMembers() {
        const teamGrid = document.getElementById('team-grid');
        if (!teamGrid) return;

        const teamMembers = [
            {
                name: 'Priya Sharma',
                position: 'Creative Director',
                specialty: 'Bridal Makeup Expert',
                experience: '12+ years',
                image: 'https://images.unsplash.com/photo-1494790108777-223fd4f5603d?w=400&h=400&fit=crop'
            },
            {
                name: 'Anjali Desai',
                position: 'Senior Hair Stylist',
                specialty: 'Color Specialist',
                experience: '8+ years',
                image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop'
            },
            {
                name: 'Meera Kapoor',
                position: 'Nail Art Expert',
                specialty: 'Creative Nail Designs',
                experience: '6+ years',
                image: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=400&h=400&fit=crop'
            },
            {
                name: 'Riya Mehta',
                position: 'Skincare Specialist',
                specialty: 'Facial Treatments',
                experience: '10+ years',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
            }
        ];

        teamGrid.innerHTML = teamMembers.map(member => `
            <div class="team-card">
                <img src="${member.image}" alt="${member.name}" class="team-image">
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

    // Load testimonials with carousel
    loadTestimonials() {
        const slider = document.getElementById('testimonials-slider');
        if (!slider) return;

        const testimonials = [
            {
                name: 'Neha Gupta',
                role: 'Bridal Client',
                image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop',
                text: 'Absolutely amazing experience! The bridal makeup was perfect, and the team made me feel like a princess on my special day.',
                rating: 5
            },
            {
                name: 'Kavita Singh',
                role: 'Regular Client',
                image: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=150&h=150&fit=crop',
                text: 'Best salon in town! The staff is professional, and the hygiene standards are top-notch. My go-to place for all beauty needs.',
                rating: 5
            },
            {
                name: 'Pooja Patel',
                role: 'Celebrity Client',
                image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop',
                text: 'The hair coloring service is exceptional! They understood exactly what I wanted and delivered beyond expectations.',
                rating: 5
            }
        ];

        slider.innerHTML = testimonials.map(testimonial => `
            <div class="testimonial-card">
                <img src="${testimonial.image}" alt="${testimonial.name}" class="testimonial-image">
                <div class="testimonial-rating">
                    ${'<i class="fas fa-star"></i>'.repeat(testimonial.rating)}
                </div>
                <div class="testimonial-text">"${testimonial.text}"</div>
                <div class="testimonial-author">${testimonial.name}</div>
                <div class="testimonial-role">${testimonial.role}</div>
            </div>
        `).join('');

        // Auto-slide carousel
        this.initTestimonialCarousel();
    }

    initTestimonialCarousel() {
        const cards = document.querySelectorAll('.testimonial-card');
        let currentIndex = 0;

        const showCard = (index) => {
            cards.forEach((card, i) => {
                card.style.display = i === index ? 'block' : 'none';
            });
        };

        if (cards.length > 0) {
            showCard(0);
            setInterval(() => {
                currentIndex = (currentIndex + 1) % cards.length;
                showCard(currentIndex);
            }, 5000);
        }
    }

    // Load Instagram feed
    loadInstagramFeed() {
        const feed = document.getElementById('instagram-feed');
        if (!feed) return;

        // Instagram posts from your actual account
        // Replace with your actual Instagram post URLs
        const instagramPosts = [
            'https://images.unsplash.com/photo-1605493625526-54acb523e3eb?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1622288432450-0a7b3d3b8b3b?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1622306006963-b0c4f0a7c3a3?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1622306117306-4d6f3c4b0b3c?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1622306117306-4d6f3c4b0b3d?w=400&h=400&fit=crop'
        ];
        
        feed.innerHTML = instagramPosts.map(post => `
            <div class="instagram-item" onclick="window.open('https://instagram.com/beautybarsalon', '_blank')">
                <img src="${post}" alt="Instagram Post" loading="lazy">
                <div class="instagram-overlay">
                    <i class="fab fa-instagram"></i>
                    <span>View on Instagram</span>
                </div>
            </div>
        `).join('');
    }

    // Setup video player
    setupVideoPlayer() {
        const playButton = document.querySelector('.play-button');
        const videoContainer = document.querySelector('.video-container video');
        const overlay = document.querySelector('.video-overlay');

        if (playButton && videoContainer) {
            playButton.addEventListener('click', () => {
                if (videoContainer.paused) {
                    videoContainer.play();
                    if (overlay) overlay.style.opacity = '0';
                } else {
                    videoContainer.pause();
                    if (overlay) overlay.style.opacity = '1';
                }
            });

            videoContainer.addEventListener('ended', () => {
                if (overlay) overlay.style.opacity = '1';
            });
        }
    }

    // Setup lightbox for gallery
    setupLightbox() {
        const lightbox = document.getElementById('lightbox');
        const closeBtn = document.querySelector('.lightbox-close');
        const prevBtn = document.querySelector('.lightbox-prev');
        const nextBtn = document.querySelector('.lightbox-next');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeLightbox());
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.changeImage(-1));
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.changeImage(1));
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox && lightbox.classList.contains('active')) {
                if (e.key === 'Escape') this.closeLightbox();
                if (e.key === 'ArrowLeft') this.changeImage(-1);
                if (e.key === 'ArrowRight') this.changeImage(1);
            }
        });
    }

    openLightbox(index) {
        this.currentImageIndex = index;
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const counter = document.getElementById('lightbox-counter');
        
        if (lightbox && lightboxImg && this.galleryImages[index]) {
            lightboxImg.src = this.galleryImages[index].src;
            if (counter) counter.textContent = `${index + 1}/${this.galleryImages.length}`;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    changeImage(direction) {
        this.currentImageIndex += direction;
        
        if (this.currentImageIndex < 0) {
            this.currentImageIndex = this.galleryImages.length - 1;
        } else if (this.currentImageIndex >= this.galleryImages.length) {
            this.currentImageIndex = 0;
        }
        
        const lightboxImg = document.getElementById('lightbox-img');
        const counter = document.getElementById('lightbox-counter');
        
        if (lightboxImg && this.galleryImages[this.currentImageIndex]) {
            lightboxImg.src = this.galleryImages[this.currentImageIndex].src;
            if (counter) counter.textContent = `${this.currentImageIndex + 1}/${this.galleryImages.length}`;
        }
    }

    // Animate counters on scroll
    startCounterAnimation() {
        const counters = document.querySelectorAll('.counter-number');
        if (counters.length === 0) return;

        const animateCounter = (element, target) => {
            let current = 0;
            const increment = target / 50;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    element.textContent = Math.floor(current).toLocaleString() + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target.toLocaleString() + '+';
                }
            };
            updateCounter();
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const target = parseInt(element.textContent);
                    animateCounter(element, target);
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }
}

// Initialize gallery when page loads
let galleryManager;
document.addEventListener('DOMContentLoaded', () => {
    galleryManager = new GalleryManager();
    window.galleryManager = galleryManager;
});
