// Validimi i formes se kontaktit
document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let isCorrect = true;

    // Formati i email-it
    let emailFormat = /^[a-z0-9._%+\-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    // Merr vlerat
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let subject = document.getElementById("subject").value;
    let message = document.getElementById("message").value;

    // Mesazhet e gabimeve
    let nameError = document.getElementById("nameError");
    let emailError = document.getElementById("emailError");
    let subjectError = document.getElementById("subjectError");
    let messageError = document.getElementById("messageError");

    // Pastro gabimet e vjetra
    nameError.innerText = "";
    emailError.innerText = "";
    subjectError.innerText = "";
    messageError.innerText = "";

    // Kontrolle
    if (name.trim() === "") {
        nameError.innerText = "Ju lutem plotesoni emrin.";
        isCorrect = false;
    }

    if (email.trim() === "") {
        emailError.innerText = "Ju lutem plotesoni email-in.";
        isCorrect = false;
    } else if (!emailFormat.test(email)) {
        emailError.innerText = "Formati i email-it nuk eshte valid.";
        isCorrect = false;
    }

    if (subject.trim() === "") {
        subjectError.innerText = "Ju lutem plotesoni subjektin.";
        isCorrect = false;
    }

    if (message.trim() === "") {
        messageError.innerText = "Ju lutem plotesoni mesazhin.";
        isCorrect = false;
    } else if (message.trim().length < 10) {
        messageError.innerText = "Mesazhi duhet te kete te pakten 10 karaktere.";
        isCorrect = false;
    }

    // Success
    if (isCorrect) {
        alert("Mesazhi u dergua me sukses!");
        document.getElementById("contactForm").reset();
    }
});