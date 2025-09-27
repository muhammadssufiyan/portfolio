// =====================================================
// Advanced Animation Controllers
// Complex animations and interactive effects
// =====================================================

class AnimationController {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        this.setupIntersectionObservers();
        this.initParticleSystem();
        this.initCursorEffects();
        this.initScrollAnimations();
        this.initHoverEffects();
    }

    // =====================================================
    // Intersection Observer Setup
    // =====================================================

    setupIntersectionObservers() {
        const options = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: [0.1, 0.5, 0.9]
        };

        const callback = (entries, observer) => {
            entries.forEach(entry => {
                this.handleIntersection(entry, observer);
            });
        };

        this.observers.set('main', new IntersectionObserver(callback, options));
        
        // Observe all animated elements
        document.querySelectorAll('[data-animate]').forEach(el => {
            this.observers.get('main').observe(el);
        });
    }

    handleIntersection(entry, observer) {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const animationType = element.dataset.animate;
        const delay = parseInt(element.dataset.delay) || 0;

        setTimeout(() => {
            this.triggerAnimation(element, animationType);
        }, delay);

        observer.unobserve(element);
    }

    triggerAnimation(element, type) {
        if (this.isReducedMotion) {
            element.classList.add('animate-complete');
            return;
        }

        switch (type) {
            case 'fadeIn':
                this.fadeIn(element);
                break;
            case 'slideUp':
                this.slideUp(element);
                break;
            case 'scaleIn':
                this.scaleIn(element);
                break;
            case 'rotateIn':
                this.rotateIn(element);
                break;
            case 'morphIn':
                this.morphIn(element);
                break;
            default:
                element.classList.add('animate');
        }
    }

    // =====================================================
    // Animation Methods
    // =====================================================

    fadeIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    slideUp(element) {
        element.style.transform = 'translateY(50px)';
        element.style.opacity = '0';
        element.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease-out';
        
        requestAnimationFrame(() => {
            element.style.transform = 'translateY(0)';
            element.style.opacity = '1';
        });
    }

    scaleIn(element) {
        element.style.transform = 'scale(0.8)';
        element.style.opacity = '0';
        element.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s ease-out';
        
        requestAnimationFrame(() => {
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
        });
    }

    rotateIn(element) {
        element.style.transform = 'rotate(-10deg) scale(0.8)';
        element.style.opacity = '0';
        element.style.transition = 'transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.7s ease-out';
        
        requestAnimationFrame(() => {
            element.style.transform = 'rotate(0deg) scale(1)';
            element.style.opacity = '1';
        });
    }

    morphIn(element) {
        element.style.clipPath = 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)';
        element.style.transition = 'clip-path 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        requestAnimationFrame(() => {
            element.style.clipPath = 'polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)';
        });
    }

    // =====================================================
    // Particle System
    // =====================================================

    initParticleSystem() {
        if (this.isReducedMotion || window.innerWidth < 768) return;

        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        particleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;

        heroSection.appendChild(particleContainer);

        // Create particles
        for (let i = 0; i < 20; i++) {
            this.createParticle(particleContainer);
        }
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 1;
        const opacity = Math.random() * 0.5 + 0.1;
        const duration = Math.random() * 20 + 10;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: var(--light-brown);
            border-radius: 50%;
            opacity: ${opacity};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float-particle ${duration}s linear infinite;
        `;

        container.appendChild(particle);

        // Remove and recreate particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                this.createParticle(container);
            }
        }, duration * 1000);
    }

    // =====================================================
    // Cursor Effects
    // =====================================================

    initCursorEffects() {
        if ('ontouchstart' in window || this.isReducedMotion) return;

        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: var(--primary-brown);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.1s ease-out;
            opacity: 0;
        `;

        document.body.appendChild(cursor);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });

        // Smooth cursor follow
        const updateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
            requestAnimationFrame(updateCursor);
        };

        updateCursor();

        // Hover effects
        document.addEventListener('mouseenter', (e) => {
            if (e.target.matches('a, button, .btn, .project-card')) {
                cursor.style.transform += ' scale(1.5)';
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            if (e.target.matches('a, button, .btn, .project-card')) {
                cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
            }
        }, true);
    }

    // =====================================================
    // Advanced Scroll Animations
    // =====================================================

    initScrollAnimations() {
        let ticking = false;

        const updateAnimations = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            // Parallax backgrounds
            document.querySelectorAll('.parallax-bg').forEach(el => {
                el.style.transform = `translateY(${rate}px)`;
            });

            // Stagger animations
            document.querySelectorAll('.stagger-item').forEach((el, index) => {
                const delay = index * 0.1;
                const offset = scrolled * (0.1 + delay);
                el.style.transform = `translateY(${offset}px)`;
            });

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateAnimations);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick);
    }

    // =====================================================
    // Hover Effects
    // =====================================================

    initHoverEffects() {
        // Magnetic effect for buttons
        document.querySelectorAll('.btn, .project-card').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                if (this.isReducedMotion) return;
                
                const rect = e.target.getBoundingClientRect();
                const relX = e.clientX - rect.left;
                const relY = e.clientY - rect.top;
                
                e.target.style.transform = `perspective(1000px) rotateX(${(relY - rect.height / 2) / 10}deg) rotateY(${(rect.width / 2 - relX) / 10}deg)`;
            });

            element.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            });

            element.addEventListener('mousemove', (e) => {
                if (this.isReducedMotion) return;
                
                const rect = e.target.getBoundingClientRect();
                const relX = e.clientX - rect.left;
                const relY = e.clientY - rect.top;
                
                e.target.style.transform = `perspective(1000px) rotateX(${(relY - rect.height / 2) / 10}deg) rotateY(${(rect.width / 2 - relX) / 10}deg)`;
            });
        });

        // Ripple effect
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                if (this.isReducedMotion) return;

                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 600ms linear;
                    background-color: rgba(255, 255, 255, 0.6);
                    width: ${size}px;
                    height: ${size}px;
                    top: ${y}px;
                    left: ${x}px;
                `;
                
                button.appendChild(ripple);
                
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.parentNode.removeChild(ripple);
                    }
                }, 600);
            });
        });
    }

    // =====================================================
    // Text Animations
    // =====================================================

    animateText(element, text, speed = 50) {
        if (this.isReducedMotion) {
            element.textContent = text;
            return;
        }

        element.textContent = '';
        let i = 0;
        
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        };
        
        typeWriter();
    }

    // =====================================================
    // Cleanup Methods
    // =====================================================

    destroy() {
        // Clean up observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        // Remove custom cursor
        const cursor = document.querySelector('.custom-cursor');
        if (cursor) cursor.remove();
        
        // Remove particles
        const particles = document.querySelector('.particle-container');
        if (particles) particles.remove();
    }
}

// =====================================================
// CSS Animations (to be injected)
// =====================================================

const animationCSS = `
@keyframes float-particle {
    0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(-100px) rotate(360deg);
        opacity: 0;
    }
}

@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.stagger-item:nth-child(1) { transition-delay: 0.1s; }
.stagger-item:nth-child(2) { transition-delay: 0.2s; }
.stagger-item:nth-child(3) { transition-delay: 0.3s; }
.stagger-item:nth-child(4) { transition-delay: 0.4s; }
.stagger-item:nth-child(5) { transition-delay: 0.5s; }

.parallax-bg {
    will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
    .particle-container {
        display: none !important;
    }
    
    .custom-cursor {
        display: none !important;
    }
    
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = animationCSS;
document.head.appendChild(style);

// =====================================================
// Initialization
// =====================================================

let animationController;

document.addEventListener('DOMContentLoaded', () => {
    animationController = new AnimationController();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (animationController) {
        animationController.destroy();
    }
});

// Export for external use
window.AnimationController = AnimationController;

// =====================================================
// Additional Animation Utilities
// =====================================================

// Smooth scroll to element with offset
function smoothScrollTo(target, offset = 0, duration = 800) {
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
    if (!targetElement) return;

    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animateScroll(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuart(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animateScroll);
    }

    function easeInOutQuart(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t * t + b;
        t -= 2;
        return -c / 2 * (t * t * t * t - 2) + b;
    }

    requestAnimationFrame(animateScroll);
}

// Stagger animation for multiple elements
function staggerAnimation(elements, animationClass, delay = 100) {
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add(animationClass);
        }, index * delay);
    });
}

// Advanced intersection observer with multiple thresholds
function createAdvancedObserver(callback, options = {}) {
    const defaultOptions = {
        root: null,
        rootMargin: '0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
    };

    const finalOptions = { ...defaultOptions, ...options };
    return new IntersectionObserver(callback, finalOptions);
}

// Performance optimized animation frame
class AnimationFrameManager {
    constructor() {
        this.callbacks = [];
        this.running = false;
    }

    add(callback) {
        this.callbacks.push(callback);
        if (!this.running) {
            this.start();
        }
    }

    remove(callback) {
        const index = this.callbacks.indexOf(callback);
        if (index > -1) {
            this.callbacks.splice(index, 1);
        }
        if (this.callbacks.length === 0) {
            this.stop();
        }
    }

    start() {
        this.running = true;
        this.tick();
    }

    stop() {
        this.running = false;
    }

    tick() {
        if (this.running) {
            this.callbacks.forEach(callback => callback());
            requestAnimationFrame(() => this.tick());
        }
    }
}

// Global animation frame manager
window.animationFrameManager = new AnimationFrameManager();

// Export utilities
window.smoothScrollTo = smoothScrollTo;
window.staggerAnimation = staggerAnimation;
window.createAdvancedObserver = createAdvancedObserver;