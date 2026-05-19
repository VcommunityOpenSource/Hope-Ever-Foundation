// map.js – Pin-based interactive map

document.addEventListener('DOMContentLoaded', function() {
  const pins = document.querySelectorAll('.pin');
  const chips = document.querySelectorAll('.district-list .chip');
  const tooltip = document.getElementById('tooltip');
  const tipBg = document.getElementById('tip-bg');
  const tipText = document.getElementById('tip-text');

  if (!pins.length || !chips.length) return;

  function showTooltip(pin) {
    const cx = parseFloat(pin.getAttribute('cx'));
    const cy = parseFloat(pin.getAttribute('cy'));
    const name = pin.getAttribute('data-name');
    if (!tipText || !tipBg || !tooltip) return;

    tipText.setAttribute('x', cx);
    tipText.setAttribute('y', cy - 14);
    tipText.textContent = name;
    const len = name.length * 6.5 + 16;
    tipBg.setAttribute('x', cx - len / 2);
    tipBg.setAttribute('y', cy - 28);
    tipBg.setAttribute('width', len);
    tipBg.setAttribute('height', 18);
    tooltip.style.display = 'block';
    pin.setAttribute('r', '9');
    pin.setAttribute('fill', '#d4872a');
  }

  function resetPin(pin) {
    pin.setAttribute('r', '6');
    pin.setAttribute('fill', '#0f6e56');
    if (tooltip) tooltip.style.display = 'none';
  }

  // Pin hover events
  pins.forEach(pin => {
    pin.style.cursor = 'pointer';
    pin.addEventListener('mouseenter', () => showTooltip(pin));
    pin.addEventListener('mouseleave', () => resetPin(pin));
  });

  // Chip click events
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const name = chip.getAttribute('data-name');
      const pin = document.querySelector(`.pin[data-name="${name}"]`);
      if (!pin) return;

      // Remove active class from all chips
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      // Reset all pins
      pins.forEach(p => resetPin(p));
      showTooltip(pin);

      // Auto-hide after 1.8 seconds
      setTimeout(() => {
        resetPin(pin);
        chips.forEach(c => c.classList.remove('active'));
      }, 1800);
    });
  });
});