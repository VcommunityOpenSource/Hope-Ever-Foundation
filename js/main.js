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
