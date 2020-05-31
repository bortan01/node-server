const jwt = require('jsonwebtoken');

let verificaToquen = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEMILLA, (err, decoded) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "el token no es valido"
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });

};

let verificaAdmi_Role = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEMILLA, (err, decoded) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "el token no es valido"
                }
            });
        }
        let admin_role = decoded.usuario.role
        if (admin_role == 'USER_ROLE') {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "NO TIENES PERMISOS PARA CREAR UN USUARIO"
                }
            });
        }


        req.usuario = decoded.usuario;
        next();
    });

};
//====================================
//verifica token para la imagen
//====================================

let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEMILLA, (err, decoded) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "el token no es valido"
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });

}

module.exports = {
    verificaToquen,
    verificaAdmi_Role,
    verificaTokenImg
};