import path from 'path';

import Singleton from '../utils/Singleton.js';
import { io } from '../../main.js';

const { daos } = Singleton.getInstance();
const { usersDao , notificationsDao } = daos;

const userController = () => {};

userController.getHome = async ( req , res ) => {
  if(!req.user) return res.redirect('/users/login')
  res.redirect('/products')
} 

userController.getUsers = async (req , res) => {
  try {
    let users = await usersDao.getAll();
    if( ! (users instanceof Array) ) return res.send('<p>usuarios No es un Array</p>');
    if(!users.length) return res.send('<p>No hay usuarios cargados</p>');

    res.json(users);
  } catch (err) {
    let message = err || "Ocurrio un error";

    console.error(`Error ${err.status}: ${message}`);
    res.send( `
    <h1>Ocurrio un error</h1>
    <p>Error ${err.status}: ${message}</p>
    ` );
  }
}

userController.getSignup = ( req , res ) => {
  let user = req.user;
  res.render( path.join(process.cwd(),'/views/signup.ejs'),{title: 'Signup',user})
}

userController.postSignup = async ( req , res ) => {
  
  try {
    let user = req.user;
    let data = req.body;
    let userExist = await usersDao.findUser(data.email);
    if(userExist) throw new Error(`Ya existe un usuario logueado con el mail ${data.email}`);
    delete data.repassword;

    const newUser = await usersDao.createUser(data);
    let notification = {
      responsable: user.email,
      receiver: 'all',
      message: `Ha creado el usuario: ${newUser.email}`
    }
    notification = await notificationsDao.newNotification(notification);   
    res.redirect('/products')
  } catch (err) {
    let message = err || "Ocurrio un error";

    console.error(`Error ${err.status}: ${message}`);
    res.send( `
    <h1>Ocurrio un error</h1>
    <p>Error ${err.status}: ${message}</p>
    ` );
  }
}

userController.getLogin = ( req , res ) => {
  if(req.user) res.redirect('/products')
  res.render( path.join(process.cwd(),'/views/login.ejs'),{ title: 'Login',user : req.user })
}

userController.logout = ( req , res ) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
}


export default userController;