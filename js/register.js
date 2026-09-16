"use strict";

/* VARIABLA GLOBALE */
let selectedFile = null;   // Mban skedarin e zgjedhur

/* KRITER 8: VEKTORË PËR KOMPONENTË TË NJËJTIT TIP
Të gjitha checkbox-et kapen me querySelector si array */
const checkboxes = Array.from(
    document.querySelectorAll('input[name="aktivitetet[]"]')
);

/* KRITER 12: DRAG & DROP — W3C File API */
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const filePreview = document.getElementById("filePreview");
const dropText = document.getElementById("dropText");
const dropIcon = document.getElementById("dropIcon");
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE_MB = 10;

/* Klikimi mbi drop zone - hap file dialog */
dropZone.addEventListener("click", () => fileInput.click());

/* Tastiera - hapja me Enter/Space */
dropZone.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fileInput.click();
    }
});

/* DRAG EVENTS */
["dragenter", "dragover"].forEach(function (evName) {
    dropZone.addEventListener(evName, function (e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add("dragover");
    });
});

["dragleave", "dragend"].forEach(function (evName) {
    dropZone.addEventListener(evName, function (e) {
        e.preventDefault();
        dropZone.classList.remove("dragover");
    });
});

/* DROP - kriter 12: W3C File API */
dropZone.addEventListener("drop", function (e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove("dragover");

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
        handleFile(files[0]);
    }
});

/* Zgjedhja e skedarit me input[type=file] */
fileInput.addEventListener("change", function () {
    if (this.files && this.files.length > 0) {
        handleFile(this.files[0]);
    }
});

/*
 * handleFile — Kriter 12: W3C File API
 * Lexon skedarin, kontrollon tipin dhe madhesine,
 * simulon Worker (FileReader si background process)
 */
function handleFile(file) {
    const errEl = document.getElementById("fileError");
    errEl.textContent = "";

    /* Validim tipi */
    if (!ALLOWED_TYPES.includes(file.type)) {
        errEl.textContent = "Skedari duhet të jetë PDF, JPG ose PNG.";
        return;
    }

    /* Validim madhesia */
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        errEl.textContent = "Skedari nuk mund të jetë më i madh se " + MAX_SIZE_MB + " MB.";
        return;
    }

    selectedFile = file;

    /* Shfaq preview */
    document.getElementById("fileName").textContent = file.name;
    document.getElementById("fileSize").textContent = formatFileSize(file.size);

    /* Ikona sipas tipit */
    const iconEl = document.getElementById("previewIcon");
    if (file.type === "application/pdf") {
        iconEl.className = "fa-solid fa-file-pdf file-preview-icon";
        iconEl.style.color = "#ef4444";
    } else {
        iconEl.className = "fa-solid fa-file-image file-preview-icon";
        iconEl.style.color = "rgb(0,188,212)";
    }

    filePreview.style.display = "block";
    dropZone.classList.add("drop-success");
    dropText.innerHTML = "<strong>Skedari u zgjodh!</strong> Klikoni për të ndryshuar.";
    dropIcon.className = "fa-solid fa-circle-check drop-icon";
    dropIcon.style.color = "#22c55e";

    /* Kriter 12: Simulim FileReader (Worker) per te lexuar skedarin */
    simulateFileWorker(file);
}

/* simulateFileWorker - simulo Web Worker me FileReader
 * Kriter 12: W3C File API + Worker */

function simulateFileWorker(file) {
    const progressWrap = document.getElementById("uploadProgressWrap");
    const progressBar = document.getElementById("uploadProgressBar");
    const progressText = document.getElementById("uploadProgressText");

    progressWrap.style.display = "block";
    progressText.textContent = "Duke lexuar skedarin...";
    progressText.style.color = "#888";

    const reader = new FileReader();

    reader.onprogress = function (e) {
        if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            progressBar.style.width = pct + "%";
        }
    };

    reader.onload = function () {
        progressBar.style.width = "100%";
        progressBar.style.background = "#22c55e";
        progressText.textContent = "✓ Skedari u lexua me sukses!";
        progressText.style.color = "#22c55e";
    };

    reader.onerror = function () {
        progressText.textContent = "Gabim gjatë leximit të skedarit.";
        progressText.style.color = "#ef4444";
    };

    reader.readAsArrayBuffer(file);
}

/* Hiqe skedarin */
document.getElementById("removeFile").addEventListener("click", function () {
    clearFileSelection();
});

function clearFileSelection() {
    selectedFile = null;
    fileInput.value = "";
    filePreview.style.display = "none";
    dropZone.classList.remove("drop-success");
    dropText.innerHTML = 'Zvarrit skedarin këtu <strong>ose klikoni për ta zgjedhur</strong>';
    dropIcon.className = "fa-solid fa-cloud-arrow-up drop-icon";
    dropIcon.style.color = "";
    document.getElementById("uploadProgressBar").style.width = "0%";
    document.getElementById("uploadProgressBar").style.background = "rgb(0,188,212)";
    document.getElementById("uploadProgressText").textContent = "";
    document.getElementById("uploadProgressWrap").style.display = "none";
    document.getElementById("fileError").textContent = "";
}

/* BYTE FORMAT */
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

/* KRITER 10: BUTON PASTRIM */
document.getElementById("btnPastro").addEventListener("click", function () {
    const form = document.getElementById("registerForm");
    form.reset();

    /* Pastro te gjitha mesazhet e gabimit */
    document.querySelectorAll(".error").forEach(function (el) { el.textContent = ""; });
    document.querySelectorAll(".input-box input, .input-box select").forEach(function (el) {
        el.classList.remove("valid", "invalid");
    });

    /* Pastro skedarin */
    clearFileSelection();

    /* Pastro strength bar */
    document.getElementById("strengthBar").style.width = "0%";
    document.getElementById("strengthLabel").textContent = "";
    document.getElementById("strengthWrap").style.display = "none";

    /* Pastro success card */
    const card = document.getElementById("successCard");
    card.style.display = "none";
    card.innerHTML = "";

    /* Uncheck */
    checkboxes.forEach(function (cb) { cb.checked = false; });

    /* Reset label drag-drop */
    clearFileSelection();

    /* Fokus ne fushen e pare */
    document.getElementById("emri").focus();
});

/* KRITER 4: TOGGLE FJALËKALIM */
document.querySelectorAll(".toggle-password").forEach(function (btn) {
    btn.addEventListener("click", function () {
        const id = this.getAttribute("data-target");
        const input = document.getElementById(id);
        const hide = input.type === "password";
        input.type = hide ? "text" : "password";
        this.querySelector("i").className = hide ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
        this.setAttribute("aria-label", hide ? "Fshih fjalëkalimin" : "Shfaq fjalëkalimin");
    });
});

/* PASSWORD STRENGTH BAR (live) */
document.getElementById("password").addEventListener("input", function () {
    const val = this.value;
    const wrap = document.getElementById("strengthWrap");
    const bar = document.getElementById("strengthBar");
    const lbl = document.getElementById("strengthLabel");

    if (!val) {
        wrap.style.display = "none";
        lbl.textContent = "";
        return;
    }

    wrap.style.display = "block";
    let score = 0;

    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^a-zA-Z0-9]/.test(val)) score++;
    if (val.length >= 12) score++;

    const levels = [
        { pct: "20%", color: "#ef4444", label: "Shumë e dobët" },
        { pct: "40%", color: "#f97316", label: "E dobët" },
        { pct: "60%", color: "#eab308", label: "Mesatare" },
        { pct: "80%", color: "#84cc16", label: "E mirë" },
        { pct: "100%", color: "#22c55e", label: "Shumë e fortë" },
    ];

    const lvl = levels[Math.min(score - 1, 4)] || levels[0];
    bar.style.width = lvl.pct;
    bar.style.backgroundColor = lvl.color;
    lbl.textContent = lvl.label;
    lbl.style.color = lvl.color;
});

/* FORMATIM AUTOMATIK I NUMRIT (XXX-XXXXXXX) */
document.getElementById("phone").addEventListener("input", function () {
    let raw = this.value.replace(/[^0-9]/g, "");
    if (raw.length > 10) raw = raw.slice(0, 10);
    if (raw.length > 3) {
        this.value = raw.slice(0, 3) + "-" + raw.slice(3);
    } else {
        this.value = raw;
    }
});

/* FUNKSIONET E VALIDIMIT (krit 1–7) */

/** Kriter 7: Validim manual email - @ para . dhe min 2 karaktere pas . */
function validateEmail(email) {
    const atIndex = email.indexOf("@");
    if (atIndex < 1) return false;                      // @ duhet pas min 1 karakteri

    const afterAt = email.slice(atIndex + 1);          // domain.ext
    const dotIndex = afterAt.lastIndexOf(".");
    if (dotIndex < 1) return false;                     // . duhet te ekzistoje dhe pas @ min 1 karakter
    // atIndex < (atIndex + 1 + dotIndex) garantohet gjithmone (@ para .)

    const afterDot = afterAt.slice(dotIndex + 1);       // ext
    if (afterDot.length < 2) return false;              // min 2 karaktere pas .

    /* Karakteret baze te lejuara */
    const re = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

/** Kriter 6: Validim format telefoni XXX-XXXXXXX */
function validatePhone(phone) {
    return /^[0-9]{3}-[0-9]{7}$/.test(phone);
}

/** Shfaq gabim */
function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
}

/** Pastro gabim */
function clearError(id) {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
}

/** Shto klase valid/invalid mbi input */
function markField(inputId, isValid) {
    const el = document.getElementById(inputId);
    if (!el) return;
    el.classList.toggle("valid", isValid);
    el.classList.toggle("invalid", !isValid);
}

/* VALIDIM LIVE (blur) — tregon gabim menjëherë */
document.getElementById("emri").addEventListener("blur", function () {
    if (!this.value.trim()) {
        showError("emriError", "Emri është i detyrueshëm.");
        markField("emri", false);
    } else {
        clearError("emriError");
        markField("emri", true);
    }
});

document.getElementById("mbiemri").addEventListener("blur", function () {
    if (!this.value.trim()) {
        showError("mbiemriError", "Mbiemri është i detyrueshëm.");
        markField("mbiemri", false);
    } else {
        clearError("mbiemriError");
        markField("mbiemri", true);
    }
});

document.getElementById("email").addEventListener("blur", function () {
    const val = this.value.trim();
    if (!val) {
        showError("emailError", "Email-i është i detyrueshëm.");
        markField("email", false);
    } else if (!validateEmail(val)) {
        showError("emailError", "Email invalid — duhet të ketë @ dhe . me min. 2 karaktere pas pikës.");
        markField("email", false);
    } else {
        clearError("emailError");
        markField("email", true);
    }
});

document.getElementById("phone").addEventListener("blur", function () {
    const val = this.value.trim();
    if (!val) {
        showError("phoneError", "Nr. Celulari është i detyrueshëm.");
        markField("phone", false);
    } else if (!validatePhone(val)) {
        showError("phoneError", "Formati duhet të jetë XXX-XXXXXXX (p.sh. 069-1234567).");
        markField("phone", false);
    } else {
        clearError("phoneError");
        markField("phone", true);
    }
});

document.getElementById("rruga").addEventListener("blur", function () {
    if (!this.value.trim()) {
        showError("rrugaError", "Rruga është e detyrueshme.");
        markField("rruga", false);
    } else {
        clearError("rrugaError");
        markField("rruga", true);
    }
});

document.getElementById("qyteti").addEventListener("blur", function () {
    if (!this.value.trim()) {
        showError("qytetiError", "Qyteti është i detyrueshëm.");
        markField("qyteti", false);
    } else {
        clearError("qytetiError");
        markField("qyteti", true);
    }
});



/* Kriter 4: krahasim password live */
document.getElementById("confirmPassword").addEventListener("blur", function () {
    const pw1 = document.getElementById("password").value;
    const pw2 = this.value;
    if (!pw2) {
        showError("confirmPasswordError", "Konfirmimi i fjalëkalimit është i detyrueshëm.");
        markField("confirmPassword", false);
    } else if (pw1 !== pw2) {
        showError("confirmPasswordError", "Fjalëkalimet nuk përputhen.");
        markField("confirmPassword", false);
    } else {
        clearError("confirmPasswordError");
        markField("confirmPassword", true);
    }
});

/* SUBMIT — Validim i plote (krit 1–8) */
document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let isCorrect = true;

    /* Pastro te gjitha gabimet */
    const errIds = [
        "emriError",
        "mbiemriError",
        "datelindjaError",
        "gjiniaError",
        "emailError",
        "phoneError",
        "rrugaError",
        "qytetiError",
        "passwordError",
        "confirmPasswordError",
        "packageError",
        "aktivitetetError",
        "fileError"
    ];
    errIds.forEach(function (id) { clearError(id); });

    /* Lexo vlerat */
    const emri = document.getElementById("emri").value.trim();
    const mbiemri = document.getElementById("mbiemri").value.trim();
    const datelindja = document.getElementById("datelindja").value;
    const gjinia = document.getElementById("gjinia").value;
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPass = document.getElementById("confirmPassword").value;
    const packageSelect = document.getElementById("package").value;
    const rruga = document.getElementById("rruga").value.trim();
    const qyteti = document.getElementById("qyteti").value.trim();

    /* Kriter 8: Vektori i checkbox-eve */
    const aktivitetetZgjedhura = checkboxes
        .filter(function (cb) { return cb.checked; })
        .map(function (cb) { return cb.value; });

    /* KRITER 1: Fushat tekst te detyrueshme */
    if (!emri) {
        showError("emriError", "Emri është i detyrueshëm.");
        markField("emri", false);
        isCorrect = false;
    } else {
        markField("emri", true);
    }

    if (!mbiemri) {
        showError("mbiemriError", "Mbiemri është i detyrueshëm.");
        markField("mbiemri", false);
        isCorrect = false;
    } else {
        markField("mbiemri", true);
    }

    /* Datelindja */
    if (!datelindja) {
        showError("datelindjaError", "Datëlindja është e detyrueshme.");
        markField("datelindja", false);
        isCorrect = false;
    } else {
        const today = new Date();
        const birth = new Date(datelindja);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

        if (birth > today) {
            showError("datelindjaError", "Datëlindja nuk mund të jetë në të ardhmen.");
            markField("datelindja", false);
            isCorrect = false;
        } else if (age < 14) {
            showError("datelindjaError", "Duhet të jesh të paktën 14 vjeç.");
            markField("datelindja", false);
            isCorrect = false;
        } else {
            markField("datelindja", true);
        }
    }

    /* KRITER 2: Gjinia e detyrueshme */
    if (!gjinia) {
        showError("gjiniaError", "Zgjidhni gjininë — ky fushë është e detyrueshme.");
        document.getElementById("gjinia").classList.add("invalid");
        isCorrect = false;
    } else {
        document.getElementById("gjinia").classList.remove("invalid");
        document.getElementById("gjinia").classList.add("valid");
    }

    /* Rruga */
    if (!rruga) {
        showError("rrugaError", "Rruga është e detyrueshme.");
        markField("rruga", false);
        isCorrect = false;
    } else {
        markField("rruga", true);
    }

    /* Qyteti */
    if (!qyteti) {
        showError("qytetiError", "Qyteti është i detyrueshëm.");
        markField("qyteti", false);
        isCorrect = false;
    } else {
        markField("qyteti", true);
    }

    /* KRITER 7: Email */
    if (!email) {
        showError("emailError", "Email-i është i detyrueshëm.");
        markField("email", false);
        isCorrect = false;
    } else if (!validateEmail(email)) {
        showError("emailError", "Email invalid — duhet @ para pikës dhe min. 2 karaktere pas pikës.");
        markField("email", false);
        isCorrect = false;
    } else {
        markField("email", true);
    }

    /* KRITER 6: Nr. Telefoni XXX-XXXXXXX  */
    if (!phone) {
        showError("phoneError", "Nr. Celulari është i detyrueshëm.");
        markField("phone", false);
        isCorrect = false;
    } else if (!validatePhone(phone)) {
        showError("phoneError", "Formati i kërkuar: XXX-XXXXXXX (p.sh. 069-1234567).");
        markField("phone", false);
        isCorrect = false;
    } else {
        markField("phone", true);
    }

    /* KRITER 4: Password */
    const pwFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!password) {
        showError("passwordError", "Fjalëkalimi është i detyrueshëm.");
        markField("password", false);
        isCorrect = false;
    } else if (!pwFormat.test(password)) {
        showError("passwordError", "Min. 8 karaktere, 1 shkronjë e madhe dhe 1 numër.");
        markField("password", false);
        isCorrect = false;
    } else {
        markField("password", true);
    }

    /* KRITER 4: Krahasimi i dy password-eve */
    if (!confirmPass) {
        showError("confirmPasswordError", "Konfirmimi i fjalëkalimit është i detyrueshëm.");
        markField("confirmPassword", false);
        isCorrect = false;
    } else if (confirmPass !== password) {
        showError("confirmPasswordError", "Fjalëkalimet nuk përputhen.");
        markField("confirmPassword", false);
        isCorrect = false;
    } else if (pwFormat.test(password)) {
        markField("confirmPassword", true);
    }

    /* KRITER 5: Select paketa (element nga lista) */
    if (!packageSelect) {
        showError("packageError", "Duhet të zgjidhni patjeter një paketë nga lista.");
        document.getElementById("package").classList.add("invalid");
        isCorrect = false;
    } else {
        document.getElementById("package").classList.remove("invalid");
        document.getElementById("package").classList.add("valid");
    }

    /* KRITER 3: Minimumi një checkbox */
    if (aktivitetetZgjedhura.length === 0) {
        showError("aktivitetetError", "Zgjidhni të paktën një aktivitet/interes.");
        isCorrect = false;
    }

    /* FILE */
    if (!selectedFile) {
        showError("fileError", "Duhet të ngarkoni një skedar (PDF, JPG ose PNG).");
        isCorrect = false;
    }

    /* Nese te gjitha janë OK */
    if (isCorrect) {
        /* Ruaj ne localStorage */
        const today = new Date();
        const birth = new Date(datelindja);
        let mosha = today.getFullYear() - birth.getFullYear();
        const mm = today.getMonth() - birth.getMonth();
        if (mm < 0 || (mm === 0 && today.getDate() < birth.getDate())) mosha--;

        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("userName", emri);
        localStorage.setItem("userEmri", emri);
        localStorage.setItem("userMbiemri", mbiemri);
        localStorage.setItem("userEmriPlote", emri + " " + mbiemri);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userPhone", phone);
        localStorage.setItem("userGjinia", gjinia);
        localStorage.setItem("userDatelindja", datelindja);
        localStorage.setItem("userMosha", mosha);
        localStorage.setItem("userRruga", rruga);
        localStorage.setItem("userQyteti", qyteti);
        localStorage.setItem("userPackage", packageSelect);
        localStorage.setItem("userAktivitetet", aktivitetetZgjedhura.join(", "));
        localStorage.setItem("memberSince", today.toLocaleDateString("sq-AL"));

        /* KRITER 9: Shfaq sukses me DOM + imazh */
        showSuccessCard({
            emri, mbiemri, email, phone, gjinia,
            datelindja, mosha, packageSelect,
            aktivitetet: aktivitetetZgjedhura,
            rruga, qyteti,
            fileName: selectedFile ? selectedFile.name : null
        });

        /* Dergo formularin te PHP pas 2.5 sek */
        /* DERGO FORMULARIN */
        setTimeout(function () {

            /* sigurohu që localStorage ruhet */
            localStorage.setItem("loggedIn", "true");

            /* ridergo formën */
            document.getElementById("registerForm").submit();

        }, 2500);
    } else {
        /* Scroll te gabimi i pare */
        const firstErr = document.querySelector(".error:not(:empty)");
        if (firstErr) {
            firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }
});

/* KRITER 9: DOM - shfaq informacion me imazh
   Shton elemente në të njëjtin HTML pas "Dërgo" */
function showSuccessCard(data) {
    const card = document.getElementById("successCard");
    card.style.display = "block";

    /* Gjenero HTML dinamikisht me DOM (createElement) */
    const header = document.createElement("div");
    header.className = "success-card-header";

    const iconDiv = document.createElement("div");
    iconDiv.className = "success-card-icon";
    iconDiv.innerHTML = '<i class="fa-solid fa-circle-check"></i>';

    const headerText = document.createElement("div");
    const h3 = document.createElement("h3");
    h3.textContent = "Mirë se vini, " + data.emri + "!";
    const pSub = document.createElement("p");
    pSub.textContent = "Regjistrimi juaj u krye me sukses. Po ju ridrejtojmë...";

    headerText.appendChild(h3);
    headerText.appendChild(pSub);
    header.appendChild(iconDiv);
    header.appendChild(headerText);

    /* Imazh (kriter 9: imazh i shoqeruar) */
    const img = document.createElement("img");
    img.src = "images/register-bg.jpg";
    img.alt = "EliteGym — mirë se vini!";
    img.className = "success-card-img";
    img.onerror = function () { this.style.display = "none"; };

    /* Grid me te dhena */
    const grid = document.createElement("div");
    grid.className = "success-card-grid";

    const items = [
        { label: "Emri i plotë", value: data.emri + " " + data.mbiemri },
        { label: "Email", value: data.email },
        { label: "Celulari", value: data.phone },
        { label: "Gjinia", value: data.gjinia },
        { label: "Mosha", value: data.mosha + " vjeç" },
        { label: "Paketa", value: data.packageSelect },
    ];

    if (data.qyteti) {
        items.push({ label: "Qyteti", value: data.qyteti });
    }

    items.forEach(function (item) {
        const div = document.createElement("div");
        div.className = "success-item";

        const lbl = document.createElement("p");
        lbl.className = "success-item-label";
        lbl.textContent = item.label;

        const val = document.createElement("p");
        val.className = "success-item-value";
        val.textContent = item.value;

        div.appendChild(lbl);
        div.appendChild(val);
        grid.appendChild(div);
    });

    /* Tags aktivitetesh */
    let tagsSection = null;
    if (data.aktivitetet && data.aktivitetet.length > 0) {
        tagsSection = document.createElement("div");
        const tagsTitle = document.createElement("p");
        tagsTitle.className = "success-item-label";
        tagsTitle.textContent = "Aktivitetet e zgjedhura:";
        tagsTitle.style.marginBottom = "8px";

        const tagsWrap = document.createElement("div");
        tagsWrap.className = "success-tags";

        data.aktivitetet.forEach(function (ak) {
            const tag = document.createElement("span");
            tag.className = "success-tag";
            tag.textContent = ak;
            tagsWrap.appendChild(tag);
        });

        tagsSection.appendChild(tagsTitle);
        tagsSection.appendChild(tagsWrap);
    }

    /* INFO */
    let fileSection = null;
    if (data.fileName) {
        fileSection = document.createElement("div");
        fileSection.className = "success-file-info";
        fileSection.innerHTML =
            '<i class="fa-solid fa-file-medical"></i>' +


            '<span>Skedari i analizave: <strong>' + escapeHtml(data.fileName) + '</strong></span>';
    }

    /* RUAJ AKTIVITETET */

    localStorage.setItem(
        "userAktivitetet",
        JSON.stringify(data.aktivitetet || [])
    );

    /* RUAJ ANALIZAT */

    if (data.fileName) {
        localStorage.setItem("analizaName", data.fileName);
    }

    card.innerHTML = "";
    card.appendChild(header);
    card.appendChild(img);
    card.appendChild(grid);
    if (tagsSection) card.appendChild(tagsSection);
    if (fileSection) card.appendChild(fileSection);

    /* Scroll te success card */
    card.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* Escapim HTML bazë */
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}