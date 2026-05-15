window.initGallery = function initGallery() {
  const yearButtons = document.querySelectorAll('[data-year-filter]');
  const categoryButtons = document.querySelectorAll('[data-category-filter]');
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = document.querySelector('.lightbox img');
  const lightboxCaption = document.querySelector('.lightbox figcaption');
  const closeButton = document.querySelector('.lightbox-close');
  const prevButton = document.querySelector('.lightbox-prev');
  const nextButton = document.querySelector('.lightbox-next');

  if (!yearButtons.length || !categoryButtons.length || !items.length) {
    return;
  }

  let activeYear = 'all';
  let activeCategory = 'all';
  let visibleItems = Array.from(items);
  let currentIndex = 0;

  const applyFilter = function () {
    visibleItems = [];
    items.forEach(function (item) {
      const itemYear = item.getAttribute('data-year');
      const itemCategory = item.getAttribute('data-category');

      const yearPass = activeYear === 'all' || itemYear === activeYear;
      const categoryPass = activeCategory === 'all' || itemCategory === activeCategory;
      const show = yearPass && categoryPass;

      item.style.display = show ? '' : 'none';
      if (show) {
        visibleItems.push(item);
      }
    });
  };

  yearButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      yearButtons.forEach(function (btn) {
        btn.classList.remove('active');
      });
      button.classList.add('active');
      activeYear = button.getAttribute('data-year-filter');
      applyFilter();
    });
  });

  categoryButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      categoryButtons.forEach(function (btn) {
        btn.classList.remove('active');
      });
      button.classList.add('active');
      activeCategory = button.getAttribute('data-category-filter');
      applyFilter();
    });
  });

  const openLightbox = function (item) {
    if (!lightbox || !lightboxImage || !lightboxCaption) {
      return;
    }

    const image = item.querySelector('img');
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = item.getAttribute('data-caption') || image.alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    currentIndex = visibleItems.indexOf(item);
  };

  const closeLightbox = function () {
    if (!lightbox) {
      return;
    }
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  const shiftImage = function (direction) {
    if (!visibleItems.length) {
      return;
    }
    currentIndex = (currentIndex + direction + visibleItems.length) % visibleItems.length;
    openLightbox(visibleItems[currentIndex]);
  };

  items.forEach(function (item) {
    item.addEventListener('click', function () {
      openLightbox(item);
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeLightbox);
  }
  if (prevButton) {
    prevButton.addEventListener('click', function () {
      shiftImage(-1);
    });
  }
  if (nextButton) {
    nextButton.addEventListener('click', function () {
      shiftImage(1);
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', function (event) {
    if (!lightbox || !lightbox.classList.contains('open')) {
      return;
    }

    if (event.key === 'Escape') {
      closeLightbox();
    }
    if (event.key === 'ArrowRight') {
      shiftImage(1);
    }
    if (event.key === 'ArrowLeft') {
      shiftImage(-1);
    }
  });

  applyFilter();
};
