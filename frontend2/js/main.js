import CustomError from "../util/CustomError.js";
import { Application } from "./application.js";

(async () => {
  try {
    const response = await fetch("http://localhost:5192/Ocene/PreuzmiPredmete");

    if (!response.ok) {
      throw new CustomError(
        "Something went wrong, please try again later",
        response.statusText,
        response.status
      );
    }
    const predmeti = await response.json();

    const app = new Application(predmeti);

    app.draw(document.body);

  } catch (err) {
    console.log(err);
    // do smth with it
    console.log(err.message, err.statusText || "Error", err.statusCode || 500);
  }
})();
