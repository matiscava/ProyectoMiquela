export default class HistoryDtoTable{
  constructor(referenceNumber,timestamp,client,clientID,item,itemID,quantity,type,id){
    this.referenceNumber = referenceNumber;
    this.timestamp = timestamp;
    this.client = client;
    this.clientID = clientID;
    this.item = item;
    this.itemID = itemID;
    this.quantity = quantity;
    this.type = type;
    this.id = id;
  }
}