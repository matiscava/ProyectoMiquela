import validationsSignupForm from './validations/ValidationsSignupForm.js';

export function SignupForm(){
  const d = document;
  let formValues = {}

  setTimeout(()=>validationsSignupForm(d,formValues),0);

}