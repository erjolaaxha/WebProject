document.addEventListener("DOMContentLoaded", () => {

  const widget = document.getElementById("macroWidget");
  const header = document.getElementById("widgetHeader");

  /* TOGGLE (OPEN / CLOSE) */
  header.addEventListener("click", (e) => {
    widget.classList.toggle("collapsed");
  });

  /* CALCULATOR */
  window.calcMacros = function () {

    let w = document.getElementById("weight").value;
    let h = document.getElementById("height").value;
    let a = document.getElementById("age").value;
    let act = document.getElementById("activity").value;

    if (!w || !h || !a) {
      document.getElementById("result").innerHTML =
        "⚠️ Ploteso te gjitha fushat!";
      return;
    }

    w = Number(w);
    h = Number(h);
    a = Number(a);
    act = Number(act);

    let bmr = 10 * w + 6.25 * h - 5 * a + 5;
    let tdee = bmr * act;

    let protein = w * 1.8;
    let fat = w * 0.8;
    let carbs = (tdee - (protein * 4 + fat * 9)) / 4;

    document.getElementById("result").innerHTML =
      `🔥 ${Math.round(tdee)} kcal<br>
     🍗 ${Math.round(protein)}g protein<br>
     🥑 ${Math.round(fat)}g fat<br>
     🍞 ${Math.round(carbs)}g carbs`;
  };

  /* DRAG SYSTEM */

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  header.addEventListener("mousedown", (e) => {
    isDragging = true;

    const rect = widget.getBoundingClientRect();

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    widget.style.left = (e.clientX - offsetX) + "px";
    widget.style.top = (e.clientY - offsetY) + "px";

    widget.style.right = "auto";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

});