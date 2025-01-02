require('dotenv').config()
const knex = require('knex')

const db = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME ?? 'root',
        password: process.env.DB_PASSWORD ?? 'root',
        database: process.env.DB_NAME ?? 'simskul'
    }
});

module.exports = db