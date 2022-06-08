export function SetClientsList(type,$select){
  let typeList = clientsList.filter( client => client.type === type);
  typeList.forEach( (el) => {
    let $option = document.createElement('option');
    $option.value = el.name;
    $option.textContent = el.name;
    $select.appendChild($option)
  })
}