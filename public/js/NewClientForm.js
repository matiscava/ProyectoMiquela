import { ValidationsClientForm } from "./validations/ValidationsClientForm.js";

export function NewClientForm(){
  const d = document;
  let formValues = {};
  setTimeout(() => ValidationsClientForm(d,formValues), 0);
}