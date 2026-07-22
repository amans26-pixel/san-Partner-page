// Minimal JS to activate reveal animations and basic interactions
document.addEventListener('DOMContentLoaded', function () {
  // Reveal all elements when they enter the viewport
  const reveals = Array.from(document.querySelectorAll('.reveal'));

  function revealOnScroll() {
    const windowHeight = window.innerHeight;
    reveals.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const offset = 80; // start revealing slightly before
      if (rect.top <= windowHeight - offset) {
        el.classList.add('active');
      }
    });
  }

  // Run once to show content that is already in view
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll, { passive: true });

  // Header scroll behavior
  const header = document.getElementById('header');
  function handleHeader() {
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  handleHeader();
  window.addEventListener('scroll', handleHeader, { passive: true });

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', function () {
      navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('open');
    });
  }

  // Simple partner form submission handler (client-side only)
  const partnerForm = document.getElementById('partnerForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');
  if (partnerForm && formSuccess && submitBtn) {
    partnerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      submitBtn.setAttribute('disabled', '');
      // show spinner (if any)
      const spinner = submitBtn.querySelector('.btn-spinner');
      const btnText = submitBtn.querySelector('.btn-text');
      if (spinner) spinner.classList.remove('hidden');
      if (btnText) btnText.classList.add('hidden');

      // simulate async submission
      setTimeout(function () {
        partnerForm.reset();
        if (spinner) spinner.classList.add('hidden');
        if (btnText) btnText.classList.remove('hidden');
        submitBtn.removeAttribute('disabled');
        formSuccess.classList.add('show');
      }, 900);
    });

    // Reset form state helper used by HTML button
    window.resetFormState = function () {
      formSuccess.classList.remove('show');
    };
  }
});

// Accessibility: close mobile menu when resizing to desktop
window.addEventListener('resize', function () {
  const navMenu = document.getElementById('navMenu');
  if (!navMenu) return;
  if (window.innerWidth > 900) navMenu.classList.remove('open');
});
