const express = require('express');
const app = express();
const { verificaToquen } = require('../middlewares/autenticaciono');
let Producto = require('../models/producto');


//====================================
//buscar productos
//====================================
app.get('/productos/buscar/:termino', (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');


    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                })
            }
            res.json({
                ok: true,
                productos: productoDB
            });
        });
});




//====================================
//obtener todos los prouctos
//====================================
app.get('/productos', (req, res) => {
    ///trae todos los productos
    //populate usuario categoria
    //paginado 
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, prodDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }
            if (!prodDB) {
                return res.status(400).json({
                    ok: false,
                    err: "la consulta tiene un error"
                });
            }
            res.json({
                ok: true,
                producto: prodDB
            });
        });


});


//====================================
//obtener todos los proucto por id
//====================================
app.get('/productos/:id', (req, res) => {
    //pro
    //populate usuario y categoria
    ///trae todos los productos
    //populate usuario categoria
    //paginado 
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, prodDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err,
                    myerror: "id no valido"
                });
            }
            if (!prodDB) {
                return res.status(400).json({
                    ok: false,
                    err: "la consulta tiene un error, id equivocado"
                });
            }
            res.json({
                ok: true,
                producto: prodDB
            });
        });

});

//====================================
//crear un nuevo producto
//====================================
app.post('/productos', verificaToquen, (req, res) => {
    //grabal el usuario
    //grabar la categoria
    let body = req.body;
    //console.log("el req es " + req.usuario._id);
    let producto = new Producto({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: Number(body.precioUni),
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario,
        img: ""


    });

    producto.save((error, proDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                err: error
            });
        }
        if (!proDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "no se pudo crear el producto"
                }
            });
        }

        res.json({
            ok: true,
            producto: proDB
        });

    });
});

//====================================
//actualizr un nuevo producto
//====================================
app.put('/productos/:id', verificaToquen, (req, res) => {
    //grabar el usuario
    //grabar una  categoria del listado 
    let id = req.params.id;
    let body = req.body;

    let producto_modificado = {


        nombre: body.nombre,
        precioUni: (body.precioUni),
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,

    };

    Producto.findByIdAndUpdate(id, producto_modificado, { new: true, runValidators: true }, (err, proDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        if (!proDB) {
            return res.status(400).json({
                ok: false,
                err: "error en la bd"
            });
        }

        res.json({
            ok: true,
            producto: proDB
        });
    });


});


//====================================
//borrar producto
//====================================
app.delete('/productos/:id', (req, res) => {
    //cambiar disponible a falso
    let id = req.params.id;
    Producto.findById(id, (err, proDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: "id no existe"
            });
        }
        if (!proDB) {
            return res.status(400).json({
                ok: false,
                err: "error en la bd"
            });
        }
        proDB.disponible = false;
        proDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    myerror: "id no existe",
                    err: err
                });
            }
            res.json({
                ok: true,
                producto: productoBorrado
            });
        });

    });

});



module.exports = app;