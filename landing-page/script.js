// Analytics and Event Tracking
function trackDownload(platform) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'app_download_click', {
            'platform': platform,
            'source': 'landing_page'
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'InitiateCheckout', {
            'content_name': 'MindCare App Download',
            'content_category': 'App',
            'platform': platform
        });
    }
    
    console.log(`Download tracked: ${platform}`);
    
    // Here you would redirect to the actual store URLs
    if (platform === 'ios') {
        window.open('https://apps.apple.com/app/mindcare', '_blank');
    } else if (platform === 'android') {
        window.open('https://play.google.com/store/apps/details?id=com.mindcare', '_blank');
    }
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 DOM loaded, initializing navigation...');
    
    // Handle navigation clicks
    const navLinks = document.querySelectorAll('a[href^="#"]');
    console.log('🔗 Found navigation links:', navLinks.length);
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Track navigation
                if (typeof trackEvent === 'function') {
                    trackEvent('navigation_click', {
                        'section': targetId.replace('#', ''),
                        'source': 'header_nav'
                    });
                }
            } else {
                console.warn('Target section not found:', targetId);
            }
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe sections for animations
    const sections = document.querySelectorAll('.features, .benefits, .testimonials, .how-it-works');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Animate feature cards on scroll
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        observer.observe(card);
        
        // Stagger animation
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Animate testimonials
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, index) => {
        observer.observe(card);
        card.style.animationDelay = `${index * 0.15}s`;
    });
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            // Track milestone scrolls
            if (maxScroll === 25 || maxScroll === 50 || maxScroll === 75 || maxScroll === 100) {
                trackEvent('scroll_depth', {
                    'percent': maxScroll
                });
            }
        }
    });
});

// Feature interaction tracking
function trackFeatureClick(featureName) {
    trackEvent('feature_interest', {
        'feature_name': featureName
    });
}

// General event tracking function
function trackEvent(eventName, parameters = {}) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('trackCustom', eventName, parameters);
    }
    
    console.log('Event tracked:', eventName, parameters);
}

// Newsletter signup (if you add one)
function subscribeNewsletter(email) {
    trackEvent('newsletter_signup', {
        'method': 'landing_page'
    });
    
    // Here you would send to your email service
    console.log('Newsletter signup:', email);
}

// Mobile menu toggle (if you add hamburger menu)
function toggleMobileMenu() {
    const menu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (menu && hamburger) {
        menu.classList.toggle('active');
        hamburger.classList.toggle('active');
    }
}

// FAQ toggle (if you add FAQ section)
function toggleFAQ(element) {
    const faqItem = element.closest('.faq-item');
    const answer = faqItem.querySelector('.faq-answer');
    
    faqItem.classList.toggle('active');
    
    if (faqItem.classList.contains('active')) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
    } else {
        answer.style.maxHeight = '0';
    }
}

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
});

// Performance monitoring
window.addEventListener('load', function() {
    // Track page load time
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    
    trackEvent('page_performance', {
        'load_time': Math.round(loadTime / 1000), // Convert to seconds
        'page': 'landing'
    });
});

// Cookie consent (if needed)
function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    document.getElementById('cookie-banner')?.classList.add('hidden');
    
    trackEvent('cookies_accepted');
}

// Share functionality
function shareApp(platform) {
    const url = window.location.href;
    const text = 'Transforme sua saúde mental com o MindCare - App gratuito com IA terapêutica!';
    
    let shareUrl = '';
    
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        trackEvent('social_share', {
            'platform': platform,
            'content_type': 'landing_page'
        });
    }
}

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add to home screen prompt (PWA-like)
let deferredPrompt;

window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show custom install button
    const installButton = document.getElementById('install-app-btn');
    if (installButton) {
        installButton.style.display = 'block';
        
        installButton.addEventListener('click', function() {
            deferredPrompt.prompt();
            
            deferredPrompt.userChoice.then(function(choiceResult) {
                if (choiceResult.outcome === 'accepted') {
                    trackEvent('pwa_install', {
                        'method': 'banner'
                    });
                }
                deferredPrompt = null;
            });
        });
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    // Track errors (only in production)
    if (location.hostname !== 'localhost') {
        trackEvent('javascript_error', {
            'message': e.message,
            'filename': e.filename,
            'lineno': e.lineno
        });
    }
});

// Keyboard navigation improvements
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// A/B Testing helper (if needed)
function getVariant() {
    const variants = ['A', 'B'];
    const storedVariant = localStorage.getItem('abTestVariant');
    
    if (storedVariant) {
        return storedVariant;
    }
    
    const variant = variants[Math.floor(Math.random() * variants.length)];
    localStorage.setItem('abTestVariant', variant);
    
    trackEvent('ab_test_assigned', {
        'variant': variant
    });
    
    return variant;
}

// Initialize A/B test on page load
document.addEventListener('DOMContentLoaded', function() {
    const variant = getVariant();
    document.body.classList.add(`variant-${variant.toLowerCase()}`);
});

// Service Worker registration (for offline functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
                trackEvent('service_worker_registered');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}

// Exit intent detection
document.addEventListener('mouseleave', function(e) {
    if (e.clientY <= 0) {
        // User is about to leave - show exit intent
        trackEvent('exit_intent');
        
        // You could show a modal here
        console.log('Exit intent detected');
    }
});

// Page visibility API
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
        trackEvent('page_hidden');
    } else if (document.visibilityState === 'visible') {
        trackEvent('page_visible');
    }
});

console.log('🚀 MindCare Landing Page loaded successfully!');