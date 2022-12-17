import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import User from "App/Models/User";
import Folder from "App/Models/Folder";

export default class Chip extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public url: string

  @column()
  public is_favorite: boolean

  @column()
  public clicks: number

  @belongsTo(()=> User)
  public user: BelongsTo<typeof User>

  @belongsTo(()=> Folder)
  public folder: BelongsTo<typeof Folder>

  @column()
  public metadata: object

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
