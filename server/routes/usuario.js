const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');

///esto se llama destructuracion
const { verificaToquen, verificaAdmi_Role } = require('../middlewares/autenticaciono.js');

app.get('/', function(req, res) {
    res.json('Hello World')
});

app.get('/usuario', verificaToquen, function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({}, 'nombre email estado google role imagen')
        .skip(desde)
        .limit(limite)
        .exec((err, arregloUsuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            Usuario.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    usuario: arregloUsuarios,
                    cuantos: conteo
                });
            });


        });
});

app.post('/usuario', [verificaToquen, verificaAdmi_Role], function(req, res) {

    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        img: ""
    });

    usuario.save((err, usuBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            usuario: usuBD
        });
    });
});



app.put('/usuario/:id', [verificaToquen, verificaAdmi_Role], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role,estado']);

    // delete body.password;
    // delete body.google;

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBD
        });
    })



});

app.delete('/usuarioDefinitivamente/:id', [verificaToquen, verificaAdmi_Role], function(req, res) {
    // res.json('deleteUsuario')
    let id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuDelete) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,

            });
        }
        if (usuDelete === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "usuario no encontrado"
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuDelete
        });
    });
});

app.delete('/usuario/:id', [verificaToquen, verificaAdmi_Role], function(req, res) {
    // res.json('deleteUsuario')
    let id = req.params.id;
    let usuarioEnviado = {};
    Usuario.findByIdAndUpdate(id, usuarioEnviado, (err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBD
        });
    })
});

module.exports = app;