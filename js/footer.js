/* VITI PERDITESOHET AUTOMATIKISHT */
document.getElementById("year").textContent = new Date().getFullYear();

/* HIQET ZONA E ANETARIT NESE NUK JE I LOGUAR */
(function () {

    const memberLinks = document.getElementById("footerMemberLinks");

    if (memberLinks && localStorage.getItem("loggedIn") !== "true") {
        memberLinks.style.display = "none";
    }

})();