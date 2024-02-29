import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', function (table: any) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()')); // Using UUID as primary key
    table.string('email').unique().notNullable();
    table.string('username').unique().notNullable();
    table.string('password').notNullable();
    table.string('refreshToken').nullable();
    table.enum('role', ['USER', 'ADMIN']).defaultTo('USER');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('users');
}
