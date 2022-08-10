const express = require("express");
const handlebars = require('express-handlebars');
const app = express();
let items = [];


const hbs = handlebars.create({
    extname: 'hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + "/views/layaout",
    partialsDir: __dirname + "/views/partials"
});


//Utilizar JSON en las request (Cuerpo)
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.static("public"));

let productos = [
    {
        title: "Hamburguesa",
        price: "1234",
        thumbnail: "https://st4.depositphotos.com/1328914/20814/i/600/depositphotos_208145482-stock-photo-double-cheeseburger-with-lettuce-tomato.jpg",
        id: 1
    },
    {
        title: "Tequeños",
        price: "1200",
        thumbnail: "https://st4.depositphotos.com/1328914/20814/i/600/depositphotos_208145482-stock-photo-double-cheeseburger-with-lettuce-tomato.jpg",
        id: 2
    }
];


//Rutas para productos

//GET

app.get("/productos", (req, res) => {
    const product = productos;
    res.render('form', { 
        product: product,
        listExists: true,});
});

//POST

app.post('/productos', (req, res) => {
    const prod = req.body
	const newProd = { ...prod, id: productos[productos.length-1].id + 1 };
    productos.push(newProd);
    res.redirect('/productos');
});

const PORT = 8080;

//Nuevo
app.listen(PORT, err => {
    if(err) throw new Error(`Error ${err}`);
    console.log(`Server listening on port ${PORT}`);
});