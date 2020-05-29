const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'la descripcion de la categoria es necesario es necesaria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});
module.exports = mongoose.model('Categoria', categoriaSchema);