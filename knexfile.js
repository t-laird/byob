// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/sjdfljs', 
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    },
    seed: {
      directory: './db/seeds/dev'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + '?ssl=true',
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    }
  },

  test: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost/sjdfljs', 
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    },
    seed: {
      directory: './db/seeds/test'
    }
  }
};
