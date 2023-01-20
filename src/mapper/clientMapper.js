import ClientDtoClientById from "../dto/client/clientDtoClientById.js";
import ClientDtoCreateForm from "../dto/client/clientDtoCreateForm.js";
import ClientDtoSelect from "../dto/client/clientDtoSelect.js";
import ClientDtoTable from "../dto/client/clientDtoTable.js";
const clientMapper = () => {};

clientMapper.mapClientToClientDtoTable = ( client ) => 
  new ClientDtoTable(
    client.cuit,
    client.name,
    client.email,
    client.type,
    client.id
  )


clientMapper.mapClientToCLientDtoCreateForm = (client) => 
  new ClientDtoCreateForm(
    client.cuit,
    client.email
  )

clientMapper.mapClientToClientDtoById = (client) =>
  new ClientDtoClientById(
    client.id,
    client.type,
    client.address,
    client.phone,
    client.email,
    client.timestamp
  )

clientMapper.mapClientToClientSelect = (client) =>
  new ClientDtoSelect(
    client.cuit,
    client.name,
    client.type
  )

export default clientMapper;