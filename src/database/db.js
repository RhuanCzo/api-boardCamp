import { Client } from "pg"


const connection = new Client({
    user: "postgres",
    password: "postgres",
    database: "BoardCamp",
    host: "localhost",
    port: 5432
});


const db = await connection.connect();

export default db
