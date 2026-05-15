window.initScrollReveal = function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) {
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach(function (element) {
    observer.observe(element);
  });
};
