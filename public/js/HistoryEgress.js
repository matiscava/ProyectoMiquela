import getSiblings from "./helpers/getSiblings.js";
import { SetClientsList } from "./settings/SetClientList.js";

export function HistoryEgress() {
  const d = document,
  $historyEgressForm = d.getElementById('history-egress-form'),
  $historyEgressTemmplate = d.getElementById('history-egress-template').content,
  $newItemBtn = d.getElementById('btn-add-item'),
  $scanCamPanel = d.querySelector('.panel-scan-cam'),
  $select = d.querySelector('select[name=client]');
  let valueNumber = 1


  SetClientsList('cliente',$select);

  d.addEventListener('click' , (e) => {
    if (e.target === $newItemBtn){
      let $clone = d.importNode($historyEgressTemmplate, true);

      $clone.querySelectorAll('label')[0].setAttribute('for',`[products][${valueNumber}][varCode]`);
      $clone.querySelectorAll('input[type=text]')[0].setAttribute('name',`[products][${valueNumber}][varCode]`);
      $clone.querySelectorAll('input[type=text]')[0].setAttribute('data-next-input',`[products][${valueNumber}][name]`);
      $clone.querySelectorAll('label')[1].setAttribute('for',`[products][${valueNumber}][name]`);
      $clone.querySelectorAll('input[type=text]')[1].setAttribute('name',`[products][${valueNumber}][name]`);
      $clone.querySelectorAll('label')[2].setAttribute('for',`[products][${valueNumber}][quantity]`);
      $clone.querySelectorAll('input[type=number]')[0].setAttribute('name',`[products][${valueNumber}][quantity]`);
      $clone.querySelector('.btn-code-scan').setAttribute('data-varCode',`[products][${valueNumber}][varCode]`)
      d.querySelector('.items-list').appendChild($clone);
      valueNumber = valueNumber + 1 ;

    }

    if(e.target.matches('.btn-code-scan')){
      $scanCamPanel.querySelector('article button').setAttribute('data-varCode',`${e.target.getAttribute('data-varCode')}`)
      $scanCamPanel.classList.add('is-active')
    }

    if(e.target.matches('.scan-cam-container button')){
      $scanCamPanel.classList.remove('is-active')
      let query = e.target.getAttribute('data-varCode');
      let $inputText =$historyEgressForm.querySelector(`input[name='${query}']`)
      $inputText.value = 'Chewbacca';
    }
    
    if(e.target.matches('.new-item .btn-delete-item')){
      let $div = e.target.parentNode;
      d.querySelector('.items-list').removeChild($div);
    }
    
  })

  d.addEventListener('change', (e) => {
    if(e.target === $select){
      let option = e.target.value;
      if(option !== '0'){
        let client = clientsList.find( client => client.name === option)
        d.querySelector('input[name=clientID]').value = client.cuit;
      }else{
        d.querySelector('input[name=clientID]').value = "";
      }
    }
    if(e.target.matches('input.var-code-input')){
      let item = itemsList.find( el => el.varCode === e.target.value)
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