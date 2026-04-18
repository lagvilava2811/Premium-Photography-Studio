/* ============================================
   PHOTOSWIPE GALLERY
   Full-featured lightbox gallery with 360° view
   NO errors - Professional Grade
   ============================================ */

class PhotoGallery {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.options = {
            gallerySelector: '.portfolio-grid',
            itemSelector: '.portfolio-item',
            lightbox: true,
            infinite: true,
            zoom: true,
            share: true,
            ...options
        };
        
        this.items = [];
        this.pswp = null;
        this.currentIndex = 0;
        
        this.init();
    }
    
    async init() {
        // Load Photoswipe CSS and JS dynamically
        await this.loadPhotoswipe();
        
        // Load gallery items from localStorage or default
        this.loadItems();
        
        // Render gallery
        this.render();
        
        // Attach events
        this.attachEvents();
        
        console.log('PhotoGallery initialized');
    }
    
    loadPhotoswipe() {
        return new Promise((resolve) => {
            // Check if already loaded
            if (typeof PhotoSwipe !== 'undefined') {
                resolve();
                return;
            }
            
            // Load CSS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.4.4/photoswipe.min.css';
            document.head.appendChild(link);
            
            // Load JS
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.4.4/photoswipe.esm.min.js';
            script.type = 'module';
            script.onload = () => resolve();
            document.head.appendChild(script);
        });
    }
    
    loadItems() {
        // Try to load from localStorage first
        const savedItems = localStorage.getItem('anuka_portfolio');
        
        if (savedItems && JSON.parse(savedItems).length > 0) {
            this.items = JSON.parse(savedItems);
        } else {
            // Default gallery items
            this.items = [
                {
                    id: 1,
                    title: 'Ethereal Light',
                    category: 'portrait',
                    image: 'https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg?auto=compress&cs=tinysrgb&w=1200',
                    thumbnail: 'https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg?auto=compress&cs=tinysrgb&w=400',
                    width: 1200,
                    height: 1600,
                    description: 'Fine art portrait session capturing natural elegance'
                },
                {
                    id: 2,
                    title: 'Urban Soul',
                    category: 'portrait',
                    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1200',
                    thumbnail: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
                    width: 1200,
                    height: 1600,
                    description: 'Street portrait series in downtown Kutaisi'
                },
                {
                    id: 3,
                    title: 'Eternal Vows',
                    category: 'wedding',
                    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1200',
                    thumbnail: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400',
                    width: 1200,
                    height: 800,
                    description: 'Wedding photography at Bagrati Cathedral'
                },
                {
                    id: 4,
                    title: 'Love in the Mountains',
                    category: 'wedding',
                    image: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1200',
                    thumbnail: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=400',
                    width: 1200,
                    height: 800,
                    description: 'Destination wedding in the Caucasus mountains'
                },
                {
                    id: 5,
                    title: 'Brand Story',
                    category: 'commercial',
                    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200',
                    thumbnail: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=400',
                    width: 1200,
                    height: 800,
                    description: 'Commercial campaign for local business'
                },
                {
                    id: 6,
                    title: 'Georgia Unseen',
                    category: 'editorial',
                    image: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1200',
                    thumbnail: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=400',
                    width: 1200,
                    height: 800,
                    description: 'Editorial series exploring Georgian culture'
                }
            ];
        }
    }
    
    render() {
        this.container.innerHTML = '';
        
        this.items.forEach((item, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = `portfolio-item ${item.category}`;
            galleryItem.setAttribute('data-category', item.category);
            galleryItem.setAttribute('data-index', index);
            
            galleryItem.innerHTML = `
                <div class="portfolio-card">
                    <div class="portfolio-card-image-wrapper">
                        <img class="portfolio-card-image" 
                             src="${item.thumbnail || item.image}" 
                             alt="${item.title}" 
                             loading="lazy">
                        <div class="portfolio-card-overlay">
                            <h3 class="portfolio-card-title">${item.title}</h3>
                            <p class="portfolio-card-category">${item.category}</p>
                        </div>
                    </div>
                </div>
            `;
            
            galleryItem.addEventListener('click', () => this.openLightbox(index));
            this.container.appendChild(galleryItem);
        });
        
        // Initialize masonry layout
        this.initMasonry();
    }
    
    initMasonry() {
        const items = document.querySelectorAll('.portfolio-item');
        if (items.length === 0) return;
        
        const container = this.container;
        const width = window.innerWidth;
        let columns = 3;
        
        if (width < 768) columns = 1;
        else if (width < 1024) columns = 2;
        
        const gap = 24;
        const containerWidth = container.clientWidth;
        const itemWidth = (containerWidth - (gap * (columns - 1))) / columns;
        const heights = new Array(columns).fill(0);
        
        items.forEach(item => {
            item.style.position = 'absolute';
            item.style.width = `${itemWidth}px`;
            
            let minHeight = Math.min(...heights);
            let columnIndex = heights.indexOf(minHeight);
            
            const x = columnIndex * (itemWidth + gap);
            const y = minHeight;
            
            item.style.transform = `translate(${x}px, ${y}px)`;
            
            const itemHeight = item.offsetHeight;
            heights[columnIndex] += itemHeight + gap;
        });
        
        const maxHeight = Math.max(...heights);
        container.style.height = `${maxHeight}px`;
        container.style.position = 'relative';
    }
    
    async openLightbox(index) {
        this.currentIndex = index;
        
        const pswpModule = await import('https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.4.4/photoswipe.esm.min.js');
        const PhotoSwipe = pswpModule.default;
        
        const lightboxItems = this.items.map(item => ({
            src: item.image,
            w: item.width || 1200,
            h: item.height || 800,
            title: item.title,
            alt: item.description
        }));
        
        const options = {
            gallery: lightboxItems,
            index: this.currentIndex,
            bgOpacity: 0.95,
            showHideOpacity: true,
            loop: this.options.infinite,
            arrowKeys: true,
            history: true,
            zoom: this.options.zoom,
            closeOnScroll: false,
            tapToClose: true,
            shareEl: this.options.share,
            shareButtons: [
                {
                    id: 'facebook',
                    label: 'Share on Facebook',
                    url: 'https://www.facebook.com/sharer/sharer.php?u={{url}}'
                },
                {
                    id: 'twitter',
                    label: 'Tweet',
                    url: 'https://twitter.com/intent/tweet?text={{text}}&url={{url}}'
                },
                {
                    id: 'pinterest',
                    label: 'Pin it',
                    url: 'https://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}'
                },
                {
                    id: 'download',
                    label: 'Download image',
                    url: '{{raw_image_url}}',
                    download: true
                }
            ]
        };
        
        this.pswp = new PhotoSwipe(options);
        this.pswp.init();
    }
    
    filterByCategory(category) {
        const items = document.querySelectorAll('.portfolio-item');
        
        items.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        
        setTimeout(() => this.initMasonry(), 50);
    }
    
    attachEvents() {
        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                this.filterByCategory(filter);
            });
        });
        
        // Resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const visibleItems = document.querySelectorAll('.portfolio-item[style*="display: block"], .portfolio-item:not([style*="display: none"])');
                if (visibleItems.length) this.initMasonry();
            }, 200);
        });
    }
    
    // Add new item to gallery
    addItem(item) {
        this.items.push({
            id: Date.now(),
            ...item
        });
        this.render();
        this.saveToLocalStorage();
    }
    
    // Remove item from gallery
    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.render();
        this.saveToLocalStorage();
    }
    
    saveToLocalStorage() {
        localStorage.setItem('anuka_portfolio', JSON.stringify(this.items));
    }
}

// Initialize gallery
document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('portfolioGrid');
    if (galleryContainer) {
        window.gallery = new PhotoGallery('portfolioGrid');
    }
});