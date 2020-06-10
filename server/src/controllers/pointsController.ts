import { Request, Response } from 'express'
import knex from '../database/connection'

class PointsController {
    async index(request: Request, response: Response)
    {
      const points = await knex('points').select('*')

      const serializedPoints = points.map(point => {
        return {
          ...point,
          image_url: `http://${process.env.LOCAL_IP}:3333/uploads/points_images/${point.image}`
        }
      })

      return response.json(serializedPoints)
    }

    async index_filtered(request: Request, response: Response)
    {
      const { city, uf, items } = request.query
      const allItems = await (await knex('items').select('id')).map(item => (item.id))

      const parsedItems = String(items)
        .split(',')
        .map(item => Number(item.trim()) )

      const points = await knex('points')
          .join('points_items', 'points.id', '=', 'points_items.point_id')
          .whereIn('points_items.item_id', (items) ? parsedItems : allItems)
          .where('city', String(city))
          .where('uf', String(uf))
          .distinct()
          .select('points.*', knex.raw('group_concat(points_items.item_id) AS items'))
          .groupBy('points.id')

      const serializedPoints = points.map(point => {
        return {
          ...point,
          image_url: `http://${process.env.LOCAL_IP}:3333/uploads/points_images/${point.image}`
        }
      })

      return response.json(serializedPoints)
    }

    async show(request: Request, response: Response)
    {
      const { id } = request.params

      const point = await knex('points').where('id', id).first()

      if(!point)
          return response.status(400).json({ message: 'Point not found !' })


      const serializedPoint = {
        ...point,
        image_url: `http://${process.env.LOCAL_IP}:3333/uploads/points_images/${point.image}`
      }

      const items = await knex('items')
          .join('points_items', 'items.id', '=', 'points_items.item_id')
          .where('points_items.point_id', id)
          .select('items.title')

      return response.json({ serializedPoint, items })
    }
    
    async create(request: Request, response: Response)
    {
      const {
          name, 
          email,
          whatsapp,
          city,
          uf,
          latitude,
          longitude,
          items
      } = request.body
  
      //Usado para multiplas transcões interdependentes no banco de dados
      const trx = await knex.transaction()
      
      const point = {
          image: request.file.filename,
          name, 
          email,
          whatsapp,
          city,
          uf,
          location_lat: latitude,
          location_lng: longitude
      }

      const inserted_ids = await trx('points').insert(point)
      const point_id = inserted_ids[0]
      const point_items = items
        .split(',')
        .map((item: string) => Number(item.trim()))
        .map((item_id: Number) => {
          return {
              item_id,
              point_id
          }
      })
  
      await trx('points_items').insert(point_items)
      
      await trx.commit()

      return response.json({
          id: point_id,
          ...point,
      })
    }
}

export default PointsController