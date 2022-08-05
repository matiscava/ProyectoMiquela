const NewNotification = (data) => {
  const d = document,
    $template = d.getElementById('notification-template').content,
    $notifications = d.getElementById('notifications');
    let $clone = d.importNode($template, true);
    $clone.querySelector('span').setAttribute('data-close', `notiID-${data.id}`);
    $clone.querySelector('.notification-container').id = `notiID-${data.id}`;
    $clone.querySelector('.notification-responsable').innerHTML = data.responsable;
    $clone.querySelector('.notification-message').innerHTML = data.message;
    $notifications.appendChild($clone);
    const $div = d.getElementById(`notiID-${data.id}`);
    setTimeout(()=> {
      $div.classList.add('is-active');
    },500)
    setTimeout(()=> {
      $div.classList.remove('is-active');
      $div.remove()
    },4000)

    const $spans = d.querySelectorAll('#notifications span.icon-cancel');
    
    $spans.forEach( $span => {
      $span.addEventListener('click', (e) => {
        let id = e.target.getAttribute('data-close');
        d.getElementById(id).remove();
      })
    });
}

export default NewNotification