import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('feature_requests', (table) => {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.string('subtitle', 500).notNullable();
    table.integer('number_of_upvote').defaultTo(0).notNullable();
    table.integer('number_of_downvote').defaultTo(0).notNullable();
    table.string('created_by', 255).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();

    // Add indexes for better query performance
    table.index('created_by');
    table.index('created_at');
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('feature_requests');
}

