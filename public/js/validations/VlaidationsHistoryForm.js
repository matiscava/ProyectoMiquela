import { SetClientsList } from "../settings/SetClientList.js";

export   function ValidationsHistoryForm(id) {
  const d = document,
    $form = d.getElementById(id),
    $inputs = $form.querySelectorAll('[required]'),
    $select = $form.querySelector('select[name=client]');
  let formValues = {};
  SetClientsList('todos', $select);
  $inputs.forEach( (el) => {
    const $span = d.createElement('span');
    $span.id = el.name;
    $span.textContent = el.title || 'Error al ingresar el dato';
    $span.classList.add('contact-form-error','none');
    el.insertAdjacentElement('afterend', $span); 
  })

  for (const option of  $select.options) {
    if(option.getAttribute('data-cuit') === histoyCuit ) option.setAttribute('selected',true);
  }

  $select.addEventListener('change', (e) => {
      let $option = $select.options[$select.options.selectedIndex];
      if($option.value !== '0'){
        d.querySelector('input[name=clientIDDisabled]').value = $option.getAttribute('data-cuit');
        d.querySelector('input[name=clientID]').value = $option.getAttribute('data-cuit');
      }else{
        d.querySelector('input[name=clientIDDisabled]').value = "";
        d.querySelector('input[name=clientID]').value = "";
      }
  })

  $form.addEventListener('keyup', (e) => {
    if(e.target.matches(`${id} [required]`)){
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
    let oldCuit = clientsList.find(el => el.cuit === formValues.cuit );
    let oldVarCode = clientsList.find(el => el.varCode === formValues.varCode )
    if(oldCuit) {
    e.preventDefault();
  
      $inputs[0].value = '';
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
    }else if(oldVarCode) {
    e.preventDefault();
    $inputs[3].value = '';
    $inputs[4].value = '';
    $panel.classList.add('is-active');
    $template.querySelector('h3').textContent = 'Ocurrio un Error';
    $template.querySelector('p').textContent = 'El Código de Barra ingresado pertenece a un producto existente.'; 
    $template.querySelector('input').value = 'Cerrar';
    $template.querySelector('input').id = 'btn-cerrar';
    let $clone = d.importNode($template,true);

    $fragment.appendChild($clone)
    $fragment.getElementById('btn-cerrar').addEventListener('click', (e) => {
      $panel.classList.remove('is-active');
    })
    $panel.innerHTML = "";
    $panel.appendChild($fragment);
    } else if($inputs[3].value !== $inputs[4].value) {
      e.preventDefault()
      $panel.classList.add('is-active');
      $template.querySelector('h3').textContent = 'Ocurrio un Error';
      $template.querySelector('p').textContent = 'El Código de Barra ingresado NO coincide con el escaneado, vuelva a intentarlo.'; 
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