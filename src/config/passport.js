import { isValidPassword } from '../utils/hash.js';
import passportLocal from 'passport-local';
import FSDao from '../daos/fs/productDaoFS.js';

const USERS_DB = './DB/users.json',
  LocalStrategy = passportLocal.Strategy;

const loginCallback = async ( username , password , done ) => {
  try {
    const user = await FSDao.findUser(USERS_DB,username);

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
    let user = await FSDao.findUser(USERS_DB,username);

    if (user){
      console.log('el Usuario ya existe');
      return done(null, false)
    }
    let data = req.body;
    delete data.repassword;
    user = await FSDao.createUser(USERS_DB,data);

    return done(null, user)
  } catch (err) {
    done(err)    
  }
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
  signupStrategy
}

