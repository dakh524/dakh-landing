AOS.init({ once: true, offset: 50, duration: 800 });

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    document.getElementById('scroll-progress').style.width = scrollPercent + '%';

    const nav = document.getElementById('navbar');
    if (scrollTop > 20) {
        nav.classList.add('glass-nav');
        nav.classList.remove('bg-transparent');
    } else {
        nav.classList.remove('glass-nav');
        nav.classList.add('bg-transparent');
    }

    const backToTop = document.getElementById('back-to-top');
    if (scrollTop > 500) {
        backToTop.classList.remove('translate-y-20', 'opacity-0');
    } else {
        backToTop.classList.add('translate-y-20', 'opacity-0');
    }
});

// Mobile Menu
const mobileMenu = document.getElementById('mobile-menu');
function openMobile() {
    mobileMenu.classList.remove('translate-x-full');
    document.body.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
}
function closeMobile() {
    mobileMenu.classList.add('translate-x-full');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = 'auto';
}
function toggleMobile() {
    const isOpen = !mobileMenu.classList.contains('translate-x-full');
    isOpen ? closeMobile() : openMobile();
}
const mobileBtn = document.getElementById('mobile-btn');
const closeMobileBtn = document.getElementById('close-mobile');

if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        toggleMobile();
        const isOpen = !mobileMenu.classList.contains('translate-x-full');
        mobileBtn.setAttribute('aria-expanded', isOpen);
    });
}

if (closeMobileBtn) {
    closeMobileBtn.addEventListener('click', () => {
        toggleMobile();
        if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
    });
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('translate-x-full')) {
        closeMobile();
    }
});
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        closeMobile();
    }
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
function openLightbox(el) {
    lightboxImg.src = el.querySelector('img').src;
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}
function closeLightboxForce() {
    lightbox.classList.add('hidden');
    document.body.style.overflow = 'auto';
}
function closeLightbox(e) {
    if(e.target === lightbox) closeLightboxForce();
}

// Reveal-on-scroll using IntersectionObserver (works alongside AOS)
function initRevealOnScroll() {
    const opts = { root: null, rootMargin: '0px', threshold: 0.12 };
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // If you want non-repeating reveals, unobserve after intersecting
                io.unobserve(entry.target);
            }
        });
    }, opts);

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// Simple parallax for elements with .parallax-bg (disabled on mobile for performance)
function initParallax() {
    const el = document.querySelector('.parallax-bg');
    if (!el) return;
    const mql = window.matchMedia('(max-width: 768px)');
    if (mql.matches) return;
    window.addEventListener('scroll', () => {
        const sc = window.scrollY;
        // move slower than scroll for parallax effect
        const y = sc * 0.2;
        el.style.transform = `translate3d(0, ${y}px, 0)`;
    }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
    initRevealOnScroll();
    initParallax();
});

// Scroll-spy: highlight nav links when sections are in view
function initScrollSpy() {
    const links = Array.from(document.querySelectorAll('.nav-link'));
    const sections = links
        .map(l => {
            const href = l.getAttribute('href') || '';
            // Only handle in-page anchors to avoid querySelector errors
            return href.startsWith('#') ? document.querySelector(href) : null;
        })
        .filter(Boolean);
    if (sections.length === 0) return;
    const opts = { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 };
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.target.id) return;
            const id = '#' + entry.target.id;
            const link = document.querySelector(`.nav-link[href="${id}"]`);
            if (entry.isIntersecting) {
                links.forEach(l => l.classList.remove('active'));
                if (link) link.classList.add('active');
            }
        });
    }, opts);
    sections.forEach(s => io.observe(s));
}

document.addEventListener('DOMContentLoaded', () => {
    // run scroll spy after DOM ready
    initScrollSpy();
    
    // Logo click - scroll to top
    const logo = document.getElementById('logo');
    if (logo) {
        logo.addEventListener('click', () => window.scrollTo(0, 0));
    }
    
    // Mobile menu links - close menu on click
    document.querySelectorAll('.mobile-menu-link').forEach(link => {
        link.addEventListener('click', toggleMobile);
    });
    
    // Gallery images - open lightbox
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            openLightbox(this);
        });
    });
    
    // Back to top button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({top: 0, behavior: 'smooth'});
        });
    }
    
    // Lightbox close handlers
    if (lightbox) {
        lightbox.addEventListener('click', closeLightbox);
        const closeBtn = document.getElementById('lightbox-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeLightboxForce);
        }
    }
});

// Modal
const modal = document.getElementById('modal');
function openModal(role) {
    document.getElementById('modal-role').innerText = role;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}
function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Toast Notification System
function createToastContainer() {
    if (!document.getElementById('toast-container')) {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
}

function showToast(message, type = 'info', duration = 4000) {
    createToastContainer();
    const container = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-triangle-exclamation',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fa-solid ${icons[type] || icons.info} toast-icon"></i>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" aria-label="Close notification">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Close handlers
    const closeBtn = toast.querySelector('.toast-close');
    const closeToast = () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    };
    
    closeBtn.addEventListener('click', closeToast);
    setTimeout(closeToast, duration);
}

// Image Lazy Loading Enhancement
function initImageLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
    
    // Handle regular images
    document.querySelectorAll('img:not([data-src])').forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            img.addEventListener('error', () => {
                img.alt = 'Image failed to load';
            });
        }
    });
}

// Smooth Scroll Enhancement
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });
}

// Keyboard Navigation Enhancement
function initKeyboardNavigation() {
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID if it doesn't exist
    const mainContent = document.querySelector('main') || document.querySelector('#home') || document.body;
    if (!mainContent.id) {
        mainContent.id = 'main-content';
    }
    
    // Enhanced keyboard navigation for cards
    document.querySelectorAll('.card-interactive, .program-card, .card-enhanced').forEach(card => {
        if (!card.hasAttribute('tabindex')) {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
        }
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = card.querySelector('a');
                if (link) {
                    link.click();
                }
            }
        });
    });
}

// Mobile Touch Gestures
function initTouchGestures() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenu) return;
    
    mobileMenu.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    mobileMenu.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && !mobileMenu.classList.contains('translate-x-full')) {
                // Swipe left - close menu
                closeMobile();
            }
        }
    }
}

// Performance Monitoring
function initPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
        try {
            const perfObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'largest-contentful-paint') {
                        console.log('LCP:', entry.renderTime || entry.loadTime);
                    }
                }
            });
            perfObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            // Performance observer not supported
        }
    }
}

// Enhanced Error Handling
window.addEventListener('error', (e) => {
    console.error('Error:', e.error);
    // Could send to error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // Could send to error tracking service
});

// Initialize all UX enhancements
document.addEventListener('DOMContentLoaded', () => {
    initImageLoading();
    initSmoothScroll();
    initKeyboardNavigation();
    initTouchGestures();
    initPerformanceMonitoring();
    
    // Show page loaded notification (optional)
    // showToast('Page loaded successfully', 'success', 2000);
});