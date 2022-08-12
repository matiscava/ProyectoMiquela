const NotificationIcon = (data) => {
  const d = document,
    $notificationSpan = d.querySelector('.notidication-icon'),
    $notificationLength = d.querySelectorAll('.notifications-unviewed'),
    $template = d.getElementById('notification-li-template').content,
    $notificationListFragment = d.createDocumentFragment(),
    $notificationContainer = d.getElementById('notifications-container'),
    $notificationList = d.getElementById('notifications-list'),
    socket = io.connect();
    let unSee = 0;
    let timmer;
    let i = 0,lengthData = 4;
    data.reverse();
    
    /*
      Ingresa el span al que quiere generar la notificación cuando hay un mensaje sin ver.
    */
    function notificationLength($span) {
      $span.forEach( $notification => {
        if(unSee > 0){
          $notification.textContent = '.';
          $notification.classList.remove('none')
        }else{
          $notification.classList.add('none')
        }
      });
    }

    function invocation() {
      timmer = setTimeout(() => {    
        let message = [];    
        $notificationList.querySelectorAll('.notification-li').forEach( $li => {
          if($li.classList.contains('un-see')){
            $li.classList.remove('un-see');
            unSee = unSee-1;
            message.push({
              email : $notificationList.getAttribute('data-client'),
              notiId: $li.getAttribute('data-noti-id')
            });
            notificationLength($notificationLength);
          }
          if(message.length) socket.emit('see-notification', message )
        });
      }, 3000);
    } 
    
    function createSpan(){
      let $li = document.createElement('li');
      let $span = document.createElement('span');
      $li.classList.add('notification-li', 'notifications-btn');
      $span.classList.add('icon-triangle-down');
      $li.appendChild($span);
      $notificationList.appendChild($li);
    }

    function getNotifications (){
      let k;
      lengthData > data.length ? k= data.length : k = lengthData;
      for( i ; i < k; i++){
        let el = data[i];
        
        if(el.viewed !== true) {
          $template.querySelector('.notification-li').classList.add('un-see');
        }else{
          $template.querySelector('.notification-li').classList.remove('un-see');
        }
        notificationLength($notificationLength);
        $template.querySelector('.notification-li').setAttribute('data-noti-id', el.id);
        $template.querySelector('.notification-li-responsable').innerHTML = el.responsable;
        if(el.type === 'warn'){
          let $p = d.createElement('p').classList.add('notification-li-warn')
          $p.innerHTML = 'ATENCION!'
          $template.insertAfter($p, $template.querySelector('.notification-li').firstElementChild )
        } 
        $template.querySelector('.notification-li-message').innerHTML = el.message;
        
        let $clone = d.importNode($template, true);
        $notificationListFragment.appendChild($clone);
        if(el.type === 'warn')$template.removeChild('.notification-li-warn')
      }
      $notificationList.appendChild($notificationListFragment); 
      if(data.length !== k) createSpan()
    }

    data.forEach( el => {
      if(el.viewed !== true) unSee++;
    });



    d.addEventListener('click', (e) => {
      if(e.target.matches('.notifications-btn') || e.target.matches('.icon-triangle-down')){
        let $remove;
        e.target.matches('.icon-triangle-down') ? $remove = e.target.parentElement : $remove = e.target;
        lengthData = lengthData+4;
        $notificationList.removeChild($remove)
        getNotifications()
      }
      if(e.target == $notificationSpan || e.target.parentElement ==  $notificationSpan){
        e.preventDefault();
        while ($notificationList.firstChild) {
          $notificationList.removeChild($notificationList.lastChild);
        }
        lengthData = 4;
        i=0;
        $notificationContainer.classList.toggle('none');
        if(!$notificationContainer.classList.contains('none')) {
          getNotifications();
          invocation();
        }else{
          clearTimeout(timmer)
        }
      }
    })
    
}

export default NotificationIcon;
