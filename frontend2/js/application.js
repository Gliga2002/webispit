import CustomError from "../util/CustomError.js";
import Predmet from "./predmet.js";
import Student from "./student.js";
import Ocena from "./ocena.js";

export class Application {
  constructor(predmetiFetched) {
    this.fields = [
      { name: "Broj indeksa:", class: "brind" },
      { name: "Ime i prezime:", class: "imeprezime" },
      { name: "Predmet:", class: "predmet" },
      { name: "Ocena:", class: "ocena" },
    ];

    this.colors = ["#116bee", "#ee9411", "#36c984"];

    this.predmeti = predmetiFetched.map((predmet) => {
      const color = this.colors[Math.round(Math.random() * this.colors.length)];
      return new Predmet(
        predmet.id,
        predmet.naziv,
        color,
        this.manipulatePredmetiIDs
      );
    });

    this.predmetiIDs = [];
    this.studenti = [];
  }

  draw(container) {
    const formEl = document.createElement("form");
    this.drawForm(formEl);
    formEl.addEventListener("submit", this.submitFormHandler);
    container.appendChild(formEl);

    const mainEl = document.createElement("section");

    const checkboxesEl = document.createElement("div");
    checkboxesEl.classList.add("checkboxes");
    this.drawCheckboxes(checkboxesEl);
    mainEl.appendChild(checkboxesEl);
    const resultsEl = document.createElement("div");
    const ulEl = document.createElement("ul");
    ulEl.classList.add("cards");
    
    resultsEl.appendChild(ulEl);
    mainEl.appendChild(resultsEl);

    container.appendChild(mainEl);
  }

  drawCheckboxes(checkboxContainer) {
    this.predmeti.forEach((predmet) => {
      const checkboxDivEl = document.createElement("div");
      checkboxDivEl.classList.add("checkbox-div");
      predmet.draw(checkboxDivEl, predmet);
      checkboxContainer.appendChild(checkboxDivEl);
    });
  }

  drawForm(formContainer) {
    this.fields.forEach((label) => {
      return this.drawInputBox({
        divEl: document.createElement("div"),
        formEl: formContainer,
        labelText: label.name,
        inputClass: label.class,
      });
    });

    const buttonEl = document.createElement("button");
    buttonEl.textContent = "Upisi";
    formContainer.appendChild(buttonEl);

    formContainer.classList.add("form");
  }

  drawStudents(ulElContainer) {
    console.log(this.studenti);
    this.studenti.forEach((student) => {
      student.draw(ulElContainer, this.predmetiIDs, this.predmeti);
    })
  }

  drawInputBox({ divEl, formEl, labelText, inputClass }) {
    const labelEl = document.createElement("label");
    labelEl.innerText = labelText;
    divEl.appendChild(labelEl);

    const inputEl = document.createElement("input");
    inputEl.setAttribute("name", inputClass);
    divEl.appendChild(inputEl);

    formEl.appendChild(divEl);
  }

  submitFormHandler = async (event) => {
    event.preventDefault();

    const formEl = event.target;

    const formData = new FormData(formEl);

    try {
      const response = await fetch("http://localhost:5192/Ocene/DodajOcenu", {
        method: "POST",
        body: JSON.stringify({
          brojIndeksa: formData.get("brind"),
          imePrezime: formData.get("imeprezime"),
          predmet: formData.get("predmet"),
          ocena: formData.get("ocena"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new CustomError(
          "Something went wrong, please try again later",
          response.statusText,
          response.status
        );
      }

      const data = await response.json();

      const isFound = this.predmeti.find(
        (predmet) => predmet.id === data.predmet.id
      );

      if (!isFound) {
        const randomColor =
          this.colors[Math.round(Math.random() * this.colors.length)];
        const newPredmet = new Predmet(
          data.predmet.id,
          data.predmet.naziv,
          randomColor
        );
        this.predmeti = [...this.predmeti, newPredmet];
      }

      // bad performance, nemam vreme
      const checkboxesEl = document.querySelector(".checkboxes");
      checkboxesEl.innerHTML = '';
      this.drawCheckboxes(checkboxesEl);

      formEl.reset();
    } catch (err) {
      console.log(
        err.message,
        err.statusText || "Error",
        err.statusCode || 500
      );
    }
  };

  manipulatePredmetiIDs = async (idPremeta, isChecked) => {
    if (isChecked) {
      this.predmetiIDs = [...this.predmetiIDs, idPremeta];
    }

    if (!isChecked) {
      this.predmetiIDs = this.predmetiIDs.filter(
        (predmetId) => predmetId !== idPremeta
      );
    }

    console.log(this.predmetiIDs);

    try {
      const response = await fetch("http://localhost:5192/Ocene/PreuzmiOcene", {
        method: "PUT",
        body: JSON.stringify(this.predmetiIDs),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new CustomError(
          "Something went wrong, please try again later",
          response.statusText,
          response.status
        );
      }
      const ocene = await response.json();

      console.log(ocene);

      ocene.forEach((ocena) => {
        let student = this.studenti.find(
          (student) => {
            return student.id === ocena.student.id
          }
        );

        if (!student) {
          student = new Student(
            ocena.student.id,
            ocena.student.index,
            ocena.student.imePrezime,
            []
          );
          this.studenti = [...this.studenti, student];

          let o = new Ocena(ocena.vrednost, ocena.predmet.naziv);
          student.dodajOcenu(o);
        }
        
      });


      const ulEl = document.querySelector('.cards');
      ulEl.innerHTML = '';

      this.drawStudents(ulEl);

      
    } catch (err) {
      console.log(
        err.message,
        err.statusText || "Error",
        err.statusCode || 500
      );
    }
  };
}
