exports.up = function (knex) {
  return knex.schema.createTable('links', function (table) {
    table.string('code').primary()
    table.text('address').notNullable()
    table.datetime('createdAt').defaultTo(knex.fn.now())
    table.datetime('updatedAt').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('links')
}
