import express from "express";
import userController from "./../../controller/users.js";
import passport from "passport";
import { loginStrategy , signupStrategy } from "../../config/passport.js"
import { isAdmin, isAuth } from "../../utils/authMiddelware.js";
import Singleton from "../../utils/Singleton.js";

const userRoute = express.Router();

const { daos } = Singleton.getInstance();
const {usersDao } = daos;

passport.use('login', loginStrategy )
passport.use('signup', signupStrategy )

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
      if (!req.body.remember_me) { return next(); }
  
      var token = utils.generateToken(64);
      Token.save(token, { userId: req.user.id }, function(err) {
        if (err) { return done(err); }
        res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 }); // 7 days
        return next();
      });
    },
    userController.getHome
  )
  .get('/signup', isAdmin, userController.getSignup)
  .post('/signup',
    passport.authenticate('signup', {failureRedirect: '/users/fail-signup'} ),
    userController.getHome
  )
  .get('/logout', userController.logout);

export default userRoute;


