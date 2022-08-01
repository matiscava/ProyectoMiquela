import FileContainer from "../../containers/FileContainer.js";

class UserDaoFile extends FileContainer {
  constructor() {
    super('/DB/users.json')
  }
};

export default UserDaoFile;