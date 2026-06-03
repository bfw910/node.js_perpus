import express from "express";
import db from "./config/db.config.js";
import cors from "cors";

// Import Routes
import bukuRoutes from "./routes/buku.routes.js";
import mahasiswaRoutes from "./routes/mahasiswa.routes.js";
import prodiRoutes from "./routes/prodi.routes.js";
import pinjamRoutes from "./routes/pinjam.routes.js";
import routerUser from "./routes/user.routes.js";

// Import Models (agar Sequelize mengenali tabel)
import Buku from "./models/buku.model.js";
import Mahasiswa from "./models/mahasiswa.model.js";
import Prodi from "./models/prodi.model.js";
import Pinjam from "./models/pinjam.model.js";
import DetailPinjam from "./models/detail_pinjam.model.js";
import User from "./models/user.model.js";

const app = express();

try {
    await db.authenticate();
    console.log("Koneksi berhasil");
    await db.sync({ alter: true });
    console.log("Semua tabel berhasil disinkronisasi");
} catch (error) {
    console.log("Koneksi gagal", error);
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register Routes
app.use("/api/buku", bukuRoutes);
app.use("/api/mahasiswa", mahasiswaRoutes);
app.use("/api/prodi", prodiRoutes);
app.use("/api/pinjam", pinjamRoutes);
app.use("/api/user", routerUser);

app.listen(5000, () => {
    console.log("Server berjalan di port 5000");
});