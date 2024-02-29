import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('messages').del();

  // Inserts seed entries
  await knex('messages').insert([
    { id: '1', content: 'Message 1', userId: '1', chatId: '1' },
    { id: '2', content: 'Message 2', userId: '2', chatId: '1' },
    { id: '3', content: 'Message 3', userId: '1', chatId: '2' },
  ]);
}
