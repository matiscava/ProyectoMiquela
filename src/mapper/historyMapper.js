import HistoryDtoTable from "../dto/history/historyDtoTable.js";
import HistoryDtoUpdate from "../dto/history/historyDtoUpdate.js";

const historyMapper = () => {};

historyMapper.mapHistoryToHistoryDtoTable = (history, client, item) =>{
  const hDto =  new HistoryDtoTable();
  hDto.id = history.id;
  hDto.type = history.type;
  hDto.referenceNumber = history.referenceNumber;
  hDto.quantity = history.quantity;
  hDto.timestamp = new Date(history.timestamp).toLocaleDateString();
  hDto.client = client.name;
  hDto.clientID = client.id;
  hDto.item = item.name;
  hDto.itemID = item.id;

  return hDto;
} 

historyMapper.mapHistoryToHistotyDtoUpdate = (history) =>
  new HistoryDtoUpdate(
    history.referenceNumber,
    history.clientID,
    history.type,
    history.barCode,
    history.name,
    history.quantity,
    history.id
  )

export default historyMapper;