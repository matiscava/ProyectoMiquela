import FileContainer from "../../containers/FileContainer.js";

class NotificationDaoFile extends FileContainer {
  constructor() {
    super('/DB/notifications.json')
  }
};

export default NotificationDaoFile;