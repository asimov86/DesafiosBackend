const express = require("express");
const fs = require("fs");
//const { Router } = express;
const app = express();

let carritos = [];

//Utilizar JSON en las request (Cuerpo)
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));



//const router= Router();

class Contenedor{
    constructor(fileName){
        this.fileName = fileName;    
    }

    async getAll(){
        
        try{
            let data = await fs.promises.readFile(`./${this.fileName}.txt`, 'utf-8');
            data = JSON.parse(data);
            return data;
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }

    async getById(idC){
        
        try{
            let data = await fs.promises.readFile(`./${this.fileName}.txt`, 'utf-8');
            data = JSON.parse(data);
            let getData = data.find(p => p.id === idC);
            let error = (typeof(getData) === "undefined") ? 'error:producto no encontrado' : 'Producto encontrado';
            console.error (error);
            return getData;
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }

    async post(item){
        
        try{
            let data = await fs.promises.readFile(`./${this.fileName}.txt`, 'utf-8');
            data = JSON.parse(data);
            
            let codigo = getRandomCod(1000000, 10000000);//Habria que verificar entre los productos existentes si el codigo que se va a otorgar existe. Sino existe si se puede otorgar, si existe se debe crear otro codigo verificar de nuevo y si no existe si se otorga.
            let timestamp = new Date().toLocaleString();
            item.id = data.length + 1;
            item.timestamp = timestamp;
            item.codigo = codigo; 
            data.push(item);
            //Escribo
            await fs.promises.writeFile(`./${this.fileName}.txt`, JSON.stringify(data));
            //
            return data;
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }

    async put(item, carId){
        
        try{
            let data = await fs.promises.readFile(`./${this.fileName}.txt`, 'utf-8');
            data = JSON.parse(data);
            let timestamp = new Date().toLocaleString();
            let codigo = getRandomCod(1000000, 10000000);//Habria que verificar entre los productos existentes si el codigo que se va a otorgar existe. Sino existe si se puede otorgar, si existe se debe
            item.timestamp = timestamp;
            item.codigo = codigo; 
            let pIndex=data.findIndex((producto => producto.id === carId));
            data[pIndex] = item;
            //Escribo
            await fs.promises.writeFile(`./${this.fileName}.txt`, JSON.stringify(data));
            //
            return data;
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }

    async deleteById(carId){
        
        try{
            let data = await fs.promises.readFile(`./${this.fileName}.txt`, 'utf-8');
            data = JSON.parse(data);
            const newData = data.filter((item) => item.id !== carId);
            for (let i = 0; i < newData.length; i++) {//Actualizo la posición de los productos en el array luego de borrar un item.
               newData[i].id = (i + 1);
            }
            await fs.promises.writeFile(`./${this.fileName}.txt`, JSON.stringify(newData));
            return newData;
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }

}
//Rutas para productos

//GET
app.get('/', (req, res) => {
    res.send({mensaje: "Bienvenidos a la ruta raíz"});
});

const carrito = new Contenedor('carrito');

app.get('/api/carrito', async (req, res) => {
    const car = await carrito.getAll();
    res.send({carritos: car});
});

app.get('/api/carrito/:id', async (req, res) => {
    
    let idC = parseInt(req.params.id);
    console.log(idC);
    const car = await carrito.getById(idC);
    res.send({carritos: car});
});

app.post('/api/carrito/', async (req, res) => {
    let item = req.body;
    console.log(item);
    const car = await carrito.post(item);
    res.send({carritos: car});
});

app.put('/api/carrito/:id', async (req, res) => {
    let item = req.body;
    let carId = parseInt(req.params.id);
    console.log(item);
    console.log(carId);
    const car = await carrito.put(item, carId);
    res.send({carritos: car});
});

app.delete('/api/carrito/:id', async (req, res) => {
    let carId = parseInt(req.params.id);
    console.log(carId);
    const car = await producto.deleteById(carId);
    res.send({carritos: car});
});



function getRandomCod(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)+min);
}

const PORT = 8080;

app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en puerto ${PORT}`);
})
