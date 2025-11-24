// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Topic cards functionality - ensure only one opens at a time
function initializeTopicCards() {
    const topicCards = document.querySelectorAll('.topic-card');
    
    topicCards.forEach(card => {
        const header = card.querySelector('.topic-header');
        
        if (header) {
            // Remove any existing listeners
            header.removeEventListener('click', handleTopicClick);
            // Add new listener
            header.addEventListener('click', handleTopicClick);
        }
    });
}

function handleTopicClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const card = e.currentTarget.closest('.topic-card');
    const isCurrentlyActive = card.classList.contains('active');
    
    // Close all cards first
    document.querySelectorAll('.topic-card').forEach(otherCard => {
        otherCard.classList.remove('active');
    });
    
    // If this card wasn't active, open it
    if (!isCurrentlyActive) {
        card.classList.add('active');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeTopicCards);

// Also initialize after a short delay to ensure all elements are ready
setTimeout(initializeTopicCards, 100);

// Enhanced navbar background change on scroll with parallax effects
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrolled = window.pageYOffset;
    
    // Navbar scroll effect
    if (scrolled > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Parallax effects for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.3;
        hero.style.transform = `translateY(${rate}px)`;
    }
    
    // Parallax effect for hero background
    const heroBackground = document.querySelector('.hero::before');
    if (scrolled < window.innerHeight) {
        const rate = scrolled * 0.1;
        hero.style.backgroundPosition = `center ${rate}px`;
    }
    
    // Add floating animation to elements as they come into view
    const parallaxElements = document.querySelectorAll('.parallax-element');
    parallaxElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const speed = element.dataset.speed || 0.5;
        
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        }
    });
});

// Enhanced Intersection Observer for multiple animation types
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Add staggered animations to children if they exist
            const children = entry.target.querySelectorAll('.stagger-animation');
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('visible');
                }, index * 100);
            });
        }
    });
}, observerOptions);

// Parallax scrolling effect
function addParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.parallax-slow, .parallax-fast');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.classList.contains('parallax-slow') ? 0.3 : 0.6;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        // Enhanced section transition effect
        const latestVideo = document.querySelector('.latest-video');
        const topics = document.querySelector('.topics');
        
        if (latestVideo && topics) {
            const latestVideoRect = latestVideo.getBoundingClientRect();
            const topicsRect = topics.getBoundingClientRect();
            
            // Create more dramatic transition effect between sections
            if (topicsRect.top < window.innerHeight && topicsRect.top > -topicsRect.height) {
                const transitionProgress = Math.max(0, Math.min(1, (window.innerHeight - topicsRect.top) / 400));
                const slideDistance = 80 * (1 - transitionProgress);
                const scaleValue = 0.9 + (0.1 * transitionProgress);
                
                topics.style.transform = `translateY(${slideDistance}px) scale(${scaleValue})`;
                topics.style.opacity = Math.max(0.3, transitionProgress);
                
                // Add blur effect during transition
                const blurAmount = 5 * (1 - transitionProgress);
                topics.style.filter = `blur(${blurAmount}px)`;
            }
        }
    });
}

// Text reveal animation on scroll
function addTextRevealEffect() {
    const textElements = document.querySelectorAll('.reveal-text');
    
    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target.textContent;
                entry.target.innerHTML = '';
                
                [...text].forEach((char, index) => {
                    const span = document.createElement('span');
                    span.textContent = char === ' ' ? '\u00A0' : char;
                    span.style.opacity = '0';
                    span.style.transform = 'translateY(20px)';
                    span.style.transition = `all 0.3s ease ${index * 0.05}s`;
                    entry.target.appendChild(span);
                    
                    setTimeout(() => {
                        span.style.opacity = '1';
                        span.style.transform = 'translateY(0)';
                    }, 100);
                });
                
                textObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    textElements.forEach(el => textObserver.observe(el));
}

// Enhanced animations with multiple effects
document.addEventListener('DOMContentLoaded', () => {
    // Initialize parallax and text effects
    addParallaxEffect();
    addTextRevealEffect();
    
    // Add section title animations
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        observer.observe(title);
    });
    
    // Add different animation types to sections
    const latestVideo = document.querySelector('.latest-video');
    if (latestVideo) {
        latestVideo.classList.add('slide-left', 'parallax-slow');
        observer.observe(latestVideo);
    }
    
    // Initialize topics section with initial state
    const topicsSection = document.querySelector('.topics');
    if (topicsSection) {
        topicsSection.style.opacity = '0.3';
        topicsSection.style.transform = 'translateY(80px) scale(0.9)';
        topicsSection.style.filter = 'blur(5px)';
        topicsSection.classList.add('fade-in');
        observer.observe(topicsSection);
    }
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsSection.classList.add('scale-in', 'parallax-fast');
        observer.observe(statsSection);
    }
    
    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
        aboutSection.classList.add('slide-right');
        observer.observe(aboutSection);
    }
    
    // Add staggered animation to topic cards with slide-in from sides
    const topicCards = document.querySelectorAll('.topic-card');
    topicCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Re-initialize topic card functionality after animations
    setTimeout(initializeTopicCards, 500);
    
    // Add staggered animation to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.classList.add('scale-in');
        card.classList.add(`stagger-${(index % 6) + 1}`);
        observer.observe(card);
    });
    
    // Add floating animation to social links
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach((link, index) => {
        link.classList.add('float-animation');
        link.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Add reveal text effect to hero description
    const heroDesc = document.querySelector('.hero-description');
    if (heroDesc) {
        heroDesc.classList.add('reveal-text');
    }
});

// Counter animation for statistics
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    updateCounter();
}

// Trigger counter animations when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(number => {
                const target = parseInt(number.textContent.replace(/,/g, ''));
                number.textContent = '0';
                setTimeout(() => {
                    animateCounter(number, target);
                }, 200);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// Advanced scroll-triggered animations
let ticking = false;

function updateAnimations() {
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Smooth parallax for multiple elements
    const parallaxElements = document.querySelectorAll('.parallax-element');
    parallaxElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const speed = parseFloat(element.dataset.speed) || 0.5;
        
        if (rect.top < windowHeight && rect.bottom > 0) {
            const yPos = (windowHeight - rect.top) * speed;
            element.style.transform = `translateY(${yPos}px)`;
        }
    });
    
    // Rotate elements based on scroll
    const rotateElements = document.querySelectorAll('.rotate-on-scroll');
    rotateElements.forEach(element => {
        const rotation = scrolled * 0.1;
        element.style.transform = `rotate(${rotation}deg)`;
    });
    
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);

// Enhanced hover effects and interactions
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.1) rotate(5deg)';
        this.style.filter = 'brightness(1.1)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
        this.style.filter = 'brightness(1)';
    });
});

// Add magnetic effect to buttons and cards
function addMagneticEffect(selector) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const moveX = x * 0.1;
            const moveY = y * 0.1;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0px, 0px)';
        });
    });
}

// Apply magnetic effect to topic cards and stat cards
document.addEventListener('DOMContentLoaded', () => {
    addMagneticEffect('.topic-card');
    addMagneticEffect('.stat-card');
});

// Enhanced video list interactions
document.querySelectorAll('.video-list li').forEach(item => {
    item.addEventListener('click', function() {
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        // Add click animation
        this.style.transform = 'translateX(8px) scale(1.02)';
        this.style.background = 'rgba(73, 80, 87, 0.05)';
        
        setTimeout(() => {
            this.style.transform = 'translateX(0) scale(1)';
            this.style.background = 'transparent';
            ripple.remove();
        }, 300);
        
        console.log('Video clicked:', this.textContent);
    });
    
    // Add hover effect
    item.addEventListener('mouseenter', function() {
        this.style.paddingLeft = '1rem';
        this.style.background = 'rgba(73, 80, 87, 0.02)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.paddingLeft = '0';
        this.style.background = 'transparent';
    });
});

// Enhanced loading and page transitions
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add entrance animation to hero elements
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        const heroDescription = document.querySelector('.hero-description');
        const socialLinks = document.querySelector('.social-links');
        
        if (heroTitle) heroTitle.style.animationDelay = '0s';
        if (heroDescription) heroDescription.style.animationDelay = '0.3s';
        if (socialLinks) socialLinks.style.animationDelay = '0.6s';
    }, 100);
    
    // Add staggered reveal to navigation items
    const navItems = document.querySelectorAll('.nav-link');
    navItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });
});

// Advanced reveal animations with performance optimization
let revealTicking = false;

function revealElements() {
    const reveals = document.querySelectorAll('.fade-in:not(.visible), .slide-left:not(.visible), .slide-right:not(.visible), .scale-in:not(.visible)');
    
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 100;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
            
            // Add special effects for certain elements
            if (element.classList.contains('topic-card')) {
                setTimeout(() => {
                    element.style.boxShadow = '0 20px 50px rgba(33, 37, 41, 0.1)';
                }, 300);
            }
        }
    });
    
    revealTicking = false;
}

function requestRevealTick() {
    if (!revealTicking) {
        requestAnimationFrame(revealElements);
        revealTicking = true;
    }
}

window.addEventListener('scroll', requestRevealTick);

// Add typing effect to hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Add CSS for ripple effect
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(73, 80, 87, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Add smooth page transitions
document.addEventListener('DOMContentLoaded', () => {
    // Add page transition effect
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        document.body.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
    }, 100);
});

// Add scroll-based color transitions
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrolled / maxScroll;
    
    // Subtle color shift based on scroll position
    const hue = 210 + (scrollPercent * 30); // Shift from blue-gray to warmer tones
    document.documentElement.style.setProperty('--dynamic-hue', hue);
});
