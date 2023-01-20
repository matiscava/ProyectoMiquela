import ItemDtoBarCode from "../dto/item/itemDtoBarCode.js";
import ItemDtoHistoryEgress from "../dto/item/itemDtoHistoryEgress.js";
import ItemDtoHistoryIngress from "../dto/item/itemDtoHistoryIngress.js";

const itemMapper = () => {};

itemMapper.mapItemToItemDtoHistoryIngress = (item) => 
  new ItemDtoHistoryIngress(
    item.barCode,
    item.name
  )

itemMapper.mapItemToItemDtoHistoryEgress = (item) =>
  new ItemDtoHistoryEgress(
    item.barCode,
    item.name,
    item.stock
  )

itemMapper.mapItemToItemDtoBarCode = (item) =>
  new ItemDtoBarCode(
    item.barCode
  )

export default itemMapper;