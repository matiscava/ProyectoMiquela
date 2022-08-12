
const NotificationBtn = (data) => {
  const d = document,
    $notificationBtn = d.querySelector('.panel-btn.notification-btn'),
    $notificationAside = d.querySelector('.panel.panel-notification'),
    $notificationLength = d.querySelectorAll('.notifications-unviewed'),
    $notificationTemplate = d.getElementById('notification-panel-li-template').content,
    $notificationListFragment = d.createDocumentFragment(),
    $notificationContainer = d.getElementById('notifications-container-panel'),
    $notificationList = d.getElementById('notifications-list-panel'),
    socket = io.connect();
    let unSee = 0;
    let timmer;
    let i = 0,lengthData = 4;
    data.reverse();

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
            notificationLength();
          }
          if(message.length) socket.emit('see-notification', message )
        });
      }, 3000);
    } 
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
          $notificationTemplate.querySelector('.notification-li').classList.add('un-see');
        }else{
          $notificationTemplate.querySelector('.notification-li').classList.remove('un-see');
        }
        notificationLength($notificationLength);
        $notificationTemplate.querySelector('.notification-li').setAttribute('data-noti-id', el.id);
        $notificationTemplate.querySelector('.notification-li-responsable').innerHTML = el.responsable;
        if(el.type === 'warn'){
          let $p = d.createElement('p').classList.add('notification-li-warn')
          $p.innerHTML = 'ATENCION!'
          $notificationTemplate.insertAfter($p, $notificationTemplate.querySelector('.notification-li').firstElementChild )
        } 
        $notificationTemplate.querySelector('.notification-li-message').innerHTML = el.message;
    
        let $clone = d.importNode($notificationTemplate, true);
        $notificationListFragment.appendChild($clone);
        if(el.type === 'warn')$notificationTemplate.removeChild('.notification-li-warn')
      }

      $notificationList.appendChild($notificationListFragment); 
      if(data.length !== k) createSpan()
    }
    data.forEach( el => {
      if(el.viewed !== true) unSee++;
    });


  d.addEventListener('click', (e) => {
    if( e.target == $notificationBtn || e.target.parentElement == $notificationBtn) {
      while ($notificationList.firstChild) {
        $notificationList.removeChild($notificationList.lastChild);
      }
      $notificationAside.classList.toggle('is-active');
      $notificationBtn.querySelector('span').classList.toggle('icon-cancel')
      $notificationBtn.querySelector('span').classList.toggle('icon-bell')
      lengthData = 4;
      i=0;
      if($notificationAside.classList.contains('is-active')) {
        getNotifications();
        invocation();
      }else{
        clearTimeout(timmer)
      }
    }
    if(e.target.matches('.notifications-btn') || e.target.matches('.icon-triangle-down')){
      let $remove;
      e.target.matches('.icon-triangle-down') ? $remove = e.target.parentElement : $remove = e.target;
      lengthData = lengthData+4;
      $notificationList.removeChild($remove)
      getNotifications()
    }


  })
}

export default NotificationBtn;