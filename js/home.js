/* Personalizimi i hero seksionit bazuar ne gjendjen e login-it */
(function () {

    const isLoggedIn = localStorage.getItem("loggedIn") === "true";

    const firstName = localStorage.getItem("userEmri") || "";
    const userPkg = localStorage.getItem("userPackage") || "";

    if (!isLoggedIn) return;

    /* HERO UPDATE */
    const heroTitle = document.getElementById("heroTitle");
    const heroSubtitle = document.getElementById("heroSubtitle");
    const heroButtons = document.getElementById("heroButtons");

    if (heroTitle) {
        heroTitle.textContent = "Mirë se erdhe, " + firstName + "!";
    }

    if (heroSubtitle) {
        heroSubtitle.textContent =
            "Vazhdo rrugëtimin tënd. Ti je në rrugën e duhur.";
    }

    if (heroButtons) {
        heroButtons.innerHTML = `
            <a href="dashboard.html" class="btn">Dashboard im</a>

            <a href="rezervime.html" class="btn btn-outline">
                <i class="fa-solid fa-calendar-check"></i>
                Rezervo klasë
            </a>
        `;
    }

    /* WELCOME BAR */
    const bar = document.getElementById("userWelcomeBar");

    if (bar) {
        bar.style.display = "block";

        const welcomeMsg = document.getElementById("welcomeMsg");

        let pkgLabel = userPkg
            ? " · Paketa: <strong>" + userPkg + "</strong>"
            : "";

        if (welcomeMsg) {
            welcomeMsg.innerHTML =
                "<i class='fa-solid fa-circle-user'></i> " +
                firstName +
                pkgLabel;
        }
    }

})();