export function ValidationsClientForm ( id ) {
  const d = document,
    $form = d.getElementById(id),
    socket = io.connect(),
    $inputs = $form.querySelectorAll('[required]');
  let formValues = {};

  $inputs.forEach( (el) => {
    const $span = d.createElement('span');
    $span.id = el.name;
    $span.textContent = el.title || 'Error al ingresar el dato';
    $span.classList.add('contact-form-error','none');
    el.insertAdjacentElement('afterend', $span); 
  });
  $form.addEventListener('keyup', (e) => {
    if(e.target.matches(`${id} [required]`)) {
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
    let message;
    if(window.location.pathname.includes('upgrade')){
        message= `Ha editado el Cliente: ${$inputs[0].value}`;
    }else{
        message= `Ha creado el Cliente: ${$inputs[0].value}`;
    }
    socket.emit('notification', {message})

    e.defaultPrevented();
  }
 }) 
}
