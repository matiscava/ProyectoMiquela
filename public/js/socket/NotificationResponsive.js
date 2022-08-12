import NotificationBtn from "./NotificationBtn.js";
import NotificationIcon from "./NotificationIcon.js";

function NotificationResponsive (data) {
  const originalHeight = window.innerHeight;
  const originalWidth = window.innerWidth;

  if(originalWidth > 1150) {
    NotificationIcon(data)
  }else{
    NotificationBtn(data)
  }
  window.addEventListener('resize', (e) => {

    if (originalHeight != window.innerHeight) {
      // console.log('cambio');
      if(window.innerWidth > 1150) {
        // console.log('compu');
        NotificationIcon(data)
      }else {
        // console.log('celu');
        NotificationBtn(data)
      }
    }
    if (originalWidth != window.innerWidth) {
      // console.log('cambio ancho');
      if(window.innerWidth > 1150) {
        // console.log('compu');
        NotificationIcon(data)
      }else {
        // console.log('celu');
        NotificationBtn(data)
      }
    }
  })
}

export default NotificationResponsive;