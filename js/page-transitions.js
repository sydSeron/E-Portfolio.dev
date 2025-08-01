document.addEventListener('DOMContentLoaded', function() {
    // Add loaded class for initial fade in
    document.body.classList.add('loaded');
    
    // Handle navigation links with fade transitions
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only apply transition for internal links
            if (href && !href.startsWith('http') && !href.startsWith('#')) {
                e.preventDefault();
                
                // Add fade out effect
                document.body.classList.remove('loaded');
                document.body.classList.add('fade-out');
                
                // Navigate after a shorter delay to match CSS transition
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    });
    
    // Also handle the CTA buttons and View All Projects button
    const internalLinks = document.querySelectorAll('a[href$=".html"]');
    internalLinks.forEach(link => {
        if (!link.classList.contains('nav-link')) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href && !href.startsWith('http')) {
                    e.preventDefault();
                    
                    document.body.classList.remove('loaded');
                    document.body.classList.add('fade-out');
                    
                    setTimeout(() => {
                        window.location.href = href;
                    }, 300);
                }
            });
        }
    });
});

// Handle browser back/forward buttons
window.addEventListener('pageshow', function(event) {
    document.body.classList.remove('fade-out');
    document.body.classList.add('loaded');
});