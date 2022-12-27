// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import LoginRequest from "App/Validators/LoginRequestValidator";
import UserRequest from "App/Validators/UserRequestValidator";
import User from "App/Models/User";
import Hash from "@ioc:Adonis/Core/Hash";
import Folder from "App/Models/Folder";

export default class AuthController {
  public async register({request, response}: HttpContextContract){
    try{
      const payload = await request.validate(UserRequest)
      const user = new User()
      user.name = payload.name
      user.email = payload.email
      user.password = payload.password
      const savedUser = await user.save()

      const folder = new Folder()
      folder.name = "Bookmarks"
      await folder.related('user').associate(savedUser)
      await folder.save()

      return response.send({'success': user.$isPersisted})

    }catch (e){
      response.badRequest(e)
    }

  }

  public async login({request, response, auth}: HttpContextContract){
    try{
      const payload = await request.validate(LoginRequest)
      const user = await User.findByOrFail('email', payload.email)

      if(!(await Hash.verify(user.password, payload.password))){
        return response.unauthorized('Invalid Email/Password')
      }

      const token = await auth.use('api').generate(user, {
        expiresIn: '15 days'
      })

      return response.status(200).send({ 'status': 'success', 'token': token, 'user': user.serialize()})

    }catch (e){
       response.badRequest(e)
    }

  }
}
