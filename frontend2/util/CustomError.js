export default class CustomError extends Error {
  constructor(message, statusText, statusCode) {
    super(message);
    this.statusText = statusText;
    this.statusCode = statusCode;
  }
}