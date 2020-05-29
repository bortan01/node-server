const express = require('express')
const app = express();
let { verificaToquen, verificaAdmi_Role } = require('../middlewares/autenticaciono');
let Categoria = require('../models/categoria');

//====================================
//MOSTRAR TODAS LAS CATEGORIAS
//====================================
app.get('/categoria', verificaToquen, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, catDB) => {
            if (err) {
                return json({
                    ok: false,
                    err: err
                });
            }
            res.json({
                ok: true,
                categoria: catDB
            });
        });

});
//====================================
//mostrar una categoria por ii
//====================================  
app.get('/categoria/:id', verificaToquen, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, catDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        if (!catDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "el id no fue encontrado"
                }
            });
        }
        return res.json({
            ok: true,
            categoria: catDB
        });

    });
});
//====================================
//crear nueva categoria
//====================================
app.post('/categoria', verificaToquen, (req, res) => {
    //regresa la nueva categoria
    // req.usuario._id
    let body = req.body;
    //  console.log("el req es " + req.body.usuario);
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario
    });

    categoria.save((error, catDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                err: error
            });
        }
        if (!catDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "no se pudo crear el usuario"
                }
            });
        }

        res.json({
            ok: true,
            categoria: catDB
        });

    });
});
//====================================
//actualizar categoria
//====================================
app.delete('/categoria/:id', [verificaToquen, verificaAdmi_Role], (req, res) => {
    //actualizar le nombre de la categoria 
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (error, catDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                err: error
            });
        }
        if (!catDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "no se pudo eliminar la categoria el id no existe"
                }
            });
        }

        res.json({
            ok: true,
            message: "categoria borrada"
        });

    });
});

//==================================== 
//delete de categoria categoria
//====================================
app.put('/categoria/:id', verificaToquen, (req, res) => {
    //solo una administrador puede borrar categoria, y se debe de utilizar una token
    //categoria. findbyid remove

    let id = req.params.id;
    let body = req.body;
    let descripcion_categoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descripcion_categoria, { new: true, runValidators: true }, (error, catDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                err: error
            });
        }
        if (!catDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "no se pudo crear la catagoira "
                }
            });
        }

        res.json({
            ok: true,
            categoria: catDB
        });

    });
});



module.exports = app;