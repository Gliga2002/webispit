export default class Predmet {
  constructor(id, naziv, color, checkCallback) {
    (this.id = id),
      (this.naziv = naziv),
      (this.color = color),
      (this.checkCallback = checkCallback);
  }
  draw(container, predmet) {
    const checkboxEl = document.createElement("input");
    checkboxEl.type = "checkbox";
    checkboxEl.addEventListener("change", this.changeCheckboxHandler);
    checkboxEl.setAttribute("id", predmet.id);
    container.appendChild(checkboxEl);

    const labelEl = document.createElement("label");
    labelEl.innerText = predmet.naziv;
    labelEl.setAttribute("for", predmet.id);
    labelEl.style.color = this.color;
    container.appendChild(labelEl);
  }

  changeCheckboxHandler = (event) => {
    const checkboxEl = event.target;
    const isChecked = checkboxEl.checked;
   
    this.checkCallback(this.id, isChecked);
  };
}
