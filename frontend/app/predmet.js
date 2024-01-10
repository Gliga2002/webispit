export class Predmet {
  constructor(id, naziv, color, checkCallback) {
    this.id = id;
    this.naziv = naziv;
    this.color = color;
    this.checkCallback = checkCallback;
  }

  draw(container) {
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.onchange = this.onCheckChange;
    cb.classList.add(`cb-${this.id}`);
    container.appendChild(cb);

    const lbl = document.createElement("label");
    lbl.innerHTML = this.naziv;
    lbl.style.color = this.color;
    container.appendChild(lbl);
  }

  onCheckChange = () => {
    const cb = document.querySelector(`.cb-${this.id}`);
    this.checkCallback(this.id, cb.checked);
  };
}
