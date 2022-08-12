import express from "express";
import userController from "./../../controller/users.js";
import passport from "passport";
import { loginStrategy } from "../../config/passport.js"
import { isAdmin, isAuth } from "../../utils/authMiddelware.js";
import Singleton from "../../utils/Singleton.js";

const userRoute = express.Router();

const { daos } = Singleton.getInstance();
const {usersDao } = daos;

passport.use('login', loginStrategy )
// passport.use('signup', signupStrategy )

passport.serializeUser( (user, done) => {
  done(null , user.id)
})

passport.deserializeUser( async (userId , done) => {
  try {
    const user = await usersDao.getByID(userId);
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
    function(req, res, next) {
      // issue a remember me cookie if the option was checked
      if (!req.body.rememberMe) { return next(); }
      req.session.cookie.maxAge = 604800000;
      req.session.cookie.httpOnly = true;

      return next();

    },
    userController.getHome
  )
  .get('/signup', isAdmin, userController.getSignup)
  .post('/signup', isAdmin, userController.postSignup)
  .get('/logout', userController.logout);

export default userRoute;


