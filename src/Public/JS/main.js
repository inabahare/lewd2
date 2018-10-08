document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector(".navbar-burger");
    const menu   = document.querySelector("#nav-items");

    navbar.addEventListener("click", () => {
        navbar.classList.toggle("is-active");
        menu.classList.toggle("is-active");
    });
});