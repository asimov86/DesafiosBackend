const express = require("express");
const fs = require("fs");
const app = express();



let productos = [];

//Utilizar JSON en las request (Cuerpo)
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

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

    async getById(idP){
        
        try{
            let data = await fs.promises.readFile(`./${this.fileName}.txt`, 'utf-8');
            data = JSON.parse(data);
            let getProduct = data.find(p => p.id === idP);
            let error = (typeof(getProduct) === "undefined") ? 'error:producto no encontrado' : 'Producto encontrado';
            console.error (error);
            return getProduct;
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

    async put(item, prodId){
        
        try{
            let data = await fs.promises.readFile(`./${this.fileName}.txt`, 'utf-8');
            data = JSON.parse(data);
            let timestamp = new Date().toLocaleString();
            let codigo = getRandomCod(1000000, 10000000);//Habria que verificar entre los productos existentes si el codigo que se va a otorgar existe. Sino existe si se puede otorgar, si existe se debe
            item.timestamp = timestamp;
            item.codigo = codigo; 
            let pIndex=data.findIndex((producto => producto.id === prodId));
            data[pIndex] = item;
            //Escribo
            await fs.promises.writeFile(`./${this.fileName}.txt`, JSON.stringify(data));
            //
            return data;
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }

    async deleteById(prodId){
        
        try{
            let data = await fs.promises.readFile(`./${this.fileName}.txt`, 'utf-8');
            data = JSON.parse(data);
            const newData = data.filter((item) => item.id !== prodId);
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

const producto = new Contenedor('productos');


//Productos
app.get('/api/productos', async (req, res) => {
    const prod = await producto.getAll();
    res.send({productos: prod});
});

app.get('/api/productos/:id', async (req, res) => {
    
    let idP = parseInt(req.params.id);
    console.log(idP);
    const prod = await producto.getById(idP);
    res.send({productos: prod});
});

app.post('/api/productos/', async (req, res) => {
    let item = req.body;
    console.log(item);
    const prod = await producto.post(item);
    res.send({productos: prod});
});

app.put('/api/productos/:id', async (req, res) => {
    let item = req.body;
    let prodId = parseInt(req.params.id);
    console.log(item);
    console.log(prodId);
    const prod = await producto.put(item, prodId);
    res.send({productos: prod});
});

app.delete('/api/productos/:id', async (req, res) => {
    let prodId = parseInt(req.params.id);
    console.log(prodId);
    const prod = await producto.deleteById(prodId);
    res.send({productos: prod});
});

// Fin productos

function getRandomCod(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)+min);
}

const PORT = 8080;

app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en puerto ${PORT}`);
})
