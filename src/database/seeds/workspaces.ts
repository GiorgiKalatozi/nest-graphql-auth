import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('workspaces').del();

  // Inserts seed entries
  await knex('workspaces').insert([
    { id: '1', name: 'Workspace 1', userId: '1' },
    { id: '2', name: 'Workspace 2', userId: '2' },
    { id: '3', name: 'Workspace 3', userId: '3' },
  ]);
}
