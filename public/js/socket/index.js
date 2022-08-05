// import { io } from "../../../main.js";
import NewNotification from "./NewNotification.js";
import NewWarn from "./NewWarn.js";

const socket = io.connect();

socket
  .on('new-notification', (data) => {
    NewNotification(data)
  })
  .on('new-warn',(data) => {
    NewWarn(data);
  })

  
export default socket;