// Configuration
const API_BASE_URL = 'http://localhost:8001/api'; // Ajuste conforme necessário

// Pricing data (matches backend EBOOK_PACKAGES structure)
const pricingPlans = {
    starter: {
        name: 'STARTER',
        maxEmployees: 50,
        pricePerEmployee: 15,
        features: [
            'Acesso básico ao app',
            'Chat com Dr. Ana (10 sessões/mês)',
            'Dashboard administrativo',
            'Relatórios mensais',
            'Suporte por email'
        ]
    },
    business: {
        name: 'BUSINESS',
        maxEmployees: 200,
        pricePerEmployee: 12,
        features: [
            'Tudo do Starter +',
            'Chat ilimitado com Dr. Ana',
            'Exercícios personalizados',
            'Relatórios detalhados',
            'Suporte prioritário',
            'Integração básica'
        ]
    },
    enterprise: {
        name: 'ENTERPRISE',
        maxEmployees: 999999,
        pricePerEmployee: 8,
        features: [
            'Tudo do Business +',
            'Dashboard executivo',
            'Integração completa',
            'Treinamentos para gestores',
            'Webinars mensais',
            'Account manager dedicado',
            'SLA garantido'
        ]
    }
};

// State management
let selectedPlan = null;
let calculatedEmployeeCount = 0;
let purchasePlan = null;

// Utility functions
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatNumber(value) {
    return new Intl.NumberFormat('pt-BR').format(value);
}

function getRecommendedPlan(employees) {
    if (employees <= 50) return pricingPlans.starter;
    if (employees <= 200) return pricingPlans.business;
    return pricingPlans.enterprise;
}

function calculatePrice(plan, employees) {
    const monthlyPrice = plan.pricePerEmployee * employees;
    const annualPrice = monthlyPrice * 12 * 0.8; // 20% discount
    return { monthlyPrice, annualPrice };
}

// Calculator functionality
function calculatePrice() {
    const employeeInput = document.getElementById('employees');
    const employeeCount = parseInt(employeeInput.value);
    
    if (!employeeCount || employeeCount < 1) {
        hideCalculatorResult();
        return;
    }
    
    calculatedEmployeeCount = employeeCount;
    const recommendedPlan = getRecommendedPlan(employeeCount);
    const { monthlyPrice, annualPrice } = calculatePrice(recommendedPlan, employeeCount);
    
    // Update UI
    document.getElementById('recommended-plan').textContent = recommendedPlan.name;
    document.getElementById('monthly-total').textContent = formatNumber(monthlyPrice);
    document.getElementById('annual-total').textContent = formatNumber(annualPrice);
    
    // Show result
    document.getElementById('calculator-result').classList.remove('hidden');
    
    // Store for later use
    selectedPlan = recommendedPlan;
}

function hideCalculatorResult() {
    document.getElementById('calculator-result').classList.add('hidden');
    selectedPlan = null;
}

function selectCalculatedPlan() {
    if (selectedPlan) {
        openQuoteModal();
        // Pre-fill employee count
        document.getElementById('company-size').value = calculatedEmployeeCount;
        updateSelectedPlanInfo();
    }
}

// Navigation functions
function scrollToCalculator() {
    document.querySelector('.calculator-section').scrollIntoView({
        behavior: 'smooth'
    });
}

// Plan selection
function selectPlan(planKey) {
    selectedPlan = pricingPlans[planKey];
    openQuoteModal();
    updateSelectedPlanInfo();
}

function updateSelectedPlanInfo() {
    if (selectedPlan) {
        document.getElementById('selected-plan-name').textContent = selectedPlan.name;
        document.getElementById('selected-plan-info').classList.remove('hidden');
    } else {
        document.getElementById('selected-plan-info').classList.add('hidden');
    }
}

// Modal functions
function openQuoteModal() {
    document.getElementById('quote-modal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeQuoteModal() {
    document.getElementById('quote-modal').classList.remove('show');
    document.body.style.overflow = 'auto';
    resetQuoteForm();
}

function openSuccessModal() {
    document.getElementById('success-modal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
    document.getElementById('success-modal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function resetQuoteForm() {
    document.getElementById('quote-form').reset();
    selectedPlan = null;
    updateSelectedPlanInfo();
}

// Purchase modal functions
function buyPlan(planKey) {
    purchasePlan = pricingPlans[planKey];
    openPurchaseModal();
    updatePurchaseModal();
}

function openPurchaseModal() {
    document.getElementById('purchase-modal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closePurchaseModal() {
    document.getElementById('purchase-modal').classList.remove('show');
    document.body.style.overflow = 'auto';
    resetPurchaseForm();
}

function resetPurchaseForm() {
    document.getElementById('purchase-form').reset();
    purchasePlan = null;
}

function updatePurchaseModal() {
    if (!purchasePlan) return;
    
    // Update plan info
    document.getElementById('purchase-plan-name').textContent = purchasePlan.name;
    document.getElementById('purchase-plan-details').textContent = 
        `Para até ${purchasePlan.maxEmployees === 999999 ? '∞' : purchasePlan.maxEmployees} funcionários`;
    
    // Update pricing display
    document.getElementById('selected-plan-display').textContent = purchasePlan.name;
    document.getElementById('price-per-employee-display').textContent = 
        `R$ ${purchasePlan.pricePerEmployee}/mês`;
    
    // Update employee count listener
    const employeesInput = document.getElementById('purchase-employees');
    employeesInput.addEventListener('input', updatePurchasePricing);
    
    // Initial pricing update
    updatePurchasePricing();
}

function updatePurchasePricing() {
    if (!purchasePlan) return;
    
    const employeesInput = document.getElementById('purchase-employees');
    const employees = parseInt(employeesInput.value) || 0;
    
    const { monthlyPrice, annualPrice } = calculatePrice(purchasePlan, employees);
    
    document.getElementById('employees-display').textContent = employees.toString();
    document.getElementById('total-monthly-display').textContent = 
        `R$ ${monthlyPrice.toLocaleString('pt-BR')}`;
    document.getElementById('total-annual-display').textContent = 
        `R$ ${annualPrice.toLocaleString('pt-BR')}`;
}

// Corporate checkout submission
async function submitCorporateCheckout(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/corporate/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                company: formData.get('company'),
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                employees: parseInt(formData.get('employees')),
                plan: purchasePlan.name.toLowerCase(),
                origin_url: window.location.origin
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to create checkout');
        }
    } catch (error) {
        console.error('Corporate checkout error:', error);
        throw error;
    }
}

// Form submission
async function submitQuoteRequest(formData) {
    try {
        // In a real implementation, this would call your backend API
        const response = await fetch(`${API_BASE_URL}/corporate/quote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                company: formData.get('company'),
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                employees: parseInt(formData.get('company-size')),
                message: formData.get('message'),
                selectedPlan: selectedPlan?.name || 'Not specified',
                source: 'corporate_website'
            })
        });
        
        if (response.ok) {
            return { success: true };
        } else {
            throw new Error('Failed to submit quote request');
        }
    } catch (error) {
        console.error('Quote submission error:', error);
        
        // For demo purposes, simulate success after 1 second
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 1000);
        });
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Quote form submission
    document.getElementById('quote-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.classList.add('loading');
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        
        try {
            const formData = new FormData(this);
            const result = await submitQuoteRequest(formData);
            
            if (result.success) {
                closeQuoteModal();
                openSuccessModal();
                
                // Track conversion (if you have analytics)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'conversion', {
                        'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
                        'value': calculatedEmployeeCount * (selectedPlan?.pricePerEmployee || 12),
                        'currency': 'BRL'
                    });
                }
            }
        } catch (error) {
            alert('Erro ao enviar solicitação. Tente novamente ou entre em contato conosco.');
        } finally {
            // Reset button state
            submitButton.classList.remove('loading');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
    
    // Close modal when clicking outside
    document.getElementById('quote-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeQuoteModal();
        }
    });
    
    document.getElementById('success-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeSuccessModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeQuoteModal();
            closeSuccessModal();
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form validation enhancements
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function() {
        const email = this.value;
        if (email && !email.includes('@')) {
            this.setCustomValidity('Por favor, insira um email válido');
        } else if (email && !email.includes('.')) {
            this.setCustomValidity('Por favor, insira um email válido');  
        } else {
            this.setCustomValidity('');
        }
    });
    
    // Phone formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value.length >= 11) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        } else if (value.length >= 7) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
        } else if (value.length >= 1) {
            value = value.replace(/^(\d{0,2})/, '($1');
        }
        this.value = value;
    });
    
    // Employee count validation
    const companySizeInput = document.getElementById('company-size');
    companySizeInput.addEventListener('input', function() {
        const value = parseInt(this.value);
        if (value && value > 0) {
            const plan = getRecommendedPlan(value);
            selectedPlan = plan;
            updateSelectedPlanInfo();
        }
    });
});

// Analytics and tracking functions
function trackEvent(eventName, parameters = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, parameters);
    }
    
    console.log('Event tracked:', eventName, parameters);
}

// Track page interactions
document.addEventListener('DOMContentLoaded', function() {
    // Track calculator usage
    document.getElementById('employees').addEventListener('change', function() {
        trackEvent('calculator_used', {
            employee_count: this.value
        });
    });
    
    // Track plan selections
    window.selectPlan = function(planKey) {
        trackEvent('plan_selected', {
            plan_name: planKey
        });
        selectedPlan = pricingPlans[planKey];
        openQuoteModal();
        updateSelectedPlanInfo();
    };
    
    // Track quote modal opens
    window.openQuoteModal = function() {
        trackEvent('quote_modal_opened');
        document.getElementById('quote-modal').classList.add('show');
        document.body.style.overflow = 'hidden';
    };
});

// Expose functions to global scope for inline event handlers
window.calculatePrice = calculatePrice;
window.scrollToCalculator = scrollToCalculator;
window.selectPlan = selectPlan;
window.selectCalculatedPlan = selectCalculatedPlan;
window.openQuoteModal = openQuoteModal;
window.closeQuoteModal = closeQuoteModal;
window.openSuccessModal = openSuccessModal;
window.closeSuccessModal = closeSuccessModal;

// Performance optimization
document.addEventListener('DOMContentLoaded', function() {
    // Lazy load images if any
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
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

console.log('🚀 Corporate website loaded successfully!');