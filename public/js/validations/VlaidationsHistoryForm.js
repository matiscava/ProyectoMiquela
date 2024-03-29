import { SetClientsList } from "../settings/SetClientList.js";

export   function ValidationsHistoryForm(id) {
  const d = document,
    $form = d.getElementById(id),
    $inputs = $form.querySelectorAll('[required]'),
    $select = $form.querySelector('select[name=client]'),
    socket = io.connect(),
    $scanCamPanel = d.querySelector('.panel-scan-cam');
    
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
  $form.addEventListener('click', (e) => {

    if(e.target.matches('.btn-code-scan')){
      $scanCamPanel.querySelector('.scan-cam-container #scan-cam-send').setAttribute('data-barCode',`${e.target.getAttribute('data-barCode')}`)
      $scanCamPanel.classList.add('is-active')
    }
  })
  $scanCamPanel.addEventListener('click', (e) => {
    if( e.target.matches('.scan-cam-container #scan-cam-send')){
      $scanCamPanel.classList.remove('is-active')
      let $inputBarCodeDisabled = $form.querySelector(`input[name='barCodeScan']`)
      let text = sessionStorage.barCode;
      $inputBarCodeDisabled.value = text; 
      sessionStorage.removeItem('barCode');
      let $resultContainer = document.getElementById('qr-reader-results');
      $resultContainer.querySelector('.qr-result').textContent = 'Resultado: ';
    }
    if(e.target.matches('.icon-cancel')){
      $scanCamPanel.classList.remove('is-active')
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
    let oldBarCode = itemsList.find(el => el.barCode === formValues.barCode )
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
    }else if(oldBarCode) {
    e.preventDefault();
    $inputs[4].value = '';
    $inputs[5].value = '';
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
    } else if($inputs[4].value !== $inputs[5].value) {
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
      let message = `Ha editado el ${$select.options[$select.options.selectedIndex].value} N° ${$inputs[1].value}`;
      let data = {};
      data.barCode = $inputs[4].value;
      data.name = $inputs[3].value;
      let quantity = $inputs[6].value,
        originalQuantity = $inputs[6].getAttribute('data-quantity'),
        type = $form.querySelector('select[name="type"]').options[$form.querySelector('select[name="type"]').options.selectedIndex].value;
      data.diference = originalQuantity - quantity ;
      if(type === 'Egreso'){
        data.diference = data.diference * -1;
      }

      socket.emit('notification', {message} );
      socket.emit('change-stock',data);
        


      e.defaultPrevented();
    }
   }) 
}