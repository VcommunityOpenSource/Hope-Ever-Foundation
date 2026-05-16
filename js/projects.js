const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(button => {

  button.addEventListener("click", () => {

    document
      .querySelector(".filter-btn.active")
      .classList.remove("active");

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