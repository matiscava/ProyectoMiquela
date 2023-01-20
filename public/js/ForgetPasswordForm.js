import { ValidationsForgetPasswordForm } from "./validations/ValidationsForgetPasswordForm.js";

export function ForgetPasswordForm(){
  const d = document;
  let formValues = {};
  setTimeout( () => ValidationsForgetPasswordForm(d,formValues),0);
}