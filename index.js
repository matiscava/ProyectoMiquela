import express from 'express';
import session from 'express-session';
import passport from 'passport';
import router from './src/router/index.js';
import expressMethodOverride from 'express-method-override' 

//VARIABLES

const app = express(),
  PORT = process.env.PORT || 8080;

//CONFIGURAR LA SESION

const apiSession = session({
  secret: 'cookie-negri',
  resave: true,
  rolling: true,
  saveUninitialized: false,
  cookie: {
    httpOnly: false,
    secure: false,
    maxAge: 600000
  }
})

//METHOD-OVERRIDE

const restFul = expressMethodOverride('_method');

//CONFIGURACION SERVER

app
  .use(express.json())
  .use(express.urlencoded({extended:true}))
  .use(express.static('public'))
  .use(apiSession)
  .use( restFul )
  .use( passport.initialize() )
  .use( passport.session() )
  // .use((req, res, next) => {
  //   console.log(req.session);
  //   // console.log(req.user);
  //   console.log(req.url);
    
  //   next()
  // })
  .set('views','./views')
  .set('view engine', 'ejs');

//SERVIDOR

app.use(router)

app.listen( PORT , () => console.log(`Servidor funcionando en http://localhost:${PORT}/`));


