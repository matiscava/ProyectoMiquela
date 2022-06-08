import express from "express";
import clientController from "../../controller/clients.js";

const clientRoute = express.Router();

clientRoute
  .get('/', clientController.getClients )
  .get('/new-client', clientController.getCreateClient )
  .post('/new-client', clientController.createClient );

export default clientRoute;