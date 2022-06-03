import crypto from 'crypto';

//FUNCIONES

const createHash = ( password ) => {
  let salt = crypto.randomBytes(32).toString('hex');
  let genHash = crypto.pbkdf2Sync( password , salt , 100, 64, 'sha512').toString('hex');
  return {
    salt,
    hash: genHash
  }
}

const  isValidPassword = ( password , hash , salt ) => {
  let hashVerify = crypto.pbkdf2Sync( password , salt , 100, 64, 'sha512').toString('hex');
  return hash === hashVerify;
}

export {
  createHash,
  isValidPassword
}