import express from "express";
import historyController from "../../controller/history.js";

const historyRoute = express.Router();

historyRoute
  .get('/', historyController.getHistory )
  .post('/ingress', historyController.postIngress)
  .post('/egress', historyController.postEgress)

export default historyRoute;