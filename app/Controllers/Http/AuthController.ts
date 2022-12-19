// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import LoginRequest from "App/Validators/LoginRequestValidator";
import CreateUserRequest from "App/Validators/CreateUserRequestValidator";
import User from "App/Models/User";
import Hash from "@ioc:Adonis/Core/Hash";

export default class AuthController {
  public async register(ctx: HttpContextContract){
    try{
      const payload = await ctx.request.validate(CreateUserRequest)
      const user = new User()
      user.name = payload.name
      user.email = payload.email
      user.password = await Hash.make(payload.password)
      await user.save()
      return ctx.response.send({'success': user.$isPersisted})

    }catch (e){
      ctx.response.badRequest('Invalid Input')
    }

  }

  public async login(ctx: HttpContextContract){
    try{
      const payload = await ctx.request.validate(LoginRequest)
      const user = await User.query().where('email', payload.email).firstOrFail()

      if(!(await Hash.verify(user.password, payload.password))){
        return ctx.response.unauthorized('Invalid Email/Password')
      }

      const token = await ctx.auth.use('api').generate(user, {
        expiresIn: '15 days'
      })

      return ctx.response.status(200).send({ 'token': token})

    }catch (e){
       ctx.response.badRequest('Invalid or Incorrect Email/Password')
    }

  }
}
