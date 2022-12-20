// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class UsersController {

  public async show({request, response}: HttpContextContract){
    try{
      const user = await User.findByOrFail('uuid', request.param('id'))
      return response.send({'user': user.serialize()})
    }catch (e) {
      return response.badRequest(e)
    }
  }

  public async index({request, response}: HttpContextContract){
    try{
      const users = await User.query()
        .paginate(request.param('page'), request.param('limit'))
      response.send({users: users.serialize()})
    }catch (e){
      response.internalServerError(e)
    }
  }

  public async update({request, response}: HttpContextContract){
    try{
      const payload = request.body()
      const user = await User.query().where('uuid', request.param('id')).update({...payload})
      return response.send({'success': user})
    }catch (e) {
      response.internalServerError(e)
    }
  }

  public async destroy({request, response}: HttpContextContract){
    const user = await User.findByOrFail('uuid', request.param('id'))
    await user.delete()
    return response.noContent()
  }
}
