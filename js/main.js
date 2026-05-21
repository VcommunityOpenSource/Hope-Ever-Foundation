(function () {
  async function injectComponent(selector, filePath) {
    const placeholder = document.querySelector(selector);
    if (!placeholder) {
      return;
    }

    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error('Failed to load component: ' + filePath);
      }
      placeholder.innerHTML = await response.text();
    } catch (error) {
      placeholder.innerHTML = '';
      console.error(error);
    }
  }

  function normalizeRelativeUrls(scope, prefix) {
    if (!scope || !prefix) {
      return;
    }

    const nodes = scope.querySelectorAll('[href], [src]');
    nodes.forEach(function (node) {
      ['href', 'src'].forEach(function (attr) {
        const value = node.getAttribute(attr);
        if (!value) {
          return;
        }

        const isExternal =
          value.startsWith('http') ||
          value.startsWith('mailto:') ||
          value.startsWith('tel:') ||
          value.startsWith('#') ||
          value.startsWith('../') ||
          value.startsWith('./');

        if (!isExternal) {
          node.setAttribute(attr, prefix + value);
        }
      });
    });
  }

  function initModules() {
    if (typeof window.initNavbar === 'function') {
      window.initNavbar();
    }
    if (typeof window.initHeroSlider === 'function') {
      window.initHeroSlider();
    }
    if (typeof window.initCounters === 'function') {
      window.initCounters();
    }
    if (typeof window.initProjectFilters === 'function') {
      window.initProjectFilters();
    }
    if (typeof window.initGallery === 'function') {
      window.initGallery();
    }
    if (typeof window.initContactForm === 'function') {
      window.initContactForm();
    }
    if (typeof window.initScrollReveal === 'function') {
      window.initScrollReveal();
    }
  }

  document.addEventListener('DOMContentLoaded', async function () {
    const inProjectSubdir = window.location.pathname.indexOf('/projects/') !== -1;
    const basePath = inProjectSubdir ? '../' : '';

    await Promise.all([
      injectComponent('#navbar-placeholder', basePath + 'components/navbar.html'),
      injectComponent('#footer-placeholder', basePath + 'components/footer.html')
    ]);

    if (inProjectSubdir) {
      normalizeRelativeUrls(document.querySelector('#navbar-placeholder'), '../');
      normalizeRelativeUrls(document.querySelector('#footer-placeholder'), '../');
    }

    initModules();
  });
})();

// ============================================
// HERO IMAGE SLIDER
// ============================================
window.initHeroSlider = function() {
    const slider = document.getElementById('hero-slider');
    if (!slider) return;

    const images = slider.querySelectorAll('img');
    if (images.length <= 1) return;

    let currentIndex = 0;
    
    // Change image every 5 seconds
    setInterval(() => {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
    }, 5000);
};

// ============================================
// FLOATING BACK TO TOP BUTTON - Global Component
// ============================================
(function() {
    // Create button element
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-top-btn';
    scrollBtn.id = 'scrollTopBtn';
    scrollBtn.setAttribute('aria-label', 'Back to top');
    scrollBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M18 15l-6-6-6 6"/>
        </svg>
    `;
    
    // Add to page
    document.body.appendChild(scrollBtn);
    
    // Show/hide based on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
})();