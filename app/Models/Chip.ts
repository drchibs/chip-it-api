import { DateTime } from 'luxon'
import {uuid} from 'uuidv4'
import {BaseModel, beforeCreate, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import User from "App/Models/User";
import Folder from "App/Models/Folder";

export default class Chip extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column({serializeAs: 'id'})
  public uuid: string

  @column()
  public url: string

  @column()
  public isFavorite: boolean

  @column()
  public clicks: number

  @column({serializeAs: null})
  userId: number

  @belongsTo(()=> User)
  public user: BelongsTo<typeof User>

  @column({serializeAs: null})
  folderId: number

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

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(user: User) {
    user.uuid = uuid()
  }
}
