(function () {
    "use strict";

    /* TE gjitha faqet e website-it */
    const searchData = [
        { label: "Kreu", url: "index.html", icon: "fa-house" },
        { label: "Rreth Nesh", url: "about.html", icon: "fa-circle-info" },
        { label: "Paketat e Abonimit", url: "membership.html", icon: "fa-id-card" },
        { label: "Klasat", url: "classes.html", icon: "fa-dumbbell" },
        { label: "Cardio", url: "class-cardio.html", icon: "fa-heart-pulse" },
        { label: "Boxing", url: "class-boxing.html", icon: "fa-hand-fist" },
        { label: "Yoga", url: "class-yoga.html", icon: "fa-spa" },
        { label: "CrossFit", url: "class-crossfit.html", icon: "fa-fire" },
        { label: "Strength Training", url: "class-strength.html", icon: "fa-dumbbell" },
        { label: "Trajnerët", url: "trainers.html", icon: "fa-user-check" },
        { label: "BMI Calculator", url: "bmiCal.html", icon: "fa-weight-scale" },
        { label: "Kontakt", url: "contact.html", icon: "fa-envelope" },
        { label: "Regjistrohu", url: "register.html", icon: "fa-user-plus" },
        { label: "Kyçu", url: "login.html", icon: "fa-right-to-bracket" },
        { label: "Rezervimet", url: "rezervime.html", icon: "fa-calendar-check" },
        { label: "Matjet Antropometrike", url: "matje.html", icon: "fa-ruler" },
        { label: "Dashboard", url: "dashboard.html", icon: "fa-gauge" },
    ];

    /* Prit derisa navbar te ngarkohet nga loadComponents.js */
    const observer = new MutationObserver(function () {
        const input = document.getElementById("navSearch");
        const dropdown = document.getElementById("searchDropdown");
        if (!input || !dropdown) return;
        observer.disconnect();
        initSearch(input, dropdown);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function initSearch(input, dropdown) {

        /* Kerko ndersa shkruan */
        input.addEventListener("input", function () {
            const query = this.value.trim().toLowerCase();

            if (query.length < 1) {
                dropdown.classList.remove("open");
                dropdown.innerHTML = "";
                return;
            }

            const results = searchData.filter(function (item) {
                return item.label.toLowerCase().includes(query);
            });

            renderDropdown(results, dropdown, query);
        });

        /* Mbyll dropdown me klik jashtë */
        document.addEventListener("click", function (e) {
            if (!e.target.closest(".search-wrap")) {
                dropdown.classList.remove("open");
            }
        });

        /* Navigim me tastierë */
        input.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                const first = dropdown.querySelector(".search-result-item");
                if (first) window.location.href = first.getAttribute("href");
            }
            if (e.key === "Escape") {
                dropdown.classList.remove("open");
                input.value = "";
            }
        });
    }

    function renderDropdown(results, dropdown, query) {
        if (!results.length) {
            dropdown.innerHTML = "<p class='search-no-result'>Nuk u gjet asgjë për \"" + query + "\".</p>";
            dropdown.classList.add("open");
            return;
        }

        /* Thekso termin e kerkuar me bold+ngjyre */
        dropdown.innerHTML = results.slice(0, 7).map(function (r) {
            const highlighted = r.label.replace(
                new RegExp("(" + escapeRegex(query) + ")", "gi"),
                "<strong style='color:rgb(0,188,212)'>$1</strong>"
            );
            return "<a href='" + r.url + "' class='search-result-item'>" +
                "<i class='fa-solid " + r.icon + "'></i>" +
                "<span>" + highlighted + "</span>" +
                "</a>";
        }).join("");

        dropdown.classList.add("open");
    }

    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

})();