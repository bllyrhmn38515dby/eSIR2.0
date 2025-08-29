import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './DokumenManager.css';

const DokumenManager = ({ rujukanId, onClose }) => {
  const [dokumen, setDokumen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadData, setUploadData] = useState({
    deskripsi: '',
    kategori: 'lainnya'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchDokumen = useCallback(async () => {
    try {
      setError('');
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get(
        `http://localhost:3001/api/dokumen/rujukan/${rujukanId}`,
        { headers }
      );
      
      if (response.data.success) {
        setDokumen(response.data.data);
      } else {
        setError('Gagal mengambil data dokumen');
      }
    } catch (error) {
      console.error('Error fetching dokumen:', error);
      setError(error.response?.data?.message || 'Gagal mengambil data dokumen');
    } finally {
      setLoading(false);
    }
  }, [rujukanId]);

  useEffect(() => {
    fetchDokumen();
  }, [fetchDokumen]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Ukuran file terlalu besar. Maksimal 10MB');
        setSelectedFile(null);
        return;
      }
      
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setError('Tipe file tidak didukung. File yang diizinkan: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX, TXT');
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Pilih file terlebih dahulu');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      };
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('rujukan_id', rujukanId);
      formData.append('deskripsi', uploadData.deskripsi);
      formData.append('kategori', uploadData.kategori);
      
      const response = await axios.post(
        'http://localhost:3001/api/dokumen/upload',
        formData,
        { headers }
      );
      
      if (response.data.success) {
        setSuccess('Dokumen berhasil diupload');
        setSelectedFile(null);
        setUploadData({ deskripsi: '', kategori: 'lainnya' });
        setShowUploadForm(false);
        fetchDokumen(); // Refresh list
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error uploading dokumen:', error);
      setError(error.response?.data?.message || 'Gagal mengupload dokumen');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (dokumenId, namaAsli) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get(
        `http://localhost:3001/api/dokumen/${dokumenId}/download`,
        { 
          headers,
          responseType: 'blob'
        }
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', namaAsli);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error downloading dokumen:', error);
      setError('Gagal mengunduh dokumen');
    }
  };

  const handleDelete = async (dokumenId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.delete(
        `http://localhost:3001/api/dokumen/${dokumenId}`,
        { headers }
      );
      
      if (response.data.success) {
        setSuccess('Dokumen berhasil dihapus');
        fetchDokumen(); // Refresh list
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting dokumen:', error);
      setError(error.response?.data?.message || 'Gagal menghapus dokumen');
    }
  };

  const getFileIcon = (tipeFile) => {
    if (tipeFile.includes('pdf')) return '📄';
    if (tipeFile.includes('image')) return '🖼️';
    if (tipeFile.includes('word')) return '📝';
    if (tipeFile.includes('excel')) return '📊';
    if (tipeFile.includes('text')) return '📄';
    return '📎';
  };

  const getKategoriBadge = (kategori) => {
    const badges = {
      'hasil_lab': 'badge-lab',
      'rontgen': 'badge-rontgen',
      'resep': 'badge-resep',
      'surat_rujukan': 'badge-surat',
      'lainnya': 'badge-lainnya'
    };
    return badges[kategori] || 'badge-lainnya';
  };

  if (loading) {
    return (
      <div className="dokumen-manager">
        <div className="dokumen-header">
          <h2>Manajemen Dokumen</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="loading">Memuat data dokumen...</div>
      </div>
    );
  }

  return (
    <div className="dokumen-manager">
      <div className="dokumen-header">
        <h2>Manajemen Dokumen</h2>
        <div className="header-actions">
          <button 
            className="btn-upload"
            onClick={() => setShowUploadForm(true)}
          >
            + Upload Dokumen
          </button>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      {/* Upload Form */}
      {showUploadForm && (
        <div className="upload-form">
          <h3>Upload Dokumen Baru</h3>
          <form onSubmit={handleUpload}>
            <div className="form-group">
              <label>Pilih File</label>
              <input
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx,.txt"
                required
              />
              <small>Maksimal 10MB. Format: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX, TXT</small>
            </div>

            <div className="form-group">
              <label>Kategori</label>
              <select
                value={uploadData.kategori}
                onChange={(e) => setUploadData({...uploadData, kategori: e.target.value})}
              >
                <option value="lainnya">Lainnya</option>
                <option value="hasil_lab">Hasil Laboratorium</option>
                <option value="rontgen">Rontgen</option>
                <option value="resep">Resep</option>
                <option value="surat_rujukan">Surat Rujukan</option>
              </select>
            </div>

            <div className="form-group">
              <label>Deskripsi (Opsional)</label>
              <textarea
                value={uploadData.deskripsi}
                onChange={(e) => setUploadData({...uploadData, deskripsi: e.target.value})}
                placeholder="Deskripsi dokumen..."
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-submit"
                disabled={uploading || !selectedFile}
              >
                {uploading ? 'Mengupload...' : 'Upload Dokumen'}
              </button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => {
                  setShowUploadForm(false);
                  setSelectedFile(null);
                  setUploadData({ deskripsi: '', kategori: 'lainnya' });
                  setError('');
                }}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Dokumen List */}
      <div className="dokumen-list">
        {dokumen.length === 0 ? (
          <div className="no-dokumen">
            <p>Belum ada dokumen yang diupload</p>
            <button 
              className="btn-upload"
              onClick={() => setShowUploadForm(true)}
            >
              Upload Dokumen Pertama
            </button>
          </div>
        ) : (
          <div className="dokumen-grid">
            {dokumen.map((doc) => (
              <div key={doc.id} className="dokumen-card">
                <div className="dokumen-icon">
                  {getFileIcon(doc.tipe_file)}
                </div>
                
                <div className="dokumen-info">
                  <h4 className="dokumen-title">{doc.nama_asli}</h4>
                  <p className="dokumen-meta">
                    <span className="dokumen-size">{doc.ukuran_file_formatted}</span>
                    <span className="dokumen-date">
                      {new Date(doc.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </p>
                  
                  {doc.deskripsi && (
                    <p className="dokumen-desc">{doc.deskripsi}</p>
                  )}
                  
                  <div className="dokumen-tags">
                    <span className={`badge ${getKategoriBadge(doc.kategori)}`}>
                      {doc.kategori_text}
                    </span>
                    <span className="uploaded-by">Oleh: {doc.uploaded_by}</span>
                  </div>
                </div>
                
                <div className="dokumen-actions">
                  <button 
                    className="btn-download"
                    onClick={() => handleDownload(doc.id, doc.nama_asli)}
                    title="Download"
                  >
                    📥
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(doc.id)}
                    title="Hapus"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DokumenManager;
