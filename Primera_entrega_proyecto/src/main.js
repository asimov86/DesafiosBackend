const express = require('express');
const mainRouter = require('./routes');
//const initMongoDB = require('./services/database');
const PORT = 8080;

const app = express();
app.use(express.static('public'));

//initMongoDB();
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));

app.use(express.json());

app.use('/api', mainRouter);

app.use((req, res) => {
    res.status(404).json({
      msg: 'Ruta no encontrada',
    });
  });

