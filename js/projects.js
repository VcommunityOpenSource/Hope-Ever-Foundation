window.initProjectFilters = function initProjectFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  if (!filterButtons.length || !projectCards.length) {
    return;
  }

  filterButtons.forEach(button => {

    button.addEventListener("click", () => {

      const activeButton = document.querySelector(".filter-btn.active");
      if (activeButton) {
        activeButton.classList.remove("active");
      }

      button.classList.add("active");

      const filter = button.getAttribute("data-filter");

      projectCards.forEach(card => {

        if (
          filter === "all" ||
          card.getAttribute("data-category") === filter
        ) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }

      });

    });

  });

  projectCards.forEach(card => {
    const cardLink = card.querySelector("a[href]");

    if (!cardLink) {
      return;
    }

    // Makes the whole card act like its existing project link without changing routes.
    card.setAttribute("role", "link");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", cardLink.textContent.trim());

    card.addEventListener("click", event => {
      if (event.target.closest("a")) {
        return;
      }

      window.location.href = cardLink.href;
    });

    card.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      window.location.href = cardLink.href;
    });
  });
};
