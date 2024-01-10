import { Ocena } from "./ocena.js";
import { Predmet } from "./predmet.js";
import { Student } from "./student.js";

export class Application {
  constructor(predmetiFetched) {
    this.polja = [
      { naziv: "Broj indeksa:", klasa: "brind" },
      { naziv: "Ime i prezime:", klasa: "imeprezime" },
      { naziv: "Predmet:", klasa: "predmet" },
      { naziv: "Ocena:", klasa: "ocena" },
    ];
    this.colors = ["#116bee", "#ee9411", "#36c984"];

    this.predmeti = predmetiFetched.map((p, index) => {
      const color = this.colors[index % this.colors.length];
      return new Predmet(p.id, p.naziv, color, this.handleChecked);
    });

    this.predmetiIDs = [];
    this.studenti = [];
  }

  draw(container) {
    const forma = document.createElement("div");
    forma.classList.add("forma");
    this.drawForma(forma);
    container.appendChild(forma);

    const pretraga = document.createElement("div");
    pretraga.classList.add("pretraga");

    const checkboxes = document.createElement("div");
    checkboxes.classList.add("checkboxes");
    this.drawCheckboxes(checkboxes);
    pretraga.appendChild(checkboxes);

    const rezultati = document.createElement("div");
    rezultati.classList.add("rezultati");
    pretraga.appendChild(rezultati);

    container.appendChild(pretraga);
  }

  drawForma(container) {
    this.polja.forEach((p) => {
      let lbl = document.createElement("label");
      lbl.innerHTML = p.naziv;
      lbl.classList.add("margin-10");
      container.appendChild(lbl);

      let input = document.createElement("input");
      input.classList.add(`input-${p.klasa}`, "margin-10");
      container.appendChild(input);
    });

    const btnUpisi = document.createElement("input");
    btnUpisi.type = "button";
    btnUpisi.value = "Upisi";
    btnUpisi.onclick = this.onClickUpisi;
    btnUpisi.classList.add("btn-upisi");
    container.appendChild(btnUpisi);
  }

  drawCheckboxes(container) {
    this.predmeti.forEach((p) => {
      let predmet = document.createElement("div");
      p.draw(predmet);
      container.appendChild(predmet);
    });
  }

  onClickUpisi = async () => {
    let vrednosti = {};

    this.polja.forEach((p) => {
      let input = document.querySelector(`.input-${p.klasa}`);
      vrednosti[p.klasa] = input.value;
    });

    const result = await fetch("http://localhost:5192/Ocene/DodajOcenu", {
      method: "POST",
      body: JSON.stringify({
        brojIndeksa: vrednosti["brind"],
        imePrezime: vrednosti["imeprezime"],
        predmet: vrednosti["predmet"],
        ocena: vrednosti["ocena"],
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());

    if (this.predmeti.find((p) => p.id == result.predmet.id) == null) {
      const color = this.colors[this.predmeti.length % this.colors.length];
      const noviPredmet = new Predmet(
        result.predmet.id,
        result.predmet.naziv,
        color
      );
      this.predmeti.push(noviPredmet);

      // iscrtati ponovo niz cbs
      const cbs = document.querySelector(".checkboxes");
      cbs.replaceChildren();
      this.drawCheckboxes(cbs);
    }
  };

  handleChecked = async (idPredmeta, isChecked) => {
    if (isChecked) {
      this.predmetiIDs.push(idPredmeta);
    } else {
      const indexP = this.predmetiIDs.findIndex((id) => id == idPredmeta);
      if (indexP != -1) {
        this.predmetiIDs.splice(indexP, 1);
      }
    }

    const ocene = await fetch("http://localhost:5192/Ocene/PreuzmiOcene", {
      method: "PUT",
      body: JSON.stringify(this.predmetiIDs),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());

    this.studenti = [];

    ocene.forEach((ocena) => {
      let student = this.studenti.find((s) => s.id == ocena.student.id);
      if (student == null) {
        student = new Student(
          ocena.student.id,
          ocena.student.indeks,
          ocena.student.imePrezime,
          []
        );
        this.studenti.push(student);
      }
      let o = new Ocena(ocena.vrednost, ocena.predmet.naziv);
      student.dodajOcenu(o);
    });

    console.log(this.studenti);
    const rez = document.querySelector(".rezultati");
    rez.replaceChildren();

    this.studenti.forEach((s) => {
      s.draw(rez, this.predmetiIDs, this.predmeti);
    });
  };
}
