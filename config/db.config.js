import { Sequelize } from "sequelize";
import mysql from "mysql2";
const db = new Sequelize("web_lanjut", "avnadmin", "AVNS_zxJHdAMA1aoa5qBhCtK", {
  host: "mysql-153b5fd7-bfw0910-57c2.h.aivencloud.com",
  dialect: "mysql",
  port: 23126,
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
