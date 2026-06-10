import { Sequelize } from "sequelize";
import mysql from "mysql2";

const DBNAME = process.env.DB_NAME;
const DBUSER = process.env.DB_USER;
const DBPASS = process.env.DB_PASSWORD;
const DBHOST = process.env.DB_HOST;
const DBPORT = process.env.DB_PORT;

const db = new Sequelize(DBNAME, DBUSER, DBPASS, {
  host: DBHOST,
  dialect: "mysql",
  port: DBPORT,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  define: {
    timestamps: false,
  },
});

export default db;

/*(async()=>{ 
await db.sync({ alter: true }); 
})();*/
