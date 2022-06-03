import express from "express";
import clientController from "../../controller/clients.js";

const clientRoute = express.Router();

clientRoute
  .get('/', clientController.getClients )
  .post('/', clientController.createClient );

export default clientRoute;