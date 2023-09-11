const jwt = require('jsonwebtoken')

const key = 'secretos'

function generarToken(usuario){
    const {id, nombre} = usuario 
    const payload = { usuario }
    
    const token = jwt.sign(payload, key, {expiresIn:'1h'})
    return {id, nombre, token}    
}

function verificarToken(req, res, next){
    let token = req.header('Authorization')       
    
    token = typeof token=="undefined" ? token : token.slice(7)
    //token = token.slice(7)     
    console.log(token)
    if(!token){
        return res.status(401).json({mensaje:'Token no generado'})
    }
    jwt.verify(token, key,(error, decoded)=>{
        if(error){            
            console.log(decoded)
            return res.status(401).json({mensaje:'Token no valido, Ud no esta logueado'})

        }
        req.userId = decoded.usuario.id
        //req.nombre = decoded.usuario.nombre        
        next()
    })
}

module.exports = {
    generarToken,
    verificarToken
}