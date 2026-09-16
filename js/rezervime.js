(function () {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";

    if (isLoggedIn) {
        document.getElementById("rezContent").style.display = "block";
        document.getElementById("rezLoginWall").style.display = "none";
        initTabs();
        initKlasaForm();
        initPersonaleForm();
        renderAllList();
        updateBadge();
    } else {
        document.getElementById("rezContent").style.display = "none";
        document.getElementById("rezLoginWall").style.display = "block";
    }

    /* TABS */
    function initTabs() {
        document.querySelectorAll(".rez-tab").forEach(function (btn) {
            btn.addEventListener("click", function () {
                document.querySelectorAll(".rez-tab").forEach(function (b) { b.classList.remove("active"); });
                document.querySelectorAll(".tab-panel").forEach(function (p) { p.classList.remove("active"); });
                this.classList.add("active");
                document.getElementById("tab-" + this.dataset.tab).classList.add("active");
                if (this.dataset.tab === "lista") renderAllList();
            });
        });
    }

    /* PERSONAL DATA */
    ["dataKlasa", "dataPersonale"].forEach(function (id) {
        const el = document.getElementById(id);
        if (el) el.setAttribute("min", new Date().toISOString().split("T")[0]);
    });

    /* FORM 1: CLASS */
    function initKlasaForm() {
        document.getElementById("rezervoKlasaForm").addEventListener("submit", function (e) {
            e.preventDefault();

            const klasa = document.getElementById("klasa").value;
            const instruktor = document.getElementById("instruktor").value;
            const data = document.getElementById("dataKlasa").value;
            const ora = document.getElementById("oraKlasa").value;
            const shenime = document.getElementById("shenimeKlasa").value;

            clearErrors(["klasaErr", "instruktorErr", "dataKlasaErr", "oraKlasaErr"]);

            let valid = true;
            if (!klasa) { setErr("klasaErr", "Zgjidh klasën."); valid = false; }
            if (!instruktor) { setErr("instruktorErr", "Zgjidh instruktotin."); valid = false; }
            if (!data) { setErr("dataKlasaErr", "Zgjidh datën."); valid = false; }
            if (!ora) { setErr("oraKlasaErr", "Zgjidh orën."); valid = false; }
            if (!valid) return;

            const lista = getRez();
            if (lista.find(function (r) { return r.tipi === "klasa" && r.data === data && r.ora === ora && r.klasa === klasa; })) {
                setErr("oraKlasaErr", "Ke tashmë rezervim për këtë klasë në këtë orar."); return;
            }

            lista.push({
                tipi: "klasa", klasa: klasa, instruktor: instruktor,
                data: formatDate(data), rawDate: data, ora: ora, shenime: shenime
            });
            saveRez(lista);

            showPopup("Klasa u rezervua!", "<strong>" + klasa + "</strong> me " + instruktor.split("(")[0] + "<br>" + formatDate(data) + " · " + ora);
            this.reset();
            updateBadge();
        });
    }

    /* FORM 2: PERSONAL FORM */
    function initPersonaleForm() {
        document.getElementById("rezervoPersonaleForm").addEventListener("submit", function (e) {
            e.preventDefault();

            const pt = document.getElementById("personalTrainer").value;
            const data = document.getElementById("dataPersonale").value;
            const ora = document.getElementById("oraPersonale").value;
            const kohezgjatja = document.getElementById("kohezgjatjaPersonale").value;
            const qellimet = document.getElementById("qellimet").value;

            clearErrors(["ptErr", "dataPersonaleErr", "oraPersonaleErr", "kohezgjatjaPersonaleErr"]);

            let valid = true;
            if (!pt) { setErr("ptErr", "Zgjidh Personal Trainerin."); valid = false; }
            if (!data) { setErr("dataPersonaleErr", "Zgjidh datën."); valid = false; }
            if (!ora) { setErr("oraPersonaleErr", "Zgjidh orën."); valid = false; }
            if (!kohezgjatja) { setErr("kohezgjatjaPersonaleErr", "Zgjidh kohëzgjatjen."); valid = false; }
            if (!valid) return;

            const lista = getRez();
            if (lista.find(function (r) { return r.tipi === "personale" && r.data === formatDate(data) && r.ora === ora; })) {
                setErr("oraPersonaleErr", "Ke tashmë seancë personale në këtë orar."); return;
            }

            lista.push({
                tipi: "personale", pt: pt, data: formatDate(data), rawDate: data,
                ora: ora, kohezgjatja: kohezgjatja, qellimet: qellimet
            });
            saveRez(lista);

            showPopup("Seanca personale u konfirmua!", "Me <strong>" + pt.split("(")[0] + "</strong><br>" +
                formatDate(data) + " · " + ora + " · " + kohezgjatja);
            this.reset();
            updateBadge();
        });
    }

    /* RENDER LIST */
    function renderAllList() {
        const container = document.getElementById("allRezList");
        if (!container) return;
        const lista = getRez();

        if (!lista.length) {
            container.innerHTML = "<p class='no-rez-msg'>Nuk ke rezervime ende. " +
                "<a href='#' onclick='switchTab(\"klasa\");return false;'>Rezervo tani →</a></p>";
            return;
        }

        lista.sort(function (a, b) {
            return new Date(a.rawDate + "T" + a.ora.split(" ")[0]) - new Date(b.rawDate + "T" + b.ora.split(" ")[0]);
        });

        container.innerHTML = "";
        lista.forEach(function (r, i) {
            const isKlasa = r.tipi === "klasa";
            const div = document.createElement("div");
            div.className = "rez-item-card " + (isKlasa ? "rez-klasa" : "rez-pt");
            div.innerHTML =
                "<div class='rez-item-icon'>" +
                "<i class='fa-solid " + (isKlasa ? "fa-dumbbell" : "fa-user-tie") + "'></i>" +
                "</div>" +
                "<div class='rez-item-info'>" +
                "<span class='rez-type-badge'>" + (isKlasa ? "Klasë" : "Seancë Personale") + "</span>" +
                "<strong>" + (isKlasa ? r.klasa : r.pt.split("(")[0]) + "</strong>" +
                "<span>" + r.data + " · " + r.ora + (r.kohezgjatja ? " · " + r.kohezgjatja : "") + "</span>" +
                (isKlasa && r.instruktor ? "<span class='rez-sub'>Instruktori: " + r.instruktor.split("(")[0] + "</span>" : "") +
                (r.shenime ? "<span class='rez-sub'>📝 " + r.shenime + "</span>" : "") +
                (r.qellimet ? "<span class='rez-sub'>🎯 " + r.qellimet + "</span>" : "") +
                "</div>" +
                "<button class='rez-del-btn' onclick='deleteRez(" + i + ")'>" +
                "<i class='fa-solid fa-xmark'></i> Anulo" +
                "</button>";
            container.appendChild(div);
        });
    }

    window.deleteRez = function (index) {
        if (!confirm("Dëshiron të anulosh këtë rezervim?")) return;
        const lista = getRez();
        lista.splice(index, 1);
        saveRez(lista);
        renderAllList();
        updateBadge();
    };

    window.switchTab = function (name) {
        document.querySelectorAll(".rez-tab").forEach(function (b) { b.classList.remove("active"); });
        document.querySelectorAll(".tab-panel").forEach(function (p) { p.classList.remove("active"); });
        document.querySelector("[data-tab='" + name + "']").classList.add("active");
        document.getElementById("tab-" + name).classList.add("active");
    };

    /* HELPERS */
    function getRez() { return JSON.parse(localStorage.getItem("rezervimet") || "[]"); }
    function saveRez(l) { localStorage.setItem("rezervimet", JSON.stringify(l)); }
    function setErr(id, m) { document.getElementById(id).textContent = m; }
    function clearErrors(ids) { ids.forEach(function (id) { document.getElementById(id).textContent = ""; }); }

    function updateBadge() {
        const n = getRez().length;
        const b = document.getElementById("rezCountBadge");
        if (b) b.textContent = n;
    }

    function formatDate(str) {
        const d = new Date(str + "T00:00:00");
        return d.toLocaleDateString("sq-AL", { weekday: "short", day: "2-digit", month: "long", year: "numeric" });
    }

    function showPopup(title, details) {
        document.getElementById("popupTitle").textContent = title;
        document.getElementById("popupDetails").innerHTML = details;
        document.getElementById("rezPopup").classList.add("active");
    }

    document.getElementById("rezPopup").addEventListener("click", function (e) {
        if (e.target === this) this.classList.remove("active");
    });

})();
