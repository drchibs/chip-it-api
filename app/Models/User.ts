import { DateTime } from 'luxon'
import {BaseModel, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'
import Chip from "App/Models/Chip";
import Folder from "App/Models/Folder";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

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
}
