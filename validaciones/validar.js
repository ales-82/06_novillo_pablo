function validarCampos(campo, mensaje, errores){
    //const { titulo, descripcion, fecha, hora, color} = objeto        
    if(typeof campo !='string' || campo==''){
        errores.push(mensaje)        
    }    
}

function validarFecha(campo, mensaje, errores){
    //const fechaVal =/^\d{4}-\d{2}-\d{2}$/
    const fechaVal =/^(?:19|20)\d\d-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)$/
    if(!fechaVal.test(campo)){
        errores.push(mensaje)        
    }
}
function validarHora(campo, mensaje, errores){
    //const horaVal = /^\d{2}:\d{2}$/
    const horaVal = /^([01]?[0-9]|2[0-4]):[0-5][0-9]$/
    if(!horaVal.test(campo)){
        errores.push(mensaje)        
    }
}

module.exports = {
    validarCampos,
    validarFecha,
    validarHora
}