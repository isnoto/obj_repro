module.exports = {
  development: {
    client: 'pg',
    connection: {
      user: 'postgres',
      password: '',
      database: 'test_1'
    },
    migrations: {
      tableName: 'migrations'
    }
  }
};
