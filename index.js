const express = require('express')
//const path = require('path')
const auth = require('./auth/jwt')
const controller = require('./controller/EventController')
const app = express()

const port = 5000

app.use(express.json())

/*app.post('/registro',function(req, res){
    const objetoUser = req.body
    //console.log(req.body)
    console.log(objetoUser)
    if(fs.existsSync("jsonlocal.json")){
        const usuarioJson = JSON.parse(fs.readFileSync("jsonlocal.json",'utf8'))
        usuarioJson.usuario.push(objetoUser)
        fs.writeFileSync('jsonlocal.json', JSON.stringify(usuarioJson,null,2),'utf8')
    }else{        
        fs.writeFileSync('jsonlocal.json', JSON.stringify({usuario:[objetoUser]},null,2),'utf8')
    }   

    res.status(201).json({mensaje:"Usuario creado"})
})*/
/*app.post('/registro', async function(req, res){
    const objetoUser = req.body
    try{        
        await fs.promises.access("jsonlocal.json")
        const usuarioJson = JSON.parse(await fs.promises.readFile("jsonlocal.json",'utf8')) 
        //console.log(usuarioJson)       
        usuarioJson.usuario.push(objetoUser)
        await fs.promises.writeFile('jsonlocal.json',JSON.stringify(usuarioJson,null,2),'utf8')
        res.status(201).json({mensaje:"Usuario creado"})
    }catch(error){
        await fs.promises.writeFile('jsonlocal.json',JSON.stringify({usuario:[objetoUser]},null,2),'utf8')
        
    }
    res.status(201).json({mensaje:"Usuario creado"})
})*/

//registro y login
app.post('/registro', controller.register)

app.post('/login',controller.login)

//eventos
app.post('/api/tarea', auth.verificarToken,controller.createTask)

app.put('/api/tarea/:id', auth.verificarToken, controller.updateTask)

app.delete('/api/tarea/:id',auth.verificarToken, controller.deleteTasks)

app.get('/api/tarea/:fecha', auth.verificarToken, controller.findTaskDate)

app.listen(port, function(){
    console.log('El servidor esta en el puerto', port)
})