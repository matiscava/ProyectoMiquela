import ProductDtoCreateForm from "../dto/product/productDtoCreateForm.js";
import ProductDtoTable from "../dto/product/productDtoTable.js";
import ProductDtoUpdateForm from "../dto/product/productDtoUpdateForm.js";

const productMapper = () => {};

productMapper.mapProductToPoductDtoTable = (p) => 
  new ProductDtoTable(
    p.barCode,
    p.code,
    p.name,
    p.description,
    p.type,
    p.stock,
    p.id
  );

productMapper.mapProductToProductDtoCreateForm = (p) => 
  new ProductDtoCreateForm(p.barCode,p.code);

productMapper.mapProductToProductDtoUpdateForm = (p) =>
  new ProductDtoUpdateForm(
    p.name,
    p.description,
    p.code,
    p.type,
    p.minStock,
    p.barCode,
    p.id
  );

export default productMapper;