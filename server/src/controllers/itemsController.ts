import { Request, Response } from 'express'
import knex from '../database/connection'

class ItemsController {
    async index(request: Request, response: Response) 
    {
        const items = await knex('items').select('*')
    
        //Serialize é o processo de converter ou transformar dados do banco antes de entrega-los a sua aplicação
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://192.168.0.112:3333/uploads/${item.image}`
            }
        })
        
        return response.json(serializedItems)
    }
}

export default ItemsController