/**
 * SAN Softwares Partner Landing Page Logic
 * Interactive UI components, animations, and form validation
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check for print parameter to bypass animations for screenshot/pdf print generation
    if (window.location.search.includes('print=true')) {
        document.body.classList.add('print-mode');
        // Force active on all reveals
        setTimeout(() => {
            document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
            document.querySelectorAll('.timeline-step').forEach(el => el.classList.add('active'));
            const progressBar = document.getElementById('timelineProgress');
            if (progressBar) progressBar.style.width = '100%';
            // Set stats targets immediately
            document.querySelectorAll('.stat-number').forEach(stat => {
                stat.textContent = stat.getAttribute('data-target') + (stat.getAttribute('data-target') === '99.9' ? '%' : '+');
            });
        }, 100);
    }

    initStickyHeader();
    initMobileMenu();
    initScrollReveal();
    initFAQAccordion();
    initStatsCounter();
    initTimelineAnimation();
    initFormValidation();
});

/* --- 1. Sticky Header & Floating CTA Scroll Effects --- */
function initStickyHeader() {
    const header = document.getElementById('header');
    const floatingCta = document.getElementById('floatingCta');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function handleScroll() {
        const scrollY = window.scrollY;

        // Sticky Header toggle
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Floating CTA toggle
        if (scrollY > 400) {
            floatingCta.classList.add('show');
        } else {
            floatingCta.classList.remove('show');
        }

        // Active Link highlighting on scroll
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger initial run in case page is refreshed mid-scroll
}

/* --- 2. Mobile Menu Toggle --- */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const toggleIcon = mobileToggle.querySelector('i');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Toggle icon visual states
        if (navMenu.classList.contains('active')) {
            toggleIcon.className = 'fa-solid fa-xmark';
        } else {
            toggleIcon.className = 'fa-solid fa-bars';
        }
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            toggleIcon.className = 'fa-solid fa-bars';
        });
    });
}

/* --- 3. Scroll Reveal Animations (using Intersection Observer) --- */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // trigger when 10% of element is in view
        rootMargin: '0px 0px -50px 0px' // slightly trigger before it fully hits screen center
    });

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });
}

/* --- 4. FAQ Accordion Interaction --- */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Toggle selected item
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

/* --- 5. Statistics Counter Animation --- */
function initStatsCounter() {
    const statsGrid = document.querySelector('.stats-grid');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    if (!statsGrid) return;

    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !animated) {
            animated = true;
            statNumbers.forEach(stat => {
                const target = parseFloat(stat.getAttribute('data-target'));
                const duration = 2000; // 2 seconds animation
                const startTime = performance.now();
                const isFloat = target % 1 !== 0;

                function updateCount(currentTime) {
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);
                    
                    // Easing function (easeOutQuad)
                    const easeProgress = progress * (2 - progress);
                    
                    let currentValue = easeProgress * target;
                    
                    if (isFloat) {
                        stat.textContent = currentValue.toFixed(1) + '%';
                    } else {
                        stat.textContent = Math.floor(currentValue) + '+';
                    }

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        // Ensure final value is exact
                        stat.textContent = target + (isFloat ? '%' : '+');
                    }
                }
                
                requestAnimationFrame(updateCount);
            });
        }
    }, { threshold: 0.3 });

    statsObserver.observe(statsGrid);
}

/* --- 6. Onboarding Timeline Viewport Animation --- */
function initTimelineAnimation() {
    const timeline = document.querySelector('.timeline-container');
    const steps = document.querySelectorAll('.timeline-step');
    const progressBar = document.getElementById('timelineProgress');
    let animated = false;

    if (!timeline) return;

    const timelineObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !animated) {
            animated = true;
            let currentStepIdx = 0;

            function animateNextStep() {
                if (currentStepIdx < steps.length) {
                    steps[currentStepIdx].classList.add('active');
                    
                    // Calculate progress percentage
                    const isMobile = window.innerWidth <= 768;
                    const percent = ((currentStepIdx) / (steps.length - 1)) * 100;
                    
                    if (isMobile) {
                        progressBar.style.height = `${percent}%`;
                        progressBar.style.width = '100%';
                    } else {
                        progressBar.style.width = `${percent}%`;
                        progressBar.style.height = '100%';
                    }

                    currentStepIdx++;
                    setTimeout(animateNextStep, 550); // delay before next step activates
                }
            }

            // Start timeline cascading animation
            animateNextStep();
        }
    }, { threshold: 0.4 });

    timelineObserver.observe(timeline);

    // Re-calculate on resize (for timeline progress direction adjustment)
    window.addEventListener('resize', () => {
        if (animated) {
            const activeSteps = document.querySelectorAll('.timeline-step.active');
            const percent = ((activeSteps.length - 1) / (steps.length - 1)) * 100;
            if (window.innerWidth <= 768) {
                progressBar.style.height = `${percent}%`;
                progressBar.style.width = '100%';
            } else {
                progressBar.style.width = `${percent}%`;
                progressBar.style.height = '100%';
            }
        }
    });
}

/* --- 7. Partnership Dropdown Selection Helpers --- */
window.selectPartnerType = function(partnerType) {
    const select = document.getElementById('partnerType');
    if (select) {
        select.value = partnerType;
        // Trigger manual change check to clear errors if needed
        select.dispatchEvent(new Event('change'));
    }
    
    // Smooth scroll to form
    const formSec = document.getElementById('register');
    if (formSec) {
        formSec.scrollIntoView({ behavior: 'smooth' });
    }
};

window.setDiscussionMode = function() {
    // Select Referral as a placeholder or partner Type
    window.selectPartnerType('Referral');
    
    // Autofill details in message
    const msg = document.getElementById('message');
    if (msg) {
        msg.value = "Hello SAN Team, I would like to schedule a partner discussion to explore synergies between our organizations.";
        msg.focus();
    }
};

/* --- 8. Registration Form Validation & Submission --- */
function initFormValidation() {
    const form = document.getElementById('partnerForm');
    const successOverlay = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');

    if (!form) return;

    // Remove error class on input modification
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const group = input.closest('.form-group');
            if (group) group.classList.remove('has-error');
        });
        input.addEventListener('change', () => {
            const group = input.closest('.form-group');
            if (group) group.classList.remove('has-error');
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;

        // 1. Text Field Validations
        const requiredInputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        requiredInputs.forEach(input => {
            const group = input.closest('.form-group');
            let isFieldValid = true;

            // Specific Email Validation
            if (input.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value.trim())) {
                    isFieldValid = false;
                }
            } 
            // Specific Website URL Validation
            else if (input.type === 'url') {
                const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
                if (!urlRegex.test(input.value.trim())) {
                    isFieldValid = false;
                }
            }
            // Checkbox Validation
            else if (input.type === 'checkbox') {
                if (!input.checked) {
                    isFieldValid = false;
                }
            }
            // Standard Text Field check
            else {
                if (input.value.trim() === '') {
                    isFieldValid = false;
                }
            }

            if (!isFieldValid) {
                isValid = false;
                if (group) group.classList.add('has-error');
            } else {
                if (group) group.classList.remove('has-error');
            }
        });

        // 2. Perform submission if valid
        if (isValid) {
            // Disable button, show loading spinner
            submitBtn.disabled = true;
            btnText.classList.add('hidden');
            btnSpinner.classList.remove('hidden');

            // Simulate server network latency (1.5 seconds)
            setTimeout(() => {
                // Hide spinner
                submitBtn.disabled = false;
                btnText.classList.remove('hidden');
                btnSpinner.classList.add('hidden');

                // Show success overlay modal
                successOverlay.classList.add('show');
            }, 1500);
        } else {
            // Scroll to the first error input
            const firstError = form.querySelector('.has-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // Handle Newsletter submission in footer
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            if (input.value.trim() !== '') {
                alert(`Thank you! '${input.value}' has been successfully subscribed to our partner updates newsletter.`);
                input.value = '';
            }
        });
    }
}

// Reset form fields and overlay state
window.resetFormState = function() {
    const form = document.getElementById('partnerForm');
    const successOverlay = document.getElementById('formSuccess');
    if (form) {
        form.reset();
        // Remove error highlights
        const groups = form.querySelectorAll('.form-group');
        groups.forEach(group => group.classList.remove('has-error'));
    }
    if (successOverlay) {
        successOverlay.classList.remove('show');
    }
};
