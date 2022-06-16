export function ValidationsProductForm (id) {
  const d = document,
    $form = d.getElementById(id),
    $inputs = $form.querySelectorAll('[required]'),
    $scanCamPanel = d.querySelector('.panel-scan-cam'),
    $scanBtn = d.querySelector('.btn-code-span');
  let formValues = {};
  
  
  $inputs.forEach( (el) => {
    const $span = d.createElement('span');
    $span.id = el.name;
    $span.textContent = el.title || 'Error al ingresar el dato';
    $span.classList.add('contact-form-error','none');
    el.insertAdjacentElement('afterend', $span); 
  })

  $form.addEventListener('keyup', (e) => {
    if(e.target.matches('#create-product-form [required]')) {
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
  $form.addEventListener('click', (e) => {
    if(e.target.matches('.btn-code-scan')){
      console.log(e.target);
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
  })
  $form.addEventListener('submit', (e) => {
    e.preventDefault()
    let $panel = d.querySelector('.panel'),
    $template = d.getElementById('show-template').content,
    $fragment = d.createDocumentFragment();

    $inputs.forEach($input => {
      formValues[`${$input.name}`] =  $input.value;
    })

    let oldCode = productsList.find(el=> el.code === formValues.code);
    let oldVarCode = productsList.find(el=> el.barCode === formValues.barCode);

    if (oldCode){
      e.preventDefault()
      $inputs[2].value = '';
      $panel.classList.add('is-active');
      $template.querySelector('h3').textContent = 'Ocurrio un Error';
      $template.querySelector('p').textContent = 'El Código Interno ingresado pertenece a un producto existente. Ingrese uno nuevo.'; 
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
    if (oldVarCode){
      e.preventDefault()
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
    }

    if($inputs[4].value !== $inputs[5].value) {
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
    }

  })
}