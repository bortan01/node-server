const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'el nombre es necesario']
    },
    email: {
        type: String,
        required: [true, 'el correo es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'el password es necesario']
    },
    img: {
        type: String,
        require: false
    },
    role: {
        type: String,
        required: [true, 'el rol es necesario'],
        default: 'USER_ROLE',
        enum: rolesValidos

    },
    estado: {
        type: Boolean,
        required: [true, 'el estado es necesario'],
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}


usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} DEBE DE SER UNICO'
});

module.exports = mongoose.model('Usuario', usuarioSchema);