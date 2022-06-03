import path from 'path';
import FSDao from "../daos/fs/productDaoFS.js";


const userController = () => {},
  USERS_DB = './DB/users.json';

userController.getHome = async ( req , res ) => {
  let userSession = req.user
  if(!userSession) return res.redirect('/users/login')
  res.redirect('/history')
} 

userController.getUsers = async (req , res) => {
  try {
    let users = await FSDao.getAll(USERS_DB);
    if( ! (users instanceof Array) ) return res.send('<p>usuarios No es un Array</p>');
    if(!users.length) return res.send('<p>No hay usuarios cargados</p>');

    res.json(users);
  } catch (err) {
    let message = err || "Ocurrio un error";

    console.log(`Error ${err.status}: ${message}`);
    res.send( `
    <h1>Ocurrio un error</h1>
    <p>Error ${err.status}: ${message}</p>
    ` );
  }
}

userController.getSignup = ( req , res ) => {
  res.render( path.join(process.cwd(),'/views/signup.ejs'),{title: 'Signup'})
}

// userController.signupUser = async ( req , res ) => {
//   try {
//     let data = req.body;
//     delete data.repassword; 
//     console.log('signupUser',data);
//     data = await FSDao.createUser(USERS_DB,data)
//     req.session.userSession = data.id;

//     res.redirect('/');

//     } catch (err) {
//       let message = err || "Ocurrio un error";
//       console.log(`Error ${err.status}: ${message}`);
//       res.send( `
//       <h1>Ocurrio un error</h1>
//       <p>Error ${err.status}: ${message}</p>
//       ` );
//     }
// }

userController.getLogin = ( req , res ) => {
  res.render( path.join(process.cwd(),'/views/login.ejs'),{ title: 'Login',user : req.user })
}


export default userController;