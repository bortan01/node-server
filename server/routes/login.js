const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const jwt = require('jsonwebtoken');
const app = express();

///esto es para la identificacion de google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);



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

///CONFIGURACIONES DE GOOGLE 
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    //este es el usuario que se retornara 
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}
//verify().catch(console.error);





app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    ///por si hay algun problema cuando se identifique con un usuario de googel
    let googleUser = await verify(token)
        .catch((err) => {
            return res.status(403).json({
                okk: false,
                err: e
            });
        });
    Usuario.findOne({ email: googleUser.email }, (err, usuDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        if (usuDB) {
            if (usuDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "debe de usar autenticacion normal"
                    }
                });
            } else {
                ///si fue un usuario autenticado con google anteriormente se va a renovar el token
                let token = jwt.sign({
                    usuario: usuDB,
                }, process.env.SEMILLA, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.json({
                    ok: true,
                    usuario: usuDB,
                    toke: token
                });

            }
        } else {
            ///si se trata de un usuario que por primera vez se identifica con sus credenciales google y poor lo tanto nolo tenemos en la bd
            let usu = new Usuario;
            usu.nombre = googleUser.nombre;
            usu.email = googleUser.email;
            usu.img = googleUser.img;
            usu.google = true;
            usu.password = ':)'

            usu.save((err, usuDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: true,
                        err: err
                    });
                }
                let token = jwt.sign({
                    usuario: usuDB,
                }, process.env.SEMILLA, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.json({
                    ok: true,
                    usuario: usuDB,
                    toke: token
                });


            });
        }

    });


    // return res.json({
    //     usuario: googleUser
    // });
});



module.exports = app;