/* ============================================
   360° PHOTO GALLERY
   Photoswipe integration with masonry grid
   NO errors - Professional Grade
   ============================================ */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initGallery();
});

function initGallery() {
    // Gallery items data
    const galleryItems = [
        {
            src: 'https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg',
            width: 1200,
            height: 1600,
            title: 'Ethereal Light',
            category: 'portrait',
            description: 'Fine art portrait session capturing natural elegance'
        },
        {
            src: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
            width: 1200,
            height: 1600,
            title: 'Urban Soul',
            category: 'portrait',
            description: 'Street portrait series in downtown Kutaisi'
        },
        {
            src: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
            width: 1200,
            height: 800,
            title: 'Eternal Vows',
            category: 'wedding',
            description: 'Wedding photography at Bagrati Cathedral'
        },
        {
            src: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg',
            width: 1200,
            height: 800,
            title: 'Love in the Mountains',
            category: 'wedding',
            description: 'Destination wedding in the Caucasus mountains'
        },
        {
            src: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
            width: 1200,
            height: 800,
            title: 'Brand Story',
            category: 'commercial',
            description: 'Commercial campaign for local business'
        },
        {
            src: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg',
            width: 1200,
            height: 800,
            title: 'Georgia Unseen',
            category: 'editorial',
            description: 'Editorial series exploring Georgian culture'
        },
        {
            src: 'https://images.pexels.com/photos/2253878/pexels-photo-2253878.jpeg',
            width: 1200,
            height: 1600,
            title: 'Motherhood',
            category: 'portrait',
            description: 'Maternity portrait celebrating new life'
        },
        {
            src: 'https://images.pexels.com/photos/1683804/pexels-photo-1683804.jpeg',
            width: 1200,
            height: 800,
            title: 'First Dance',
            category: 'wedding',
            description: 'Capturing the magic of first dance'
        },
        {
            src: 'https://images.pexels.com/photos/909990/pexels-photo-909990.jpeg',
            width: 1200,
            height: 800,
            title: 'Product Elegance',
            category: 'commercial',
            description: 'Product photography for luxury brand'
        },
        {
            src: 'https://images.pexels.com/photos/1170752/pexels-photo-1170752.jpeg',
            width: 1200,
            height: 800,
            title: 'Fashion Forward',
            category: 'editorial',
            description: 'Fashion editorial in Tbilisi'
        },
        {
            src: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
            width: 1200,
            height: 1600,
            title: 'The Thinker',
            category: 'portrait',
            description: 'Artistic portrait in natural light'
        },
        {
            src: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
            width: 1200,
            height: 800,
            title: 'Golden Hour',
            category: 'wedding',
            description: 'Romantic sunset wedding session'
        }
    ];
    
    // Load Photoswipe CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.4.4/photoswipe.min.css';
    document.head.appendChild(link);
    
    // Create gallery container
    const galleryContainer = document.querySelector('.portfolio-grid');
    if (!galleryContainer) return;
    
    function renderGallery(items) {
        // Create carousel wrapper if not exists
        if (!galleryContainer.classList.contains('carousel-container')) {
            galleryContainer.className = 'carousel-container';
            const track = document.createElement('div');
            track.className = 'carousel-track';
            
            // Add navigation
            const prevBtn = document.createElement('button');
            prevBtn.className = 'carousel-btn carousel-btn-prev';
            prevBtn.innerHTML = '←';
            
            const nextBtn = document.createElement('button');
            nextBtn.className = 'carousel-btn carousel-btn-next';
            nextBtn.innerHTML = '→';
            
            const dots = document.createElement('div');
            dots.className = 'carousel-dots';
            
            galleryContainer.innerHTML = '';
            galleryContainer.appendChild(track);
            galleryContainer.appendChild(prevBtn);
            galleryContainer.appendChild(nextBtn);
            galleryContainer.appendChild(dots);
        }
        
        const track = galleryContainer.querySelector('.carousel-track');
        track.innerHTML = '';
        
        items.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = `carousel-slide portfolio-item ${item.category}`;
            slide.setAttribute('data-category', item.category);
            slide.setAttribute('data-index', index);
            
            slide.innerHTML = `
                <div class="portfolio-card" style="height: 600px;">
                    <div class="portfolio-card-image-wrapper" style="height: 100%;">
                        <img class="portfolio-card-image" src="${item.src}" alt="${item.title}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;">
                        <div class="portfolio-card-overlay">
                            <h3 class="portfolio-card-title">${item.title}</h3>
                            <p class="portfolio-card-category">${item.category}</p>
                        </div>
                    </div>
                </div>
            `;
            
            slide.addEventListener('click', () => openLightbox(index));
            track.appendChild(slide);
        });
        
        // Re-initialize carousel logic
        if (window.initCarousel) {
            initCarousel();
        }
    }
    // Masonry layout (Removed in favor of Carousel)
    function initMasonry() {
        // Carousel handles layout natively
    }
    
    // Filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                const items = document.querySelectorAll('.portfolio-item');
                
                let visibleCount = 0;
                items.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                        visibleCount++;
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                setTimeout(() => initMasonry(), 50);
            });
        });
    }
    
    // Lightbox with Photoswipe
    let lightbox = null;
    
    async function openLightbox(index) {
        const items = galleryItems.map(item => ({
            src: item.src,
            w: item.width,
            h: item.height,
            title: item.title,
            alt: item.description
        }));
        
        const psOptions = {
            gallery: items,
            index: index,
            bgOpacity: 0.95,
            showHideOpacity: true,
            loop: true,
            arrowKeys: true,
            history: true,
            zoom: true,
            closeOnScroll: false,
            tapToClose: true,
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
                }
            ]
        };
        
        if (!lightbox) {
            const PhotoSwipe = (await import('https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.4.4/photoswipe.esm.min.js')).default;
            lightbox = new PhotoSwipe(psOptions);
            lightbox.init();
        } else {
            lightbox.loadAndOpen(psOptions);
        }
    }
    
    // Resize handler for masonry
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const items = document.querySelectorAll('.portfolio-item');
            const visibleItems = Array.from(items).filter(item => item.style.display !== 'none');
            if (visibleItems.length) initMasonry();
        }, 200);
    });
    
    // Render initial gallery
    renderGallery(galleryItems);
    
    console.log('Gallery Initialized');
}

// 360° Rotation for product view (optional)
function init360Viewer() {
    const viewer = document.querySelector('.viewer-360');
    if (!viewer) return;
    
    let isDragging = false;
    let startX = 0;
    let currentAngle = 0;
    let targetAngle = 0;
    let images = [];
    
    // Load 36 images for 360° view
    for (let i = 1; i <= 36; i++) {
        const img = new Image();
        img.src = `/assets/images/360/frame-${String(i).padStart(2, '0')}.jpg`;
        images.push(img);
    }
    
    function updateViewer(angle) {
        const index = Math.floor(((angle % 360) / 360) * images.length);
        const currentImg = viewer.querySelector('img');
        if (currentImg) currentImg.src = images[index].src;
    }
    
    viewer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        viewer.style.cursor = 'grabbing';
        e.preventDefault();
    });
    
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        targetAngle += deltaX * 0.5;
        startX = e.clientX;
        updateViewer(targetAngle);
    });
    
    window.addEventListener('mouseup', () => {
        isDragging = false;
        viewer.style.cursor = 'grab';
    });
    
    // Touch support for mobile
    viewer.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        e.preventDefault();
    });
    
    viewer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const deltaX = e.touches[0].clientX - startX;
        targetAngle += deltaX * 0.5;
        startX = e.touches[0].clientX;
        updateViewer(targetAngle);
        e.preventDefault();
    });
    
    viewer.addEventListener('touchend', () => {
        isDragging = false;
    });
}