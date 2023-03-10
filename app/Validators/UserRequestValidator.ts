import {schema, CustomMessages, rules} from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserRequestValidator {
  constructor(protected ctx: HttpContextContract) {}


  public schema = schema.create({
    name: schema.string([rules.minLength(4)]),
    email: schema.string([ rules.email(), rules.unique({table: 'users', column: 'email'})]),
    password: schema.string([rules.minLength(6)])
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {}
}
