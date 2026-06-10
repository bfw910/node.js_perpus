import { Sequelize } from "sequelize";
import Pinjam from "../models/pinjam.model.js";
import Mahasiswa from "../models/mahasiswa.model.js";
import DetailPinjam from "../models/detail_pinjam.model.js";
import Prodi from "../models/prodi.model.js";
import Buku from "../models/buku.model.js";

// GET semua pinjam
export const getAllPinjam = async (req, res) => {
  try {
    const pinjams = await Pinjam.findAll({
      include: [
        {
          model: Mahasiswa,
          attributes: ["nim", "nama"],
          include: [{ model: Prodi, attributes: ["nama_prodi"] }],
        },
      ],
    });
    res.json(pinjams);
  } catch (error) {
    res.json({ message: error.message });
  }
};

// GET pinjam by NIM
export const cariPinjamByNim = async (req, res) => {
  try {
    const data = await Pinjam.findAll({
      where: { nim: req.params.nim },
      include: [Mahasiswa, { model: DetailPinjam, include: "buku" }],
    });
    res.json(data[0]);
  } catch (error) {
    res.json({ message: error.message });
  }
};

//get detail pinjam
export const getAlldtalePinjam = async (req, res) => {
  try {
    const pinjams = await DetailPinjam.findAll({
      include: ["buku", { model: Pinjam, include: "mahasiswa" }],
    });
    res.json(pinjams);
  } catch (error) {
    res.json({ message: error.message });
  }
};

//insert pinjam
export const insertPinjam = async (req, res) => {
  try {
    const pinjams = await Pinjam.create(
      {
        tanggal_pinjam: req.body.tanggal_pinjam,
        tanggal_kembali: req.body.tanggal_kembali,
        nim: req.body.nim,
        pegawai_id: req.body.pegawai_id,
        detail_pinjams: req.body.detail_pinjams
      },
      {
        include: DetailPinjam 
      }
    );
    
    if (pinjams && req.body.detail_pinjams) {
      for (let i = 0; i < req.body.detail_pinjams.length; i++) {
         Buku.decrement(// decrement digunakan untuk mengurangi sedangakn inecrement untuk tambah
          {jumlah : req.body.detail_pinjams[i].jml_pinjam},
          {where : {kode_buku: req.body.detail_pinjams[i].buku_id}}
      );
      }
    }
    res.json(pinjams);
  } catch (error) {
    res.json({ message: error.message });
  }
};



//tugas
// TAHAP PENCARIAN (GET)
export const cariBukuDipinjam = async (req, res) => {
  try {
    const { nim } = req.params;

    // Langsung cari di DetailPinjam, tapi di-JOIN (include) ke Pinjam dan Buku
    const detailPinjams = await DetailPinjam.findAll({
      where: { status: 1 },
      include: [
        {
          model: Pinjam,
          where: { nim: nim }, // Filter berdasarkan NIM di tabel Pinjams
          include: [
            { 
              model: Mahasiswa, 
              attributes: ["nama"] 
            }
          ],
        },
        {
          model: Buku,
          attributes: ["judul"], // Ambil kode_buku saja sebagai pengganti judul
        },
      ],
    });

    if (detailPinjams.length === 0) {
      return res.json({ message: "Tidak ada buku yang sedang dipinjam oleh mahasiswa ini." });
    }

    // Format ulang datanya agar output JSON lebih rapi (tidak terlalu nested)
    const hasil = detailPinjams.map((detail) => ({
      detail_pinjam_id: detail.id,
      nama_mahasiswa: detail.pinjam.mahasiswa.nama,
      judul_buku: detail.buku.judul,
      jumlah_dipinjam: detail.jml_pinjam,
    }));

    res.json({ status: "Berhasil", data: hasil });
  } catch (error) {
    res.json({ message: error.message });
  }
};

// TAHAP AKSI PENGEMBALIAN (POST)

export const kembalikanBuku = async (req, res) => {
  try {
    const { buku_kembali } = req.body;
    // Expected input: {
    //   "buku_kembali": [
    //     { "detail_pinjam_id": 1, "jml_kembali": 2 },
    //     { "detail_pinjam_id": 2, "jml_kembali": 1 }
    //   ]
    // }


    // Validasi input: pastikan buku_kembali adalah array yang tidak kosong
    if (!buku_kembali || !Array.isArray(buku_kembali) || buku_kembali.length === 0) {
      return res.json({ message: "Data pengembalian tidak valid atau kosong." });
    }

    // Gunakan for...of untuk iterasi array yang rapi dan mendukung await
    for (const item of buku_kembali) {
      const { detail_pinjam_id, jml_kembali } = item;

      // Cari detail pinjam beserta data bukunnya sekalian
      const detail = await DetailPinjam.findOne({
        where: { id: detail_pinjam_id, status: 1 },
        include: [{ model: Buku, attributes: ["kode_buku"] }]
      });

      if (!detail) {
        return res.json({ message: `Data pinjaman dengan ID ${detail_pinjam_id} tidak ditemukan.` });
      }

      if (jml_kembali > detail.jml_pinjam) {
        return res.json({ message: "Jumlah kembali tidak boleh lebih besar dari jumlah pinjam!" });
      }

      // Skenario 1 & 2: Update status atau pecah data
      if (jml_kembali === detail.jml_pinjam) {
        await detail.update({ status: 2 });
      } else {
        // Buat history pengembalian (status 2)
        await DetailPinjam.create({
          pinjam_id: detail.pinjam_id,
          buku_id: detail.buku_id,
          jml_pinjam: jml_kembali,
          status: 2,
        });

        // Kurangi jumlah pinjam di data awal (status 1)
        await detail.update({ jml_pinjam: detail.jml_pinjam - jml_kembali });
      }

      // SINKRONISASI STOK BUKU: Gunakan metode bawaan Sequelize (increment)
      // Ini jauh lebih aman dan bersih daripada menghitung manual
      await Buku.increment("jumlah", {
        by: jml_kembali,
        where: { kode_buku: detail.buku_id },
      });
    }

    res.json({ message: "Proses pengembalian buku berhasil diproses." });
  } catch (error) {
    res.json({ message: error.message });
  }
};

// LAPORAN PENGEMBALIAN (GET)
export const laporanPengembalian = async (req, res) => {
  try {
    // JOIN semua tabel yang diperlukan dalam satu query
    const laporanData = await DetailPinjam.findAll({
      where: { status: 2 },
      include: [
        {
          model: Pinjam,
          attributes: ["tanggal_kembali"], // Ini batas waktunya
          include: [{ model: Mahasiswa, attributes: ["nama"] }],
        },
        {
          model: Buku,
          attributes: ["judul"],
        },
      ],
    });

    const hasilLaporan = laporanData.map((item) => {
      // Sequelize secara default menyimpan createdAt dan updatedAt
      // Sesuaikan 'update_at' atau 'updatedAt' sesuai konfigurasi modelmu
      const tglKembaliBeneran = new Date(item.updated_at || item.updatedAt); 
      const tglBatasKembali = new Date(item.pinjam.tanggal_kembali);

      // Hitung selisih hari dengan Math.max agar tidak minus jika dikembalikan sebelum waktunya
      const year = tglKembaliBeneran.getFullYear();
      const month = String(tglKembaliBeneran.getMonth() + 1).padStart(2, '0'); // Ditambah 1 karena bulan dimulai dari 0
      const day = String(tglKembaliBeneran.getDate()).padStart(2, '0');      
      const selisihWaktu = tglKembaliBeneran - tglBatasKembali;
      const hitungHari = Math.ceil(selisihWaktu / (1000 * 3600 * 24));
      const hariTerlambat = Math.max(0, hitungHari); // Jika minus/tepat waktu, jadi 0

      return {
        nama_mahasiswa: item.pinjam.mahasiswa.nama,
        nama_buku: item.buku.judul,
        jumlah_pinjam: item.jml_pinjam + " buku",
        tanggal_pengembalian: `${year}-${month}-${day}`,// Format YYYY-MM-DD
        jumlah_hari_terlambat: hariTerlambat,
      };
    });

    res.json({ status: "Berhasil", data: hasilLaporan });
  } catch (error) {
    res.json({ message: error.message });
  }
};