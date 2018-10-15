document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector(".navbar-burger");
    const menu   = document.querySelector("#nav-items");

    navbar.addEventListener("click", () => {
        navbar.classList.toggle("is-active");
        menu.classList.toggle("is-active");
    });

    const inputs = document.querySelectorAll("input");
    if (inputs.length > 0) {
        inputs.forEach(handleInputs);
    } else {
        console.log("There are no inputs :<");
    }
});

const handleInputs = input => {
    // Filter out inputs that are t text, password, number, etc.
    if (input.maxLength) {
        const label = document.querySelector(`label[for="${input.id}"`);
        const inputName = input.id
                               .capitalize()
                               .split("-")
                               .join(" ");
        
        input.addEventListener("input", e => {
            // If too many characters
            if (input.value.length == input.maxLength) {
                label.innerText = `${inputName} must be ${input.maxLength} characters or less`;
                input.classList.toggle("is-danger");
                input.classList.remove("is-success");
            } 
            // If too few characters
            else if (input.value.length == 0) {
                label.innerText = `${inputName} can't be empty`;
                input.classList.toggle("is-danger");
                input.classList.remove("is-success");
            }
            // Just right
            else {
                label.innerText = `${inputName}`;
                input.classList.remove("is-danger");
                input.classList.add("is-success");
            }
        });
    }
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}