const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { uploadSingle, uploadMultiple, getFileInfo, validateFile } = require('../middleware/upload');
const db = require('../config/db');
const path = require('path');
const fs = require('fs');

// Get all dokumen for a rujukan
router.get('/rujukan/:rujukanId', verifyToken, async (req, res) => {
  try {
    const { rujukanId } = req.params;

    // Check if user has access to this rujukan
    const [rujukanRows] = await db.execute(`
      SELECT * FROM rujukan WHERE id = ?
    `, [rujukanId]);

    if (rujukanRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Rujukan tidak ditemukan'
      });
    }

    const rujukan = rujukanRows[0];

    // Check permission - user must be related to this rujukan
    if (req.user.role === 'admin_faskes' && req.user.faskes_id) {
      if (rujukan.faskes_asal_id != req.user.faskes_id && rujukan.faskes_tujuan_id != req.user.faskes_id) {
        return res.status(403).json({
          success: false,
          message: 'Tidak memiliki akses ke dokumen rujukan ini'
        });
      }
    }

    // Get dokumen with user info
    const [dokumenRows] = await db.execute(`
      SELECT 
        d.*,
        u.nama_lengkap as uploaded_by_name
      FROM dokumen d
      LEFT JOIN users u ON d.uploaded_by = u.id
      WHERE d.rujukan_id = ?
      ORDER BY d.created_at DESC
    `, [rujukanId]);

    // Transform data untuk frontend
    const dokumen = dokumenRows.map(doc => ({
      id: doc.id,
      nama_file: doc.nama_file,
      nama_asli: doc.nama_asli,
      tipe_file: doc.tipe_file,
      ukuran_file: doc.ukuran_file,
      ukuran_file_formatted: formatFileSize(doc.ukuran_file),
      deskripsi: doc.deskripsi,
      kategori: doc.kategori,
      kategori_text: getKategoriText(doc.kategori),
      uploaded_by: doc.uploaded_by_name,
      created_at: doc.created_at,
      download_url: `/api/dokumen/${doc.id}/download`
    }));

    res.json({
      success: true,
      data: dokumen
    });

  } catch (error) {
    console.error('Error getting dokumen:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data dokumen'
    });
  }
});

// Upload single dokumen
router.post('/upload', verifyToken, uploadSingle, async (req, res) => {
  try {
    const { rujukan_id, deskripsi, kategori } = req.body;

    // Validate input
    if (!rujukan_id || !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Rujukan ID dan file wajib diisi'
      });
    }

    // Check if rujukan exists and user has access
    const [rujukanRows] = await db.execute(`
      SELECT * FROM rujukan WHERE id = ?
    `, [rujukan_id]);

    if (rujukanRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Rujukan tidak ditemukan'
      });
    }

    const rujukan = rujukanRows[0];

    // Check permission
    if (req.user.role === 'admin_faskes' && req.user.faskes_id) {
      if (rujukan.faskes_asal_id != req.user.faskes_id && rujukan.faskes_tujuan_id != req.user.faskes_id) {
        return res.status(403).json({
          success: false,
          message: 'Tidak memiliki akses ke rujukan ini'
        });
      }
    }

    // Validate file
    const fileErrors = validateFile(req.file);
    if (fileErrors.length > 0) {
      // Delete uploaded file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.status(400).json({
        success: false,
        message: fileErrors.join(', ')
      });
    }

    // Get file info
    const fileInfo = getFileInfo(req.file);

    // Insert dokumen to database
    const [result] = await db.execute(`
      INSERT INTO dokumen (
        rujukan_id, nama_file, nama_asli, tipe_file, ukuran_file, 
        path_file, deskripsi, kategori, uploaded_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      rujukan_id,
      fileInfo.filename,
      fileInfo.originalName,
      fileInfo.mimetype,
      fileInfo.size,
      fileInfo.path,
      deskripsi || null,
      kategori || 'lainnya',
      req.user.userId
    ]);

    // Log upload activity
    await db.execute(`
      INSERT INTO dokumen_logs (dokumen_id, user_id, aksi, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?)
    `, [
      result.insertId,
      req.user.userId,
      'upload',
      req.ip,
      req.get('User-Agent')
    ]);

    // Get uploaded dokumen data
    const [dokumenRows] = await db.execute(`
      SELECT 
        d.*,
        u.nama_lengkap as uploaded_by_name
      FROM dokumen d
      LEFT JOIN users u ON d.uploaded_by = u.id
      WHERE d.id = ?
    `, [result.insertId]);

    const dokumen = dokumenRows[0];

    res.status(201).json({
      success: true,
      message: 'Dokumen berhasil diupload',
      data: {
        id: dokumen.id,
        nama_file: dokumen.nama_file,
        nama_asli: dokumen.nama_asli,
        tipe_file: dokumen.tipe_file,
        ukuran_file: dokumen.ukuran_file,
        ukuran_file_formatted: formatFileSize(dokumen.ukuran_file),
        deskripsi: dokumen.deskripsi,
        kategori: dokumen.kategori,
        kategori_text: getKategoriText(dokumen.kategori),
        uploaded_by: dokumen.uploaded_by_name,
        created_at: dokumen.created_at,
        download_url: `/api/dokumen/${dokumen.id}/download`
      }
    });

  } catch (error) {
    console.error('Error uploading dokumen:', error);
    
    // Delete uploaded file if exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Gagal mengupload dokumen'
    });
  }
});

// Upload multiple dokumen
router.post('/upload-multiple', verifyToken, uploadMultiple, async (req, res) => {
  try {
    const { rujukan_id } = req.body;

    // Validate input
    if (!rujukan_id || !req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Rujukan ID dan file wajib diisi'
      });
    }

    // Check if rujukan exists and user has access
    const [rujukanRows] = await db.execute(`
      SELECT * FROM rujukan WHERE id = ?
    `, [rujukan_id]);

    if (rujukanRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Rujukan tidak ditemukan'
      });
    }

    const rujukan = rujukanRows[0];

    // Check permission
    if (req.user.role === 'admin_faskes' && req.user.faskes_id) {
      if (rujukan.faskes_asal_id != req.user.faskes_id && rujukan.faskes_tujuan_id != req.user.faskes_id) {
        return res.status(403).json({
          success: false,
          message: 'Tidak memiliki akses ke rujukan ini'
        });
      }
    }

    const uploadedFiles = [];
    const errors = [];

    // Process each file
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      
      try {
        // Validate file
        const fileErrors = validateFile(file);
        if (fileErrors.length > 0) {
          errors.push(`${file.originalname}: ${fileErrors.join(', ')}`);
          // Delete invalid file
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
          continue;
        }

        // Get file info
        const fileInfo = getFileInfo(file);

        // Insert dokumen to database
        const [result] = await db.execute(`
          INSERT INTO dokumen (
            rujukan_id, nama_file, nama_asli, tipe_file, ukuran_file, 
            path_file, deskripsi, kategori, uploaded_by
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          rujukan_id,
          fileInfo.filename,
          fileInfo.originalName,
          fileInfo.mimetype,
          fileInfo.size,
          fileInfo.path,
          null,
          'lainnya',
          req.user.userId
        ]);

        // Log upload activity
        await db.execute(`
          INSERT INTO dokumen_logs (dokumen_id, user_id, aksi, ip_address, user_agent)
          VALUES (?, ?, ?, ?, ?)
        `, [
          result.insertId,
          req.user.userId,
          'upload',
          req.ip,
          req.get('User-Agent')
        ]);

        uploadedFiles.push({
          id: result.insertId,
          nama_file: fileInfo.filename,
          nama_asli: fileInfo.originalName,
          tipe_file: fileInfo.mimetype,
          ukuran_file: fileInfo.size,
          ukuran_file_formatted: formatFileSize(fileInfo.size)
        });

      } catch (error) {
        console.error(`Error processing file ${file.originalname}:`, error);
        errors.push(`${file.originalname}: Gagal memproses file`);
        
        // Delete file if exists
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }

    res.status(201).json({
      success: true,
      message: `Berhasil mengupload ${uploadedFiles.length} file`,
      data: {
        uploaded: uploadedFiles,
        errors: errors
      }
    });

  } catch (error) {
    console.error('Error uploading multiple dokumen:', error);
    
    // Delete all uploaded files
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Gagal mengupload dokumen'
    });
  }
});

// Download dokumen
router.get('/:id/download', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get dokumen data
    const [dokumenRows] = await db.execute(`
      SELECT d.*, r.faskes_asal_id, r.faskes_tujuan_id
      FROM dokumen d
      LEFT JOIN rujukan r ON d.rujukan_id = r.id
      WHERE d.id = ?
    `, [id]);

    if (dokumenRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Dokumen tidak ditemukan'
      });
    }

    const dokumen = dokumenRows[0];

    // Check permission
    if (req.user.role === 'admin_faskes' && req.user.faskes_id) {
      if (dokumen.faskes_asal_id != req.user.faskes_id && dokumen.faskes_tujuan_id != req.user.faskes_id) {
        return res.status(403).json({
          success: false,
          message: 'Tidak memiliki akses ke dokumen ini'
        });
      }
    }

    // Check if file exists
    if (!fs.existsSync(dokumen.path_file)) {
      return res.status(404).json({
        success: false,
        message: 'File tidak ditemukan di server'
      });
    }

    // Log download activity
    await db.execute(`
      INSERT INTO dokumen_logs (dokumen_id, user_id, aksi, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?)
    `, [
      id,
      req.user.userId,
      'download',
      req.ip,
      req.get('User-Agent')
    ]);

    // Send file
    res.download(dokumen.path_file, dokumen.nama_asli);

  } catch (error) {
    console.error('Error downloading dokumen:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengunduh dokumen'
    });
  }
});

// Delete dokumen
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get dokumen data
    const [dokumenRows] = await db.execute(`
      SELECT d.*, r.faskes_asal_id, r.faskes_tujuan_id, u.role as user_role
      FROM dokumen d
      LEFT JOIN rujukan r ON d.rujukan_id = r.id
      LEFT JOIN users u ON d.uploaded_by = u.id
      WHERE d.id = ?
    `, [id]);

    if (dokumenRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Dokumen tidak ditemukan'
      });
    }

    const dokumen = dokumenRows[0];

    // Check permission - only uploader or admin can delete
    if (dokumen.uploaded_by != req.user.userId && req.user.role !== 'admin_pusat') {
      return res.status(403).json({
        success: false,
        message: 'Tidak memiliki izin untuk menghapus dokumen ini'
      });
    }

    // Delete file from filesystem
    if (fs.existsSync(dokumen.path_file)) {
      fs.unlinkSync(dokumen.path_file);
    }

    // Delete from database (CASCADE will handle logs)
    await db.execute('DELETE FROM dokumen WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Dokumen berhasil dihapus'
    });

  } catch (error) {
    console.error('Error deleting dokumen:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus dokumen'
    });
  }
});

// Get dokumen statistics
router.get('/stats/:rujukanId', verifyToken, async (req, res) => {
  try {
    const { rujukanId } = req.params;

    // Check permission
    const [rujukanRows] = await db.execute(`
      SELECT * FROM rujukan WHERE id = ?
    `, [rujukanId]);

    if (rujukanRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Rujukan tidak ditemukan'
      });
    }

    const rujukan = rujukanRows[0];

    if (req.user.role === 'admin_faskes' && req.user.faskes_id) {
      if (rujukan.faskes_asal_id != req.user.faskes_id && rujukan.faskes_tujuan_id != req.user.faskes_id) {
        return res.status(403).json({
          success: false,
          message: 'Tidak memiliki akses ke rujukan ini'
        });
      }
    }

    // Get statistics
    const [statsRows] = await db.execute(`
      SELECT 
        COUNT(*) as total_files,
        SUM(ukuran_file) as total_size,
        COUNT(CASE WHEN kategori = 'hasil_lab' THEN 1 END) as hasil_lab,
        COUNT(CASE WHEN kategori = 'rontgen' THEN 1 END) as rontgen,
        COUNT(CASE WHEN kategori = 'resep' THEN 1 END) as resep,
        COUNT(CASE WHEN kategori = 'surat_rujukan' THEN 1 END) as surat_rujukan,
        COUNT(CASE WHEN kategori = 'lainnya' THEN 1 END) as lainnya
      FROM dokumen 
      WHERE rujukan_id = ?
    `, [rujukanId]);

    const stats = statsRows[0];

    res.json({
      success: true,
      data: {
        total_files: stats.total_files,
        total_size: stats.total_size,
        total_size_formatted: formatFileSize(stats.total_size),
        by_kategori: {
          hasil_lab: stats.hasil_lab,
          rontgen: stats.rontgen,
          resep: stats.resep,
          surat_rujukan: stats.surat_rujukan,
          lainnya: stats.lainnya
        }
      }
    });

  } catch (error) {
    console.error('Error getting dokumen stats:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik dokumen'
    });
  }
});

// Helper functions
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getKategoriText(kategori) {
  const kategoriMap = {
    'hasil_lab': 'Hasil Laboratorium',
    'rontgen': 'Rontgen',
    'resep': 'Resep',
    'surat_rujukan': 'Surat Rujukan',
    'lainnya': 'Lainnya'
  };
  
  return kategoriMap[kategori] || kategori;
}

module.exports = router;
