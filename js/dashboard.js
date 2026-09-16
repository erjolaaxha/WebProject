// CHECK LOGIN

if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
}

// GET USER DATA

const userData = {
    emriPlote:
        localStorage.getItem("userEmriPlote") ||
        localStorage.getItem("userEmri") ||
        "—",

    email:
        localStorage.getItem("userEmail") || "—",

    gjinia:
        localStorage.getItem("userGjinia") || "—",

    mosha:
        localStorage.getItem("userMosha") || "",

    package:
        localStorage.getItem("userPackage") || "Pa paketë",

    memberSince:
        localStorage.getItem("memberSince") ||
        new Date().toLocaleDateString("sq-AL"),

    rruga:
        localStorage.getItem("userRruga") || "",

    qyteti:
        localStorage.getItem("userQyteti") || "",

    kodi:
        localStorage.getItem("userKodiPostar") || ""
};

// FILL PROFILE

document.getElementById("dashEmriPlote").textContent =
    userData.emriPlote;

document.getElementById("dashEmail").textContent =
    userData.email;

document.getElementById("dashGjinia").textContent =
    userData.gjinia;

document.getElementById("dashMosha").textContent =
    userData.mosha
        ? `${userData.mosha} vjeç`
        : "—";

document.getElementById("dashMember").textContent =
    `Anëtar që nga: ${userData.memberSince}`;

document.getElementById("dashPkg").textContent =
    userData.package;

document.getElementById("dashPackage").textContent =
    userData.package;

// ADDRESS

const address = [
    userData.rruga,
    userData.qyteti,
    userData.kodi
]
    .filter(Boolean)
    .join(", ");

if (address) {
    document.getElementById("dashAddress").textContent =
        address;

    document.getElementById("dashAddressBar").style.display =
        "flex";
}

// AKTIVITETET

const aktivitetet = JSON.parse(
    localStorage.getItem("userAktivitetet") || "[]"
);

if (aktivitetet.length > 0) {

    const panel =
        document.getElementById("dashAktivitetePanel");

    const list =
        document.getElementById("dashAktiviteteList");

    panel.style.display = "block";

    aktivitetet.forEach((aktivitet) => {

        const badge = document.createElement("span");

        badge.className = "dash-badge";
        badge.textContent = aktivitet;

        list.appendChild(badge);
    });
}

// ANALIZAT

const analizaName =
    localStorage.getItem("analizaName");

if (analizaName) {

    document.getElementById("dashAnalizaPanel")
        .style.display = "block";

    document.getElementById("dashAnalizaBox").innerHTML = `
        <div class="rez-mini">
            <i class="fa-solid fa-file-medical"></i>

            <div>
                <strong>${analizaName}</strong>
            </div>
        </div>
    `;
}

// REZERVIMET

const rezervimet = JSON.parse(
    localStorage.getItem("rezervimet") || "[]"
);

document.getElementById("dashRezCount").textContent =
    rezervimet.length;

const rezList =
    document.getElementById("dashRezList");

if (rezervimet.length > 0) {

    rezList.innerHTML = "";

    const sorted = rezervimet
        .slice()
        .sort((a, b) =>
            new Date(b.rawDate) - new Date(a.rawDate)
        )
        .slice(0, 4);

    sorted.forEach((r) => {

        const isKlasa = r.tipi === "klasa";

        const div = document.createElement("div");

        div.className =
            `rez-mini ${isKlasa ? "mini-klasa" : "mini-pt"}`;

        div.innerHTML = `
            <i class="fa-solid ${isKlasa
                ? "fa-dumbbell"
                : "fa-user-tie"
            }"></i>

            <div>
                <strong>
                    ${isKlasa
                ? r.klasa
                : r.pt
                    ? r.pt.split("(")[0]
                    : "Seancë"
            }
                </strong>

                <span>
                    ${r.data} · ${r.ora}
                </span>
            </div>
        `;

        rezList.appendChild(div);
    });
}

// MATJET

const matjet = JSON.parse(
    localStorage.getItem("matjet") || "[]"
);

document.getElementById("dashMatjeCount").textContent =
    matjet.length;

if (matjet.length > 0) {

    const lastMatje = matjet
        .slice()
        .sort((a, b) =>
            new Date(b.dataRaw) - new Date(a.dataRaw)
        )[0];

    document.getElementById("dashPesha").textContent =
        `${lastMatje.pesha} kg`;

    document.getElementById("dashMatjeBox").innerHTML = `
        <div class="matje-mini-card">

            <div class="mmc-row">
                <span>Pesha</span>
                <strong>${lastMatje.pesha} kg</strong>
            </div>

            <div class="mmc-row">
                <span>Gjatësia</span>
                <strong>${lastMatje.gjatesia} cm</strong>
            </div>

            <div class="mmc-row">
                <span>BMI</span>

                <strong>
                    ${lastMatje.bmi}
                    <small>(${lastMatje.bmiLabel})</small>
                </strong>
            </div>

            ${lastMatje.yndyra
            ? `
                    <div class="mmc-row">
                        <span>% Yndyra</span>
                        <strong>${lastMatje.yndyra} %</strong>
                    </div>
                    `
            : ""
        }

            ${lastMatje.muskujt
            ? `
                    <div class="mmc-row">
                        <span>Muskujt</span>
                        <strong>${lastMatje.muskujt} kg</strong>
                    </div>
                    `
            : ""
        }

            <p class="mmc-date">
                ${lastMatje.data}
            </p>

        </div>
    `;
}