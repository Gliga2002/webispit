export class Student {
  constructor(id, indeks, imeprezime, ocene) {
    this.id = id;
    this.indeks = indeks;
    this.imeprezime = imeprezime;
    this.ocene = ocene;
  }

  dodajOcenu(ocena) {
    this.ocene.push(ocena);
  }

  draw(container, predmetiIDs, predmeti) {
    const div = document.createElement("div");
    div.classList.add("student");

    const ime = document.createElement("p");
    ime.innerHTML = this.imeprezime;
    ime.classList.add("ime-studenta");
    div.appendChild(ime);

    const ocene = document.createElement("div");
    ocene.classList.add("ocene");

    // racunanje sirine ocene
    const n = predmetiIDs.length;

    ocene.style.gridTemplateColumns = `repeat(${n}, 1fr)`;

    // iscrtavanje ocene
    this.ocene.forEach((o) => {
      // prvo naci predmet u nizu predmeta
      let predmet = predmeti.find((p) => p.naziv == o.predmet);
      // zatim odrediti boju
      let color = predmet.color;
      // zatim na osnovu niza IDjeva predmeta odrediti poziciju
      let indeksPredmeta = predmetiIDs.findIndex((id) => id == predmet.id);
      let kolona = indeksPredmeta + 1;

      let h = o.vrednost * 10;

      let divOcena = document.createElement("div");
      divOcena.style.backgroundColor = color;
      divOcena.style.gridArea = `1 / ${kolona} / 2 / ${kolona + 1}`;
      divOcena.style.height = `${h}%`;
      divOcena.classList.add("ocena");
      ocene.appendChild(divOcena);
    });

    div.appendChild(ocene);

    container.appendChild(div);
  }
}
