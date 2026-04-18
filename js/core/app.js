/* ============================================
   CORE APPLICATION
   Main app initialization, state management
   NO errors - Professional Grade
   ============================================ */

class App {
    constructor() {
        this.state = {
            isLoaded: false,
            isMobile: window.innerWidth < 768,
            isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
            isDesktop: window.innerWidth >= 1024,
            scrollPosition: 0,
            theme: this.getPreferredTheme(),
            language: 'ka-GE'
        };
        
        this.components = [];
        this.observers = [];
        
        this.init();
    }
    
    getPreferredTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    init() {
        // Apply theme
        this.applyTheme();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Handle resize
        this.handleResize();
        
        // Handle scroll
        this.handleScroll();
        
        // Mark as loaded
        this.state.isLoaded = true;
        document.body.classList.add('app-loaded');
        
        // Dispatch event
        this.dispatch('app:ready', this.state);
        
        console.log('App initialized', this.state);
    }
    
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.state.theme);
        document.documentElement.style.colorScheme = this.state.theme;
    }
    
    setTheme(theme) {
        this.state.theme = theme;
        localStorage.setItem('theme', theme);
        this.applyTheme();
        this.dispatch('theme:changed', theme);
    }
    
    toggleTheme() {
        const newTheme = this.state.theme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
    
    setupEventListeners() {
        // Resize handler with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.handleResize(), 150);
        });
        
        // Scroll handler with throttle
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }
            
            // Escape key
            if (e.key === 'Escape') {
                this.closeModals();
            }
        });
    }
    
    handleResize() {
        const width = window.innerWidth;
        
        this.state.isMobile = width < 768;
        this.state.isTablet = width >= 768 && width < 1024;
        this.state.isDesktop = width >= 1024;
        
        this.dispatch('resize', this.state);
    }
    
    handleScroll() {
        this.state.scrollPosition = window.scrollY;
        this.dispatch('scroll', this.state.scrollPosition);
        
        // Update header state
        const header = document.querySelector('.header');
        if (header) {
            if (this.state.scrollPosition > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // Trigger scroll animations
        this.triggerScrollAnimations();
    }
    
    triggerScrollAnimations() {
        const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .section-fade, .card-scroll, .stagger-children');
        
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const threshold = 100;
            
            if (rect.top < windowHeight - threshold && rect.bottom > 0) {
                el.classList.add('visible');
            }
        });
    }
    
    openSearch() {
        const searchOverlay = document.querySelector('.search-overlay');
        if (searchOverlay) {
            searchOverlay.classList.add('active');
            const searchInput = searchOverlay.querySelector('input');
            if (searchInput) searchInput.focus();
        }
    }
    
    closeModals() {
        // Close search
        const searchOverlay = document.querySelector('.search-overlay');
        if (searchOverlay?.classList.contains('active')) {
            searchOverlay.classList.remove('active');
        }
        
        // Close mobile menu
        const mobileMenu = document.getElementById('mobileMenu');
        const menuToggle = document.getElementById('menuToggle');
        if (mobileMenu?.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            menuToggle?.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
        }
    }
    
    registerComponent(component) {
        this.components.push(component);
    }
    
    on(event, callback) {
        if (!this.observers[event]) {
            this.observers[event] = [];
        }
        this.observers[event].push(callback);
    }
    
    dispatch(event, data) {
        if (this.observers[event]) {
            this.observers[event].forEach(callback => callback(data));
        }
    }
    
    // Performance monitoring
    logPerformance() {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
        }
    }
    
    // Network status
    initNetworkStatus() {
        window.addEventListener('online', () => {
            this.dispatch('network:online', true);
        });
        
        window.addEventListener('offline', () => {
            this.dispatch('network:offline', false);
        });
    }
    
    // Service Worker registration
    registerServiceWorker() {
        if ('serviceWorker' in navigator && location.protocol === 'https:') {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registered:', registration.scope);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed:', error);
                });
        }
    }
}

// Initialize app when DOM is ready
let appInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    appInstance = new App();
    
    // Make app globally available for debugging (optional)
    window.app = appInstance;
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App };
}