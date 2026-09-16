/* Ngarkimi dinamik i komponenteve te riperdorshem */
function loadComponent(id, file) {
    fetch(file)
        .then(res => {
            if (!res.ok) throw new Error("Komponenti nuk u gjet: " + file);
            return res.text();
        })
        .then(html => {
            document.getElementById(id).innerHTML = html;

            /* Vendosja e vitit aktual ne footer */
            if (id === "footer") {
                const yearEl = document.getElementById("year");
                if (yearEl) yearEl.textContent = new Date().getFullYear();
            }

            /* Aktivizimi i navbares pas ngarkimit */
            if (id === "navbar") {
                initNavToggle();
                updateNavbar();
            }
        })
        .catch(err => console.error(err));
}

/* Menaxhimi i butonit hamburger per mobile */
function initNavToggle() {
    const toggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (!toggle || !navLinks) return;

    toggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        toggle.setAttribute("aria-expanded", isOpen);
    });
}

/* Perditeso navbar bazuar ne gjendjen e login-it */
function updateNavbar() {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    const userName = localStorage.getItem("userName") || "Profili";
    const navLinks = document.querySelector(".nav-links");

    if (!navLinks) return;

    /* Gjej li-ne me profile-icon ose krijo nje te ri */
    const profileLi = navLinks.querySelector("li:last-child");

    if (isLoggedIn) {
        profileLi.outerHTML = `
    <li class="nav-user-dropdown">
        <button class="nav-user-btn" title="Profili">
            <i class="fa-solid fa-circle-user"></i>
            <i class="fa-solid fa-chevron-down nav-chevron"></i>
        </button>
        <ul class="nav-user-menu">
            <li><a href="dashboard.html"><i class="fa-solid fa-gauge"></i> Dashboard</a></li>
            <li><a href="rezervime.html"><i class="fa-solid fa-calendar-check"></i> Rezervo</a></li>
            <li><a href="matje.html"><i class="fa-solid fa-ruler"></i> Matjet</a></li>
            <li class="divider"></li>
            <li><a href="#" onclick="logout(); return false;" class="logout-item">
                <i class="fa-solid fa-right-from-bracket"></i> Dil
            </a></li>
        </ul>
    </li>`;

        // Aktivizo dropdown-in
        const dropBtn = navLinks.querySelector(".nav-user-btn");
        const dropMenu = navLinks.querySelector(".nav-user-menu");
        dropBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            dropMenu.classList.toggle("open");
            dropBtn.classList.toggle("active");
        });
        document.addEventListener("click", () => {
            dropMenu.classList.remove("open");
            dropBtn.classList.remove("active");
        });

    } else {
        /* Sigurohu qe ikona e profilit te ridrejtoje ne login */
        const profileIcon = navLinks.querySelector(".profile-icon");
        if (profileIcon) {
            profileIcon.setAttribute("href", "login.html");
            profileIcon.setAttribute("title", "Kycu");
        }
    }
}

/* Funksioni i logout-it */
function logout() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userPackage");
    localStorage.removeItem("memberSince");
    localStorage.removeItem("rezervimet");
    window.location.href = "index.html";
}

loadComponent("navbar", "components/navbar.html");
loadComponent("footer", "components/footer.html");

const searchScript = document.createElement("script");
searchScript.src = "js/search.js";
document.body.appendChild(searchScript);
