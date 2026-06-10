import express from "express";
import {
    getAllProdi,
    getProdiByKode,
    tambahProdi,
    updateProdi,
    deleteProdi,
} from "../controllers/prodi.controllers.js";
//import { authenticateToken } from "../middlware/VerifyTokens.js";

const router = express.Router();

router.get("/",authenticateToken, getAllProdi);
router.post("/", authenticateToken, tambahProdi);
router.get("/:kode", authenticateToken, getProdiByKode);
router.patch("/:kode", authenticateToken, updateProdi);
router.delete("/:kode", authenticateToken, deleteProdi);

export default router;
