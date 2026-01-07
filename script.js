// Portfolio Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    console.log('Ayomide Portfolio loaded successfully!');
    
    // ======================
    // 1. BASIC INITIALIZATION
    // ======================
    
    // Set current year in footer
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
    
    // ======================
    // 2. IMAGE LOADING & ERROR HANDLING
    // ======================
    
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Handle loading states
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.classList.remove('loading');
        });
        
        // Handle image errors
        img.addEventListener('error', function() {
            console.warn('Failed to load image:', this.src);
            this.classList.remove('loading');
            
            // Set appropriate placeholder based on image type
            if (this.id === 'profile-photo') {
                this.src = 'https://via.placeholder.com/320x320/3498db/ffffff?text=Ayomide+Orimogunje';
                this.alt = 'Profile Photo Placeholder';
            } else if (this.classList.contains('cert-preview-image')) {
                if (this.src.includes('bsc-cert-preview')) {
                    this.src = 'https://via.placeholder.com/400x180/2c3e50/ffffff?text=BSC+Certificate';
                } else if (this.src.includes('msc-cert-preview')) {
                    this.src = 'https://via.placeholder.com/400x180/3498db/ffffff?text=MSC+Certificate';
                }
            }
        });
        
        // Add loading class initially
        img.classList.add('loading');
    });
    
    // ======================
    // 3. CERTIFICATE FEATURES
    // ======================
    
    // Certificate download tracking
    const downloadLinks = document.querySelectorAll('.download-link');
    downloadLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const fileName = this.textContent.includes('BSc') ? 'BSc Certificate' : 'MSc Certificate';
            showNotification(`Starting download: ${fileName}`, 'info');
            
            // You can add analytics here
            console.log(`Download initiated: ${fileName}`);
        });
    });
    
    // Certificate preview image click to open PDF
    const certImages = document.querySelectorAll('.cert-preview-image');
    certImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            const link = this.closest('.cert-image-container').querySelector('.preview-btn');
            if (link) {
                link.click();
            }
        });
    });
    
    // ======================
    // 4. NAVIGATION & SCROLLING
    // ======================
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Calculate scroll position with navbar offset
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(targetId);
            }
        });
    });
    
    // Update active nav link on scroll
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.scrollY + 100;
            
            let currentSection = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    currentSection = section.id;
                }
            });
            
            if (currentSection) {
                updateActiveNavLink(`#${currentSection}`);
            }
        }, 100);
    });
    
    function updateActiveNavLink(targetId) {
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }
    
    // ======================
    // 6. SOCIAL LINKS
    // ======================
    
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add analytics tracking here if needed
            const platform = this.querySelector('i').classList.contains('fa-github') ? 'GitHub' :
                           this.querySelector('i').classList.contains('fa-linkedin') ? 'LinkedIn' : 'Email';
            console.log(`${platform} link clicked`);
        });
    });
    
    // ======================
    // 7. NOTIFICATION SYSTEM
    // ======================
    
    window.showNotification = function(message, type = 'success') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Icons for different notification types
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };
        
        notification.innerHTML = `
            <i class="fas ${icons[type] || icons.success}"></i>
            <span>${message}</span>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => notification.remove());
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    };
    
    // ======================
    // 8. MOBILE NAVIGATION
    // ======================
    
    function initMobileMenu() {
        const navbar = document.querySelector('.navbar');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!navbar || !navMenu) return;
        
        // Create hamburger menu for mobile
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger-menu';
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        
        hamburger.style.cssText = `
            display: none;
            background: none;
            border: none;
            color: #2c3e50;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
            z-index: 1001;
        `;
        
        navbar.querySelector('.nav-container').appendChild(hamburger);
        
        // Toggle menu
        hamburger.addEventListener('click', function() {
            const isOpen = navMenu.style.display === 'flex';
            navMenu.style.display = isOpen ? 'none' : 'flex';
            this.innerHTML = isOpen ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target) && window.innerWidth <= 768) {
                navMenu.style.display = 'none';
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
        
        // Handle window resize
        function handleResize() {
            if (window.innerWidth <= 768) {
                hamburger.style.display = 'block';
                navMenu.style.display = 'none';
                navMenu.style.cssText = `
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    flex-direction: column;
                    padding: 1rem;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                    z-index: 1000;
                `;
            } else {
                hamburger.style.display = 'none';
                navMenu.style.display = 'flex';
                navMenu.style.cssText = '';
            }
        }
        
        // Initial check and resize listener
        handleResize();
        window.addEventListener('resize', handleResize);
    }
    
    // Initialize mobile menu
    initMobileMenu();
    
    // ======================
    // 9. ACHIEVEMENTS ANIMATION
    // ======================
    
    const achievementItems = document.querySelectorAll('.achievement-item');
    achievementItems.forEach((item, index) => {
        // Staggered animation
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 100);
        
        // Click to highlight
        item.addEventListener('click', function() {
            const originalColor = this.style.backgroundColor;
            this.style.backgroundColor = '#e8f4fc';
            setTimeout(() => {
                this.style.backgroundColor = originalColor;
            }, 1000);
        });
    });
    
    // ======================
    // 10. ADDITIONAL STYLES
    // ======================
    
    const additionalStyles = document.createElement('style');
    additionalStyles.textContent = `
        /* Notification Styles */
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            color: #2c3e50;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 10000;
            transform: translateX(0);
            opacity: 1;
            transition: all 0.3s ease;
            max-width: 400px;
            border-left: 4px solid #2ecc71;
        }
        
        .notification-success {
            border-left-color: #2ecc71;
        }
        
        .notification-error {
            border-left-color: #e74c3c;
        }
        
        .notification-info {
            border-left-color: #3498db;
        }
        
        .notification i:first-child {
            font-size: 1.2rem;
        }
        
        .notification-success i:first-child {
            color: #2ecc71;
        }
        
        .notification-error i:first-child {
            color: #e74c3c;
        }
        
        .notification-info i:first-child {
            color: #3498db;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: #95a5a6;
            cursor: pointer;
            margin-left: auto;
            padding: 0;
            font-size: 0.9rem;
            transition: color 0.3s;
        }
        
        .notification-close:hover {
            color: #e74c3c;
        }
        
        /* Active navigation link */
        .nav-menu a.active {
            color: #3498db;
            font-weight: 600;
        }
        
        .nav-menu a.active::after {
            width: 100%;
        }
        
        /* Image loading animation */
        img.loading {
            opacity: 0.7;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
        }
        
        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        
        /* Achievement items initial state */
        .achievement-item {
            opacity: 0;
            transform: translateX(-20px);
            transition: all 0.5s ease;
        }
        
        /* Print styles */
        @media print {
            .navbar, .hero-buttons, .contact-form, .footer-social, .notification {
                display: none !important;
            }
            
            .hero {
                background: white !important;
                color: #2c3e50 !important;
                padding: 20px 0 !important;
            }
            
            .section {
                page-break-inside: avoid;
            }
            
            a {
                color: #2c3e50 !important;
                text-decoration: none;
            }
        }
    `;
    
    document.head.appendChild(additionalStyles);
    
    // ======================
    // 11. INITIAL SCROLL CHECK
    // ======================
    
    // Check initial scroll position
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 100);
    
    // ======================
    // 12. PERFORMANCE OPTIMIZATION
    // ======================
    
    // Debounce resize events
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Re-check active section on resize completion
            window.dispatchEvent(new Event('scroll'));
        }, 250);
    });
    
    // ======================
    // 13. ACCESSIBILITY FEATURES
    // ======================
    
    // Add keyboard navigation for certificates
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals or notifications
            const notification = document.querySelector('.notification');
            if (notification) {
                notification.remove();
            }
        }
    });
    
    // Focus management for better accessibility
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const firstFocusableElement = document.querySelectorAll(focusableElements)[0];
    const lastFocusableElement = document.querySelectorAll(focusableElements)[document.querySelectorAll(focusableElements).length - 1];
    
    // ======================
    // 14. ANALYTICS (Optional)
    // ======================
    
    // You can add Google Analytics or other tracking here
    /*
    window.addEventListener('load', function() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href
            });
        }
    });
    */
    
    console.log('All JavaScript features initialized successfully!');
});

// Export functions for global use (if needed)
window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showNotification('Failed to copy. Please copy manually.', 'error');
    });
};

// Update the initMobileMenu function:
function initMobileMenu() {
    const navbar = document.querySelector('.navbar');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navbar || !navMenu) return;
    
    // Create hamburger menu
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger-menu';
    hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    hamburger.style.cssText = 'display: none;';
    
    navbar.querySelector('.nav-container').appendChild(hamburger);
    
    // Toggle menu with better mobile support
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        this.innerHTML = navMenu.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    
    // Close menu when clicking links
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && window.innerWidth <= 768) {
            navMenu.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Handle window resize
    function handleResize() {
        if (window.innerWidth <= 768) {
            hamburger.style.display = 'block';
            if (!navMenu.classList.contains('active')) {
                navMenu.style.display = 'none';
            }
        } else {
            hamburger.style.display = 'none';
            navMenu.style.display = 'flex';
            navMenu.classList.remove('active');
        }
    }
    
    // Initial check
    handleResize();
    window.addEventListener('resize', handleResize);
}