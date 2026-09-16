/* Llogaritja dhe shfaqja e BMI */
function calculateBMI() {
    const heightInput = document.getElementById("height");
    const weightInput = document.getElementById("weight");
    const errorEl = document.getElementById("bmi-error");
    const resultEl = document.getElementById("bmi-result");
    const statusEl = document.getElementById("bmi-status");
    const indicator = document.getElementById("bmi-indicator");

    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);

    /* Validimi i inputeve */
    if (!heightInput.value || !weightInput.value) {
        errorEl.textContent = "Ju lutem plotesoni te dy fushat.";
        return;
    }

    if (height < 50 || height > 250) {
        errorEl.textContent = "Gjatesia duhet te jete ndermjet 50 dhe 250 cm.";
        return;
    }

    if (weight < 20 || weight > 300) {
        errorEl.textContent = "Pesha duhet te jete ndermjet 20 dhe 300 kg.";
        return;
    }

    errorEl.textContent = "";

    /* Llogaritja e BMI */
    const heightM = height / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);

    /* Percaktimi i statusit dhe ngjyres */
    let status, color, indicatorPos;

    if (bmi < 18.5) {
        status = "Nen peshe";
        color = "#4fc3f7";
        indicatorPos = Math.min((bmi / 18.5) * 25, 24);
    } else if (bmi < 25) {
        status = "Peshe normale";
        color = "#66bb6a";
        indicatorPos = 25 + ((bmi - 18.5) / 6.5) * 25;
    } else if (bmi < 30) {
        status = "Mbi peshe";
        color = "#ffa726";
        indicatorPos = 50 + ((bmi - 25) / 5) * 25;
    } else {
        status = "Obez";
        color = "#ef5350";
        indicatorPos = Math.min(75 + ((bmi - 30) / 10) * 25, 98);
    }

    /* Perditesimi i DOM */
    resultEl.textContent = bmi;
    resultEl.style.color = color;
    statusEl.textContent = status;
    indicator.style.left = indicatorPos + "%";
}
