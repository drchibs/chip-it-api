// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import ChipRequest from "App/Validators/ChipRequestValidator";
import User from "App/Models/User";
import Folder from "App/Models/Folder";
import Chip from "App/Models/Chip";
import { getLinkPreview } from "link-preview-js";

export default class ChipsController {
  public async create({request, response}: HttpContextContract){
    try{
      const payload = await request.validate(ChipRequest)
      const metadata = await getLinkPreview(payload.url, {
        headers: {
          "user-agent": "googlebot"
        },
      })

      const user = await User.findByOrFail('uuid', payload.user_id)

      const userHasChip = await Chip.query().where('url', payload.url).where('user_id', user.id)
      if(userHasChip.length > 0){
        return response.badRequest({ messages: { errors: "Chip already exists"}})
      }

      let folder;
      if (payload.folder_id == null){
        folder = await Folder.query().where('name', 'Bookmarks').where('user_id', user.id).first()
      }else{
        folder = await Folder.findByOrFail('uuid', payload.folder_id)
      }

      const chip = new Chip()
      chip.url = payload.url
      chip.ip = request.ip()
      chip.clicks = 1
      chip.userAgent = <string>request.headers()["user-agent"]
      chip.metadata = metadata
      await chip.related('user').associate(user)
      await chip.related('folder').associate(folder)
      await chip.save()

      return response.send({chip: chip})
    }catch (e) {
      return response.badRequest(e)
    }

  }

  public async show({request, response}: HttpContextContract){
    try{
      const chip = await Chip.query().where('uuid', request.param('id'))
        .preload('user').preload('folder').firstOrFail()
      return response.send({'chip': chip.serialize()})
    }catch (e) {
      return response.badRequest(e)
    }
  }

  public async index({request, response}: HttpContextContract){
    const query = request.qs()
    try{
      const chips = await Chip.query()
        .paginate(query['page'], query['limit'])
      response.send({chips: chips.serialize()})
    }catch (e){
      return response.internalServerError(e)
    }
  }

  public async update({request, response}: HttpContextContract){
    try{
      const payload = request.body()
      const chip = await Chip.query().where('uuid', request.param('id')).update({...payload})
      return response.send({'success': chip})
    }catch (e) {
      return response.internalServerError(e)
    }
  }

  public async destroy({request, response}: HttpContextContract){
    const chip = await Chip.findByOrFail('uuid', request.param('id'))
    await chip.delete()
    return response.noContent()
  }

  public async incrementClicks({request, response}: HttpContextContract){
    try{
      const chip = await Chip.query().where('uuid', request.param('id')).increment('clicks', 1)
      return response.send({'success': chip})
    }catch (e) {
      return response.internalServerError(e)
    }
  }

  public async toggleFavorite({request, response}: HttpContextContract){
    try{

      const chip = await Chip.query().where('uuid', request.param('id')).firstOrFail()
      chip.isFavorite = !chip.isFavorite
      await chip.save()
      return response.send({'success': 1})
    }catch (e) {
      return response.internalServerError(e)
    }
  }

  public async userChips({request, response}: HttpContextContract){
    const query = request.qs()
    try{
      const user = await User.findByOrFail('uuid', request.param('id'))
      const chips = await Chip.query().where('user_id', user.id)
        .paginate(query['page'], query['limit'])
      response.send({user: user.serialize(), chips: chips.serialize()})
    }catch (e){
      return response.internalServerError(e)
    }
  }

  public async userFavoriteChips({request, response}: HttpContextContract){
    const query = request.qs()
    try{
      const user = await User.findByOrFail('uuid', request.param('id'))
      const chips = await Chip.query().where('user_id', user.id).where('is_favorite', true)
        .paginate(query['page'], query['limit'])
      response.send({user: user.serialize(), favorites: chips.serialize()})
    }catch (e){
      return response.internalServerError(e)
    }
  }
}
