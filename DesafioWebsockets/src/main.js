const express = require('express')
const path = require('path')
const publicPath = path.resolve(__dirname, '../public');

const http = require('http');
const io = require('socket.io');

const products_api = require('../api/products_api.js')
const messages_api = require('../api/messages_api.js')

//--------------------------------------------
// instancio servidor, socket y api

const app = express()

const myServer = http.Server(app);
const myWSServer = io(myServer);

const productosApi = new products_api()
const mensajesApi = new messages_api('message_log.json')

//--------------------------------------------
// configuro el socket

myWSServer.on('connection', async socket => {
    console.log('Un nuevo usuario se ha conectado');

    // carga inicial de productos
    socket.emit('products', productosApi.showAll());
    console.log(productosApi.showAll());

    // actualizacion de productos
    socket.on('update', producto => {
        productosApi.save(producto)
        myWSServer.sockets.emit('products', productosApi.showAll());
    })

    // carga inicial de mensajes
    socket.emit('messages', await mensajesApi.showAll());

    // actualizacion de mensajes
    socket.on('newMessage', async mensaje => {
        mensaje.fyh = new Date().toLocaleString()
        await mensajesApi.save(mensaje)
        myWSServer.sockets.emit('messages', await mensajesApi.showAll());
    })
});


// Se agrega lo sig para poder trabajar correctamente con lo que nos envian en el body de un POST o PUT

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(publicPath));

// Inicializacion de servidor, definicion y asignacion de puerto
const puerto = 8080
const server = myServer.listen(puerto, () => {
    console.log('Server arriba en puerto', puerto)
})
server.on('error', error => console.log(`Error en servidor ${error}`))
