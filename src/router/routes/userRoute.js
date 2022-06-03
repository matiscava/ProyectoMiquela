import express from "express";
import userController from "./../../controller/users.js";
import passport from "passport";
import FSDao from '../../daos/fs/productDaoFS.js';
import { loginStrategy , signupStrategy } from "../../config/passport.js"
import { isAuth } from "../../utils/authMiddelware.js";

const userRoute = express.Router();

const USERS_DB = './DB/users.json';

passport.use('login', loginStrategy )
passport.use('signup', signupStrategy )

passport.serializeUser( (user, done) => {
  done(null , user.id)
})

passport.deserializeUser( async (userId , done) => {
  try {
    const user = await FSDao.getByID(USERS_DB, userId);
    done(null, user)
  } catch (err) {
    done(err)    
  }
})

userRoute
  .get('/', isAuth, userController.getUsers)
  .get('/login', userController.getLogin)
  .post('/login', 
    passport.authenticate('login', {failureRedirect: '/users/fail-login'}),
    userController.getHome
  )
  .get('/signup', userController.getSignup)
  .post('/signup',
    passport.authenticate('signup', {failureRedirect: '/users/fail-signup'} ),
    userController.getHome
  );

export default userRoute;


