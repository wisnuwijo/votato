import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('votes', (table) => {
    table.increments('id').primary();
    table.integer('feature_request_id').unsigned().notNullable();
    table.integer('user_id').notNullable();
    table.jsonb('user_detail').notNullable();
    table.enum('type', ['upvote', 'downvote']).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();

    // Foreign key constraint
    table.foreign('feature_request_id')
      .references('id')
      .inTable('feature_requests')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    // Add indexes for better query performance
    table.index('feature_request_id');
    table.index('user_id');
    table.index('type');

    // Unique constraint to prevent duplicate votes from the same user on the same feature request
    table.unique(['feature_request_id', 'user_id']);
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('votes');
}

