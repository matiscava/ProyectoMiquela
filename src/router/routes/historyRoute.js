import express from "express";
import historyController from "../../controller/history.js";

const historyRoute = express.Router();

historyRoute
  .get('/', historyController.getHistory )
  .get('/history-:id', historyController.getIngressById )
  .get('/ingress', historyController.getIngress )
  .post('/ingress', historyController.postIngress )
  .get('/egress', historyController.getEgress )
  .post('/egress', historyController.postEgress )
  .get('/upgrade/:id', historyController.getUpgradeParticularHistory )
  .put('/upgrade/', historyController.upgradeParticularHistory )
  .get('/history-:id/upgrade', historyController.getUpgradeHistory )
  .put('/history-:id/upgrade', historyController.upgradeHistory )

export default historyRoute;