import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('messages', function (table: any) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()')); // Using UUID as primary key
    table.string('content').notNullable();
    table.uuid('userId').notNullable();
    table.uuid('chatId').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());

    table
      .foreign('userId')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .foreign('chatId')
      .references('id')
      .inTable('chats')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('messages');
}
