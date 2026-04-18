/* ============================================
   ADMIN PANEL
   Manage bookings, gallery, SEO settings
   localStorage based
   NO errors - Professional Grade
   ============================================ */

class AdminPanel {
    constructor() {
        this.isLoggedIn = this.checkAuth();
        this.bookings = [];
        this.portfolio = [];
        this.packages = [];
        
        if (this.isLoggedIn) {
            this.init();
        } else {
            this.showLogin();
        }
    }
    
    checkAuth() {
        return localStorage.getItem('admin_auth') === 'true';
    }
    
    showLogin() {
        const container = document.getElementById('admin-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="admin-login">
                <div class="admin-login-card">
                    <h2>Admin Login</h2>
                    <p>Enter your credentials to access the dashboard</p>
                    <form id="adminLoginForm">
                        <div class="form-group">
                            <label for="username">Username</label>
                            <input type="text" id="username" placeholder="Enter username" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" placeholder="Enter password" required>
                        </div>
                        <button type="submit" class="btn btn-primary btn-full">Login</button>
                    </form>
                </div>
            </div>
        `;
        
        const form = document.getElementById('adminLoginForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === 'anuka123' && password === 'abazadze123') {
                localStorage.setItem('admin_auth', 'true');
                this.isLoggedIn = true;
                location.reload();
            } else {
                alert('Invalid credentials');
            }
        });
    }
    
    init() {
        this.loadData();
        this.renderDashboard();
        this.attachEvents();
    }
    
    loadData() {
        const savedBookings = localStorage.getItem('anuka_bookings');
        this.bookings = savedBookings ? JSON.parse(savedBookings) : [];
        
        const savedPortfolio = localStorage.getItem('anuka_portfolio');
        this.portfolio = savedPortfolio ? JSON.parse(savedPortfolio) : [];
        
        // Migration logic for default photos — full 48 photo set
        if (!localStorage.getItem('anuka_portfolio_migrated_v2')) {
            const unsplashIds = [
                '1542038784456-1ea8e935640e', '1511895426328-dc8714191300', '1492691527719-9d1e07e534b4', '1519741497674-611481863552',
                '1537633552985-df8429e8048b', '1494790108377-be9c29b29330', '1529156069898-49953e39b3ac', '1516541196182-6bdb0516ed27',
                '1507003211169-0a1dd7228f2d', '1544005313-94ddf0286df2', '1524504388940-b1c1722653e1', '1506794778202-cad84cf45f1d',

                '1534528741775-53994a69daeb', '1500917293891-ef795e70e1f6', '1531746020798-e6953c6e8e04', '1488426862026-3ee34a7d66fc',
                '1517841905240-472988babdf9', '1509967419530-da38b4704bc6', '1534308143481-c55f00be8ab7', '1520813792240-56fc4a3765a7',
                '1526080652727-5b77f74eacd2', '1543132220-4bf5292c5e01', '1494354145959-25cb82edf23d', '1530268729831-4b0b9e170218',

                '1515150144380-bca9f1650ed9', '1521119989659-a83eee488004', '1514315384763-ba401779410f', '1500048993953-d23a436266cf',
                '1499996860815-9b62c4d68b31', '1485206412256-701452f99a39', '1531750026848-8df0c3451b72', '1508214751196-bcfd4ca60f91',
                '1496440737103-cd596325d314', '1514860475877-4c079ee5eef5', '1491349174775-aaaf10fcb416', '1501196354995-cbb51c65aaea',

                '1493106819501-66d381c466f1', '1485893086445-ed75865251be', '1512413913371-b718814c8109', '1522075469751-3a6694fb2f61',
                '1492562080023-e114092b376c', '1526510747440-1eb24602f3ea', '1515372039744-b8f04ce4e462', '1512331283953-19967202267a',
                '1504199367644-cb8853b03f0b', '1517365830460-955ce3ccd263', '1503185912284-5271ff81b9a8', '1520975954732-57dd06d6d84a'
            ];
            const categories = ['portrait', 'wedding', 'commercial', 'editorial'];
            const titles = {
                portrait: ['Ethereal Light', 'Urban Soul', 'Golden Hour', 'Silent Story', 'Soft Gaze', 'Inner Glow', 'Natural Beauty', 'Shadow Play', 'Timeless Grace', 'Velvet Dream', 'Radiant Spirit', 'Pure Elegance'],
                wedding: ['Eternal Vows', 'Love in Mountains', 'First Dance', 'Wedding Bliss', 'Sacred Moment', 'Together Forever', 'Bridal Grace', 'Golden Ring', 'Chapel Light', 'Sunset Promise', 'Joyful Tears', 'Forever Yours'],
                commercial: ['Brand Story', 'Product Elegance', 'Studio Vision', 'Corporate Edge', 'Modern Style', 'Creative Flow', 'Design Focus', 'Visual Impact', 'Clean Lines', 'Bold Statement', 'Market Ready', 'Pro Showcase'],
                editorial: ['Georgia Unseen', 'Street Canvas', 'Urban Poetry', 'Raw Emotion', 'City Lights', 'Documentary Eye', 'Hidden Angles', 'Authentic Frame', 'Culture Lens', 'Visual Diary', 'Open Road', 'Untold Story']
            };
            const defaultPhotos = unsplashIds.map((id, index) => {
                const cat = categories[Math.floor(index / 12) % 4];
                const catIndex = index % 12;
                return {
                    id: 200 + index,
                    title: titles[cat][catIndex],
                    category: cat,
                    image: `https://images.unsplash.com/photo-${id}?w=1200&h=1600&fit=crop&q=80`,
                    date: new Date().toISOString()
                };
            });
            this.portfolio = [...defaultPhotos];
            localStorage.setItem('anuka_portfolio_migrated_v2', 'true');
            this.saveData();
        }
        
        const savedPackages = localStorage.getItem('anuka_packages');
        this.packages = savedPackages ? JSON.parse(savedPackages) : [];
        
        // Migration logic for default packages
        if (!localStorage.getItem('anuka_packages_migrated')) {
            const defaultPackages = [
                { id: 1, name: 'Essential', price: 850, discount: null, featured: false, features: ['2-hour session', '1 location', '30 digital images', 'Online gallery', 'Print release'] },
                { id: 2, name: 'Signature', price: 1500, discount: null, featured: true, features: ['4-hour session', '2 locations', '60 digital images', 'Online gallery + USB', '10 fine art prints'] },
                { id: 3, name: "Collector's", price: 2500, discount: null, featured: false, features: ['Full-day session', 'Multiple locations', '120+ digital images', 'Premium album included', 'Wall art credit'] }
            ];
            this.packages = [...defaultPackages, ...this.packages];
            localStorage.setItem('anuka_packages_migrated', 'true');
            this.saveData();
        }
    }
    
    saveData() {
        localStorage.setItem('anuka_bookings', JSON.stringify(this.bookings));
        localStorage.setItem('anuka_portfolio', JSON.stringify(this.portfolio));
        localStorage.setItem('anuka_packages', JSON.stringify(this.packages));
    }
    
    renderDashboard() {
        const container = document.getElementById('admin-container');
        if (!container) return;
        
        const pendingCount = this.bookings.filter(b => b.status === 'pending').length;
        const confirmedCount = this.bookings.filter(b => b.status === 'confirmed').length;
        const totalRevenue = this.bookings
            .filter(b => b.status === 'confirmed' || b.status === 'completed')
            .reduce((sum, b) => sum + (b.price || 0), 0);
        
        container.innerHTML = `
            <div class="admin-dashboard">
                <div class="admin-header">
                    <h1>Admin Dashboard</h1>
                    <div class="admin-header-actions">
                        <button id="logoutBtn" class="btn btn-secondary">Logout</button>
                    </div>
                </div>
                
                <div class="admin-stats">
                    <div class="stat-card">
                        <div class="stat-icon" style="color: var(--semantic-brand-primary);">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        </div>
                        <div class="stat-info">
                            <span class="stat-value">${this.bookings.length}</span>
                            <span class="stat-label">Total Bookings</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="color: #9CA3AF;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        </div>
                        <div class="stat-info">
                            <span class="stat-value">${pendingCount}</span>
                            <span class="stat-label">Pending</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="color: #10B981;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        </div>
                        <div class="stat-info">
                            <span class="stat-value">${confirmedCount}</span>
                            <span class="stat-label">Confirmed</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="color: #3B82F6;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        </div>
                        <div class="stat-info">
                            <span class="stat-value">GEL ${totalRevenue}</span>
                            <span class="stat-label">Revenue</span>
                        </div>
                    </div>
                </div>
                
                <div class="admin-tabs">
                    <button class="tab-btn active" data-tab="bookings">Bookings</button>
                    <button class="tab-btn" data-tab="gallery">Gallery</button>
                    <button class="tab-btn" data-tab="packages">Packages</button>
                    <button class="tab-btn" data-tab="seo">SEO Settings</button>
                </div>
                
                <div id="bookingsTab" class="admin-tab active">
                    <div class="table-container">
                        <table class="admin-table">
                            <thead>
                                <tr><th>ID</th><th>Date</th><th>Time</th><th>Service</th><th>Client</th><th>Amount</th><th>Status</th><th>Actions</th></tr>
                            </thead>
                            <tbody id="bookingsTableBody"></tbody>
                        </table>
                    </div>
                </div>
                
                <div id="galleryTab" class="admin-tab">
                    <div class="gallery-upload">
                        <h3>Add New Photo</h3>
                        <form id="uploadForm" class="upload-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="photoTitle">Photo Title</label>
                                    <input type="text" id="photoTitle" placeholder="e.g., Golden Hour Portrait" required>
                                </div>
                                <div class="form-group">
                                    <label for="photoCategory">Category</label>
                                    <select id="photoCategory">
                                        <option value="portrait">Portrait</option>
                                        <option value="wedding">Wedding</option>
                                        <option value="commercial">Commercial</option>
                                        <option value="editorial">Editorial</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="photoFile">Photo File</label>
                                <input type="file" id="photoFile" accept="image/*" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Upload Photo</button>
                        </form>
                    </div>
                    <div class="portfolio-grid" id="adminPortfolioGrid"></div>
                </div>
                
                <div id="packagesTab" class="admin-tab">
                    <div class="gallery-upload" style="margin-bottom: 2rem;">
                        <h3>Add / Edit Package</h3>
                        <form id="packageForm" class="upload-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Package Name</label>
                                    <input type="text" id="pkgName" placeholder="e.g., Essential" required>
                                </div>
                                <div class="form-group">
                                    <label>Base Price (GEL)</label>
                                    <input type="number" id="pkgPrice" placeholder="e.g., 850" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Discount Price (GEL) (Optional)</label>
                                    <input type="number" id="pkgDiscount" placeholder="e.g., 600">
                                </div>
                                <div class="form-group" style="flex-direction: row; align-items: center; gap: 1rem; margin-top: 2rem;">
                                    <input type="checkbox" id="pkgFeatured">
                                    <label for="pkgFeatured" style="margin: 0;">Make this Package Featured (Popular)</label>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Features (Comma separated)</label>
                                <textarea id="pkgFeatures" rows="3" placeholder="2-hour session, 1 location, 30 digital images..." required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Save Package</button>
                        </form>
                    </div>
                    <div class="portfolio-grid" id="adminPackagesGrid"></div>
                </div>
                
                <div id="seoTab" class="admin-tab">
                    <div class="seo-settings">
                        <h3>SEO Settings</h3>
                        <form id="seoForm">
                            <div class="form-group">
                                <label for="metaTitle">Meta Title</label>
                                <input type="text" id="metaTitle" placeholder="Site title for search engines">
                            </div>
                            <div class="form-group">
                                <label for="metaDescription">Meta Description</label>
                                <textarea id="metaDescription" rows="3" placeholder="Site description for search engines"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="metaKeywords">Meta Keywords</label>
                                <input type="text" id="metaKeywords" placeholder="Comma separated keywords">
                            </div>
                            <div class="form-group">
                                <label for="gaId">Google Analytics ID</label>
                                <input type="text" id="gaId" placeholder="G-XXXXXXXXXX">
                            </div>
                            <button type="submit" class="btn btn-primary">Save SEO Settings</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        this.renderBookings();
        this.renderPortfolio();
        this.renderPackages();
        this.loadSEOSettings();
        this.attachEvents();
    }
    
    renderBookings() {
        const tbody = document.getElementById('bookingsTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = this.bookings.map(booking => `
            <tr>
                <td>#${booking.id}</td>
                <td>${booking.date}</td>
                <td>${booking.time}</td>
                <td>${booking.service}</td>
                <td>
                    <strong>${booking.name}</strong><br>
                    <small>${booking.email}</small>
                </td>
                <td>GEL ${booking.price}</td>
                <td>
                    <select class="status-select" data-id="${booking.id}">
                        <option value="pending" ${booking.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="completed" ${booking.status === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td>
                    <button class="delete-booking" data-id="${booking.id}">Delete</button>
                </td>
            </tr>
        `).join('');
        
        // Status change handlers
        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const id = parseInt(select.dataset.id);
                const booking = this.bookings.find(b => b.id === id);
                if (booking) {
                    booking.status = select.value;
                    this.saveData();
                    this.renderBookings();
                }
            });
        });
        
        // Delete handlers
        document.querySelectorAll('.delete-booking').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.dataset.id);
                if (confirm('Delete this booking?')) {
                    this.bookings = this.bookings.filter(b => b.id !== id);
                    this.saveData();
                    this.renderBookings();
                }
            });
        });
    }
    
    renderPortfolio() {
        const grid = document.getElementById('adminPortfolioGrid');
        if (!grid) return;
        
        if (this.portfolio.length === 0) {
            grid.innerHTML = '<p class="no-items">No photos uploaded yet. Add your first photo above.</p>';
            return;
        }
        
        grid.innerHTML = this.portfolio.map((item, index) => `
            <div class="portfolio-item-admin">
                <img src="${item.image}" alt="${item.title}">
                <div class="info">
                    <h4>${item.title}</h4>
                    <p>${item.category}</p>
                </div>
                <button class="delete-portfolio" data-index="${index}">Delete</button>
            </div>
        `).join('');
        
        document.querySelectorAll('.delete-portfolio').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.dataset.index);
                if (confirm('Delete this photo?')) {
                    this.portfolio.splice(index, 1);
                    this.saveData();
                    this.renderPortfolio();
                }
            });
        });
    }
    
    loadSEOSettings() {
        let seo = JSON.parse(localStorage.getItem('anuka_seo') || '{}');
        
        if (!seo.metaTitle || seo.metaTitle === 'Anuka Abazadze | Premium Fine Art & Wedding Photographer in Kutaisi, Georgia' || seo.metaTitle === 'Anuka Abazadze | პროფესიონალი ფოტოგრაფი ქუთაისში') {
            seo = {
                metaTitle: 'Anuka Abazadze | Photographer in Kutaisi | ფოტოგრაფი | Фотограф',
                metaDescription: 'Professional Photographer in Kutaisi, Georgia. Wedding, portrait & commercial photography. ფოტოგრაფი ქუთაისი. Фотограф Грузия. Fotograf Kutaissi. 库塔伊西摄影师. Gürcistan fotoğrafçı.',
                metaKeywords: 'ფოტოგრაფი ქუთაისი, ქორწილის ფოტოგრაფი, ანუკა აბაზაძე, photographer in kutaisi, georgia wedding photographer, Фотограф в Кутаиси, Свадебный фотограф Грузия, 库塔伊西摄影师, 格鲁吉亚婚礼摄影, Fotograf in Kutaissi, Hochzeitsfotograf Georgien, Kutaisi fotoğrafçı, Gürcistan düğün fotoğrafçısı, photo studio kutaisi',
                gaId: seo.gaId || ''
            };
            localStorage.setItem('anuka_seo', JSON.stringify(seo));
        }
        
        document.getElementById('metaTitle').value = seo.metaTitle || '';
        document.getElementById('metaDescription').value = seo.metaDescription || '';
        document.getElementById('metaKeywords').value = seo.metaKeywords || '';
        document.getElementById('gaId').value = seo.gaId || '';
    }
    
    attachEvents() {
        // Tab switching
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                document.querySelectorAll('.admin-tab').forEach(content => {
                    content.classList.remove('active');
                });
                
                const tabId = `${tab.dataset.tab}Tab`;
                document.getElementById(tabId).classList.add('active');
            });
        });
        
        // Upload form
        const uploadForm = document.getElementById('uploadForm');
        if (uploadForm) {
            uploadForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.uploadPhoto();
            });
        }
        
        // Package form
        const packageForm = document.getElementById('packageForm');
        if (packageForm) {
            packageForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.uploadPackage();
            });
        }
        
        // SEO form
        const seoForm = document.getElementById('seoForm');
        if (seoForm) {
            seoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSEOSettings();
            });
        }
        
        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('admin_auth');
                location.reload();
            });
        }
    }
    
    renderPackages() {
        const grid = document.getElementById('adminPackagesGrid');
        if (!grid) return;
        
        if (this.packages.length === 0) {
            grid.innerHTML = '<p class="no-items">No packages yet. Add your first package above.</p>';
            return;
        }
        
        grid.innerHTML = this.packages.map((pkg, index) => `
            <div class="portfolio-item-admin" style="padding: 1.5rem; display: flex; flex-direction: column;">
                <div class="info" style="padding: 0; flex-grow: 1;">
                    <h4 style="margin-bottom: 0.5rem;">${pkg.name} ${pkg.featured ? '<span style="color:#D4AF37; font-size:10px; margin-left: 5px;">(★ Featured)</span>' : ''}</h4>
                    <p style="color: #fff; font-size: 1.25rem; margin-bottom: 1rem;">
                        ${pkg.discount ? `<del style="color: #EF4444; font-size: 0.85rem; margin-right: 0.5rem;">GEL ${pkg.price}</del> <span style="color: #D4AF37;">GEL ${pkg.discount}</span>` : `<span style="color: #D4AF37;">GEL ${pkg.price}</span>`}
                    </p>
                    <p style="font-size: 0.8rem; margin-bottom: 1.5rem; line-height: 1.5;">${pkg.features.join(', ')}</p>
                </div>
                <button class="delete-package delete-booking" style="width: 100%; margin: 0;" data-index="${index}">Delete Package</button>
            </div>
        `).join('');
        
        document.querySelectorAll('.delete-package').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.dataset.index);
                if (confirm('Delete this package?')) {
                    this.packages.splice(index, 1);
                    this.saveData();
                    this.renderPackages();
                }
            });
        });
    }

    uploadPackage() {
        const name = document.getElementById('pkgName').value;
        const price = parseInt(document.getElementById('pkgPrice').value);
        const discountVal = document.getElementById('pkgDiscount').value;
        const discount = discountVal ? parseInt(discountVal) : null;
        const featured = document.getElementById('pkgFeatured').checked;
        const featuresStr = document.getElementById('pkgFeatures').value;
        const features = featuresStr.split(',').map(f => f.trim()).filter(f => f);
        
        if (!name || isNaN(price) || features.length === 0) {
            alert('Please fill out all required fields correctly.');
            return;
        }
        
        const newPkg = {
            id: Date.now(),
            name: name,
            price: price,
            discount: discount,
            featured: featured,
            features: features
        };
        
        this.packages.push(newPkg);
        this.saveData();
        this.renderPackages();
        
        document.getElementById('packageForm').reset();
        alert('Package saved successfully!');
    }

    uploadPhoto() {
        const title = document.getElementById('photoTitle').value;
        const category = document.getElementById('photoCategory').value;
        const file = document.getElementById('photoFile').files[0];
        
        if (!title || !file) {
            alert('Please fill title and select an image');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const newItem = {
                id: Date.now(),
                title: title,
                category: category,
                image: e.target.result,
                date: new Date().toISOString()
            };
            this.portfolio.push(newItem);
            this.saveData();
            this.renderPortfolio();
            
            document.getElementById('photoTitle').value = '';
            document.getElementById('photoFile').value = '';
            
            alert('Photo uploaded successfully!');
        };
        reader.readAsDataURL(file);
    }
    
    saveSEOSettings() {
        const seoSettings = {
            metaTitle: document.getElementById('metaTitle').value,
            metaDescription: document.getElementById('metaDescription').value,
            metaKeywords: document.getElementById('metaKeywords').value,
            gaId: document.getElementById('gaId').value
        };
        localStorage.setItem('anuka_seo', JSON.stringify(seoSettings));
        alert('SEO settings saved successfully!');
    }
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('admin-container')) {
        new AdminPanel();
    }
});