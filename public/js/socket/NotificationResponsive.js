import NotificationBtn from "./NotificationBtn.js";
import NotificationIcon from "./NotificationIcon.js";

function NotificationResponsive (data) {
  if(window.innerWidth > 1150) {
    NotificationIcon(data)
  }else{
    NotificationBtn(data)
  }
  window.addEventListener('resize', (e) => {
    if(window.innerWidth > 1150) {
      NotificationIcon(data)
    }else{
      NotificationBtn(data)
    }
  })
}

export default NotificationResponsive;