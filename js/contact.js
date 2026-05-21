window.initContactForm = function initContactForm() {
  const form = document.querySelector('#contact-form');
  const feedback = document.querySelector('#form-feedback');
  if (!form || !feedback) {
    return;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !message) {
      feedback.textContent = 'Please fill in Name, Email, and Message before submitting.';
      feedback.className = 'error';
      return;
    }

    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    feedback.textContent = "Sending your message...";
    feedback.className = "";

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: json
    })
    .then(async (response) => {
      feedback.textContent = "Thank you! Your message has been sent successfully.";
      feedback.className = 'success';
      form.reset();
    })
    .catch(error => {
      feedback.textContent = "Oops! Something went wrong. Please try again later.";
      feedback.className = 'error';
    });
  });
};
