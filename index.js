import fs from 'fs';
import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import session from 'express-session';

//VARIABLES

const app = express(),
  PORT = process.env.PORT || 8080,
  FORMAT = 'utf-8',
  USERS_DB = './DB/users.json',
  CLIENTS_DB = './DB/clients.json',
  PRODUCTS_DB = './DB/products.json',
  INGRESS_DB = './DB/ingress.json',
  EGRESS_DB = '/DB/egress.json' ;

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
  
  
  
//CONFIGURACION SERVER

app
  .use(express.json())
  .use(express.urlencoded({extended:true}))
  .use(apiSession);

//FUNCIONES

const createHash = ( password ) => {
  return bcrypt.hashSync( 
    password,
    bcrypt.genSaltSync(10),
    null
   )
}

const  isValidPassword = ( user , password ) => {
  return bcrypt.compareSync( password , user.password )
}



//SERVIDOR

app
//HOME
  .get('/', async (req , res) => {
    let userSession = req.session && req.session.userEmail;
    if(!userSession) return res.redirect('/users')
    res.send('<h1>Home</h1>')
  })
//USERS
  .get('/users', async (req , res) => {
    try {
      let data = await fs.promises.readFile(USERS_DB, FORMAT)
      if(!data) return fs.writeFileSync(USERS_DB,'[]');
      let users = JSON.parse(data);
      if( ! (users instanceof Array) ) return res.send('<p>usuarios No es un Array</p>');
      if(!users.length) return res.send('<p>No hay usuarios cargados</p>');

      res.json(users);
    } catch (err) {
      let message = err || "Ocurrio un error";

      console.log(`Error ${err.status}: ${message}`);
      res.send( `
      <h1>Ocurrio un error</h1>
      <p>Error ${err.status}: ${message}</p>
      ` );
    }
  })
  .post('/signup', async ( req , res ) => {
    try {
      
    const data = req.body;
    let FSdata = await fs.promises.readFile(USERS_DB, FORMAT);
    let users = JSON.parse(FSdata);
    
    let dniRepeated = users.find( usu => usu.dni === data.dni)
    if( dniRepeated ) throw new Error(`El Usuario con el DNI: ${data.dni} ya existe, por favor ingrese un otro DNI.`);

    let emailRepeated = users.find( usu => usu.email === data.email)
    if( emailRepeated ) throw new Error(`El Usuario con el mail: ${data.email} ya existe, por favor ingrese un otro mail.`);


    if( ! (data instanceof Object) ) throw new Error('El dato enviado no es un objeto');
    if(!data.id) data.id = crypto.randomBytes(10).toString('hex');
    if(!data.admin) data.admin = false;
    if(!data.ingress_access) data.ingress_access = false;
    if(!data.egress_access) data.egress_access = false;
    if(!data.history) data.history = [];

    data.password = createHash(data.password);
    console.log(data);

    users.push(data);
    const dataToJSON = JSON.stringify(users,null,2);
    fs.writeFileSync(USERS_DB,dataToJSON);
    req.session.userEmail = data.email;

    res.send(`
      <h1> Se Creo un nuevo Usuario <h1>
      <p> Nombre: ${data.name}</p>
      <p> apellido: ${data.lastname}</p>
      <p> id: ${data.id}</p>
      `);
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.log(`Error ${err.status}: ${message}`);
      res.send( `
      <h1>Ocurrio un error</h1>
      <p>Error ${err.status}: ${message}</p>
      ` );
    }
  } )
  .post('/login', async ( req , res ) => {
    try {
      const data = req.body;
      let FSdata = await fs.promises.readFile(USERS_DB, FORMAT);
      let users = JSON.parse(FSdata);

      let user = users.find( usu => usu.email === data.email );

      if( !user || user.length === 0 ) throw new Error(`El Usuario con el mail: ${data.email} no existe, intente nuevamente.`);
      if( !isValidPassword(user , data.password) ) throw new Error(`la contraseña es Incorrecta, intente nuevamente.`);

      req.session.userEmail = data.email;

      res.send(`
      <h1> Se logueo el Usuario <h1>
      <p> Nombre: ${user.name}</p>
      <p> apellido: ${user.lastname}</p>
      <p> id: ${user.id}</p>
      `);

    } catch (err) {
      let message = err || "Ocurrio un error";
      console.log(`Error ${err.status}: ${message}`);
      res.send( `
      <h1>Ocurrio un error</h1>
      <p>Error ${err.status}: ${message}</p>
      ` );
    }
  })
  //PRODUCTS
  .get('/products', async ( req , res ) => {
    try {
      let FSdata = await fs.promises.readFile(PRODUCTS_DB, FORMAT);
      let products = JSON.parse(FSdata);
      
      res.json(products)
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.log(`Error ${err.status}: ${message}`);
      res.send( `
      <h1>Ocurrio un error</h1>
      <p>Error ${err.status}: ${message}</p>
      ` )
    }
  } )
  .post('/products', async ( req , res ) => {
    try {
      const data = req.body;
      let FSdata = await fs.promises.readFile(PRODUCTS_DB, FORMAT);
      let products = JSON.parse(FSdata);
      if( ! (data instanceof Object) ) throw new Error('El dato enviado no es un objeto');
      if(!data.id) data.id = crypto.randomBytes(10).toString('hex');
      if(!data.history) data.history = [];

      console.log('POST', typeof data, data);
      products.push(data);
      const dataToJSON = JSON.stringify(products,null,2);
      fs.writeFileSync( PRODUCTS_DB , dataToJSON);
      
      res.json(data)
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.log(`Error ${err.status}: ${message}`);
      res.send( `
      <h1>Ocurrio un error</h1>
      <p>Error ${err.status}: ${message}</p>
      ` )
    }
  } )
  //CLIENTES
  .get('/clients', async ( req , res ) => {
    try {
      let data = await fs.promises.readFile(CLIENTS_DB, FORMAT)
      if(!data) return fs.writeFileSync(CLIENTS_DB,'[]');
      let clients = JSON.parse(data);
      if( ! (clients instanceof Array) ) return res.send('<p>Clientes No es un Array</p>');
      if(!clients.length) return res.send('<p>No hay clientes cargados</p>');

      res.json(clients);
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.log(`Error ${err.status}: ${message}`);
      res.send( `
      <h1>Ocurrio un error</h1>
      <p>Error ${err.status}: ${message}</p>
      ` )
    }
  } )
  .post('/clients', async ( req , res ) => {
    try {
      const data = req.body;

      let FSdata = await fs.promises.readFile(CLIENTS_DB, FORMAT);
      let clients = JSON.parse(FSdata);
      //sacamos los '-' si tiene
      data.cuit = data.cuit.split('-').join('');

      let cuitRepeated = clients.find( cli => cli.cuit === data.cuit);
      if(cuitRepeated) throw new Error(`El Usuario con el CUIT: ${data.cuit} ya existe, por favor ingrese un otro CUIT o corrobore la informacíon.`);
    
      if( ! (data instanceof Object) ) throw new Error('El dato enviado no es un objeto');
      if(!data.id) data.id = crypto.randomBytes(10).toString('hex');
      if(!data.history) data.history = [];

      clients.push(data);
      const dataToJSON = JSON.stringify(clients,null,2);
      fs.writeFileSync( CLIENTS_DB , dataToJSON);
      
      res.json(data)
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.log(`Error ${err.status}: ${message}`);
      res.send( `
      <h1>Ocurrio un error</h1>
      <p>Error ${err.status}: ${message}</p>
      ` )
    }
  } )
  //INGRESO
  .get('/ingress' , async (req , res) => {
    try {
      let data = await fs.promises.readFile(INGRESS_DB, FORMAT);
      if(!data) return fs.writeFileSync(INGRESS_DB, '[]');
      let ingresses = JSON.parse(data);
      if(!(ingresses instanceof Array)) return res.send('<p>Ingresos No es un Array</p>');
      if(!ingresses.length) return res.send('<p>No hay ingresos cargados</p>');

      res.json(ingresses);
    } catch (err) {
      let message = err || "Ocurrio un error";

      console.log(`Error ${err.status}: ${message}`);
      res.send( `
      <h1>Ocurrio un error</h1>
      <p>Error ${err.status}: ${message}</p>
      ` );
    }
  } )
  .post('/ingress', async (req , res) => {
    try {
      let FSdata = await fs.promises.readFile(INGRESS_DB, FORMAT);
      const ingresses = JSON.parse(FSdata);
      FSdata = await fs.promises.readFile(CLIENTS_DB, FORMAT);
      const clients = JSON.parse(FSdata);
      FSdata = await fs.promises.readFile(PRODUCTS_DB, FORMAT);
      let products = JSON.parse(FSdata);
      let userSession = (req.session && req.session.userEmail) || 'Anonimo';
      const date = new Date().toLocaleString();
      const data = req.body;
      
      if(!data.id) data.id = crypto.randomBytes(10).toString('hex');
      data.cuit = data.cuit.split('-').join('');
      let cuitRepeated = clients.find( cli => cli.cuit === data.cuit);
      if(!cuitRepeated) throw new Error(`No hay un proveedor con el CUIT: ${data.cuit}. Si es un cliente nuevo debe cargar primero el cliente, sino revise los datos.`);
      let cuitRepeatedIndex = clients.findIndex( cli => cli.cuit === data.cuit);
      
      if(!data.products.length) throw new Error(`No ha cargado ningun producto en este ingreso.`);
      
      data.products.forEach(prod => {
        let prodExists = products.find(el => el.varCode == prod.varCode)  
        if(!prodExists) throw new Error(`El producto ${prod.varCode} no existe en nuestro inventario. Debe cargarlo primero antes de continuar.`);
        let prodIndex = products.findIndex(el => el.varCode == prod.varCode)  
        let history= {
          incomeNumber: data.incomeNumber,
          quantity: prod.quantity,
          type: 'Ingreso',
          responsable: userSession,
          date
        };

        prodExists.history.push(history);
        products.splice(prodIndex,1,prodExists)
      });
      let history = {
        incomeNumber: data.incomeNumber,
        products: data.products,
        responsable: userSession,
        date
      };
      cuitRepeated.history.push(history);
      clients.splice(cuitRepeatedIndex,1,cuitRepeated);

      ingresses.push(data);

      let dataToJSON = JSON.stringify(products,null,2);
      fs.writeFileSync( PRODUCTS_DB , dataToJSON);
      dataToJSON = JSON.stringify(clients,null,2);
      fs.writeFileSync( CLIENTS_DB , dataToJSON);
      dataToJSON = JSON.stringify(ingresses,null,2);
      fs.writeFileSync( INGRESS_DB , dataToJSON);
      


      res.send('El cliente existe')


      
    } catch (err) {
      let message = err || "Ocurrio un error";

      console.log(`Error ${err.status}: ${message}`); 
      res.send( `
      <h1>Ocurrio un error</h1>
      <p>Error ${err.status}: ${message}</p>
      ` );     
    }
  })

app.listen( PORT , () => console.log(`Servidor funcionando en http://localhost:${PORT}/`));


