import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'folders'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('uuid')
      table.string('name')
      table
        .integer('user_id')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
