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
// GOOGLE TRANSLATE WIDGET
// ============================================
(function() {
    function injectTranslateWidget() {
        const navWrap = document.querySelector('.nav-wrap');
        if (!navWrap) return;

        // Create translate container
        const translateWrapper = document.createElement('div');
        translateWrapper.className = 'translate-widget-wrapper';
        translateWrapper.innerHTML = '<div id="google_translate_element" class="google-translate-element"></div>';

        // Insert after the brand element
        const brand = navWrap.querySelector('.brand');
        if (brand) {
            brand.insertAdjacentElement('afterend', translateWrapper);
        } else {
            // Fallback: prepend to nav-wrap
            navWrap.insertBefore(translateWrapper, navWrap.firstChild);
        }
    }

    // Define the Google Translate init callback BEFORE the script loads
    window.googleTranslateElementInit = function() {
        new google.translate.TranslateElement(
            {
                pageLanguage: 'en',
                includedLanguages: 'ta,en',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
            },
            'google_translate_element'
        );
    };

    // Inject the widget container and load the Google Translate script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            injectTranslateWidget();
            const script = document.createElement('script');
            script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.body.appendChild(script);
        });
    } else {
        injectTranslateWidget();
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
    }
})();

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
