/* ============================================
   BLOG FUNCTIONALITY
   Blog posts, categories, newsletter
   localStorage persistence
   NO errors - Professional Grade
   ============================================ */

// Blog posts data
const blogPosts = [
    {
        id: 1,
        title: "The Art of Natural Light Photography",
        excerpt: "Discover how to harness natural light for stunning portraits and create magical moments without artificial lighting.",
        category: "Tips",
        date: "March 15, 2025",
        readTime: "5 min read",
        image: "https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        id: 2,
        title: "Behind the Scenes: Kutaisi Wedding Shoot",
        excerpt: "Join me on a magical wedding day in the heart of Kutaisi, capturing love stories amidst ancient architecture.",
        category: "Behind the Scenes",
        date: "March 8, 2025",
        readTime: "7 min read",
        image: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        id: 3,
        title: "5 Tips for a Perfect Portrait Session",
        excerpt: "From wardrobe choices to posing techniques, here's everything you need to know before your portrait shoot.",
        category: "Guides",
        date: "February 28, 2025",
        readTime: "6 min read",
        image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        id: 4,
        title: "The Rise of Fine Art Photography",
        excerpt: "Exploring the intersection of photography and traditional art, and why fine art portraits are more popular than ever.",
        category: "Inspiration",
        date: "February 20, 2025",
        readTime: "4 min read",
        image: "https://images.pexels.com/photos/2253878/pexels-photo-2253878.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        id: 5,
        title: "Editing Workflow: From RAW to Masterpiece",
        excerpt: "A glimpse into my post-processing workflow and how I transform raw captures into finished artworks.",
        category: "Techniques",
        date: "February 10, 2025",
        readTime: "8 min read",
        image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        id: 6,
        title: "Commercial Photography for Small Business",
        excerpt: "How professional photography can elevate your brand and help you connect with your audience.",
        category: "Business",
        date: "February 1, 2025",
        readTime: "6 min read",
        image: "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
];

// Render blog posts
function renderBlogPosts() {
    const blogGrid = document.getElementById('blogGrid');
    if (!blogGrid) return;
    
    blogGrid.innerHTML = blogPosts.map(post => `
        <article class="blog-card" data-id="${post.id}">
            <div class="blog-image-wrapper">
                <img class="blog-image" src="${post.image}" alt="${post.title}" loading="lazy">
                <span class="blog-category">${post.category}</span>
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span>📅 ${post.date}</span>
                    <span>⏱️ ${post.readTime}</span>
                </div>
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <a href="#" class="blog-read-more" data-id="${post.id}">
                    Read More →
                </a>
            </div>
        </article>
    `).join('');
    
    // Add click handlers for "Read More"
    document.querySelectorAll('.blog-read-more').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = parseInt(link.dataset.id);
            openBlogPost(id);
        });
    });
}

// Open blog post modal
function openBlogPost(id) {
    const post = blogPosts.find(p => p.id === id);
    if (!post) return;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'blog-modal';
    modal.innerHTML = `
        <div class="blog-modal-overlay"></div>
        <div class="blog-modal-container">
            <button class="blog-modal-close">✕</button>
            <img src="${post.image}" alt="${post.title}">
            <div class="blog-modal-content">
                <div class="blog-meta">
                    <span>📅 ${post.date}</span>
                    <span>⏱️ ${post.readTime}</span>
                    <span>🏷️ ${post.category}</span>
                </div>
                <h2>${post.title}</h2>
                <p>${post.excerpt}</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <div class="blog-share">
                    <span>Share this post:</span>
                    <a href="#" class="share-facebook">Facebook</a>
                    <a href="#" class="share-twitter">Twitter</a>
                    <a href="#" class="share-pinterest">Pinterest</a>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal
    const closeBtn = modal.querySelector('.blog-modal-close');
    const overlay = modal.querySelector('.blog-modal-overlay');
    
    const closeModal = () => {
        modal.remove();
        document.body.style.overflow = '';
    };
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    // Add share functionality
    const currentUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent(post.title);
    
    modal.querySelector('.share-facebook')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`, '_blank');
    });
    
    modal.querySelector('.share-twitter')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${currentUrl}`, '_blank');
    });
    
    modal.querySelector('.share-pinterest')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(`https://pinterest.com/pin/create/button/?url=${currentUrl}&media=${encodeURIComponent(post.image)}&description=${shareText}`, '_blank');
    });
}

// Newsletter subscription
function initNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        if (!email || !email.includes('@')) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Save to localStorage
        const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
            alert('Thank you for subscribing! Check your inbox for updates.');
        } else {
            alert('You are already subscribed!');
        }
        
        newsletterForm.reset();
    });
}

// Add modal styles
function addModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .blog-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .blog-modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(10, 10, 10, 0.95);
            backdrop-filter: blur(20px);
        }
        
        .blog-modal-container {
            position: relative;
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            background: rgba(10, 10, 10, 0.85);
            backdrop-filter: blur(20px);
            border-radius: var(--primitive-radius-2xl, 1rem);
            border: 1px solid rgba(221, 184, 154, 0.15);
            z-index: 1;
        }
        
        .blog-modal-container img {
            width: 100%;
            height: auto;
            border-radius: var(--primitive-radius-2xl, 1rem) var(--primitive-radius-2xl, 1rem) 0 0;
        }
        
        .blog-modal-content {
            padding: var(--primitive-spacing-8, 2rem);
        }
        
        .blog-modal-close {
            position: absolute;
            top: var(--primitive-spacing-4, 1rem);
            right: var(--primitive-spacing-4, 1rem);
            width: 40px;
            height: 40px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: var(--primitive-radius-full, 9999px);
            color: white;
            font-size: var(--semantic-text-xl, 1.25rem);
            z-index: 2;
        }
        
        .blog-share {
            display: flex;
            gap: var(--primitive-spacing-4, 1rem);
            margin-top: var(--primitive-spacing-6, 1.5rem);
            padding-top: var(--primitive-spacing-6, 1.5rem);
            border-top: 1px solid var(--semantic-border-light, rgba(255,255,255,0.1));
        }
        
        .blog-share a {
            padding: var(--primitive-spacing-2, 0.5rem) var(--primitive-spacing-4, 1rem);
            background: rgba(255, 255, 255, 0.05);
            border-radius: var(--primitive-radius-lg, 0.5rem);
            font-size: var(--semantic-text-sm, 0.875rem);
        }
        
        .blog-share a:hover {
            background: var(--semantic-brand-primary, #D4AF37);
            color: var(--semantic-text-inverse, #000000);
        }
    `;
    document.head.appendChild(style);
}

// Initialize blog
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('blogGrid')) {
        renderBlogPosts();
        initNewsletter();
        addModalStyles();
    }
});