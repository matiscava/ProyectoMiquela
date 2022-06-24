import getSiblings from "./helpers/getSiblings.js";
import { SetClientsList } from "./settings/SetClientList.js";

export function HistoryUpgradeForm() {
  const d = document,
  $historyEgressForm = d.getElementById('history-upgrade-form'),
  $historyEgressTemmplate = d.getElementById('history-upgrade-template').content,
  $newItemBtn = d.getElementById('btn-add-item'),
  $scanCamPanel = d.querySelector('.panel-scan-cam'),
  $select = d.querySelector('select[name=client]'),
  $selectType = d.querySelector('select[name=type]');

  
  SetClientsList('todos',$select);
  
  if ($selectType.value === 'Egreso'){
    let $inputQuantity = d.querySelectorAll('input[data-name=quantity]');
    $inputQuantity.forEach( $input => {
      $input.setAttribute('max', $input.getAttribute('data-stock'))
    });
  }

  for (const option of  $select.options) {
    if(option.getAttribute('data-cuit') === histoyCuit ) option.setAttribute('selected',true);
  }

  d.addEventListener('click' , (e) => {
    if (e.target === $newItemBtn){
      let $clone = d.importNode($historyEgressTemmplate, true);
      $clone.querySelectorAll('label')[0].setAttribute('for',`[products][${historyLength}][barCodeScan]`);
      $clone.querySelectorAll('input[type=text]')[0].setAttribute('name',`[products][${historyLength}][barCodeScan]`);
      $clone.querySelectorAll('label')[1].setAttribute('for',`[products][${historyLength}][nameScan]`);
      $clone.querySelectorAll('input[type=text]')[1].setAttribute('name',`[products][${historyLength}][nameScan]`);
      $clone.querySelectorAll('label')[2].setAttribute('for',`[products][${historyLength}][quantity]`);
      $clone.querySelectorAll('input[type=number]')[0].setAttribute('name',`[products][${historyLength}][quantity]`);
      $clone.querySelector('.btn-code-scan').setAttribute('data-barCode',`${historyLength}`)
      $clone.querySelectorAll('input[type=hidden]')[0].setAttribute('name',`[products][${historyLength}][barCode]`);
      $clone.querySelectorAll('input[type=hidden]')[1].setAttribute('name',`[products][${historyLength}][name]`);

      d.querySelector('.items-list').appendChild($clone);
      // historyLength = historyLength + 1 ;
      historyLength++;

    }

    if(e.target.matches('.btn-code-scan')){
      $scanCamPanel.querySelector('.scan-cam-container #scan-cam-send').setAttribute('data-barCode',`${e.target.getAttribute('data-barCode')}`)
      $scanCamPanel.classList.add('is-active')
    }

    if(e.target.matches('.scan-cam-container #scan-cam-send')){
      $scanCamPanel.classList.remove('is-active')
      let query = e.target.getAttribute('data-barCode');
      let $inputText =$historyEgressForm.querySelector(`input[name='[products][${query}][barCode]']`)
      let $inputTextDisabled =$historyEgressForm.querySelector(`input[name='[products][${query}][barCodeScan]']`)
      let $inputName = $historyEgressForm.querySelector(`input[name='[products][${query}][nameScan]']`)
      let $inputNamDisabled = $historyEgressForm.querySelector(`input[name='[products][${query}][name]']`)
      let name = sessionStorage.barCode ? itemsList.find(el => el.barCode === sessionStorage.barCode).name : 'Error';
      $inputNamDisabled.value = name || 'Producto No encontrado';
      $inputName.value = name || 'Producto No encontrado';
      let text = sessionStorage.barCode || 'error de lectura';
      let $inputQuantity = $historyEgressForm.querySelector(`input[name='[products][${query}][quantity]']`)
      let max = sessionStorage.barCode ? itemsList.find(el => el.barCode === sessionStorage.barCode).stock : 'Error';
      $inputQuantity.setAttribute('data-stock',max);
      let $option = $selectType.options[$selectType.options.selectedIndex]; 
      if ($option.value === 'Egreso'){
        $inputQuantity.setAttribute('max', $inputQuantity.getAttribute('stock') )
      } else{
        $inputQuantity.removeAttribute('max')
      }
      
      $inputText.value = text;
      $inputTextDisabled.value = text; 
      sessionStorage.removeItem('barCode');
      let $resultContainer = document.getElementById('qr-reader-results');
      $resultContainer.querySelector('.qr-result').textContent = 'Resultado: ';

    }

    if(e.target.matches('.icon-cancel')){
      $scanCamPanel.classList.remove('is-active')
    }

    
    if(e.target.matches('.create-item .btn-delete-item')){
      let $div = e.target.parentNode;
      d.querySelector('.items-list').removeChild($div);
    }
    
  })

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

  $selectType.addEventListener('change', (e) => {
    let $inputQuantity = d.querySelectorAll('input[data-name=quantity]');
    if($selectType.value === 'Ingreso'){
      $inputQuantity.forEach( $input => {
        $input.removeAttribute('max')
      })
    }else{
      $inputQuantity.forEach( $input => {
        $input.setAttribute('max',$input.getAttribute('data-stock'))
      })
    }
  })

  d.addEventListener('change', (e) => {
    if(e.target.matches('input.bar-code-input')){
      let item = itemsList.find( el => el.barCode === e.target.value)
      let siblings = getSiblings(e.target);
      if(!item) {
        e.target.classList.add('error')
        siblings[1].classList.add('error');
        siblings[1].value= 'No existe el item seleccionado';
      }else{
        e.target.classList.remove('error')
        siblings[1].classList.remove('error')
        siblings[1].value= item.name;
        if(siblings[2].value > item.stock) siblings[2].value = item.stock;
        siblings[2].setAttribute('max', item.stock );
      }
    }
  })
}