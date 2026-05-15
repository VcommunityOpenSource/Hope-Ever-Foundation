window.initCounters = function initCounters() {
  const counters = document.querySelectorAll('[data-counter-target]');
  if (!counters.length) {
    return;
  }

  const animateCounter = function (counter) {
    const target = Number(counter.getAttribute('data-counter-target'));
    const duration = 1300;
    const start = performance.now();

    const step = function (timestamp) {
      const progress = Math.min((timestamp - start) / duration, 1);
      const value = Math.floor(progress * target);
      counter.textContent = value.toLocaleString('en-IN');

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        const suffix = counter.getAttribute('data-counter-suffix') || '';
        counter.textContent = target.toLocaleString('en-IN') + suffix;
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.45 }
  );

  counters.forEach(function (counter) {
    observer.observe(counter);
  });
};
