//=====================
//puerto
//=====================
process.env.PORT = process.env.PORT || 3000;

//=====================
//entorno
//=====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=====================
//vencimiento del token
//=====================
//60 segundos, 60 minutos,24 horas , 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//=====================
//semilla de autenticacion
//=====================
//SEMILLA ES UNA VARIABLE CREADA EN HEROKU
process.env.SEMILLA = process.env.SEMILLA || 'SEMILLA-DESARROLLO';



//=====================
//base de datos 
//=====================

let urlBD;

if (process.env.NODE_ENV === 'dev') {
    urlBD = "mongodb://localhost:27017/cafe";
} else {
    urlBD = process.env.MONGO_URI;
}
///esta es una variable creada en terminal para evitar exponer la la url de conexion
process.env.URLDB = urlBD;