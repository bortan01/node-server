const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

//para subir archivos
app.use(fileUpload());

//para ocupar el file sistem de node y el path no es necesario el npm
const fs = require('fs');
const path = require('path');

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    //validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: "los tipos permitidos son " + tiposValidos.join(", ")
        });
    }


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: "no puedimos subir ningun archivo"
        });
    }
    let archivo = req.files.archivo;

    ///para verificar extenciones
    let extencionesValidad = ['png', 'jpg', 'gif', 'jpeg'];
    let nombreCortado = archivo.name.split('.');
    let extencion = nombreCortado[1];

    if (extencionesValidad.indexOf(extencion) < 0) {
        ///si entra aca es que la extencion del archivo no es valida
        return res.status(400).json({
            ok: false,
            err: "la extencion del archivo que ha subido no es valida como lo son " + extencionesValidad.join(', ')
        });
    }

    ///cambiar el nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencion}`


    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {

            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        ///en este momento el la imagen ya esta cargada


        if (tipo === "usuarios") {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            //   imagenProducto(id, res, nombreArchivo);
        }

    });

});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuDB) => {
        if (err) {
            //borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err: err,
                mi_error: "el id no existe"
            });
        }
        if (!usuDB) {
            if (err) {
                borraArchivo(nombreArchivo, 'usuarios');
                return res.status(400).json({
                    ok: false,
                    err: "el usuario no existe"
                });
            }
        }
        //se hara una comprabacion para evitar que se suban imagenes 
        //con esto verificamos si la ruta ya fue creada

        // borraArchivo(usuDB.img, "usuarios");
        usuDB.img = nombreArchivo;
        usuDB.save((err, usuDB) => {
            res.json({
                ok: true,
                Usuario: usuDB,
                img: nombreArchivo
            });
        });



    });
}

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuDB) => {
        if (err) {
            //borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err: err,
                mi_error: "el id no existe"
            });
        }
        if (!usuDB) {
            if (err) {
                borraArchivo(nombreArchivo, 'usuarios');
                return res.status(400).json({
                    ok: false,
                    err: "el usuario no existe"
                });
            }
        }
        //se hara una comprabacion para evitar que se suban imagenes 
        //con esto verificamos si la ruta ya fue creada

        // borraArchivo(usuDB.img, "usuarios");
        usuDB.img = nombreArchivo;
        usuDB.save((err, usuDB) => {
            res.json({
                ok: true,
                Usuario: usuDB,
                img: nombreArchivo
            });
        });



    });
}

function borraArchivo(nombre, tipo) {
    let rutaImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombre}`);
    if (fs.existsSync(rutaImagen)) {
        fs.unlinkSync(rutaImagen);
    }
}


module.exports = app;