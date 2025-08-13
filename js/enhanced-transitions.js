class PageTransitions {
    constructor() {
        this.init();
    }

    init() {
        // Add loading bar on page load
        this.showLoadingBar();
        
        // Initialize page entrance animation
        this.initPageEntrance();
        
        // Handle navigation clicks
        this.handleNavigation();
        
        // Add scroll animations
        this.initScrollAnimations();
        
        // Add enhanced hover effects
        this.addHoverEffects();
    }

    showLoadingBar() {
        const loadingBar = document.createElement('div');
        loadingBar.className = 'page-loading';
        document.body.appendChild(loadingBar);
        
        setTimeout(() => {
            if (loadingBar.parentNode) {
                loadingBar.remove();
            }
        }, 1000);
    }

    initPageEntrance() {
        // Trigger entrance animation after DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            document.body.classList.add('page-transition');
            
            // Stagger animations for content sections
            const sections = document.querySelectorAll('main section');
            sections.forEach((section, index) => {
                setTimeout(() => {
                    section.classList.add('fade-in');
                }, index * 100);
            });

            // Initialize intersection observer for scroll animations
            this.observeElements();
        });
    }

    handleNavigation() {
        // Add smooth transitions to navigation links
        const navLinks = document.querySelectorAll('.nav-link, .button[href]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Skip if it's an external link, email, tel, or anchor
                if (!href || 
                    href.startsWith('http') || 
                    href.startsWith('mailto') || 
                    href.startsWith('tel') || 
                    href.includes('#') ||
                    href === window.location.pathname) {
                    return;
                }
                
                e.preventDefault();
                this.navigateToPage(href);
            });
        });
    }

    navigateToPage(url) {
        // Add exit animation
        document.body.classList.add('page-exit');
        
        // Show loading bar
        this.showLoadingBar();
        
        // Navigate after animation completes
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }

    initScrollAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        const animatedElements = document.querySelectorAll('.project-card, .skill-item, .contact-item');
        animatedElements.forEach(el => {
            if (!el.style.animationPlayState) {
                el.style.animationPlayState = 'paused';
            }
            observer.observe(el);
        });
    }

    observeElements() {
        // Intersection Observer for revealing elements on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        // Observe all cards and sections
        const elements = document.querySelectorAll('.project-card, .skill-item, .contact-item, .hero, .projects-intro, .contact-intro');
        elements.forEach(el => observer.observe(el));
    }

    addHoverEffects() {
        // Enhanced button hover effects
        const buttons = document.querySelectorAll('.button, .project-link');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Card hover animations
        const cards = document.querySelectorAll('.project-card, .skill-item');
        cards.forEach(card => {
            const originalTransform = card.style.transform;
            
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = originalTransform || 'translateY(0) scale(1)';
            });
        });
    }

    // Utility method for smooth scrolling to sections
    static scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Initialize page transitions when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PageTransitions();
    });
} else {
    new PageTransitions();
}

// Add typing animation for hero text (if on index page)
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '/portfolio/' || window.location.pathname === '/portfolio/src/') {
        const heroDescription = document.querySelector('.hero-description');
        if (heroDescription) {
            const text = heroDescription.textContent;
            heroDescription.textContent = '';
            heroDescription.style.opacity = '1';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    heroDescription.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 30);
                }
            };
            
            setTimeout(typeWriter, 1500);
        }
    }
});

// Export for use in other scripts
window.PageTransitions = PageTransitions;
