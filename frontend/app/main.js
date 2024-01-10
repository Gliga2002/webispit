import { Application } from "./application.js";

const predmeti = await fetch(
  "http://localhost:5192/Ocene/PreuzmiPredmete"
).then((response) => response.json());

const app = new Application(predmeti);
app.draw(document.body);
