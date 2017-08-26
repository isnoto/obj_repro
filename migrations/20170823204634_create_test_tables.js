
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('physicians', (t) => {
      t.increments('id').primary();
      t.timestamps();
    }),

    knex.schema.createTable('patients', (t) => {
      t.increments('id').primary();
      t.timestamps();
    }),

    knex.schema.createTable('appointments', (t) => {
      t.increments('id').primary();
      t.integer('physician_id').references('physicians.id');
      t.integer('patient_id').references('patients.id');
      t.timestamps();
    })
  ])
};

exports.down = function(knex, Promise) {
  
};
