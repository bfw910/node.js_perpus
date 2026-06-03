import { Sequelize } from "sequelize";
import Mahasiswa from "../models/mahasiswa.model.js";
import ref_prodi from "../models/prodi.model.js";

// GET semua mahasiswa
export const getAllMahasiswa = async (req, res) => {
  try {
    const mahasiswas = await Mahasiswa.findAll({
      include: { model: ref_prodi },
    });
    res.json(mahasiswas);
  } catch (error) {
    res.json({ message: error.message });
  }
};

// GET mahasiswa by NIM
export const getMahasiswaByNim = async (req, res) => {
  try {
    const data = await Mahasiswa.findAll({
      where: { nim: req.params.nim },
    });
    res.json(data[0]);
  } catch (error) {
    res.json({ message: error.message });
  }
};

// POST tambah mahasiswa baru
export const tambahMahasiswa = async (req, res) => {
  try {
    const data = await Mahasiswa.create(req.body);
    res.json({ message: "Mahasiswa berhasil disimpan" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

// PATCH update mahasiswa
export const updateMahasiswa = async (req, res) => {
  try {
    console.log(req.body);
    await Mahasiswa.update(req.body, {
      where: { nim: req.params.nim },
    });
    res.json({ message: "Mahasiswa berhasil diupdate" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

// DELETE hapus mahasiswa
export const deleteMahasiswa = async (req, res) => {
  try {
    await Mahasiswa.destroy({
      where: { nim: req.params.nim },
    });
    res.json({ message: "Mahasiswa berhasil dihapus" });
  } catch (error) {
    res.json({ message: error.message });
  }
};
