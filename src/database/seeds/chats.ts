import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('chats').del();

  await knex('chats').insert([
    { id: '1', name: 'Chat 1', type: 'GROUP', userId: '1' },
    { id: '2', name: 'Chat 2', type: 'SINGLE', userId: '2' },
    { id: '3', name: 'Chat 3', type: 'GROUP', userId: '3' },
  ]);
}
