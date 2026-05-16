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

const SITE_CONFIG = {
    baseUrl: 'https://anuka-abazadze.wasmer.app',
    instagram: 'https://www.instagram.com/anukaabazadze/',
    facebook: 'https://www.facebook.com/anukaabazadze',
    pinterest: 'https://www.pinterest.com/anukaabazadze/',
    phone: '+995 599 123 456',
    email: 'anuka@abazadze.com'
};

const PAGE_SEO = {
    'index.html': {
        en: {
            title: 'Anuka Abazadze | Premium Photographer in Kutaisi, Georgia',
            description: 'Premium photography studio in Kutaisi, Georgia for fine art portraits, weddings, events, commercial branding, and editorial imagery.',
            keywords: 'photographer in Kutaisi, Georgia photographer, wedding photographer Kutaisi, portrait photographer Georgia, commercial photography Kutaisi'
        },
        ka: {
            title: 'ანუკა აბაზაძე | პრემიუმ ფოტოგრაფი ქუთაისში, საქართველო',
            description: 'პრემიუმ ფოტოგრაფიის სტუდია ქუთაისში პორტრეტებისთვის, ქორწილებისთვის, ღონისძიებებისთვის, კომერციული ბრენდინგისა და სარედაქციო ფოტოგრაფიისთვის.',
            keywords: 'ფოტოგრაფი ქუთაისში, ფოტოგრაფი საქართველო, ქორწილის ფოტოგრაფი ქუთაისი, პორტრეტის ფოტოგრაფი, კომერციული ფოტოგრაფია'
        },
        ru: {
            title: 'Анука Абазадзе | Премиальный фотограф в Кутаиси, Грузия',
            description: 'Премиальная фотостудия в Кутаиси для художественных портретов, свадеб, мероприятий, коммерческого брендинга и editorial-съемок.',
            keywords: 'фотограф Кутаиси, фотограф Грузия, свадебный фотограф Кутаиси, портретный фотограф Грузия, коммерческая фотография'
        }
    },
    'about.html': {
        en: {
            title: 'About Anuka Abazadze | Photography Studio in Kutaisi',
            description: 'Learn about Anuka Abazadze, a Kutaisi-based photographer creating cinematic portraits, wedding stories, and premium commercial imagery.',
            keywords: 'about Anuka Abazadze, Kutaisi photography studio, Georgian photographer'
        },
        ka: {
            title: 'ანუკა აბაზაძის შესახებ | ფოტოსტუდია ქუთაისში',
            description: 'გაიცანით ანუკა აბაზაძე, ქუთაისში მომუშავე ფოტოგრაფი, რომელიც ქმნის პორტრეტებს, საქორწილო ისტორიებს და პრემიუმ კომერციულ ფოტოებს.',
            keywords: 'ანუკა აბაზაძე, ფოტოსტუდია ქუთაისში, ქართველი ფოტოგრაფი'
        },
        ru: {
            title: 'Об Ануке Абазадзе | Фотостудия в Кутаиси',
            description: 'Познакомьтесь с Анукой Абазадзе, фотографом из Кутаиси, создающим кинематографичные портреты, свадебные истории и премиальные коммерческие съемки.',
            keywords: 'Анука Абазадзе, фотостудия Кутаиси, грузинский фотограф'
        }
    },
    'portfolio.html': {
        en: {
            title: 'Portfolio | Anuka Abazadze Photography',
            description: 'Explore portrait, wedding, commercial, and editorial photography by Anuka Abazadze in Kutaisi, Georgia.',
            keywords: 'photography portfolio Kutaisi, wedding portfolio Georgia, portrait gallery'
        },
        ka: {
            title: 'პორტფოლიო | ანუკა აბაზაძის ფოტოგრაფია',
            description: 'დაათვალიერეთ ანუკა აბაზაძის პორტრეტები, ქორწილები, კომერციული და სარედაქციო ფოტოგრაფია ქუთაისში.',
            keywords: 'ფოტოგრაფიის პორტფოლიო ქუთაისი, ქორწილის ფოტოები, პორტრეტების გალერეა'
        },
        ru: {
            title: 'Портфолио | Фотография Ануки Абазадзе',
            description: 'Посмотрите портретные, свадебные, коммерческие и editorial работы Ануки Абазадзе в Кутаиси, Грузия.',
            keywords: 'портфолио фотографа Кутаиси, свадебное портфолио Грузия, портретная галерея'
        }
    },
    'services.html': {
        en: {
            title: 'Photography Services & Pricing | Anuka Abazadze',
            description: 'Premium portrait, wedding, event, and commercial photography packages in Kutaisi with consultation, planning, and professional editing.',
            keywords: 'photography services Kutaisi, wedding photography prices, portrait session Georgia'
        },
        ka: {
            title: 'ფოტოგრაფიის სერვისები და ფასები | ანუკა აბაზაძე',
            description: 'პრემიუმ პორტრეტის, ქორწილის, ღონისძიებისა და კომერციული ფოტოგრაფიის პაკეტები ქუთაისში კონსულტაციით, დაგეგმვით და პროფესიონალური დამუშავებით.',
            keywords: 'ფოტოგრაფიის სერვისები ქუთაისი, ქორწილის ფოტოგრაფიის ფასები, პორტრეტის სესია'
        },
        ru: {
            title: 'Услуги и цены фотографа | Анука Абазадзе',
            description: 'Премиальные пакеты портретной, свадебной, событийной и коммерческой фотографии в Кутаиси с консультацией, планированием и профессиональной обработкой.',
            keywords: 'услуги фотографа Кутаиси, цены свадебного фотографа, портретная фотосессия'
        }
    },
    'contact.html': {
        en: {
            title: 'Contact & Booking | Anuka Abazadze Photography',
            description: 'Book a premium photography session with Anuka Abazadze in Kutaisi, Georgia. Contact the studio for portraits, weddings, and commercial projects.',
            keywords: 'book photographer Kutaisi, contact photography studio, photo session Georgia'
        },
        ka: {
            title: 'კონტაქტი და დაჯავშნა | ანუკა აბაზაძის ფოტოგრაფია',
            description: 'დაჯავშნეთ პრემიუმ ფოტოსესია ანუკა აბაზაძესთან ქუთაისში. დაგვიკავშირდით პორტრეტის, ქორწილისა და კომერციული პროექტებისთვის.',
            keywords: 'ფოტოგრაფის დაჯავშნა ქუთაისი, ფოტოსტუდიის კონტაქტი, ფოტოსესია საქართველო'
        },
        ru: {
            title: 'Контакты и бронирование | Фотография Ануки Абазадзе',
            description: 'Забронируйте премиальную фотосессию с Анукой Абазадзе в Кутаиси. Свяжитесь со студией для портретов, свадеб и коммерческих проектов.',
            keywords: 'забронировать фотографа Кутаиси, контакты фотостудии, фотосессия Грузия'
        }
    },
    'blog.html': {
        en: {
            title: 'Photography Blog | Anuka Abazadze',
            description: 'Photography tips, behind-the-scenes notes, and creative inspiration from Anuka Abazadze Photography Studio in Kutaisi.',
            keywords: 'photography blog Georgia, photography tips Kutaisi, creative inspiration'
        },
        ka: {
            title: 'ფოტოგრაფიის ბლოგი | ანუკა აბაზაძე',
            description: 'ფოტოგრაფიის რჩევები, კადრს მიღმა ისტორიები და შემოქმედებითი ინსპირაცია ანუკა აბაზაძის ფოტოსტუდიიდან ქუთაისში.',
            keywords: 'ფოტოგრაფიის ბლოგი საქართველო, ფოტოგრაფიის რჩევები, შემოქმედებითი ინსპირაცია'
        },
        ru: {
            title: 'Блог о фотографии | Анука Абазадзе',
            description: 'Советы по фотографии, закулисные заметки и творческое вдохновение от фотостудии Ануки Абазадзе в Кутаиси.',
            keywords: 'блог о фотографии Грузия, советы фотографа, творческое вдохновение'
        }
    }
};

const I18N = {
    en: {
        'საუკეთესო ფოტოგრაფი ქუთაისში · მთავარი ფოტოგრაფი საქართველოში · Premium Studio': 'Best photographer in Kutaisi · Leading photographer in Georgia · Premium Studio'
    },
    ka: {
        'HOME': 'მთავარი',
        'STORY': 'ამბავი',
        'PORTFOLIO': 'პორტფოლიო',
        'SERVICES': 'სერვისები',
        'CONTACT': 'კონტაქტი',
        'BLOG': 'ბლოგი',
        'Kutaisi, Georgia': 'ქუთაისი, საქართველო',
        'საუკეთესო ფოტოგრაფი ქუთაისში · მთავარი ფოტოგრაფი საქართველოში · Premium Studio': 'საუკეთესო ფოტოგრაფი ქუთაისში · წამყვანი ფოტოგრაფი საქართველოში · პრემიუმ სტუდია',
        'VIEW PORTFOLIO': 'პორტფოლიოს ნახვა',
        'BOOK A SESSION': 'სესიის დაჯავშნა',
        'Beyond the Frame': 'კადრს მიღმა',
        'My approach to photography transcends traditional boundaries. Each image is a narrative — a moment suspended in time, infused with emotion, light, and authentic human connection. Based in the heart of Kutaisi, Georgia, I bring a unique perspective shaped by the ancient streets and modern artistic vision.': 'ჩემი ფოტოგრაფია სცდება ტრადიციულ ჩარჩოებს. თითოეული ფოტო არის ისტორია, დროის შეჩერებული მომენტი, სავსე ემოციით, სინათლით და გულწრფელი ადამიანური კავშირით. ქუთაისში მუშაობა ჩემს ხედვას აძლევს როგორც ისტორიულ სიღრმეს, ისე თანამედროვე არტისტულ ენას.',
        '"Photography is the art of revealing what lies beneath the surface — the unspoken, the unseen, the unforgettable."': '"ფოტოგრაფია არის ხელოვნება, რომელიც აჩენს ზედაპირის მიღმა არსებულს - უთქმელს, უხილავს და დაუვიწყარს."',
        'WHAT I OFFER': 'რას გთავაზობთ',
        'Premium Photography Experiences': 'პრემიუმ ფოტოგრაფიის გამოცდილება',
        'Tailored sessions designed to capture your most precious moments with artistry and precision.': 'ინდივიდუალურად დაგეგმილი სესიები თქვენი ყველაზე ძვირფასი მომენტების არტისტულად და ზუსტად დასაფიქსირებლად.',
        'Tailored sessions designed to capture your most precious moments': 'ინდივიდუალურად დაგეგმილი სესიები თქვენი ყველაზე ძვირფასი მომენტებისთვის.',
        'Fine Art Portraits': 'არტ პორტრეტები',
        'Artistic portrait sessions that capture your essence with cinematic lighting and composition.': 'არტისტული პორტრეტები კინემატოგრაფიული განათებითა და კომპოზიციით.',
        'Artistic portrait sessions that capture your essence with cinematic lighting and composition. Perfect for personal branding, milestone celebrations, or simply preserving this moment in time.': 'არტისტული პორტრეტები კინემატოგრაფიული განათებითა და კომპოზიციით. იდეალურია პერსონალური ბრენდინგისთვის, მნიშვნელოვანი თარიღებისთვის ან ამ მომენტის შესანახად.',
        'Wedding & Events': 'ქორწილი და ღონისძიებები',
        'Wedding & Elopement': 'ქორწილი და ელოპმენტი',
        'Timeless wedding photography that tells your love story through authentic, emotional imagery.': 'საქორწილო ფოტოგრაფია, რომელიც თქვენს სიყვარულის ისტორიას გულწრფელი და ემოციური კადრებით ყვება.',
        'Timeless wedding photography that tells your love story through authentic, emotional imagery. From intimate elopements to grand celebrations, every moment is captured with artistry and care.': 'საქორწილო ფოტოგრაფია, რომელიც თქვენს სიყვარულის ისტორიას გულწრფელი და ემოციური კადრებით ყვება. მცირე ცერემონიიდან დიდ დღესასწაულამდე, თითოეული მომენტი ზრუნვით ფიქსირდება.',
        'Commercial & Branding': 'კომერციული და ბრენდინგი',
        'Professional brand photography that elevates your business identity and visual presence.': 'პროფესიონალური ბრენდის ფოტოგრაფია, რომელიც აძლიერებს თქვენი ბიზნესის ვიზუალურ იდენტობას.',
        'Professional brand photography that elevates your business identity. Perfect for websites, social media, marketing campaigns, and product launches.': 'პროფესიონალური ბრენდის ფოტოგრაფია ვებგვერდებისთვის, სოციალური მედიისთვის, კამპანიებისა და პროდუქტის გაშვებისთვის.',
        'Learn More →': 'გაიგე მეტი →',
        'Book Portrait Session →': 'პორტრეტის დაჯავშნა →',
        'Inquire About Wedding →': 'ქორწილის შესახებ კითხვა →',
        'Request Quote →': 'ფასის მოთხოვნა →',
        'Ready to Create Something Extraordinary?': 'მზად ხართ შევქმნათ განსაკუთრებული?',
        'Ready to Create Your Story?': 'მზად ხართ შევქმნათ თქვენი ისტორია?',
        'Ready to Book Your Session?': 'მზად ხართ სესიის დასაჯავშნად?',
        "Let's collaborate and bring your vision to life through the lens.": 'ვითანამშრომლოთ და თქვენი ხედვა კადრებად ვაქციოთ.',
        "Let's create something beautiful together.": 'ერთად შევქმნათ რაღაც ლამაზი.',
        'BOOK YOUR SESSION': 'დაჯავშნე სესია',
        'CONTACT ME →': 'დამიკავშირდით →',
        'Explore': 'ნავიგაცია',
        'Home': 'მთავარი',
        'About': 'შესახებ',
        'Portfolio': 'პორტფოლიო',
        'Services': 'სერვისები',
        'Blog': 'ბლოგი',
        'Connect': 'კავშირი',
        'Contact': 'კონტაქტი',
        'Studio': 'სტუდია',
        'Premium Photography Studio': 'პრემიუმ ფოტოგრაფიის სტუდია',
        'Based in Kutaisi, Georgia': 'ქუთაისში, საქართველოში',
        'Behind the Lens': 'ობიექტივს მიღმა',
        'The journey, philosophy, and passion that drive my photography': 'გზა, ფილოსოფია და ვნება, რომელიც ჩემს ფოტოგრაფიას ქმნის',
        'Finding Light in Every Moment': 'სინათლის პოვნა ყოველ მომენტში',
        'My Journey': 'ჩემი გზა',
        'Key moments that shaped my career': 'მნიშვნელოვანი მომენტები, რომლებმაც ჩემი კარიერა შექმნა',
        'What Drives Me': 'რა მაძლევს მიმართულებას',
        'The principles that guide every project': 'პრინციპები, რომლებიც ყველა პროექტს მართავს',
        'Authenticity': 'ავთენტურობა',
        'Excellence': 'სრულყოფილება',
        'Creativity': 'კრეატიულობა',
        "Let's Create Together": 'შევქმნათ ერთად',
        "I'd love to hear your story and help bring your vision to life.": 'მინდა მოვისმინო თქვენი ისტორია და დაგეხმაროთ ხედვის გაცოცხლებაში.',
        'START THE CONVERSATION →': 'დავიწყოთ საუბარი →',
        'Visual Stories': 'ვიზუალური ისტორიები',
        'A curated collection of my finest work — moments that speak without words': 'ჩემი საუკეთესო ნამუშევრების შერჩეული კოლექცია - მომენტები, რომლებიც უსიტყვოდ საუბრობენ',
        'ALL WORK': 'ყველა',
        'PORTRAIT': 'პორტრეტი',
        'WEDDING': 'ქორწილი',
        'COMMERCIAL': 'კომერციული',
        'EDITORIAL': 'სარედაქციო',
        'Choose Your Experience': 'აირჩიეთ გამოცდილება',
        'Curated packages designed for every need and budget': 'შერჩეული პაკეტები სხვადასხვა საჭიროებისა და ბიუჯეტისთვის',
        'Frequently Asked Questions': 'ხშირად დასმული კითხვები',
        'Everything you need to know about working with me': 'ყველაფერი, რაც ჩემთან მუშაობაზე უნდა იცოდეთ',
        "Let's Connect": 'დავუკავშირდეთ',
        "I'd love to hear about your vision and discuss how we can bring it to life": 'მინდა მოვისმინო თქვენი ხედვა და განვიხილოთ, როგორ გავაცოცხლოთ ის',
        'Studio Information': 'სტუდიის ინფორმაცია',
        'Located in the heart of Kutaisi, Georgia, my studio is designed to be a welcoming space where creativity flows freely.': 'ჩემი სტუდია ქუთაისის გულშია და შექმნილია თბილ, შემოქმედებით სივრცედ.',
        'Send Message →': 'შეტყობინების გაგზავნა →',
        'Follow the Journey': 'გამომყევით გზაზე',
        'Stay connected on Instagram for daily inspiration and recent work': 'გამომყევით Instagram-ზე ყოველდღიური ინსპირაციისა და ახალი ნამუშევრებისთვის',
        'Follow on Instagram →': 'Instagram-ზე გადასვლა →',
        'Stories & Insights': 'ისტორიები და ინსაითები',
        'Photography tips, behind-the-scenes, and creative inspiration': 'ფოტოგრაფიის რჩევები, კადრს მიღმა და შემოქმედებითი ინსპირაცია',
        'Get Weekly Inspiration': 'მიიღეთ ყოველკვირეული ინსპირაცია',
        'Subscribe to receive photography tips, exclusive content, and studio updates': 'გამოიწერეთ ფოტოგრაფიის რჩევები, ექსკლუზიური კონტენტი და სტუდიის სიახლეები',
        'Subscribe →': 'გამოწერა →',
        'Ready to Create?': 'მზად ხართ შექმნისთვის?',
        'Search...': 'ძებნა...',
        'Loading experience...': 'გამოცდილება იტვირთება...'
    },
    ru: {
        'HOME': 'Главная',
        'STORY': 'История',
        'PORTFOLIO': 'Портфолио',
        'SERVICES': 'Услуги',
        'CONTACT': 'Контакты',
        'BLOG': 'Блог',
        'Kutaisi, Georgia': 'Кутаиси, Грузия',
        'საუკეთესო ფოტოგრაფი ქუთაისში · მთავარი ფოტოგრაფი საქართველოში · Premium Studio': 'Лучший фотограф в Кутаиси · Ведущий фотограф в Грузии · Премиальная студия',
        'VIEW PORTFOLIO': 'Смотреть портфолио',
        'BOOK A SESSION': 'Забронировать съемку',
        'Beyond the Frame': 'За пределами кадра',
        'My approach to photography transcends traditional boundaries. Each image is a narrative — a moment suspended in time, infused with emotion, light, and authentic human connection. Based in the heart of Kutaisi, Georgia, I bring a unique perspective shaped by the ancient streets and modern artistic vision.': 'Мой подход к фотографии выходит за рамки классической съемки. Каждый кадр - это история, остановленный момент, наполненный эмоцией, светом и живой человеческой связью.',
        '"Photography is the art of revealing what lies beneath the surface — the unspoken, the unseen, the unforgettable."': '"Фотография раскрывает то, что скрыто под поверхностью: несказанное, невидимое и незабываемое."',
        'WHAT I OFFER': 'Что я предлагаю',
        'Premium Photography Experiences': 'Премиальный фотоопыт',
        'Tailored sessions designed to capture your most precious moments with artistry and precision.': 'Индивидуальные съемки, созданные для ваших самых ценных моментов с художественным подходом и точностью.',
        'Tailored sessions designed to capture your most precious moments': 'Индивидуальные съемки для ваших самых ценных моментов.',
        'Fine Art Portraits': 'Художественные портреты',
        'Artistic portrait sessions that capture your essence with cinematic lighting and composition.': 'Портретные съемки с кинематографичным светом и продуманной композицией.',
        'Artistic portrait sessions that capture your essence with cinematic lighting and composition. Perfect for personal branding, milestone celebrations, or simply preserving this moment in time.': 'Портретные съемки с кинематографичным светом и композицией. Подходят для личного бренда, важных дат и сохранения момента.',
        'Wedding & Events': 'Свадьбы и события',
        'Wedding & Elopement': 'Свадьба и elopement',
        'Timeless wedding photography that tells your love story through authentic, emotional imagery.': 'Свадебная фотография, рассказывающая вашу историю любви через живые и эмоциональные кадры.',
        'Timeless wedding photography that tells your love story through authentic, emotional imagery. From intimate elopements to grand celebrations, every moment is captured with artistry and care.': 'Свадебная фотография, рассказывающая вашу историю любви через живые и эмоциональные кадры. От камерных церемоний до больших торжеств.',
        'Commercial & Branding': 'Коммерческая съемка и брендинг',
        'Professional brand photography that elevates your business identity and visual presence.': 'Профессиональная бренд-фотография, усиливающая визуальную идентичность бизнеса.',
        'Professional brand photography that elevates your business identity. Perfect for websites, social media, marketing campaigns, and product launches.': 'Профессиональная бренд-фотография для сайтов, социальных сетей, маркетинговых кампаний и запусков продуктов.',
        'Learn More →': 'Подробнее →',
        'Book Portrait Session →': 'Забронировать портрет →',
        'Inquire About Wedding →': 'Узнать о свадьбе →',
        'Request Quote →': 'Запросить стоимость →',
        'Ready to Create Something Extraordinary?': 'Готовы создать что-то особенное?',
        'Ready to Create Your Story?': 'Готовы создать вашу историю?',
        'Ready to Book Your Session?': 'Готовы забронировать съемку?',
        "Let's collaborate and bring your vision to life through the lens.": 'Давайте воплотим вашу идею через объектив.',
        "Let's create something beautiful together.": 'Давайте создадим что-то красивое вместе.',
        'BOOK YOUR SESSION': 'Забронировать съемку',
        'CONTACT ME →': 'Связаться →',
        'Explore': 'Навигация',
        'Home': 'Главная',
        'About': 'Обо мне',
        'Portfolio': 'Портфолио',
        'Services': 'Услуги',
        'Blog': 'Блог',
        'Connect': 'Связь',
        'Contact': 'Контакты',
        'Studio': 'Студия',
        'Premium Photography Studio': 'Премиальная фотостудия',
        'Based in Kutaisi, Georgia': 'Кутаиси, Грузия',
        'Behind the Lens': 'За объективом',
        'The journey, philosophy, and passion that drive my photography': 'Путь, философия и страсть, которые формируют мою фотографию',
        'Finding Light in Every Moment': 'Находить свет в каждом моменте',
        'My Journey': 'Мой путь',
        'Key moments that shaped my career': 'Ключевые моменты, сформировавшие мою карьеру',
        'What Drives Me': 'Что меня вдохновляет',
        'The principles that guide every project': 'Принципы, которыми я руководствуюсь в каждом проекте',
        'Authenticity': 'Искренность',
        'Excellence': 'Качество',
        'Creativity': 'Креативность',
        "Let's Create Together": 'Давайте создавать вместе',
        "I'd love to hear your story and help bring your vision to life.": 'Я хочу услышать вашу историю и помочь воплотить вашу идею.',
        'START THE CONVERSATION →': 'Начать разговор →',
        'Visual Stories': 'Визуальные истории',
        'A curated collection of my finest work — moments that speak without words': 'Избранная коллекция моих лучших работ - моменты, говорящие без слов',
        'ALL WORK': 'Все',
        'PORTRAIT': 'Портрет',
        'WEDDING': 'Свадьба',
        'COMMERCIAL': 'Коммерция',
        'EDITORIAL': 'Editorial',
        'Choose Your Experience': 'Выберите формат',
        'Curated packages designed for every need and budget': 'Пакеты для разных задач и бюджетов',
        'Frequently Asked Questions': 'Частые вопросы',
        'Everything you need to know about working with me': 'Все, что нужно знать о работе со мной',
        "Let's Connect": 'Свяжемся',
        "I'd love to hear about your vision and discuss how we can bring it to life": 'Расскажите о вашей идее, и мы обсудим, как ее воплотить',
        'Studio Information': 'Информация о студии',
        'Located in the heart of Kutaisi, Georgia, my studio is designed to be a welcoming space where creativity flows freely.': 'Студия находится в центре Кутаиси и создана как теплое пространство для свободного творчества.',
        'Send Message →': 'Отправить сообщение →',
        'Follow the Journey': 'Следите за работами',
        'Stay connected on Instagram for daily inspiration and recent work': 'Подписывайтесь на Instagram для вдохновения и новых работ',
        'Follow on Instagram →': 'Перейти в Instagram →',
        'Stories & Insights': 'Истории и идеи',
        'Photography tips, behind-the-scenes, and creative inspiration': 'Советы по фотографии, закулисье и творческое вдохновение',
        'Get Weekly Inspiration': 'Получать вдохновение',
        'Subscribe to receive photography tips, exclusive content, and studio updates': 'Подпишитесь на советы, эксклюзивный контент и новости студии',
        'Subscribe →': 'Подписаться →',
        'Ready to Create?': 'Готовы создать?',
        'Search...': 'Поиск...',
        'Loading experience...': 'Загрузка...'
    }
};

function applyDynamicSEO() {
    initLanguageExperience();
}

function initLanguageExperience() {
    const supported = ['en', 'ka', 'ru'];
    const requested = new URLSearchParams(window.location.search).get('lang');
    const saved = localStorage.getItem('site-language');
    const browserLang = (navigator.language || 'en').slice(0, 2);
    const current = supported.includes(requested) ? requested : (supported.includes(saved) ? saved : (supported.includes(browserLang) ? browserLang : 'en'));

    localStorage.setItem('site-language', current);
    installLanguageSwitcher(current);
    applyLanguage(current);
    wireSocialLinks();
}

function getPageName() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    return page === '' ? 'index.html' : page;
}

function installLanguageSwitcher(current) {
    if (document.querySelector('.language-switcher')) return;

    const style = document.createElement('style');
    style.textContent = `
        .language-switcher {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.2rem;
            border: 1px solid rgba(212, 175, 55, 0.28);
            border-radius: 999px;
            background: rgba(0, 0, 0, 0.24);
            backdrop-filter: blur(10px);
        }
        .language-switcher button {
            min-width: 34px;
            min-height: 30px;
            padding: 0 0.55rem;
            border: 0;
            border-radius: 999px;
            background: transparent;
            color: var(--primitive-champagne-200, #EFE8D8);
            font: 600 0.72rem/1 var(--semantic-font-body, Inter, sans-serif);
            letter-spacing: 0;
            cursor: pointer;
        }
        .language-switcher button.active {
            background: var(--semantic-brand-primary, #D4AF37);
            color: #050505;
        }
        @media (max-width: 520px) {
            .language-switcher { gap: 0.1rem; }
            .language-switcher button { min-width: 30px; padding: 0 0.42rem; }
        }
    `;
    document.head.appendChild(style);

    const switcher = document.createElement('div');
    switcher.className = 'language-switcher';
    switcher.setAttribute('aria-label', 'Language selector');
    switcher.innerHTML = `
        <button type="button" data-lang-switch="en">EN</button>
        <button type="button" data-lang-switch="ka">KA</button>
        <button type="button" data-lang-switch="ru">RU</button>
    `;

    const headerActions = document.querySelector('.header-actions');
    if (headerActions) headerActions.prepend(switcher);

    switcher.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.dataset.langSwitch;
            localStorage.setItem('site-language', lang);
            applyLanguage(lang);
        });
    });

    setActiveLanguageButton(current);
}

function applyLanguage(lang) {
    const dictionary = I18N[lang] || {};
    const page = PAGE_SEO[getPageName()] || PAGE_SEO['index.html'];
    const seo = page[lang] || page.en;

    document.documentElement.lang = lang === 'ka' ? 'ka-GE' : (lang === 'ru' ? 'ru-RU' : 'en-US');
    document.title = seo.title;
    upsertMeta('description', seo.description);
    upsertMeta('keywords', seo.keywords);
    upsertMetaProperty('og:title', seo.title);
    upsertMetaProperty('og:description', seo.description);
    upsertMetaProperty('og:locale', lang === 'ka' ? 'ka_GE' : (lang === 'ru' ? 'ru_RU' : 'en_US'));
    upsertMeta('twitter:title', seo.title);
    upsertMeta('twitter:description', seo.description);
    upsertCanonical(`${SITE_CONFIG.baseUrl}/${getPageName() === 'index.html' ? '' : getPageName()}`);

    translateTextNodes(dictionary);
    translateAttributes(dictionary);
    updateStructuredData(lang, seo);
    setActiveLanguageButton(lang);
}

function translateTextNodes(dictionary) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            const parent = node.parentElement;
            if (!parent || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA'].includes(parent.tagName)) {
                return NodeFilter.FILTER_REJECT;
            }
            return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(node => {
        if (!node.__i18nSource) {
            node.__i18nSource = normalizeCopy(node.nodeValue);
        }
        const translated = dictionary[node.__i18nSource] || node.__i18nSource;
        node.nodeValue = preserveWhitespace(node.nodeValue, translated);
    });
}

function translateAttributes(dictionary) {
    document.querySelectorAll('[placeholder]').forEach(el => {
        if (!el.dataset.i18nPlaceholder) el.dataset.i18nPlaceholder = el.getAttribute('placeholder');
        el.setAttribute('placeholder', dictionary[el.dataset.i18nPlaceholder] || el.dataset.i18nPlaceholder);
    });
    document.querySelectorAll('[aria-label]').forEach(el => {
        if (!el.dataset.i18nAria) el.dataset.i18nAria = el.getAttribute('aria-label');
        el.setAttribute('aria-label', dictionary[el.dataset.i18nAria] || el.dataset.i18nAria);
    });
}

function normalizeCopy(value) {
    return value.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

function preserveWhitespace(original, translated) {
    const lead = original.match(/^\s*/)?.[0] || '';
    const tail = original.match(/\s*$/)?.[0] || '';
    return `${lead}${translated}${tail}`;
}

function setActiveLanguageButton(lang) {
    document.querySelectorAll('[data-lang-switch]').forEach(button => {
        const active = button.dataset.langSwitch === lang;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
}

function upsertMeta(name, content) {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
}

function upsertMetaProperty(property, content) {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
}

function upsertCanonical(url) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
}

function updateStructuredData(lang, seo) {
    let schema = document.getElementById('local-business-schema');
    if (!schema) {
        schema = document.createElement('script');
        schema.type = 'application/ld+json';
        schema.id = 'local-business-schema';
        document.head.appendChild(schema);
    }

    const names = {
        en: 'Anuka Abazadze Photography Studio',
        ka: 'ანუკა აბაზაძის ფოტოგრაფიის სტუდია',
        ru: 'Фотостудия Ануки Абазадзе'
    };

    schema.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: names[lang] || names.en,
        alternateName: ['Anuka Abazadze', 'Anuka Abazadze Photography'],
        url: SITE_CONFIG.baseUrl,
        image: `${SITE_CONFIG.baseUrl}/assets/images/logo.png`,
        logo: `${SITE_CONFIG.baseUrl}/assets/images/logo.png`,
        description: seo.description,
        telephone: SITE_CONFIG.phone,
        email: SITE_CONFIG.email,
        priceRange: '$$',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Kutaisi',
            addressCountry: 'GE'
        },
        areaServed: ['Kutaisi', 'Tbilisi', 'Georgia'],
        sameAs: [SITE_CONFIG.instagram, SITE_CONFIG.facebook, SITE_CONFIG.pinterest],
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Photography services',
            itemListElement: [
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Fine art portraits' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Wedding photography' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Commercial branding photography' } }
            ]
        }
    });
}

function wireSocialLinks() {
    const socialTargets = {
        instagram: SITE_CONFIG.instagram,
        facebook: SITE_CONFIG.facebook,
        pinterest: SITE_CONFIG.pinterest
    };

    document.querySelectorAll('a').forEach(link => {
        const label = `${link.getAttribute('aria-label') || ''} ${link.textContent || ''}`.toLowerCase();
        Object.entries(socialTargets).forEach(([name, url]) => {
            if (label.includes(name)) {
                link.href = url;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
            }
        });
    });
}
