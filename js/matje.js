(function () {
    "use strict";

    const isLoggedIn = localStorage.getItem("loggedIn") === "true";

    /* Shfaq ose blloko faqen */
    if (isLoggedIn) {
        document.getElementById("matjeContent").style.display = "block";
        document.getElementById("matjeWall").style.display = "none";
        renderStats();
        renderHistory();
        renderChart();
    } else {
        document.getElementById("matjeContent").style.display = "none";
        document.getElementById("matjeWall").style.display = "block";
    }

    /* Vendos date max = sot */
    const dataInput = document.getElementById("dataMatjes");
    if (dataInput) dataInput.setAttribute("max", new Date().toISOString().split("T")[0]);

    /* BMI llogaritet ne kohe reale ndersa perdoruesi shkruan */
    ["pesha", "gjatesia"].forEach(function (id) {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", previewBMI);
    });

    function previewBMI() {
        const pesha = parseFloat(document.getElementById("pesha").value);
        const gjatesia = parseFloat(document.getElementById("gjatesia").value);
        const box = document.getElementById("bmiPreview");

        if (!pesha || !gjatesia || gjatesia < 50) { box.style.display = "none"; return; }

        const bmi = calcBMI(pesha, gjatesia);
        const cat = bmiCategory(bmi);

        document.getElementById("bmiValue").textContent = bmi;
        const catEl = document.getElementById("bmiCat");
        catEl.textContent = cat.label;
        catEl.className = "bmi-cat " + cat.cls;
        box.style.display = "flex";
    }

    /* FORMA — submit */
    document.getElementById("matjeForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const dataM = document.getElementById("dataMatjes").value;
        const pesha = parseFloat(document.getElementById("pesha").value);
        const gjatesia = parseFloat(document.getElementById("gjatesia").value);
        const yndyra = parseFloat(document.getElementById("yndyra").value) || null;
        const muskujt = parseFloat(document.getElementById("muskujt").value) || null;

        /* Pastro gabimet */
        ["dataMatjesErr", "peshaErr", "gjatesiaErr"].forEach(function (id) {
            document.getElementById(id).textContent = "";
        });

        let valid = true;
        if (!dataM) { document.getElementById("dataMatjesErr").textContent = "Zgjidh datën e matjes."; valid = false; }
        if (!pesha) { document.getElementById("peshaErr").textContent = "Shkruaj peshën."; valid = false; }
        if (!gjatesia) { document.getElementById("gjatesiaErr").textContent = "Shkruaj gjatësinë."; valid = false; }
        if (!valid) return;

        const bmi = calcBMI(pesha, gjatesia);
        const cat = bmiCategory(bmi);

        const lista = getMatjet();

        /* Parandalon dy matje te se njejtes date */
        if (lista.find(function (m) { return m.dataRaw === dataM; })) {
            document.getElementById("dataMatjesErr").textContent =
                "Ke tashmë një matje për këtë datë. Fshij atë për të shtuar të re.";
            return;
        }

        lista.push({
            id: Date.now(),
            dataRaw: dataM,
            data: formatDate(dataM),
            pesha: pesha,
            gjatesia: gjatesia,
            bmi: bmi,
            bmiLabel: cat.label,
            bmiCls: cat.cls,
            yndyra: yndyra,
            muskujt: muskujt
        });

        saveMatjet(lista);
        this.reset();
        document.getElementById("bmiPreview").style.display = "none";
        renderStats();
        renderHistory();
    });

    /* RENDER STATS */
    function renderStats() {
        const lista = getMatjet();
        const note = document.getElementById("matjeCountNote");

        if (!lista.length) {
            note.textContent = "Ende nuk ke matje të regjistruara.";
            document.getElementById("progressSection").style.display = "none";
            return;
        }

        /* Rendit sipas dates */
        lista.sort(function (a, b) { return new Date(a.dataRaw) - new Date(b.dataRaw); });
        const last = lista[lista.length - 1];
        const first = lista[0];

        document.getElementById("lastPesha").textContent = last.pesha + " kg";
        document.getElementById("lastBMI").textContent = last.bmi;
        document.getElementById("lastYndyra").textContent = last.yndyra ? last.yndyra + " %" : "—";
        document.getElementById("lastMuskujt").textContent = last.muskujt ? last.muskujt + " kg" : "—";

        const bmiCard = document.getElementById("scBMI");
        bmiCard.style.borderColor = bmiColor(last.bmiCls);

        note.textContent = "Totali: " + lista.length + " matje të regjistruara.";

        /* Progresi total (krahasim first vs last) */
        if (lista.length >= 2) {
            const progSec = document.getElementById("progressSection");
            progSec.style.display = "block";

            const dpesh = (last.pesha - first.pesha).toFixed(1);
            const dbmi = (last.bmi - first.bmi).toFixed(1);

            renderProgressRow("progPesha", "Pesha", dpesh, " kg");
            renderProgressRow("progBMI", "BMI", dbmi, "");
        }
    }

    function renderProgressRow(elId, label, diff, unit) {
        const el = document.getElementById(elId);
        const num = parseFloat(diff);
        const sign = num > 0 ? "+" : "";
        const cls = num < 0 ? "prog-down" : (num > 0 ? "prog-up" : "prog-same");
        const icon = num < 0 ? "▼" : (num > 0 ? "▲" : "→");
        el.innerHTML = "<span>" + label + "</span><span class='" + cls + "'>" + icon + " " + sign + diff + unit + "</span>";
    }

    /* RENDER HISTORY TABLE */
    function renderHistory() {
        const container = document.getElementById("matjeHistoryList");
        const lista = getMatjet();

        if (!lista.length) {
            container.innerHTML = "<p class='no-rez-msg'>Nuk ke matje të regjistruara ende. Shto matjen e parë!</p>";
            return;
        }

        /* Rendit nga me e reja */
        const sorted = lista.slice().sort(function (a, b) { return new Date(b.dataRaw) - new Date(a.dataRaw); });

        let html = "<table class='history-table'><thead><tr>" +
            "<th>Data</th><th>Pesha</th><th>Gjatësia</th><th>BMI</th>" +
            "<th>% Yndyra</th><th>Muskujt</th><th></th></tr></thead><tbody>";

        sorted.forEach(function (m) {
            html += "<tr>" +
                "<td>" + m.data + "</td>" +
                "<td>" + m.pesha + " kg</td>" +
                "<td>" + m.gjatesia + " cm</td>" +
                "<td><span class='bmi-badge " + m.bmiCls + "'>" + m.bmi + " — " + m.bmiLabel + "</span></td>" +
                "<td>" + (m.yndyra ? m.yndyra + " %" : "—") + "</td>" +
                "<td>" + (m.muskujt ? m.muskujt + " kg" : "—") + "</td>" +
                "<td><button class='del-matje-btn' onclick='deleteMatje(" + m.id + ")'>" +
                "<i class='fa-solid fa-trash'></i></button></td>" +
                "</tr>";
        });

        html += "</tbody></table>";
        container.innerHTML = html;
    }

    /* Fshij matje */
    window.deleteMatje = function (id) {
        if (!confirm("Fshij këtë matje?")) return;
        let lista = getMatjet().filter(function (m) { return m.id !== id; });
        saveMatjet(lista);
        renderStats();
        renderHistory();
        renderChart();
    };

    /* HELPERS */
    function getMatjet() { return JSON.parse(localStorage.getItem("matjet") || "[]"); }
    function saveMatjet(l) { localStorage.setItem("matjet", JSON.stringify(l)); }

    function calcBMI(pesha, gjatesia) {
        const h = gjatesia / 100;
        return parseFloat((pesha / (h * h)).toFixed(1));
    }

    function bmiCategory(bmi) {
        if (bmi < 18.5) return { label: "Nënpeshë", cls: "bmi-nenpeshe" };
        if (bmi < 25) return { label: "Normal", cls: "bmi-normal" };
        if (bmi < 30) return { label: "Mbipeshë", cls: "bmi-mbipeshe" };
        return { label: "Obez", cls: "bmi-obez" };
    }

    function bmiColor(cls) {
        const map = { "bmi-normal": "#00c864", "bmi-mbipeshe": "#ffc107", "bmi-obez": "#ff5555", "bmi-nenpeshe": "#8888ff" };
        return map[cls] || "#2a2a2a";
    }

    function formatDate(str) {
        const d = new Date(str + "T00:00:00");
        return d.toLocaleDateString("sq-AL", { day: "2-digit", month: "long", year: "numeric" });
    }
    function renderChart() {
        const lista = getMatjet();
        if (!lista.length) return;

        const sorted = lista.slice().sort((a, b) => new Date(a.dataRaw) - new Date(b.dataRaw));

        const labels = sorted.map(m => m.data);
        const peshaData = sorted.map(m => m.pesha);
        const bmiData = sorted.map(m => m.bmi);

        const ctx = document.getElementById("matjeChart");
        if (!ctx) return;

        new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Pesha (kg)",
                        data: peshaData,
                        borderColor: "rgb(0,188,212)",
                        backgroundColor: "rgba(0,188,212,0.2)",
                        tension: 0.4
                    },
                    {
                        label: "BMI",
                        data: bmiData,
                        borderColor: "#ffb74d",
                        backgroundColor: "rgba(255,183,77,0.2)",
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: "white"
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: "white" }
                    },
                    y: {
                        ticks: { color: "white" }
                    }
                }
            }
        });
    }

})();
