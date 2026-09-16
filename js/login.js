document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let isCorrect = true;
    let emailFormat = /^[a-z0-9._%+\-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let emailError = document.getElementById("emailError");
    let passwordError = document.getElementById("passwordError");

    emailError.innerText = "";
    passwordError.innerText = "";

    if (email.trim() === "") {
        emailError.innerText = "Ju lutem plotesoni email-in.";
        isCorrect = false;
    } else if (!emailFormat.test(email)) {
        emailError.innerText = "Formati i email-it nuk eshte valid.";
        isCorrect = false;
    }

    if (password.trim() === "") {
        passwordError.innerText = "Ju lutem plotesoni fjalekalimin.";
        isCorrect = false;
    }

    if (isCorrect) {
        /* Ruaj sesionin ne localStorage */
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("userEmail", email);

        /* Nese nuk ka emer nga regjistrimi, perdor pjesen e email-it */
        if (!localStorage.getItem("userName")) {
            localStorage.setItem("userName", email.split("@")[0]);
        }

        window.location.href = "index.html";
    }
});

/* Shfaqja dhe fshehja e fjalekalimit */
document.querySelector(".toggle-password").addEventListener("click", function () {
    let input = document.getElementById("password");
    let isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    this.querySelector("i").className = isHidden
        ? "fa-solid fa-eye-slash"
        : "fa-solid fa-eye";
});
