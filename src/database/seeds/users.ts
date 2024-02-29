import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();

  // Inserts seed entries
  await knex('users').insert([
    {
      id: '1',
      email: 'user1@example.com',
      username: 'user1',
      password: 'password1',
    },
    {
      id: '2',
      email: 'user2@example.com',
      username: 'user2',
      password: 'password2',
    },
    {
      id: '3',
      email: 'user3@example.com',
      username: 'user3',
      password: 'password3',
    },
  ]);
}
