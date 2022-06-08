export function ValidationsClientForm ( d , formValues ) {
  const $form = d.getElementById('new-client-form'),
    $inputs = $form.querySelectorAll('[required]');

  $inputs.forEach( (el) => {
    const $span = d.createElement('span');
    $span.id = el.name;
    $span.textContent = el.title || 'Error al ingresar el dato';
    $span.classList.add('contact-form-error','none');
    el.insertAdjacentElement('afterend', $span); 
  });
  $form.addEventListener('keyup', (e) => {
    if(e.target.matches('#new-client-form [required]')) {
      let $input = e.target,
        pattern = $input.pattern;

      if(pattern && pattern.value !== ''){
        let regex = new RegExp(pattern)

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

  $inputs.forEach($input => {
    formValues[`${$input.name}`] =  $input.value;
  })
  let oldCuit = clientsList.find(el => el.cuit === formValues.cuit )
  let oldEmail = clientsList.find(el => el.email === formValues.email )
  if(oldCuit) {
  e.preventDefault();

    $inputs[1].value = '';
    $panel.classList.add('is-active');
    $template.querySelector('h3').textContent = 'Ocurrio un Error';
    $template.querySelector('p').textContent = 'El CUIT/CUIL ingresado pertenece a un proveedor/cliente existente'; 
    $template.querySelector('input').value = 'Cerrar';
    $template.querySelector('input').id = 'btn-cerrar';
    let $clone = d.importNode($template,true);

    $fragment.appendChild($clone)
    $fragment.getElementById('btn-cerrar').addEventListener('click', (e) => {
      $panel.classList.remove('is-active');
    })
    $panel.innerHTML = "";
    $panel.appendChild($fragment);
  }else if(oldEmail) {
  e.preventDefault();

    $inputs[2].value = '';
    $panel.classList.add('is-active');
      $template.querySelector('h3').textContent = 'Ocurrio un Error';
      $template.querySelector('p').textContent = 'El email ingresado pertenece a un proveedor/cliente existente'; 
      $template.querySelector('input').value = 'Cerrar';
      $template.querySelector('input').id = 'btn-cerrar';
      let $clone = d.importNode($template,true);

      $fragment.appendChild($clone)
      $fragment.getElementById('btn-cerrar').addEventListener('click', (e) => {
        $panel.classList.remove('is-active');
      })
      $panel.innerHTML = "";
      $panel.appendChild($fragment);
  } else {
    e.defaultPrevented();
  }
 }) 
}
