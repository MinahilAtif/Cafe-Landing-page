/**
 * AURA CAFÉ & BISTRO - JAVASCRIPT
 * Features:
 * 1. Sticky Navbar & Scroll Shadow
 * 2. Responsive Mobile Drawer Navigation
 * 3. Menu Category Filter Tabs
 * 4. IntersectionObserver Scroll Reveal Animations
 * 5. Interactive Form Validation with Inline Feedback & Simulated Submission
 * 6. Dynamic Year in Footer
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. STICKY NAVBAR & SCROLL SHADOW
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  const handleNavScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // Run on initial load and on scroll
  handleNavScroll();
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // Highlight active link according to scroll position
  const highlightActiveNavLink = () => {
    const scrollY = window.pageYOffset + 120; // Offset for header

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightActiveNavLink, { passive: true });


  /* ==========================================================================
     2. MOBILE DRAWER NAVIGATION
     ========================================================================== */
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  const toggleMobileMenu = () => {
    const isOpen = menuToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const closeMobileMenu = () => {
    menuToggle.classList.remove('open');
    navMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking any nav item or CTA button
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close when clicking outside of mobile drawer
    document.addEventListener('click', (event) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMobileMenu();
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }


  /* ==========================================================================
     3. MENU CATEGORY FILTER TABS
     ========================================================================== */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active tab styling & accessibility attributes
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const selectedCategory = btn.getAttribute('data-category');

      // Filter cards with smooth display
      menuCards.forEach(card => {
        const itemCategory = card.getAttribute('data-category');

        if (selectedCategory === 'all' || itemCategory === selectedCategory) {
          card.style.display = 'block';
          // Trigger slight fade-in re-render
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });


  /* ==========================================================================
     4. INTERSECTION OBSERVER SCROLL REVEAL ANIMATIONS
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target); // Reveal once
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Graceful fallback for older browsers
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }


  /* ==========================================================================
     5. RESERVATION FORM VALIDATION & INTERACTIVE SUBMISSION
     ========================================================================== */
  const resForm = document.getElementById('reservationForm');
  const resDateInput = document.getElementById('resDate');
  const successBanner = document.getElementById('reservationSuccess');
  const successDetails = document.getElementById('successDetails');
  const closeSuccessBanner = document.getElementById('closeSuccessBanner');
  const submitBtn = document.getElementById('submitBtn');

  // Set minimum date to today so past dates cannot be picked
  if (resDateInput) {
    const today = new Date().toISOString().split('T')[0];
    resDateInput.min = today;
  }

  // Form input field references
  const formFields = {
    name: {
      input: document.getElementById('resName'),
      error: document.getElementById('nameError'),
      validate: (val) => val.trim().length >= 2 ? '' : 'Please enter your full name (at least 2 characters).'
    },
    email: {
      input: document.getElementById('resEmail'),
      error: document.getElementById('emailError'),
      validate: (val) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!val.trim()) return 'Email address is required.';
        if (!emailRegex.test(val.trim())) return 'Please enter a valid email address.';
        return '';
      }
    },
    phone: {
      input: document.getElementById('resPhone'),
      error: document.getElementById('phoneError'),
      validate: (val) => {
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (!val.trim()) return 'Phone number is required.';
        if (!phoneRegex.test(val.trim().replace(/\s+/g, ''))) {
          return 'Please enter a valid phone number (e.g. 555-019-2834).';
        }
        return '';
      }
    },
    guests: {
      input: document.getElementById('resGuests'),
      error: document.getElementById('guestsError'),
      validate: (val) => val ? '' : 'Please select the number of guests in your party.'
    },
    date: {
      input: document.getElementById('resDate'),
      error: document.getElementById('dateError'),
      validate: (val) => {
        if (!val) return 'Please choose a reservation date.';
        const selected = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected < today) return 'Reservation date cannot be in the past.';
        return '';
      }
    },
    time: {
      input: document.getElementById('resTime'),
      error: document.getElementById('timeError'),
      validate: (val) => val ? '' : 'Please choose a preferred dining time slot.'
    }
  };

  // Helper to display error message
  const showError = (fieldKey, msg) => {
    const { input, error } = formFields[fieldKey];
    if (input && error) {
      input.classList.add('is-invalid');
      error.textContent = msg;
    }
  };

  // Helper to clear error message
  const clearError = (fieldKey) => {
    const { input, error } = formFields[fieldKey];
    if (input && error) {
      input.classList.remove('is-invalid');
      error.textContent = '';
    }
  };

  // Real-time validation listeners on input/change
  Object.keys(formFields).forEach(key => {
    const { input, validate } = formFields[key];
    if (!input) return;

    input.addEventListener('input', () => {
      const errorMsg = validate(input.value);
      if (!errorMsg) {
        clearError(key);
      }
    });

    input.addEventListener('blur', () => {
      const errorMsg = validate(input.value);
      if (errorMsg) {
        showError(key, errorMsg);
      } else {
        clearError(key);
      }
    });
  });

  // Handle Close Success Banner
  if (closeSuccessBanner && successBanner) {
    closeSuccessBanner.addEventListener('click', () => {
      successBanner.hidden = true;
    });
  }

  // Handle Form Submission
  if (resForm) {
    resForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isFormValid = true;
      let firstInvalidInput = null;

      // Validate each field
      Object.keys(formFields).forEach(key => {
        const { input, validate } = formFields[key];
        const errorMsg = validate(input.value);

        if (errorMsg) {
          showError(key, errorMsg);
          isFormValid = false;
          if (!firstInvalidInput) {
            firstInvalidInput = input;
          }
        } else {
          clearError(key);
        }
      });

      // If invalid, focus the first invalid input
      if (!isFormValid) {
        if (firstInvalidInput) {
          firstInvalidInput.focus();
        }
        return;
      }

      // Collect values for simulated confirmation summary
      const guestName = formFields.name.input.value.trim();
      const guestEmail = formFields.email.input.value.trim();
      const partySize = formFields.guests.input.value;
      const resDate = formFields.date.input.value;
      const resTime = formFields.time.input.value;
      const seatingPref = document.getElementById('resSeating')?.value || 'Standard';

      // Format human-friendly date
      const dateObj = new Date(resDate + 'T00:00:00');
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      // Simulate loading state on submit button
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        // Show feedback banner with personalized details
        if (successBanner && successDetails) {
          successDetails.innerHTML = `
            Thank you, <strong>${escapeHtml(guestName)}</strong>! Your table for 
            <strong>${partySize} guest(s)</strong> (${escapeHtml(seatingPref)}) has been reserved for 
            <strong>${formattedDate} at ${resTime}</strong>. A confirmation email was sent to 
            <strong>${escapeHtml(guestEmail)}</strong>.
          `;
          successBanner.hidden = false;

          // Smooth scroll to the success feedback banner
          successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Reset form fields
        resForm.reset();

        // Reset min date
        if (resDateInput) {
          resDateInput.min = new Date().toISOString().split('T')[0];
        }
      }, 700);
    });
  }

  // Security helper to escape HTML inside dynamic success message
  function escapeHtml(string) {
    const div = document.createElement('div');
    div.textContent = string;
    return div.innerHTML;
  }


  /* ==========================================================================
     6. DYNAMIC CURRENT YEAR IN FOOTER
     ========================================================================== */
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

});
