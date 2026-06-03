import express from "express";
import {
  getAllPinjam,
  getAlldtalePinjam,
  cariPinjamByNim,
  insertPinjam,
  //tugas
  cariBukuDipinjam,
  kembalikanBuku,
  laporanPengembalian,
} from "../controllers/pinjam.controller.js";
import { authenticateToken } from "../middlware/VerifyTokens.js";
const router = express.Router();

router.get("/",authenticateToken, getAllPinjam);
router.get("/detail",authenticateToken, getAlldtalePinjam);
router.get("/cekpinjam/:nim", authenticateToken, cariBukuDipinjam);
router.post("/", authenticateToken, insertPinjam);
router.post("/kembali/:nim", authenticateToken, kembalikanBuku);
router.get("/laporan", authenticateToken, laporanPengembalian);
router.get("/:nim", authenticateToken, cariPinjamByNim);

export default router;
