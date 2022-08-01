import express from 'express';
import session from 'express-session';
import passport from 'passport';
import router from './src/router/index.js';
import mime from 'mime';
import path from 'path';
import expressMethodOverride from 'express-method-override' 
import options from './src/config/config.js';
import dotenv from 'dotenv';
import { rememberMe } from './src/config/passport.js';


//VARIABLES

const app = express(),
  PORT = options.PORT || 8080;

//CONFIGURAR LA SESION

const apiSession = session({
  secret: 'cookie-negri',
  resave: true,
  rolling: true,
  saveUninitialized: false,
  cookie: {
    httpOnly: false,
    secure: false,
    maxAge: options.SESSION_AGE
  }
})

//GET MIME TYPE

const mimeType = mime.getType(path);
// const setHeadersOnStatic = (res, path, stat) => {
//   const type = mime.getType(path);
//   res.set('content-type', type);
// }

// const staticOptions = {
//   setHeaders: setHeadersOnStatic
// }





//METHOD-OVERRIDE

const restFul = expressMethodOverride('_method');

//CONFIGURACION SERVER

app
  .use(express.json())
  .use(express.urlencoded({extended:true}))
  .use(express.static(path.join(process.cwd() +'/public')))
  .set('content-type', mimeType)
  // .use(express.static(path.join('public'), staticOptions))
  .use(apiSession)
  .use( restFul )
  .use( rememberMe )
  .use( passport.initialize() ) 
  .use( passport.session() )
  // .use((req, res, next) => {
  //  console.log(req.session);
  //  console.log(req.user);
  //  console.log(req.url,req.params);
    
  //   next()
  // })
  .set('views',path.join(process.cwd() + '/views'))
  .set('view engine', 'ejs');

//SERVIDOR

app
  .use(router)
  .use((req, res) => {
    res.status(404).json(
        {error: -2, descripcion: `ruta ${req.originalUrl} método ${req.method} no implementada`}    
    )
  })
console.log('Base de datos',options.mongodb.cnxStr);
app.listen( PORT , () => console.log(`Servidor funcionando en http://localhost:${PORT}/`));


