import app , { apiSession } from "./index.js";
import { Server as HttpServer } from 'http';
import { Server as IOServer , Socket } from 'socket.io';
import Singleton from "./src/utils/Singleton.js";

const { daos } = Singleton.getInstance();
const { usersDao , productsDao } = daos;

const httpServer = new HttpServer(app);
export const io = new IOServer(httpServer);
let notiNumber = 0

io.use( ( socket , next) => {
  apiSession( socket.request , socket.request.res || {} , next )
} );

io.on( 'connection' , async (socket) => {
  try {    
    const user = socket.request && socket.request.session && socket.request.session.passport && socket.request.session.passport.user;
    
    if( user && user !== undefined ){
      socket.join('login');
      const userLog = await usersDao.getByID(user);
      socket
        .on('notification', (data) => {
          notiNumber++;
          data.id = notiNumber;
          data.responsable = userLog.email;
          socket.to('login').emit( 'new-notification' , data );
        })
        .on('change-stock', async (data) => {
          let product = await productsDao.getBy('barCode',data);

          if(product.minStock > (product.stock - data.diference)){
            let message =`el stock del producto ${product.name} está por debajo del minimo`;
            notiNumber++;
            data.id = notiNumber;
            data.responsable = userLog.email;
            data.message = message;
            socket.to('login').emit( 'new-warn' , data );
          }
        })
    }
  } catch (err) {
    let message = err || "Ocurrio un error";
  
    console.error(`Error ${err.status}: ${message}`); 
  }
} )

const PORT = parseInt(process.env.PORT) || 8080;

const server = httpServer.listen( PORT , () => console.log(`Servidor funcionando en http://localhost:${PORT}/`));

server.on('error', err => console.error(`Error en servidor ${err}`))