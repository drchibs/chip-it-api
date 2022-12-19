import { DateTime } from 'luxon'
import {uuid} from 'uuidv4'
import {BaseModel, beforeCreate, beforeSave, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'
import Chip from "App/Models/Chip";
import Folder from "App/Models/Folder";
import Hash from "@ioc:Adonis/Core/Hash";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @hasMany(()=>Chip)
  public chips: HasMany<typeof Chip>

  @hasMany(()=>Folder)
  public folders: HasMany<typeof Folder>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(user: User) {
    user.uuid = uuid()
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
