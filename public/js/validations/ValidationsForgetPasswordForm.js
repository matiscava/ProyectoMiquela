export function ValidationsForgetPasswordForm (d, formValues){
  const $form = d.getElementById('forget-password-form'),
    $inputs = d.querySelectorAll('#forget-password-form [required]');
  $inputs.forEach( el => {
    const $span = d.createElement('span');
    $span.id = el.name;
    $span.textContent = el.title;
    $span.classList.add('contact-form-error','none');
    el.insertAdjacentElement('afterend', $span);
  })

  $form.addEventListener('keyup' , (e) => {
    console.log("pressss");
    if(e.target.matches('#forget-password-form [required]')) {
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

    const user = userList.find( u => u.email === $inputs[0].value);
    if (!user) {
      e.preventDefault();
      $inputs[1].value = '';
      $panel.classList.add('is-active');
      $template.querySelector('h3').textContent = 'Ocurrio un Error';
      $template.querySelector('p').textContent = 'No existe un usuario con ese email.'; 
      $template.querySelector('input').value = 'Cerrar';
      $template.querySelector('input').id = 'btn-cerrar';
      let $clone = d.importNode($template,true);
      $fragment.appendChild($clone)
      $fragment.getElementById('btn-cerrar').addEventListener('click', (e) => {
        $panel.classList.remove('is-active');

      })
      $panel.innerHTML = "";
      $panel.appendChild($fragment);
    }
    if(user.dni !== $inputs[1].value){
      e.preventDefault();
      $inputs[1].value = '';
      $panel.classList.add('is-active');
      $template.querySelector('h3').textContent = 'Ocurrio un Error';
      $template.querySelector('p').textContent = 'No coincide el email con el DNI ingresado.'; 
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