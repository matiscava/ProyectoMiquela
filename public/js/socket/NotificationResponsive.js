import NotificationBtn from "./NotificationBtn.js";
import NotificationIcon from "./NotificationIcon.js";

function NotificationResponsive (data) {
  // const originalHeight = window.innerHeight;
  // const originalWidth = window.innerWidth;

  // if(originalWidth > 1150) {
  //   NotificationIcon(data)
  // }else{
  //   NotificationBtn(data)
  // }
  // window.addEventListener('resize', (e) => {
  //   console.log(originalHeight, window.innerHeight);
  //   console.log(originalWidth, window.innerWidth);


  //   if (originalHeight != window.innerHeight || originalWidth != window.innerWidth ) {
  //     // console.log('cambio');
  //     if(window.innerWidth > 1150) {
  //       // console.log('compu');
  //       NotificationIcon(data)
  //     }else {
  //       // console.log('celu');
  //       NotificationBtn(data)
  //     }
  //   }
  // })
  NotificationIcon(data)
  NotificationBtn(data)

}

export default NotificationResponsive;