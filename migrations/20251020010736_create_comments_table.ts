import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('comments', (table) => {
    table.increments('id').primary();
    table.integer('feature_request_id').unsigned().notNullable();
    table.integer('user_id').notNullable();
    table.jsonb('user_detail').notNullable();
    table.text('comment').notNullable();
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
    table.index('created_at');
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('comments');
}

