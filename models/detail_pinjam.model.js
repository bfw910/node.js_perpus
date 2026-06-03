import { Sequelize } from "sequelize";
import db from "../config/db.config.js";
import Buku from "./buku.model.js";
import Pinjam from "./pinjam.model.js";

const { DataTypes } = Sequelize;
const DetailPinjam = db.define(
  "detail_pinjams",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pinjam_id: {
      type: DataTypes.INTEGER,
      // references: {
      //   model: Pinjam,
      //   key: "id",
      // },
    },
    buku_id: {
      type: DataTypes.INTEGER,
      // references: {
      //   model: Buku,
      //   key: "id",
      // },
    },
    jml_pinjam: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    freezeTableName: true,
  },
);
Buku.hasMany(DetailPinjam, { foreignKey: "buku_id" });
DetailPinjam.belongsTo(Buku, { foreignKey: "buku_id" });
Pinjam.hasMany(DetailPinjam, { foreignKey: "pinjam_id" });
DetailPinjam.belongsTo(Pinjam, { foreignKey: "pinjam_id" });

export default DetailPinjam;
