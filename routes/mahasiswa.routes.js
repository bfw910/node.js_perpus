import express from "express";
import {
    getAllMahasiswa,
    getMahasiswaByNim,
    tambahMahasiswa,
    updateMahasiswa,
    deleteMahasiswa,
} from "../controllers/mahasiswa.controllers.js";
import { authenticateToken } from "../middlware/VerifyTokens.js";

const router = express.Router();

router.get("/", authenticateToken, getAllMahasiswa);
router.post("/", authenticateToken, tambahMahasiswa);
router.get("/:nim", authenticateToken, getMahasiswaByNim);
router.patch("/:nim", authenticateToken, updateMahasiswa);
router.delete("/:nim", authenticateToken, deleteMahasiswa);

export default router;
