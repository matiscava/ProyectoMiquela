import { ValidationsSignupForm } from './validations/ValidationsSignupForm.js';

export function SignupForm(){
  const d = document;
  let formValues = {}

  setTimeout(()=>ValidationsSignupForm(d,formValues),0);

}
