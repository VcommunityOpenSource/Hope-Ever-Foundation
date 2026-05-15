window.initProjectFilters = function initProjectFilters() {
  const filterButtons = document.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('[data-sector]');
  if (!filterButtons.length || !cards.length) {
    return;
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const selected = button.getAttribute('data-filter');

      filterButtons.forEach(function (btn) {
        btn.classList.remove('active');
      });
      button.classList.add('active');

      cards.forEach(function (card) {
        const sectors = (card.getAttribute('data-sector') || '').split(',');
        const shouldShow = selected === 'all' || sectors.includes(selected);
        card.style.display = shouldShow ? '' : 'none';
      });
    });
  });
};
