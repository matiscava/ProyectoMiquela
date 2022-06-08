export function SetOptions ($table, list) {
  const $selects = $table.querySelectorAll('select');
  
  $selects.forEach( el => {
    let data = el.getAttribute('name'),
    optionValues = [];

    list.forEach( el => {
      optionValues.push(el[data])
    })
    optionValues = [...new Set(optionValues)];
    data !== 'cuit' ? optionValues.sort() : optionValues.sort(function(a, b){return a - b}) ;
    data !== 'phone' ? optionValues.sort() : optionValues.sort(function(a, b){return a - b}) ;
    data !== 'quantity' ? optionValues.sort() : optionValues.sort(function(a, b){return a - b}) ;
    optionValues.forEach( item => {
      let $option = document.createElement('option');
      $option.setAttribute('value', item);
      $option.textContent = item;
      el.appendChild($option);
    })
  })
}