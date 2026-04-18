/* ============================================
   MAIN APPLICATION
   Core functionality, animations, interactions
   Professional Grade | NO errors
   ============================================ */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    initScrollAnimations();
    initCounterAnimation();
    initCustomCursor();
    initMobileMenu();
    initPreloader();
    initSmoothScroll();
    initHeaderScroll();
    initSearch();
    applyDynamicSEO();
    initLazyLoading();
    initParallax();
    initBackToTop();
    initCookieConsent();
    initPerformanceMonitoring();
    initCarousel();
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    if (animatedElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animation = element.dataset.animate;
                const delay = element.dataset.delay || 0;
                
                element.style.animation = `${animation} 0.8s ease forwards ${delay}s`;
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => observer.observe(el));
    
    // Also observe fade-up elements
    const fadeElements = document.querySelectorAll('.fade-up, .reveal, .reveal-left, .reveal-right, .reveal-scale, .section-fade');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => fadeObserver.observe(el));
}

// ===== COUNTER ANIMATION =====
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                if (isNaN(target)) return;
                
                let current = 0;
                const increment = target / 50;
                const duration = 2000;
                const stepTime = duration / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target + '+';
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current) + '+';
                    }
                }, stepTime);
                
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// ===== CUSTOM CURSOR =====
function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursor-follower');
    
    if (!cursor || !cursorFollower) return;
    
    // Check if device is touch-enabled
    if ('ontouchstart' in window) {
        cursor.style.display = 'none';
        cursorFollower.style.display = 'none';
        return;
    }
    
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });
    
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        
        cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
        
        requestAnimationFrame(animateFollower);
    }
    
    animateFollower();
    
    // Hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .portfolio-card, .btn, .filter-btn, .tab, .pagination-item');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
        });
    });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const body = document.body;
    
    if (!menuToggle || !mobileMenu) return;
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        if (body.classList.contains('menu-open')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });
    
    // Close menu on link click
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.classList.remove('menu-open');
            body.style.overflow = '';
        });
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.classList.remove('menu-open');
            body.style.overflow = '';
        }
    });
}

// ===== PRELOADER =====
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    
    const hidePreloader = () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1500);
    };

    if (document.readyState === 'complete') {
        hidePreloader();
    } else {
        window.addEventListener('load', hidePreloader);
    }
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== HEADER SCROLL EFFECT =====
function initHeaderScroll() {
    const header = document.querySelector('.header');
    const scrollThreshold = 50;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===== SEARCH FUNCTIONALITY =====
function initSearch() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-close');
    const searchInput = document.getElementById('searchInput');
    
    if (!searchToggle || !searchOverlay) return;
    
    searchToggle.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        if (searchInput) searchInput.focus();
    });
    
    if (searchClose) {
        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            searchOverlay.classList.remove('active');
        }
        
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchOverlay.classList.add('active');
            if (searchInput) searchInput.focus();
        }
    });
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `/search.html?q=${encodeURIComponent(query)}`;
                }
            }
        });
    }
}

// ===== LAZY LOAD IMAGES =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== PARALLAX EFFECT =====
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-bg, .hero-background');
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(el => {
            const rate = scrolled * 0.3;
            el.style.transform = `translateY(${rate}px)`;
        });
    });
}

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
    const button = document.getElementById('back-to-top');
    if (!button) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== COOKIE CONSENT =====
function initCookieConsent() {
    const consent = localStorage.getItem('cookie-consent');
    if (consent) return;
    
    const banner = document.createElement('div');
    banner.className = 'cookie-consent';
    banner.innerHTML = `
        <div class="cookie-content">
            <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
            <div class="cookie-buttons">
                <button class="cookie-accept">Accept</button>
                <button class="cookie-decline">Decline</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(banner);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .cookie-consent {
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            max-width: 400px;
            background: var(--semantic-bg-surface, #1F2937);
            border: 1px solid var(--semantic-border-light, rgba(255,255,255,0.1));
            border-radius: 1rem;
            padding: 1rem;
            z-index: 1000;
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
        }
        .cookie-content p {
            font-size: 0.875rem;
            color: var(--semantic-text-secondary, #D1D5DB);
            margin-bottom: 1rem;
        }
        .cookie-buttons {
            display: flex;
            gap: 0.5rem;
        }
        .cookie-accept {
            background: var(--semantic-brand-primary, #D4AF37);
            color: #000;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
        }
        .cookie-decline {
            background: transparent;
            border: 1px solid rgba(255,255,255,0.2);
            color: var(--semantic-text-secondary, #D1D5DB);
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            cursor: pointer;
        }
        @media (max-width: 480px) {
            .cookie-consent {
                left: 10px;
                right: 10px;
                bottom: 10px;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.querySelector('.cookie-accept')?.addEventListener('click', () => {
        localStorage.setItem('cookie-consent', 'accepted');
        banner.remove();
    });
    
    document.querySelector('.cookie-decline')?.addEventListener('click', () => {
        localStorage.setItem('cookie-consent', 'declined');
        banner.remove();
    });
}

// ===== PERFORMANCE MONITORING =====
function initPerformanceMonitoring() {
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            const loadTime = perfData.loadEventEnd - perfData.fetchStart;
            console.log(`Page load time: ${loadTime}ms`);
            
            // Send to analytics if needed
            if (loadTime > 3000) {
                console.warn('Slow page load detected:', loadTime, 'ms');
            }
        }
    }
}

// Log initialization
console.log('App initialization complete.');

// ===== CAROUSEL =====
function initCarousel() {
    const carousels = document.querySelectorAll('.carousel-container');
    
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const nextBtn = carousel.querySelector('.carousel-btn-next');
        const prevBtn = carousel.querySelector('.carousel-btn-prev');
        const dotsContainer = carousel.querySelector('.carousel-dots');
        
        if (!track || slides.length === 0) return;
        
        let currentIndex = 0;
        const totalSlides = slides.length;
        
        // Create dots
        if (dotsContainer) {
            dotsContainer.innerHTML = ''; // Clear existing
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }
        
        function updateDots() {
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        function goToSlide(index) {
            if (index < 0) {
                currentIndex = totalSlides - 1;
            } else if (index >= totalSlides) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }
            
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        }
        
        // Optional: Auto-play
        // setInterval(() => goToSlide(currentIndex + 1), 5000);
    });
}
console.log('Application Initialized - Full Version');


function applyDynamicSEO() {
    let savedSEO = localStorage.getItem('anuka_seo');
    let seo = {};
    
    if (savedSEO) {
        try {
            seo = JSON.parse(savedSEO);
        } catch(e) {
            console.error('Error parsing SEO', e);
        }
    }
    
    // Inject the BEST default SEO if none exists or if it's an old version
    if (!seo.metaTitle ||
        seo.metaTitle === 'Anuka Abazadze | Premium Fine Art & Wedding Photographer in Kutaisi, Georgia' ||
        seo.metaTitle === 'Anuka Abazadze | პროფესიონალი ფოტოგრაფი ქუთაისში' ||
        seo.metaTitle === 'Anuka Abazadze | Photographer in Kutaisi | ფოტოგრაფი | Фотограф') {
        seo = {
            metaTitle: 'ანუკა აბაზაძე | საუკეთესო ფოტოგრაფი ქუთაისში | მთავარი ფოტოგრაფი საქართველოში',
            metaDescription: 'ანუკა აბაზაძე — საუკეთესო და ყველაზე მაგარი ფოტოგრაფი ქუთაისში. მთავარი პრემიუმ ფოტოგრაფი საქართველოში. ქორწილის, პორტრეტის, კომერციული ფოტოგრაფია. 8+ წლის გამოცდილება, 200+ კმაყოფილი კლიენტი. დაჯავშნე ფოტოსესია დღესვე!',
            metaKeywords: 'ფოტოგრაფი ქუთაისი, საუკეთესო ფოტოგრაფი ქუთაისში, მთავარი ფოტოგრაფი საქართველოში, ყველაზე მაგარი ფოტოგრაფი ქუთაიში, ანუკა აბაზაძე, ქორწილის ფოტოგრაფი ქუთაისი, პორტრეტის ფოტოგრაფი, ფოტოსტუდია ქუთაისი, პროფესიონალი ფოტოგრაფი საქართველო, Kutaisi photographer, best photographer in Georgia, wedding photographer Kutaisi, portrait photographer Georgia',
            gaId: seo.gaId || ''
        };
        localStorage.setItem('anuka_seo', JSON.stringify(seo));
    }
    
    // Apply Title
    if (seo.metaTitle) document.title = seo.metaTitle;
    
    // Apply Description
    if (seo.metaDescription) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = seo.metaDescription;
    }
    
    // Apply Keywords
    if (seo.metaKeywords) {
        let metaKey = document.querySelector('meta[name="keywords"]');
        if (!metaKey) {
            metaKey = document.createElement('meta');
            metaKey.name = 'keywords';
            document.head.appendChild(metaKey);
        }
        metaKey.content = seo.metaKeywords;
    }
}

