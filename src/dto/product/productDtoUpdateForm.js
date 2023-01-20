export default class ProductDtoUpdateForm{
  constructor(name, description, code, type, minStock, barCode, id){
    this.name = name;
    this.description = description;
    this.code = code;
    this.type = type;
    this.minStock = minStock;
    this.barCode = barCode;
    this.id = id;
  }
}