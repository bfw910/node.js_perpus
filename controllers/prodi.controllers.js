import Prodi from "../models/prodi.model.js";

// GET semua prodi
export const getAllProdi = async (req, res) => {
    try {
        const data = await Prodi.findAll();
        res.json(data);
    } catch (error) {
        res.json({ message: error.message });
    }
};

// GET prodi by kode_prodi
export const getProdiByKode = async (req, res) => {
    try {
        const data = await Prodi.findAll({
            where: { kode_prodi: req.params.kode },
        });
        res.json(data[0]);
    } catch (error) {
        res.json({ message: error.message });
    }
};

// POST tambah prodi baru
export const tambahProdi = async (req, res) => {
    try {
        const data = await Prodi.create(req.body);
        res.json({ message: "Prodi berhasil disimpan" });
    } catch (error) {
        res.json({ message: error.message });
    }
};

// PATCH update prodi
export const updateProdi = async (req, res) => {
    try {
        await Prodi.update(req.body, {
            where: { kode_prodi: req.params.kode },
        });
        res.json({ message: "Prodi berhasil diupdate" });
    } catch (error) {
        res.json({ message: error.message });
    }
};

// DELETE hapus prodi
export const deleteProdi = async (req, res) => {
    try {
        await Prodi.destroy({
            where: { kode_prodi: req.params.kode },
        });
        res.json({ message: "Prodi berhasil dihapus" });
    } catch (error) {
        res.json({ message: error.message });
    }
};
