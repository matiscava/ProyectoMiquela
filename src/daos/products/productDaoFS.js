import FileContainer from "../../containers/FileContainer.js";

class ProductDaoFile extends FileContainer {
  constructor() {
    super('/DB/products.json')
  }
};

export default ProductDaoFile;