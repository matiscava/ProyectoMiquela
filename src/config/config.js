let pers
let mode
import fileEnv from "../env.js";

if ( process.argv[2] != 'production' || process.argv[2] != 'development' ) {
  pers = process.argv[2]
  if (process.argv[3]){
    mode = process.argv[3]
  }
} else {
  mode = process.argv[2]
}

const config = {
  PORT: fileEnv.parsed.PORT,
  PERS: fileEnv.parsed.PERS,
  FILE_PATH: fileEnv.parsed.FILE_PATH,
  DB_USER: fileEnv.parsed.DB_USER,
  DB_PASSWORD: fileEnv.parsed.DB_PASSWORD,
  DB_DATABASE: fileEnv.parsed.DB_DATABASE,
  DB_HOST: fileEnv.parsed.DB_HOST,
  MODE: fileEnv.parsed.MODE,
  SESSION_AGE: parseInt(process.env.SESSION_AGE)
}


const options = {
  ...config,
  mongodb: {
    // host: 'mongodb://localhost/ecommerce',
    cnxStr: `mongodb+srv://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_HOST}.f6x7s.mongodb.net/${config.DB_DATABASE}?retryWrites=true&w=majority`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateOmdex: true,
      serverSelectionTimeoutMS: 5000
    }
  },
  file: {
    path: `./${config.FILE_PATH}`
  }

};


export default options;