const fs = require('fs')
const auth = require('../auth/jwt')
const validaciones = require('../validaciones/validar')

const controller = {}

controller.register = function(req, res){
    const objetoUser = req.body    
    const { nombre , password } = objetoUser
    const error = []

    validaciones.validarCampos(nombre,'el nombre no debe estar vacio y debe ser texto',error)
    validaciones.validarCampos(password,'la contraseña no debe estar vacio y debe ser texto',error)    

    //console.log(error.length)
    if(error.length>0){
        return res.status(401).json({error:error})
    } 
       
    if(fs.existsSync('jsonlocal.json')){
        fs.readFile("jsonlocal.json",'utf8',function(error, data){
            if(!error){            
                const objetoUsuario =JSON.parse(data)     
                const arrayUsuario = objetoUsuario.usuario
                const id = arrayUsuario.reduce(function(max, u){
                    return u.id > max ? u.id : max
                },0)
                const userId = id + 1
                arrayUsuario.push({id:userId,...objetoUser})                                               
                fs.writeFile('jsonlocal.json',JSON.stringify(objetoUsuario, null, 2),function(error,data){
                    if(!error){
                        res.status(201).json({mensaje:"usuario creado"})                    
                    }                    
                })
            }else{
                res.status(500).json({mensaje:"hubo un error"})
            }
        })

    }else{
        fs.writeFile('jsonlocal.json',JSON.stringify({usuario:[{id:1,...objetoUser}]},null,2),function(error){
            if(error){
                return res.status(500).json({mensaje:"hubo un error"})
            }            
            return res.status(201).json({mensaje:"usuario creado"})                                
        })
    }
}

controller.login = function(req, res){
    const objetoUser = req.body        
    //console.log(objetoUser.nombre)
    const { nombre , password} = objetoUser
    const error = []

    validaciones.validarCampos(nombre,'el nombre no debe estar vacio y debe ser texto',error)
    validaciones.validarCampos(password,'la contraseña no debe estar vacio y debe ser texto',error)    
    //console.log(error.length)    
    if(error.length>0){
        return res.status(401).json({error:error})
    }  

    if(fs.existsSync('jsonlocal.json')){
        fs.readFile('jsonlocal.json','utf8',function(error, data){
            if(!error){
                usuario = JSON.parse(data).usuario
                //console.log(usuario)

                const login = usuario.find(function(u){                    
                    return u.nombre == objetoUser.nombre && u.password == objetoUser.password
                })
                //console.log(login)
                if(login){                    
                    const token = auth.generarToken(login)
                    res.status(201).json({token})
                }else{
                    res.status(401).json({mensaje:'credenciales invalidas'})
                }                
            }            
        })
    }else{
        res.status(500).json({mensaje:'la base de datos no esta conectado'})
    }
}

controller.createTask = function(req, res){
     //res.json({mensaje:'Ruta protegida',userId:req.userId})
     const objetoTask=req.body
     const { titulo, descripcion, fecha, hora, color} = objetoTask
     const error = []
 
     validaciones.validarCampos(titulo,'el titulo no debe estar vacio y debe ser texto',error)
     validaciones.validarCampos(descripcion,'la descripción no debe estar vacio y debe ser texto',error)
     validaciones.validarCampos(color,'el color no debe estar vacio y debe ser texto',error)
     validaciones.validarFecha(fecha,'la fecha no debe estar vacio y debe tener el formato "yyyy-mm-dd" o la fecha no es válida',error)
     validaciones.validarHora(hora,'La hora no debe estar vacio y debe tener el formato "hh:mm" o la hora no es valida',error)
 
     //console.log(error.length)
     if(error.length>0){
         return res.status(401).json({error:error})
     }    
 
     if(fs.existsSync('jsonlocal.json')){
         fs.readFile('jsonlocal.json','utf8',function(error, data){             
             if(!error){                
                const jsonTareas = JSON.parse(data)
                 if(jsonTareas.hasOwnProperty('tareas')){
                     const arrayTareas = jsonTareas.tareas
                     const id = arrayTareas.reduce(function(max, tarea){
                         return tarea.id > max ? tarea.id : max                        
                     },0)
                     const tareaId = id + 1                    
                     arrayTareas.push({id:tareaId,userId:req.userId,...objetoTask})
                 }else{
                     jsonTareas["tareas"]=[{id:1,userId:req.userId,...objetoTask}]
                 }
                fs.writeFile('jsonlocal.json',JSON.stringify(jsonTareas,null,2), function(error, data){
                    if(!error){
                        res.status(201).json({mensaje:'tarea creada'})
                    }
                })
             }
             
             //console.log(jsonTareas)
         })
     }else{
         res.status(500).json({mensaje:'la base de datos no esta conectado'})
     }
}

controller.updateTask = function(req, res){
    const tareaId = req.params.id
    const objetoTask = req.body
    
    //validar campos
    const { titulo, descripcion, fecha, hora, color} = objetoTask
    const error = []

    validaciones.validarCampos(titulo,'el titulo no debe estar vacio y debe ser texto',error)
    validaciones.validarCampos(descripcion,'la descripción no debe estar vacio y debe ser texto',error)
    validaciones.validarCampos(color,'el color no debe estar vacio y debe ser texto',error)
    validaciones.validarFecha(fecha,'la fecha no debe estar vacio y debe tener el formato "yyyy-mm-dd" o la fecha no es válida',error)
    validaciones.validarHora(hora,'La hora no debe estar vacio y debe tener el formato "hh:mm" o la hora no es valida',error)
    
    if(error.length>0){
        return res.status(401).json({error:error})
    }    

    if(fs.existsSync('jsonlocal.json')){
        fs.readFile('jsonlocal.json','utf8',function(error, data){            
            if(!error){
                const jsonTareas = JSON.parse(data)
                if(jsonTareas.hasOwnProperty('tareas')){
                    const arrayTareas = jsonTareas.tareas

                    const findTarea = arrayTareas.find(function(tarea){
                        return tarea.id == tareaId
                    })                    
                    if(findTarea){
                        findTarea.id = parseInt(tareaId)
                        findTarea.userId = parseInt(req.userId)
                        findTarea.titulo = objetoTask.titulo
                        findTarea.descripcion = objetoTask.descripcion
                        findTarea.fecha = objetoTask.fecha
                        findTarea.hora = objetoTask.hora
                        findTarea.color = objetoTask.color                        
                        //console.log(jsonTareas)
                        fs.writeFile('jsonlocal.json',JSON.stringify(jsonTareas,null, 2), function(error){
                            if(!error){
                                res.status(201).json({mensaje:"registro actualizado"})
                            }else{
                                res.status(401).json({mensaje:"no se pudo actualizar el registro"})
                            }
                        })

                    }else{
                        res.status(401).json({mensaje:'no es un id valido'})
                    }
                }
            }
        })
    }else{
        res.status(500).json({mensaje:'la base de datos no esta conectado'})
    }
}

controller.deleteTasks = function(req, res){    
    const tareaId = req.params.id
    console.log(tareaId)
    fs.readFile('jsonlocal.json','utf8',function(error, data){
        if(!error){
            const jsonTareas = JSON.parse(data)
            if(jsonTareas.hasOwnProperty('tareas')){
                const arrayTareas = jsonTareas.tareas
                const indexTask = arrayTareas.findIndex(function(tarea){
                    return tarea.id == tareaId
                })
                if(indexTask !=-1){
                    arrayTareas.splice(indexTask,1)
                    fs.writeFile('jsonlocal.json', JSON.stringify(jsonTareas,null,2), function(error,data){
                        if(!error){                            
                            return res.status(201).json({ mensaje: 'La Tarea asignada acaba de eliminarse'})                            
                        }else{
                            return res.status(401).json({error:"no se pudo eliminar la tarea"})
                        }                        
                    })                    
                }else{
                    return res.status(401).json({error:'la tarea que busca no se puede eliminar'})
                }                
            }else{
                return res.status(401).json({error:"no existe tareas"})
            }            
        }else{
            return res.status(401).json({error:"no su pudo acceder a la base de datos"})
        }        
    })
}

controller.findTaskDate = function(req, res){
    const fecha = req.params.fecha
    //console.log(typeof fecha)

    if(fs.existsSync('jsonlocal.json')){
        fs.readFile('jsonlocal.json','utf8',function(error, data){
            const jsonTareas = JSON.parse(data)
            if(!error){
                if(jsonTareas.hasOwnProperty('tareas')){
                    const arrayTareas = jsonTareas.tareas

                    const tareasFecha = arrayTareas.filter(function(tarea){
                        return tarea.fecha == fecha
                    })                    
                    if(tareasFecha.length){
                        res.status(201).json(tareasFecha)
                    }else{
                        res.status(401).json({mensaje:"no hay eventos"})
                    }
                }
            }
        })
    }else{
        res.status(500).json({mensaje:'la base de datos no esta conectado'})
    }
}

module.exports = controller