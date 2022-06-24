import { SetClientsList } from "./settings/SetClientList.js";
import getSiblings from "./helpers/getSiblings.js";


export function HistoryIngress (){
  const d = document,
    $historyIngressForm = d.getElementById('history-ingress-form'),
    $historyIngressTemmplate = d.getElementById('history-ingress-template').content,
    $newItemBtn = d.getElementById('btn-add-item'),
    $scanCamPanel = d.querySelector('.panel-scan-cam'),
    $select = d.querySelector('select[name=client]');
    let valueNumber = 1
    
    SetClientsList('proveedor',$select);

    d.addEventListener('click', (e) => {
      if (e.target === $newItemBtn){
        let $clone = d.importNode($historyIngressTemmplate, true);

        $clone.querySelectorAll('label')[0].setAttribute('for',`[products][${valueNumber}][barCodeScan]`);
        $clone.querySelectorAll('input[type=text]')[0].setAttribute('name',`[products][${valueNumber}][barCodeScan]`);
        $clone.querySelectorAll('label')[1].setAttribute('for',`[products][${valueNumber}][nameScan]`);
        $clone.querySelectorAll('input[type=text]')[1].setAttribute('name',`[products][${valueNumber}][nameScan]`);
        $clone.querySelectorAll('label')[2].setAttribute('for',`[products][${valueNumber}][quantity]`);
        $clone.querySelectorAll('input[type=number]')[0].setAttribute('name',`[products][${valueNumber}][quantity]`);
        $clone.querySelector('.btn-code-scan').setAttribute('data-barCode',`${valueNumber}`)
        $clone.querySelectorAll('input[type=hidden]')[0].setAttribute('name',`[products][${valueNumber}][barCode]`);
        $clone.querySelectorAll('input[type=hidden]')[1].setAttribute('name',`[products][${valueNumber}][name]`);
        
        d.querySelector('.items-list').appendChild($clone)
        valueNumber = valueNumber + 1 ;
      }
      if(e.target.matches('.btn-code-scan')){
        $scanCamPanel.querySelector('.scan-cam-container #scan-cam-send').setAttribute('data-barCode',`${e.target.getAttribute('data-barCode')}`)
        $scanCamPanel.classList.add('is-active')
      }
      if(e.target.matches('.scan-cam-container #scan-cam-send')){
        $scanCamPanel.classList.remove('is-active')
        let query = e.target.getAttribute('data-barCode');
        let $inputText =$historyIngressForm.querySelector(`input[name='[products][${query}][barCode]']`)
        let $inputTextDisabled =$historyIngressForm.querySelector(`input[name='[products][${query}][barCodeScan]']`)
        let $inputName = $historyIngressForm.querySelector(`input[name='[products][${query}][nameScan]']`)
        let $inputNamDisabled = $historyIngressForm.querySelector(`input[name='[products][${query}][name]']`)
        let name ;
        itemsList.find(el => el.barCode === sessionStorage.barCode) ? name = itemsList.find(el => el.barCode === sessionStorage.barCode).name : name = 'Producto no encontrado';
        
        $inputNamDisabled.value = name || 'Producto No encontrado';
        $inputName.value = name || 'Producto No encontrado';
        let text = sessionStorage.barCode || 'error de lectura';
        
        
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

    d.addEventListener('change', (e) => {
      if(e.target === $select){
        let $option = $select.options[$select.options.selectedIndex];
        if($option.value !== '0'){
          d.querySelector('input[name=clientIDHidden]').value = $option.getAttribute('data-cuit');
          d.querySelector('input[name=clientID]').value = $option.getAttribute('data-cuit');
        }else{
          d.querySelector('input[name=clientIDHidden]').value = "";
          d.querySelector('input[name=clientID]').value = "";
        }
      }
      if(e.target.matches('input.bar-code-input')){
        let siblings = getSiblings(e.target);
        let item = itemsList.find( el => el.barCode === e.target.value)
        if(!item) {
          e.target.classList.add('error')
          siblings[1].classList.add('error')
          siblings[1].value= 'No existe el item seleccionado';
        }else{
          e.target.classList.remove('error')
          siblings[1].classList.remove('error')
          siblings[1].value= item.name;
        }
      }
    })

}