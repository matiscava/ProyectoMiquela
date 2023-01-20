export default class HistoryDtoUpdate{
  constructor(referenceNumber,clientID,type,barCode,name,quantity,id){
    this.referenceNumber = referenceNumber;
    this.clientID = clientID;
    this.type = type;
    this.barCode = barCode;
    this.name = name;
    this.quantity = quantity;
    this.id = id;
  }
}