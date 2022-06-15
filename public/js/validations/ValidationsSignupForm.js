export default function validationsSignupForm (d,formValues) {
  const $form = d.getElementById('signup-form'),
  $inputs = d.querySelectorAll('#signup-form [required]');

  $inputs.forEach( (el) => {
    const $span = d.createElement('span');
    $span.id = el.name;
    $span.textContent = el.title;
    $span.classList.add('contact-form-error','none');
    el.insertAdjacentElement('afterend', $span);
  })

  $form.addEventListener('keyup' , (e) => {
    if(e.target.matches('#signup-form [required]')) {
      let $input = e.target,
        pattern = $input.pattern || $input.dataset.pattern;

      if(pattern && pattern.value !== ''){
        let regex = new RegExp(pattern)
        formValues[`${$input.name}`] =  $input.value;

        return !regex.exec($input.value)
          ?d.getElementById($input.name).classList.add('is-active')
          :d.getElementById($input.name).classList.remove('is-active')
      }
      if(!pattern){
        return ($input.value === '')
          ?d.getElementById($input.name).classList.add('is-active')
          :d.getElementById($input.name).classList.remove('is-active')
      }
    }

  })
  $form.addEventListener('submit', (e) => {
    let $panel = d.querySelector('.panel'),
      $template = d.getElementById('show-template').content,
      $fragment = d.createDocumentFragment();

    if (formValues.password !== formValues.repassword) {
      e.preventDefault();

      console.log('Las contraseñas no coinciden');
      $inputs[5].value = '';
      $inputs[6].value = '';
      $panel.classList.add('is-active');
      $template.querySelector('h3').textContent = 'Ocurrio un Error';
      $template.querySelector('p').textContent = 'Las contraseñas no coinciden'; 
      $template.querySelector('input').value = 'Cerrar';
      $template.querySelector('input').id = 'btn-cerrar';
      let $clone = d.importNode($template,true);

      $fragment.appendChild($clone)
      $fragment.getElementById('btn-cerrar').addEventListener('click', (e) => {
        $panel.classList.remove('is-active');

      })
      $panel.innerHTML = "";
      $panel.appendChild($fragment);
    }else{
      e.defaultPrevented();
    }
  })
}