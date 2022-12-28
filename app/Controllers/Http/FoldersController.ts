// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import FolderRequest from "App/Validators/FolderRequestValidator";
import Folder from "App/Models/Folder";
import User from "App/Models/User";
import Chip from "App/Models/Chip";

export default class FoldersController {
  public async create({request, response}: HttpContextContract){
    try{
      const payload = await request.validate(FolderRequest)
      const user = await User.findByOrFail('uuid', payload.user_id)

      const userHasFolder = await Folder.query().where('name', payload.name).where('user_id', user.id)
      if(userHasFolder.length > 0){
        return response.badRequest({ messages: { errors: "Folder already exists"}})
      }

      const folder = new Folder()
      folder.name = payload.name
      await folder.related('user').associate(user)
      await folder.save()

      //await user?.related('folders').save(folder)
      return response.send({folder: folder})
    }catch (e) {
      return response.badRequest(e)
    }

  }

  public async show({request, response}: HttpContextContract){
    try{
      const folder = await Folder.query().where('uuid', request.param('id')).preload('user').firstOrFail()
      return response.send({'folder': folder.serialize()})
    }catch (e) {
      return response.badRequest(e)
    }
  }

  public async index({request, response}: HttpContextContract){
    const query = request.qs()
    try{
      const folders = await Folder.query()
        .paginate(query['page'], query['limit'])
      response.send({folders: folders.serialize()})
    }catch (e){
      return response.internalServerError(e)
    }
  }

  public async update({request, response}: HttpContextContract){
    try{
      const payload = request.body()
      const folder = await Folder.query().where('uuid', request.param('id')).update({...payload})
      return response.send({'success': folder})
    }catch (e) {
      return response.internalServerError(e)
    }
  }

  public async destroy({request, response}: HttpContextContract){
    const folder = await Folder.findByOrFail('uuid', request.param('id'))
    await folder.delete()
    return response.noContent()
  }

  public async folderChips({request, response}: HttpContextContract){
    const query = request.qs()
    try{
      const folder = await Folder.findByOrFail('uuid', request.param('id'))
      const chips = await Chip.query().where('folder_id', folder.id)
        .paginate(query['page'], query['limit'])
      response.send({folder: folder.serialize(), chips: chips.serialize()})
    }catch (e){
      return response.internalServerError(e)
    }
  }

  public async addChipToFolder({request, response}: HttpContextContract){
    try{
      const folder = await Folder.findByOrFail('uuid', request.param('folderId'))
      const chip = await Chip.findByOrFail('uuid', request.param('chipId'))
      await chip.related('folder').associate(folder)
      const isPersisted = await folder.save()
      return response.send({success: isPersisted})
    }catch (e) {
      return response.badRequest(e)
    }

  }

  public async removeChipFromFolder({request, response}: HttpContextContract){
    try{
      const folder = await Folder.findByOrFail('uuid', request.param('folderId'))
      const chip = await Chip.findByOrFail('uuid', request.param('chipId'))
      await chip.related('folder').dissociate()
      await folder.save()
      return response.noContent()
    }catch (e){
      return response.badRequest(e)
    }

  }

  public async userFolders({request, response}: HttpContextContract){
    const query = request.qs()
    try{
      const user = await User.findByOrFail('uuid', request.param('id'))
      const folders = await Folder.query().where('user_id', user.id).orderBy('created_at', 'desc')
        .paginate(query['page'], query['limit'])
      response.send({user: user.serialize(), folders: folders.serialize()})
    }catch (e){
      return response.internalServerError(e)
    }
  }
}
