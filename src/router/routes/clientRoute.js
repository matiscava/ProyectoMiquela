import express from "express";
import clientController from "../../controller/clients.js";

const clientRoute = express.Router();

clientRoute
  .get('/', clientController.getClients )
  .get('/client-:id', clientController.getClientByID)
  .get('/create-client', clientController.getCreateClient )
  .post('/create-client', clientController.createClient )
  .get('/upgrade/:id', clientController.getUpgradeClient )
  .put('/upgrade', clientController.putUpgradeClient );

export default clientRoute;