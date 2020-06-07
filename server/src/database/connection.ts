import knex from 'knex'
import path from 'path'

/*
    path.resolve() = Forma de formatar paths independente do sistema operacional
    migrations = Histórico de versões do banco de dados
    export the connection for the whole application to use
*/

const connection = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite'),
    },
    useNullAsDefault: true
})

export default connection