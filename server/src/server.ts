/*
    Request Param: Paramentros que vem na própria rota, e identifica um recurso (req.params)
    Query Param: Paramentros que vem na própria rota, geralmente opcionais para filtros, paginação (req.query)
    Request Body: Parametros para criação/atualização  de informações

    TODO : 

    - multer file filter
*/
import path from 'path'
import express from 'express'
import routes from './routes'
import cors from 'cors'
import { errors } from 'celebrate'

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)
//express.static é usado para servir arquivos estáticos da nossa aplicação
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.use(errors())

app.listen(3333)