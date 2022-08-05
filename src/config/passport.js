import { isValidPassword } from '../utils/hash.js';
import passportLocal from 'passport-local';
import Singleton from '../utils/Singleton.js';
import options from './config.js';
import { io } from '../../main.js';

const LocalStrategy = passportLocal.Strategy;

const { daos } = Singleton.getInstance();
const { usersDao , notificationsDao } = daos;

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

const rememberMe = async (req, res, next) => {
  if (req.method == 'POST' && req.url == '/users/login'){
    if(req.body.rememberMe) {
      console.log('recuerdame');
      req.session.cookie.maxAge =  604800000;
      req.session.cookie.expires = true;

    }else{
      console.log('no lo hagas');
      req.session.cookie.maxAge =  options.SESSION_AGE;
      req.session.cookie.expires = false;
    }
  }
  next();
}

const loginStrategy = new LocalStrategy(loginCallback);
// const signupStrategy = new LocalStrategy(
//   {
//     usernameField: 'email',
//     passReqToCallback: true
//   },
//   signupCallback
//   )

export {
  loginStrategy,
  rememberMe
}

