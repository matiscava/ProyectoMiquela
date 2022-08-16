
const NotificationBtn = (data) => {
  const d = document,
    $notificationBtn = d.querySelector('.panel-btn.notification-btn'),
    $notificationAside = d.querySelector('.panel.panel-notification'),
    $notificationLength = d.querySelectorAll('span.notifications-unviewed'),
    $notificationTemplate = d.getElementById('notification-panel-li-template').content,
    $notificationListFragment = d.createDocumentFragment(),
    $notificationContainer = d.getElementById('notifications-container-panel'),
    $notificationList = d.getElementById('notifications-list-panel'),
    socket = io.connect();
    let unSee = 0;
    let timmer;
    let i = 0,lengthData = 4;
    // data.reverse();

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
            let dataMessage = data.find( men => men.id == $li.getAttribute('data-noti-id'));
            let dataMessageIndex = data.findIndex( men => men.id == $li.getAttribute('data-noti-id'));
            dataMessage.viewed = true;
            data.splice(dataMessageIndex,1,dataMessage);
            notificationLength($notificationLength);
          }
          console.log('message', message);
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
          $notificationTemplate.querySelector('.notification-li').classList.add('un-see');
        }else{
          $notificationTemplate.querySelector('.notification-li').classList.remove('un-see');
        }
        // notificationLength($notificationLength);
        $notificationTemplate.querySelector('.notification-li').setAttribute('data-noti-id', el.id);
        $notificationTemplate.querySelector('.notification-li-responsable').innerHTML = el.responsable;
        // if(el.type === 'warn'){
        //   let $p = d.createElement('p')
        //   $p.classList.add('notification-li-warn')
        //   $p.innerHTML = 'ATENCION!'
        //   $notificationTemplate.insertAfter($p, $notificationTemplate.querySelector('.notification-li') )
        // } 
        $notificationTemplate.querySelector('.notification-li-message').innerHTML = el.message;
    
        let $clone = d.importNode($notificationTemplate, true);
        let $firstChild = $clone.children[0];
        if(el.type === 'warn'){
          let $p = d.createElement('p');
          $p.classList.add('notification-li-warn');
          $p.innerHTML = 'ATENCION!';

          $firstChild.insertBefore($p, $firstChild.children[1] )
        } 
        $notificationListFragment.appendChild($clone);
      }

      $notificationList.appendChild($notificationListFragment); 
      if(data.length !== k) createSpan()
    }
    data.forEach( el => {
      if(el.viewed !== true) unSee++;
    });

  getNotifications();

  d.addEventListener('click', (e) => {
    if( e.target == $notificationBtn || e.target.parentElement == $notificationBtn) {
      console.log();
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