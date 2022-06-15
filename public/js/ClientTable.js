import { SetOptions } from "./settings/SetOptions.js";

export function ClientTable(){
  const d = document,
  $clientTable = d.getElementById('client-table'),
  $clientTemplate = d.getElementById('client-template').content,
  $clientFragment = d.createDocumentFragment(),
  $buttons = d.querySelectorAll('button[data-filter-name]'),
  $loaderPanel = d.querySelector('.panel-loader');
  let ready = false;

  function setClientTable (list) {
    ready = false;
    list.forEach( (el) => {
       const tds = $clientTemplate.querySelectorAll('td'),
        $tableLink = $clientTemplate.querySelector('.table-btn');
       
       tds[0].textContent = el.cuit;
       tds[1].textContent = el.name;
       tds[2].textContent = el.adress;
       tds[3].textContent = el.phone;
       tds[4].textContent = el.email;
       tds[5].textContent = el.type;
      $tableLink.textContent = 'Ver Cliente';
       $tableLink.setAttribute('href', `/clients/client-${el.id}`);
       let $clone = d.importNode($clientTemplate, true);
       $clientFragment.appendChild($clone);
    });
    $clientTable.querySelector('tbody').innerHTML = '';
    $clientTable.querySelector('tbody').appendChild($clientFragment);
  }

  SetOptions($clientTable, clientList);

  $clientTable.addEventListener('click', (e) => {
    $buttons.forEach($button => {
      if( e.target === $button) {
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

        $select.addEventListener('change', (e) => {
          let option = e.target.value;

          if (option ==='todos') {
            setClientTable(clientList)
          }else if (option === 'ascendente') { 
            let newList = [...clientList];
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
            setClientTable(newList)
          } else if (option === 'descendente') { 
            let newList = [...clientList];
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
            setClientTable(newList)
          } else {
            let newList = clientList.filter( el => el[filtername] == option)
            setClientTable(newList)
          }
          $select.classList.add('none');
          $button.setAttribute('data-filter-active', 'inactive');
          $button.textContent ='\u25be';
        })
      }
    })
  })
  setTimeout(() => {
    setClientTable(clientList);
    $loaderPanel.classList.remove('is-active');
    
    ready = true;
  }, ready);
}