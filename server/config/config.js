//=====================
//puerto
//=====================
process.env.PORT = process.env.PORT || 3000;

//=====================
//entorno
//=====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=====================
//base de datos 
//=====================

let urlBD;

if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/cafe ';
} else {
    urlBD = 'mongodb+srv://usuario:usuario@cluster0-mwhbr.mongodb.net/cafe?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';
}

process.env.URLDB = urlBD;