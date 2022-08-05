import express from 'express';
import session from 'express-session';
import passport from 'passport';
import router from './src/router/index.js';
import mime from 'mime';
import path from 'path';
import expressMethodOverride from 'express-method-override' ;
import { rememberMe } from './src/config/passport.js';


//VARIABLES

const app = express();


//CONFIGURAR LA SESION

export const apiSession = session({
  secret: 'cookie-negri',
  resave: true,
  rolling: true,
  saveUninitialized: false,
  cookie: {
    httpOnly: false,
    secure: false,
    maxAge: parseInt(process.env.SESSION_AGE)
  }
})

//GET MIME TYPE

const mimeType = mime.getType(path);

//METHOD-OVERRIDE

const restFul = expressMethodOverride('_method');

//CONFIGURACION SERVER

app
  .use(express.json())
  .use(express.urlencoded({extended:true}))
  .use(express.static(path.join(process.cwd() +'/public')))
  .set('content-type', mimeType)
  .use(apiSession)
  .use( restFul )
  // .use( rememberMe )
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
  });  


export default app;