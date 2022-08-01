import { isValidPassword } from '../utils/hash.js';
import passportLocal from 'passport-local';
import Singleton from '../utils/Singleton.js';
import options from './config.js';

const LocalStrategy = passportLocal.Strategy;

const { daos } = Singleton.getInstance();
const { usersDao } = daos;

const loginCallback = async ( username , password , done ) => {
  try {
    const user = await usersDao.findUser(username);

    if (!user){
      return done(null, false)
    }
    const isValid = isValidPassword( password, user.hash , user.salt )

    if(!isValid) return done( null , false)
    
    return done(null, user)
  } catch (err) {
    done(err)    
  }
}

const signupCallback = async ( req , username , password , done ) => {
  try {
    let user = await usersDao.findUser(username);

    if (user){
      console.log('el Usuario ya existe');
      return done(null, false)
    }
    let data = req.body;
    delete data.repassword;
    user = await usersDao.createUser(data);

    return done(null, user)
  } catch (err) {
    done(err)    
  }
}

const rememberMe = async (req, res, next) => {
  if (req.method == 'POST' && req.url == '/users/login'){
    if(req.body.rememberMe) {
      req.session.cookie.maxAge =  options.SESSION_AGE;
    }else{
      req.session.cookie.expires = false;
    }
  }
  next();
}

const loginStrategy = new LocalStrategy(loginCallback);
const signupStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passReqToCallback: true
  },
  signupCallback
  )

export {
  loginStrategy,
  signupStrategy,
  rememberMe
}

