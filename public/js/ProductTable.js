import { SetOptions } from "./settings/setOptions.js";

export function ProductTable(){
  const d = document,
  $productTable = d.getElementById('product-table'),
  $productTemplate = d.getElementById('product-template').content,
  $productFragment = d.createDocumentFragment(),
  $buttons = d.querySelectorAll('button[data-filter-name]'),
  $loaderPanel = d.querySelector('.panel-loader');
  let ready = false;

  function setProducTable (list) {
    ready = false;
    list.forEach( (el) => {
      const tds = $productTemplate.querySelectorAll('td');
       tds[0].textContent = el.varCode;
       tds[1].textContent = el.code;
       tds[2].textContent = el.name;
       tds[3].textContent = el.description;
       tds[4].textContent = el.type;
       tds[5].textContent = el.stock;
       let $clone = d.importNode($productTemplate, true);
       $productFragment.appendChild($clone);
    });
    $productTable.querySelector('tbody').innerHTML= '';
    $productTable.querySelector('tbody').appendChild($productFragment);

  }

  SetOptions($productTable, productList);

  $productTable.addEventListener('click', (e) => {
    $buttons.forEach( ($button) => {
      if (e.target === $button) {
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
            setProducTable(productList)
          }else if (option === 'ascendente') { 
            let newList = [...productList];
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
            setProducTable(newList)
          } else if (option === 'descendente') { 
            let newList = [...productList];
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
            setProducTable(newList)
          } else {
            let newList = productList.filter( el => el[filtername] == option)
            setProducTable(newList)
          }
          $select.classList.add('none');
          $button.setAttribute('data-filter-active', 'inactive');
          $button.textContent ='\u25be';
        })
      }
    })
  })
  setTimeout(() => {
    setProducTable(productList)

    $loaderPanel.classList.remove('is-active');
    
    ready = true;
  }, ready);


}