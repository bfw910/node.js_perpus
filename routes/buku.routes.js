import multer from 'multer';
import express from "express";
import { authenticateToken } from '../middlware/VerifyTokens.js';
const upload=multer();
const router = express.Router();

router.post("/",upload.none(), tambahbukubaru); // jika tidak upload file
import {
    getAllBuku,
    tambahbukubaru,
    cariBukuBYID,
    updateBuku,
    deleteBuku
} from "../controllers/buku.controllers.js";   

router.get("/",authenticateToken, getAllBuku);
router.get("/:id",authenticateToken, cariBukuBYID);
router.post("/",authenticateToken, tambahbukubaru);
router.patch("/:id",authenticateToken, updateBuku);
router.delete("/:id",authenticateToken, deleteBuku);


export default router;