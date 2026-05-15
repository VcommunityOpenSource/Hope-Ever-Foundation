window.initNavbar = function initNavbar() {
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.primary-nav');
  const toggle = document.querySelector('.nav-toggle');
  const currentPage = document.body.getAttribute('data-page');

  if (!header || !nav || !toggle) {
    return;
  }

  const navLinks = nav.querySelectorAll('a[data-nav]');
  navLinks.forEach(function (link) {
    if (link.getAttribute('data-nav') === currentPage) {
      link.classList.add('active');
    }

    link.addEventListener('click', function () {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  toggle.addEventListener('click', function () {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });

  const setScrollState = function () {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };

  setScrollState();
  window.addEventListener('scroll', setScrollState);

  const backToTopButton = document.querySelector('.back-to-top');
  if (backToTopButton) {
    backToTopButton.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};
