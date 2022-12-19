import { DateTime } from 'luxon'
import {uuid} from 'uuidv4'
import {BaseModel, beforeCreate, BelongsTo, belongsTo, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'
import Chip from "App/Models/Chip";
import User from "App/Models/User";

export default class Folder extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column()
  public name: string

  @belongsTo(()=> User)
  public user: BelongsTo<typeof User>

  @hasMany(()=>Chip)
  public chips: HasMany<typeof Chip>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(user: User) {
    user.uuid = uuid()
  }
}
