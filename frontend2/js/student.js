export default class Student {
  constructor(id, index, imeprezime, ocene) {
    this.id = id;
    this.index = index;
    this.imeprezime = imeprezime;
    this.ocene = ocene;
  }

  draw(ulElContainer, predmetiIDS, predmeti) {
    const cardEl = document.createElement("li");
    cardEl.classList.add("card");

    const p = document.createElement("p");
    p.innerText = this.imeprezime;

    cardEl.appendChild(p);

    const oceneEl = document.createElement('div');
    oceneEl.classList.add('ocene');

    const n = predmetiIDS.length;
    const w = (oceneEl.style.width - oceneEl.style.columnGap * (n + 1)) / n;

    oceneEl.style.gridTemplateColumns = `repeat(${n}, ${w})`;

    this.ocene.forEach(oceneEl => {
      let predmet = predmeti.find(p => p.naizv === oceneEl.predmet);
      let color = predmet.color;
      let indeksPredmeta = predmetiIDS.findIndex(id => id === predmet.id);
      let kolona = indeksPredmeta + 1;

      let h = o.vrednost * 10;

      let divOcena = document.createElement('div');
      divOcena.style.backgroundColor = color;
      divOcena.style.gridArea = `1 / ${kolona} / 2 / ${kolona + 1}`
      divOcena.style.height = `${h}%`;
      oceneEl.appendChild(divOcena);
    });


    cardEl.appendChild(oceneEl);

    ulElContainer.appendChild(cardEl);
  }

  dodajOcenu(ocena) {
    this.ocene = [...this.ocene, ocena]
  }
}
