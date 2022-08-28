const express = require("express");
const fs = require("fs");
const { stringify } = require("querystring");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

let carritos = [];
router.use(express.urlencoded({extended:true}));

class Contenedor{
    constructor(fileName){
        this.fileName = fileName;    
    }

    async getData() {
        const data = await fs.promises.readFile(`../${this.fileName}.json`, 'utf-8');
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
            //Traigo carritos
            const data = await this.getData();
            let cart = data.find(carrito => carrito.id === id);
            let getProduct = [];
             getProduct = cart.productos;
            let error = (cart.length === 0) ? 'error:producto no encontrado' : 'Producto encontrado';
            console.error (error);
            return cart.productos;
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }

    async agregaItem(idC, id_prod){
        
        try{
            let carrito = {};
            let products = await fs.promises.readFile(`../productos.txt`, 'utf-8');
            products = JSON.parse(products);
            let data = await this.getData();
            //Item a agregar en el carrito, lo busco por id_prod
            const item = products.find(item => item.id === parseInt(id_prod));
            //Busco  el carrito por id
            carrito = data.find(carrito => carrito.id === idC);
            //saco el carrito del array data
            data = data.filter(carrito => carrito.id !== idC);
            let cartProducts=carrito.productos;
            cartProducts.push(item);
            //Agrego de nuevo el carrito con los productos agregados
            data.push(carrito);
            await fs.promises.writeFile(`../${this.fileName}.json`, JSON.stringify(data));
            return carrito;
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }

    async post(){
        
        try{
            const data = await this.getData();
            console.log('Data', data);
            const newCar ={
                id: uuidv4(),
                timestamp: new Date().toLocaleString(),
                productos: [],
                };
            data.push(newCar);
            //Escribo
            await fs.promises.writeFile(`../${this.fileName}.json`, JSON.stringify(data));
            //
            return newCar.id;
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }


    async deleteCartById(id){
        
        try{
            let data = await fs.promises.readFile(`../${this.fileName}.json`, 'utf-8');
            data = JSON.parse(data);
            //Busco el carrito por id
            const newData = data.filter((carrito) => carrito.id !== id);
            await fs.promises.writeFile(`../${this.fileName}.json`, JSON.stringify(newData));
            return id;
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }

    async deleteById(idC, id_prod){
        
        try{
            let carrito = {};
            let data = await this.getData();
            //Busco  el carrito por id
            carrito = data.find(carrito => carrito.id === idC);
            let productosCarrito = [];
            //Extraigo los productos en la variable productosCarrito
            productosCarrito = carrito.productos;
            let timestampC = carrito.timestamp;
            //Elimino el producto en productosCarrito, lo busco por id_prod
            const productos = productosCarrito.filter((item) => item.id !== parseInt(id_prod));
            let newCar ={
                id: idC,
                timestamp: timestampC
                };
            newCar.productos = productos;
            //saco el carrito del array data
            let newData = data.filter((carrito) => carrito.id !== idC);
            newData.push(newCar);
            await fs.promises.writeFile(`../${this.fileName}.json`, JSON.stringify(newData));
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
    res.send({carrito_creado: car});
});

router.delete('/:idC/productos/:id_prod', async (req, res) => {
    const { idC, id_prod } = req.params;
    const car = await carrito.deleteById(idC, id_prod);
    res.send({producto_eliminado_de_carrito: car});
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const car = await carrito.deleteCartById(id);
    res.send({carrito_eliminado: car});
});

router.get('/:id/productos', async (req, res) => {
    const { id } = req.params;
    const car = await carrito.getById(id);
    res.send({productos_carrito: car});
});

router.post('/:idC/productos/:id_prod', async (req, res) => {
    const { idC, id_prod } = req.params;
    const car = await carrito.agregaItem(idC, id_prod);
    res.send({carrito: car});
});

router.get('/', async (req, res) => {
    const car = await carrito.getAll();
    res.send({carritos: car});
});

module.exports = router;