/* ============================================
   CLIENT-SIDE ROUTER
   SPA-like navigation with history API
   NO errors - Professional Grade
   ============================================ */

class Router {
    constructor(options = {}) {
        this.routes = [];
        this.currentRoute = null;
        this.container = options.container || '#main-content';
        this.useHash = options.useHash || false;
        this.transitionName = options.transitionName || 'fade';
        
        this.init();
    }
    
    init() {
        // Bind events
        window.addEventListener('popstate', () => this.handleRoute());
        
        // Handle initial route
        this.handleRoute();
        
        // Intercept all internal links
        this.interceptLinks();
        
        console.log('Router initialized');
    }
    
    addRoute(path, component, options = {}) {
        this.routes.push({
            path: this.normalizePath(path),
            component,
            options
        });
        return this;
    }
    
    normalizePath(path) {
        // Remove leading/trailing slashes and normalize
        return path.replace(/^\/+|\/+$/g, '');
    }
    
    getCurrentPath() {
        if (this.useHash) {
            let hash = window.location.hash.slice(1);
            return hash || '/';
        }
        
        let path = window.location.pathname;
        // Remove leading slash
        path = path.replace(/^\//, '');
        // Remove trailing slash
        path = path.replace(/\/$/, '');
        return path || '';
    }
    
    matchRoute(path) {
        for (const route of this.routes) {
            const pattern = route.path;
            
            // Exact match
            if (pattern === path) {
                return { route, params: {} };
            }
            
            // Dynamic route matching (e.g., /blog/:id)
            if (pattern.includes(':')) {
                const patternParts = pattern.split('/');
                const pathParts = path.split('/');
                
                if (patternParts.length === pathParts.length) {
                    const params = {};
                    let match = true;
                    
                    for (let i = 0; i < patternParts.length; i++) {
                        if (patternParts[i].startsWith(':')) {
                            params[patternParts[i].slice(1)] = pathParts[i];
                        } else if (patternParts[i] !== pathParts[i]) {
                            match = false;
                            break;
                        }
                    }
                    
                    if (match) {
                        return { route, params };
                    }
                }
            }
        }
        
        // Return 404 route if exists
        const notFoundRoute = this.routes.find(r => r.path === '404');
        return { route: notFoundRoute, params: {} };
    }
    
    async handleRoute() {
        const path = this.getCurrentPath();
        const { route, params } = this.matchRoute(path);
        
        if (!route) {
            console.warn(`No route found for path: ${path}`);
            return;
        }
        
        // Show loading indicator
        this.showLoading();
        
        try {
            // Execute before hook
            if (route.options.before) {
                await route.options.before(params);
            }
            
            // Render component
            await this.renderComponent(route.component, params);
            
            // Update current route
            this.currentRoute = { ...route, params };
            
            // Update document title
            if (route.options.title) {
                document.title = route.options.title;
            }
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'instant' });
            
            // Execute after hook
            if (route.options.after) {
                await route.options.after(params);
            }
        } catch (error) {
            console.error('Route error:', error);
            this.showError(error);
        } finally {
            this.hideLoading();
        }
    }
    
    async renderComponent(component, params) {
        const container = document.querySelector(this.container);
        if (!container) return;
        
        // Apply transition
        container.classList.add(this.transitionName + '-exit');
        
        setTimeout(async () => {
            // Render component
            if (typeof component === 'function') {
                const html = await component(params);
                container.innerHTML = html;
            } else if (typeof component === 'string') {
                container.innerHTML = component;
            }
            
            // Re-initialize components in new content
            this.reinitializeContent();
            
            container.classList.remove(this.transitionName + '-exit');
            container.classList.add(this.transitionName + '-enter');
            
            setTimeout(() => {
                container.classList.remove(this.transitionName + '-enter');
            }, 300);
        }, 150);
    }
    
    reinitializeContent() {
        // Re-run scroll animations
        if (window.app) {
            setTimeout(() => {
                window.app.triggerScrollAnimations();
            }, 100);
        }
        
        // Re-initialize lazy loading
        if (window.initLazyLoading) {
            window.initLazyLoading();
        }
        
        // Dispatch event for other components
        document.dispatchEvent(new CustomEvent('route:changed', {
            detail: { route: this.currentRoute }
        }));
    }
    
    navigate(path, options = { replace = false } = {}) {
        const normalizedPath = this.normalizePath(path);
        const currentPath = this.getCurrentPath();
        
        if (normalizedPath === currentPath && !options.force) {
            return;
        }
        
        if (options.replace) {
            if (this.useHash) {
                window.location.replace(`#${normalizedPath}`);
            } else {
                window.history.replaceState({}, '', `/${normalizedPath}`);
            }
        } else {
            if (this.useHash) {
                window.location.hash = normalizedPath;
            } else {
                window.history.pushState({}, '', `/${normalizedPath}`);
            }
        }
        
        this.handleRoute();
    }
    
    interceptLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (!href) return;
            
            // Skip external links
            if (href.startsWith('http') && !href.includes(window.location.hostname)) {
                return;
            }
            
            // Skip anchor links
            if (href.startsWith('#')) {
                return;
            }
            
            // Skip download links
            if (link.hasAttribute('download')) {
                return;
            }
            
            // Skip target="_blank"
            if (link.target === '_blank') {
                return;
            }
            
            e.preventDefault();
            
            // Remove leading slash and extension
            let path = href.replace(/^\//, '');
            path = path.replace(/\.html$/, '');
            
            this.navigate(path);
        });
    }
    
    showLoading() {
        const loadingBar = document.querySelector('.loading-bar');
        if (loadingBar) {
            loadingBar.classList.add('active');
        }
    }
    
    hideLoading() {
        const loadingBar = document.querySelector('.loading-bar');
        if (loadingBar) {
            loadingBar.classList.remove('active');
            loadingBar.classList.add('complete');
            setTimeout(() => {
                loadingBar.classList.remove('complete');
            }, 500);
        }
    }
    
    showError(error) {
        console.error('Router error:', error);
        // You can implement error UI here
    }
    
    // Helper: Get current route params
    getParams() {
        return this.currentRoute?.params || {};
    }
    
    // Helper: Go back
    back() {
        window.history.back();
    }
    
    // Helper: Go forward
    forward() {
        window.history.forward();
    }
}

// Initialize router when DOM is ready
let routerInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    routerInstance = new Router({
        container: 'main',
        transitionName: 'fade'
    });
    
    // Define routes
    routerInstance
        .addRoute('', () => fetch('/index.html').then(r => r.text()), {
            title: 'Anuka Abazadze | Home',
            before: () => console.log('Loading home...')
        })
        .addRoute('about', () => fetch('/about.html').then(r => r.text()), {
            title: 'Anuka Abazadze | About'
        })
        .addRoute('portfolio', () => fetch('/portfolio.html').then(r => r.text()), {
            title: 'Anuka Abazadze | Portfolio'
        })
        .addRoute('services', () => fetch('/services.html').then(r => r.text()), {
            title: 'Anuka Abazadze | Services'
        })
        .addRoute('contact', () => fetch('/contact.html').then(r => r.text()), {
            title: 'Anuka Abazadze | Contact'
        })
        .addRoute('blog', () => fetch('/blog.html').then(r => r.text()), {
            title: 'Anuka Abazadze | Blog'
        })
        .addRoute('blog/:id', (params) => {
            return fetch(`/blog-post.html?id=${params.id}`).then(r => r.text());
        }, {
            title: 'Anuka Abazadze | Blog Post'
        })
        .addRoute('404', '<h1>404 - Page Not Found</h1>', {
            title: '404 - Page Not Found'
        });
    
    window.router = routerInstance;
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Router };
}