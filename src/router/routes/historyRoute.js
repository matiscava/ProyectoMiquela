import express from "express";
import historyController from "../../controller/history.js";

const historyRoute = express.Router();

historyRoute
  .get('/', historyController.getHistory )
  .get('/ingress', historyController.getIngress)
  .post('/ingress', historyController.postIngress)
  .get('/egress', historyController.getEgress)
  .post('/egress', historyController.postEgress)

export default historyRoute;