const express = require("express");
const fs = require("fs");
const { stringify } = require("querystring");
//const { Router } = express;
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

//const { ProductsController } = require('../controller/productos');

let carritos = [];
router.use(express.urlencoded({extended:true}));

//const router= Router();

class Contenedor{
    constructor(fileName){
        this.fileName = fileName;    
    }

    async getData() {
        const data = await fs.promises.readFile(`../${this.fileName}.txt`, 'utf-8');
        console.log(JSON.parse(data));
        return JSON.parse(data);
      }

    async getAll(){
        
        try{
            const data = await this.getData();
            return data;
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }

    async getById(id){
        
        try{
            const data = await this.getData();
            console.log('Data', data);
            console.log('id', id); 
            let cart = data.filter(function(cart){
                return cart.id === id;
            });
            console.log('cart', cart);
            //let getData = data.id;
            let getProduct = cart.productos;
            //console.log('getData', getData);
            console.log('getProduct', getProduct);
            let error = (cart.length === 0) ? 'error:producto no encontrado' : 'Producto encontrado';
            console.error (error);
            return getProduct;
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }

    async agregaItem(id, id_prod){
        
        try{
            //Lista de productos
            let products = await fs.promises.readFile(`../productos.txt`, 'utf-8');
            products = JSON.parse(products);
            console.log(products);
            //Carrito
            const data = await this.getData();
            console.log("Carritos", data);
            //Item a agregar en el carrito, lo busco por id_prod
            let itemAagregar = products.filter(function(itemAagregar){
                return itemAagregar.id === parseInt(id_prod);
            });

            //Busco el carrito por id
            let cart = data.filter(function(cart){
                return cart.id === id;
            });
            // Muestro el carrito
            console.log("cart", cart);
            //leo los prod del carrito
            let productosCarrito = cart.productos;
            console.log("productosCarrito ", productosCarrito);
            console.log("itemAagregar   ", JSON.stringify(itemAagregar));
            /* if (!itemAagregar){
                return res.status(404).json({
                msg: 'Producto no encontrado',
            })} else{ */
                //Agrego el item al carrito
               // cart[0].productos=itemAagregar;
               if(typeof(productosCarrito) == 'undefined'){
 /*  Revisar el tipo de variable productosCarrito en carrito.js
Para que entre en una opcion o en la otra */
                cart[0].productos=itemAagregar;
                console.log("typeof(productosCarrito)", typeof(productosCarrito));
               }else{
               productosCarrito.push(itemAagregar);
               cart[0].productos=productosCarrito;}
                //cart.push(itemAagregar);
                console.log("cart", cart);
           /*  }; */
            //let timestamp = new Date().toLocaleString();
            //data.productos = productosCarrito;
            //cart.timestamp = timestamp;
            //console.log(cart);
            //Escribo
            await fs.promises.writeFile(`../${this.fileName}.txt`, JSON.stringify(cart));
            //
            return cart;
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }


    async post(){
        
        try{
            const data = await this.getData();
            console.log('Data', data);
            const newCar= {};
            let id = uuidv4();
            let timestamp = new Date().toLocaleString();
            newCar.id = id;
            newCar.timestamp = timestamp;
            //newCar.productos = [];
            console.log(newCar);
            data.push(newCar);
            //Escribo
            await fs.promises.writeFile(`../${this.fileName}.txt`, JSON.stringify(data));
            //
            return newCar;
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }

    async put(item, carId){
        
        try{
            const data = await this.getData();
            let timestamp = new Date().toLocaleString();

            item.timestamp = timestamp;
            item.codigo = codigo; 
            let pIndex=data.findIndex((producto => producto.id === carId));
            data[pIndex] = item;
            //Escribo
            await fs.promises.writeFile(`../${this.fileName}.txt`, JSON.stringify(data));
            //
            return data;
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }

    async deleteById(carId){
        
        try{
            let data = await fs.promises.readFile(`../${this.fileName}.txt`, 'utf-8');
            data = JSON.parse(data);
            const newData = data.filter((item) => item.id !== carId);
            for (let i = 0; i < newData.length; i++) {//Actualizo la posición de los productos en el array luego de borrar un item.
               newData[i].id = (i + 1);
            }
            await fs.promises.writeFile(`../${this.fileName}.txt`, JSON.stringify(newData));
            return newData;
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }

}
//Rutas para productos

const carrito = new Contenedor('carrito');

router.post('/', async (req, res) => {
    const car = await carrito.post();
    res.send({carritos: car});
});

router.delete('/:id/productos', async (req, res) => {
    let carId = parseInt(req.params.id);
    console.log(carId);
    const car = await producto.deleteById(carId);
    res.send({carritos: car});
});

router.get('/:id/productos', async (req, res) => {
    const { id } = req.params;
    //let idC = req.params.id;
    console.log(id);
    const car = await carrito.getById(id);
    res.send({carritos: car});
});

router.post('/:id/productos/:id_prod', async (req, res) => {

    //let idP = parseInt(req.params);
    const { id, id_prod } = req.params;
    console.log(id, id_prod);
    const car = await carrito.agregaItem(id, id_prod);
    res.send({productos: car});
});





/* function getRandomCod(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)+min);
} */

module.exports = router;