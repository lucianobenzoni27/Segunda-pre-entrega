import express from 'express'
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'
import productsRouter from './routers/products.router.js'
import cartsRouter from './routers/carts.router.js'
import viewsRouter from './routers/views.router.js'
import chatRouter from './routers/chat.router.js'
import mongoose from 'mongoose'
import Message from './dao/models/message.model.js'

const PORT = 8080; // puerto en el que va a escuchar el servidor

const app = express(); // crea una instancia de una aplicación de express
app.use(express.json()); // middleware para parsear el body de las requests a JSON
app.use(express.static('./src/public')); // middleware para servir archivos estáticos


// configuracion del motor de plantillas handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');


// Inicialización del servidor
try {
    await mongoose.connect('mongodb+srv://cardozoesteban:lyqQs94mGfCX24G8@cluster0.jycginf.mongodb.net/ecommerce') // conecta con la base de datos
    const serverHttp = app.listen(PORT, () => console.log('server up')) // levanta el servidor en el puerto especificado  
    const io = new Server(serverHttp) // instancia de socket.io
    
    app.use((req, res, next) => {
        req.io = io;
        next();
    }); // middleware para agregar la instancia de socket.io a la request
    
    // Rutas
    app.get('/', (req, res) => res.render('index')); // ruta raíz
    
    app.use('/chat', chatRouter); // ruta para renderizar la vista de chat
    app.use('/products', viewsRouter); // ruta para renderizar la vista de productos
    app.use('/api/products', productsRouter); // registra el router de productos en la ruta /api/products
    app.use('/api/carts', cartsRouter); // registra el router de carritos en la ruta /api/carts
    
    io.on('connection', socket => {
        console.log('Nuevo cliente conectado!')

        socket.broadcast.emit('Alerta');

        // Cargar los mensajes almacenados en la base de datos
        Message.find()
          .then(messages => {
            socket.emit('messages', messages); 
          })
          .catch(error => {
            console.log(error.message);
          });
    
        socket.on('message', data => {
          // Guardar el mensaje en la base de datos
          const newMessage = new Message({
            user: data.user,
            message: data.message
          });
    
          newMessage.save()
            .then(() => {
              // Emitir el evento messages con los mensajes actualizados de la base de datos
              Message.find()
                .then(messages => {
                  io.emit('messages', messages);
                })
                .catch(error => {
                  console.log(error.message);
                });
            })
            .catch(error => {
              console.log(error.message);
            });
        });

        socket.on('productList', async (data) => { 
            io.emit('updatedProducts', data ) // emite el evento updatedProducts con la lista de productos
        }) // evento que se ejecuta cuando se actualiza la lista de productos
    }) // evento que se ejecuta cuando un cliente se conecta
} catch (error) {
    console.log(error.message)
}
