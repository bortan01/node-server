require('./config/config.js');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/usuario'));


conexion = async() => {
    await mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
        (err, res) => {
            if (err) {
                throw new err;
            } else {
                console.log("base de datos online");
            }
        });
}
conexion();


app.listen(process.env.PORT, () => {
    console.log('escuchando puerto: ', process.env.PORT);
})