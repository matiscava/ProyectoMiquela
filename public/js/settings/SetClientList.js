export function SetClientsList(type,$select){
  let typeList
  if(type === 'todos'){
    typeList = clientsList
  }else{
    typeList = clientsList.filter( client => client.type === type);
  }
  typeList.forEach( (el) => {
    let $option = document.createElement('option');
    $option.value = el.name;
    $option.textContent = el.name;
    $option.setAttribute('data-cuit', el.cuit)
    $select.appendChild($option)
  })
}