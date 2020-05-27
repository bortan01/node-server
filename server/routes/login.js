const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const jwt = require('jsonwebtoken');
const app = express();

app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        //saber si no encontro nada
        if (!usuDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "(usuario) o contrase;a incorrectos"
                }
            });
        }
        //evaluamos la contra
        if (!bcrypt.compareSync(body.password, usuDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "usuario o (contrase;a) incorrectos"
                }
            });
        }
        let segundos = Number(process.env.CADUCIDAD_TOKEN);
        let token = jwt.sign({ usuario: usuDB },
            process.env.SEMILLA, { expiresIn: segundos }
        );


        res.json({
            ok: true,
            toke: token
        });
    });


});


module.exports = app;