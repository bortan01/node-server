const express = require('express');
const app = express();
const fs = require("fs");
const PATH = require("path");
const { verificaTokenImg } = require('../middlewares/autenticaciono');

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = PATH.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    //verificaremos y la imagen existe en el directorio
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noImagePath = PATH.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }






});






module.exports = app;