import FileContainer from "../../containers/FileContainer.js";

class HistoryDaoFile extends FileContainer {
  constructor() {
    super('/DB/history.json')
  }
};

export default HistoryDaoFile;