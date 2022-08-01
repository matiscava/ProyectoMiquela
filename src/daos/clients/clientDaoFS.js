import FileContainer from "../../containers/FileContainer.js";

class ClientDaoFile extends FileContainer {
  constructor() {
    super('/DB/clients.json')
  }
};

export default ClientDaoFile;