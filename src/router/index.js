import express from 'express';

import userController from './../controller/users.js';
import userRoute from './routes/userRoute.js';
import productRoute from './routes/productRoute.js';
import clientRoute from './routes/clientRoute.js';
import historyRoute from './routes/historyRoute.js';
import { isAuth } from '../utils/authMiddelware.js';

const router = express.Router();

router
//HOME
.get('/', userController.getHome )
//USERS
  .use('/users', userRoute )
  //PRODUCTS
  .use('/products', isAuth , productRoute )
  //CLIENTES
  .use('/clients', isAuth , clientRoute )
  //INGRESO
  .use('/history', isAuth , historyRoute )
  //ERROR 404
  .use((req, res) => {
    res.status(404).json(
        {error: -2, descripcion: `ruta ${req.originalUrl} método ${req.method} no implementada`}    
    )
})

export default router;