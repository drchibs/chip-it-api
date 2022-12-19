import { DateTime } from 'luxon'
import {uuid} from 'uuidv4'
import {BaseModel, beforeCreate, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import User from "App/Models/User";
import Folder from "App/Models/Folder";

export default class Chip extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column()
  public url: string

  @column()
  public isFavorite: boolean

  @column()
  public clicks: number

  @belongsTo(()=> User)
  public user: BelongsTo<typeof User>

  @belongsTo(()=> Folder)
  public folder: BelongsTo<typeof Folder>

  @column()
  public metadata: object

  @column()
  public ip: string

  @column()
  public userAgent: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(user: User) {
    user.uuid = uuid()
  }
}
