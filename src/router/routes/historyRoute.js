import express from "express";
import historyController from "../../controller/history.js";
import { canEgress, canIngress } from "../../utils/authMiddelware.js";

const historyRoute = express.Router();

historyRoute
  .get('/', historyController.getHistory )
  .get('/history-:id', historyController.getIngressById )
  .get('/ingress', historyController.getIngress )
  .post('/ingress',canIngress, historyController.postIngress )
  .get('/egress', historyController.getEgress )
  .post('/egress', canEgress, historyController.postEgress )
  .get('/upgrade/:id', historyController.getUpgradeParticularHistory )
  .put('/upgrade/', historyController.upgradeParticularHistory )
  .get('/history-:id/upgrade', historyController.getUpgradeHistory )
  .put('/history-:id/upgrade', historyController.upgradeHistory )

export default historyRoute;