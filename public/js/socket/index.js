// import { io } from "../../../main.js";
import NewNotification from "./NewNotification.js";
import NewWarn from "./NewWarn.js";
import NotificationBtn from "./NotificationBtn.js";
import NotificationIcon from "./NotificationIcon.js";
import NotificationResponsive from "./NotificationResponsive.js";

const socket = io.connect();

socket
  .on('new-notification', (data) => {
    NewNotification(data)
  })
  .on('new-warn',(data) => {
    NewWarn(data);
  })
  .on('get-notifications', (data) => {
    // NotificationResponsive(data);
    NotificationBtn(data);
    NotificationIcon(data);
  })

  
export default socket;