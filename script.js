/* ==========================================
   CONSTRUCCIONES ÁNGEL – JavaScript
   ========================================== */

'use strict';

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
const heroBg = document.getElementById('hero-bg');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  handleBackToTop();
}, { passive: true });

// ---- Hero parallax removed (image is fixed) ----

// ---- Hero image load animation ----
window.addEventListener('load', () => {
  if (heroBg) heroBg.classList.add('loaded');
});

// ---- Mobile hamburger menu ----
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

// Close menu when a link is clicked
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

// ---- Scroll Reveal (IntersectionObserver) ----
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger: delay based on index within parent
      const siblings = Array.from(entry.target.parentElement.children).filter(
        el => el.classList.contains('reveal-up') || el.classList.contains('reveal-left') || el.classList.contains('reveal-right')
      );
      const idx = siblings.indexOf(entry.target);
      const delay = Math.min(idx * 100, 400);
      setTimeout(() => {
        entry.target.classList.add('revealed');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ---- Animated counters ----
function animateCounter(el, target, duration = 1800) {
  const isFloat = target % 1 !== 0;
  let start = 0;
  const step = (timestamp) => {
    if (start === 0) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = target * ease;
    el.textContent = isFloat ? value.toFixed(1) : Math.floor(value);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = isFloat ? target.toFixed(1) : target.toString();
  };
  requestAnimationFrame(step);
}

const statsSection = document.getElementById('stats');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseFloat(el.dataset.target);
        animateCounter(el, target);
      });
    }
  });
}, { threshold: 0.4 });

if (statsSection) statsObserver.observe(statsSection);

// ---- Portfolio Lightbox ----
const portfolioItems = document.querySelectorAll('.portfolio-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

if (lightbox && lightboxImg && lightboxClose) {
  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightbox.classList.add('show');
      }
    });
  });

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('show');
  });

  // Close when clicking outside the image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('show');
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('show')) {
      lightbox.classList.remove('show');
    }
  });
}

// Add fade-in keyframe dynamically
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`;
document.head.appendChild(style);

// ---- Contact form ----
const form = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

form.addEventListener('submit', (e) => {
  e.preventDefault(); // Stop native submission to avoid redirect

  const nameInput = document.getElementById('form-name');
  const phoneInput = document.getElementById('form-phone');
  const messageInput = document.getElementById('form-message');
  
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const message = messageInput.value.trim();

  if (!name || !phone || !message) {
    // Highlight empty required fields
    [nameInput, phoneInput, messageInput].forEach(el => {
      if (!el.value.trim()) {
        el.style.borderColor = '#e05252';
        el.addEventListener('input', () => { el.style.borderColor = ''; }, { once: true });
      }
    });
    return;
  }

  const submitBtn = document.getElementById('form-submit');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  const formData = new FormData(form);
  
  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      formSuccess.style.display = 'block';
      formSuccess.className = 'form-success'; // Reset class
      formSuccess.innerHTML = '<span>✅</span> ¡Mensaje enviado con éxito! Te contactaremos pronto.';
      form.reset();
      
      setTimeout(() => {
        formSuccess.style.display = 'none';
      }, 8000);
    } else {
      throw new Error(data.message || 'Error en el envío');
    }
  })
  .catch(error => {
    formSuccess.style.display = 'block';
    formSuccess.className = 'form-error'; // Switch to error styling
    formSuccess.innerHTML = '<span>❌</span> Ups! Hubo un problema. Por favor, llámanos directamente.';
    console.error(error);
  })
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar solicitud';
  });
});

// ---- Back to top ----
const backToTopBtn = document.getElementById('back-to-top');

function handleBackToTop() {
  if (window.scrollY > 500) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- Smooth active nav link highlight ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');

window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollPos >= top && scrollPos < bottom) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${section.id}`) {
          link.style.color = 'var(--gold)';
        }
      });
    }
  });
}, { passive: true });

// ---- Floating buttons entrance ----
setTimeout(() => {
  // WhatsApp (Right)
  const whatsappBtn = document.getElementById('whatsapp-float');
  if (whatsappBtn) {
    whatsappBtn.style.animation = 'slideInRight 0.5s ease forwards';
    const s = document.createElement('style');
    s.textContent = `@keyframes slideInRight { from { transform: translateX(80px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
    document.head.appendChild(s);
  }

  // Habitissimo (Left)
  const habitissimoBtn = document.getElementById('habitissimo-float');
  if (habitissimoBtn) {
    habitissimoBtn.style.animation = 'slideInLeft 0.5s ease forwards';
    const s2 = document.createElement('style');
    s2.textContent = `@keyframes slideInLeft { from { transform: translateX(-80px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
    document.head.appendChild(s2);
  }
}, 1500);

// ---- Testimonials Slider Controls ----
const testTrack = document.getElementById('testimonials-track');
const testPrev = document.getElementById('test-prev');
const testNext = document.getElementById('test-next');

if (testTrack && testNext && testPrev) {
  // Approximate scroll distance (card width + gap)
  const scrollAmount = 400; 
  
  testPrev.addEventListener('click', () => {
    testTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  testNext.addEventListener('click', () => {
    testTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
}

console.log('✅ Construcciones Ángel — Web cargada correctamente.');

