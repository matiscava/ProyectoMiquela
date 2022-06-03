export function HistoryTable (){

  const d = document,
  $historyTable = d.getElementById('history-table'),
  $historyTemplate = d.getElementById('history-template').content,
  $historyFragment = d.createDocumentFragment(),
  $buttons = d.querySelectorAll('button[data-filter-name]'),
  $loaderPanel = d.querySelector('.panel-loader');
  let ready = false;
  
  console.log($buttons);
  function setHistoryTable (list) {
    ready = false;
    console.log('cargando Tabla');
    list.forEach( (el) => {
      $historyTemplate.querySelector('.form-reference-number').textContent = el.referenceNumber;
      $historyTemplate.querySelector('.form-date').textContent = el.date;
      $historyTemplate.querySelector('.form-client').textContent = el.client;
      $historyTemplate.querySelector('.form-item').textContent = el.item;
      $historyTemplate.querySelector('.form-quantity').textContent = el.quantity;
      $historyTemplate.querySelector('.form-type').textContent = el.type;
      let $clone = d.importNode($historyTemplate,true);
      $historyFragment.appendChild($clone);
    })
    $historyTable.querySelector('tbody').innerHTML= '';
    $historyTable.querySelector('tbody').appendChild($historyFragment);
  }

  function setOptions () {
    const $selects = d.querySelectorAll('#history-table select');
    
    $selects.forEach( el => {
      let data = el.getAttribute('name'),
      optionValues = [];

      historyList.forEach( el => {
        optionValues.push(el[data])
      })
      optionValues = [...new Set(optionValues)];
      data !== 'quantity' ? optionValues.sort() : optionValues.sort(function(a, b){return a - b}) ;
      optionValues.forEach( item => {
        let $option = d.createElement('option');
        $option.setAttribute('value', item);
        $option.textContent = item;
        el.appendChild($option);
      })


    })
  }

  setOptions()



  d.addEventListener('click', (e) => {
    $buttons.forEach($button => {
      if(e.target === $button){

        let filtername = $button.getAttribute('data-filter-name'),
          $select = d.getElementsByName(filtername)[0],
          isActive = $button.getAttribute('data-filter-active');
        
        if(isActive === 'inactive') {
          $select.classList.remove('none');
          $button.setAttribute('data-filter-active', 'active');
          $button.textContent = '\u25b4';
        } else if ( isActive ===  'active') {
          $select.classList.add('none');
          $button.setAttribute('data-filter-active', 'inactive');
          $button.textContent ='\u25be';
        }
        $select.addEventListener('change', e => {
          let option = e.target.value;
          console.log(option);

          if (option ==='todos') {
            setHistoryTable(historyList)
          }else if (option === 'ascendente') { 
            let newList = [...historyList];
            newList.sort(function (a, b) {
              if (a[filtername] > b[filtername]) {
                return 1;
              }
              if (a[filtername] < b[filtername]) {
                return -1;
              }
              // a must be equal to b
              return 0;
            });
            setHistoryTable(newList)
          } else if (option === 'descendente') { 
            let newList = [...historyList];
            newList.sort(function (a, b) {
              if (a[filtername] < b[filtername]) {
                return 1;
              }
              if (a[filtername] > b[filtername]) {
                return -1;
              }
              // a must be equal to b
              return 0;
            });
            setHistoryTable(newList)
          } else {
            let newList = historyList.filter( el => el[filtername] == option)
            console.log( newList );
            setHistoryTable(newList)
          }
          $select.classList.add('none');
          $button.setAttribute('data-filter-active', 'inactive');
          $button.textContent ='\u25be';

        })




      }
    })
  })

  
  
  setTimeout(() => {
    setHistoryTable(historyList);
    $loaderPanel.classList.remove('is-active');
    
    ready = true;
  }, ready);
}