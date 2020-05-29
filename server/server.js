require('./config/config.js');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const colors = require('colors');
mongoose.set('useFindAndModify', false);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//habilitar la carpeta public desde cualquier lugar 
app.use(express.static(path.resolve(__dirname, '../public')));

///importando todas las rutas
app.use(require('./routes/index'));


conexion = async() => {
    await mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
        (err, res) => {
            if (err) {
                throw new err;
            } else {
                console.log("base de datos online".green);
            }
        });
}
conexion();


app.listen(process.env.PORT, () => {
    console.log('escuchando puerto: '.yellow, process.env.PORT.yellow);
})