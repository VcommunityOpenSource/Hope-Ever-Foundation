window.initContactForm = function initContactForm() {
  const form = document.querySelector('#contact-form');
  const feedback = document.querySelector('#form-feedback');
  if (!form || !feedback) {
    return;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = form.querySelector('[name="fullName"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !message) {
      feedback.textContent = 'Please fill in Full Name, Email, and Message before submitting.';
      feedback.className = 'error';
      return;
    }

    feedback.textContent = 'Thank you. Your message has been recorded. We will connect with you shortly.';
    feedback.className = 'success';
    form.reset();
  });
};
