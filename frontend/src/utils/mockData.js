// Mock data untuk testing frontend ketika backend tidak tersedia

export const mockUser = {
  id: 1,
  nama_lengkap: 'Admin Pusat',
  email: 'admin@esir.com',
  role: 'admin_pusat',
  last_login: new Date().toISOString()
};

export const mockStats = {
  total_rujukan: 25,
  rujukan_hari_ini: 5,
  rujukan_dalam_perjalanan: 3,
  rujukan_selesai: 17,
  rujukan_pending: 2,
  rujukan_ditolak: 1
};

export const mockFaskes = [
  {
    id: 1,
    nama_faskes: 'RSUD Bogor',
    alamat: 'Jl. Dr. Semeru No. 120, Bogor',
    tipe: 'RSUD',
    telepon: '0251-8324024',
    latitude: -6.5971,
    longitude: 106.8060
  },
  {
    id: 2,
    nama_faskes: 'Puskesmas Tengah',
    alamat: 'Jl. Pajajaran No. 45, Bogor',
    tipe: 'Puskesmas',
    telepon: '0251-8321234',
    latitude: -6.5944,
    longitude: 106.7892
  }
];

export const mockRujukan = [
  {
    id: 1,
    pasien_nama: 'Ahmad Susanto',
    pasien_umur: 45,
    pasien_alamat: 'Jl. Merdeka No. 10, Bogor',
    diagnosis: 'Hipertensi',
    faskes_asal: 'Puskesmas Tengah',
    faskes_tujuan: 'RSUD Bogor',
    status: 'dalam_perjalanan',
    created_at: new Date().toISOString(),
    latitude: -6.5944,
    longitude: 106.7892
  },
  {
    id: 2,
    pasien_nama: 'Siti Nurhaliza',
    pasien_umur: 32,
    pasien_alamat: 'Jl. Sudirman No. 25, Bogor',
    diagnosis: 'Demam Berdarah',
    faskes_asal: 'Puskesmas Utara',
    faskes_tujuan: 'RSUD Bogor',
    status: 'pending',
    created_at: new Date().toISOString(),
    latitude: -6.6000,
    longitude: 106.8000
  }
];

export const mockPasien = [
  {
    id: 1,
    nama_lengkap: 'Ahmad Susanto',
    umur: 45,
    alamat: 'Jl. Merdeka No. 10, Bogor',
    telepon: '081234567890',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    nama_lengkap: 'Siti Nurhaliza',
    umur: 32,
    alamat: 'Jl. Sudirman No. 25, Bogor',
    telepon: '081234567891',
    created_at: new Date().toISOString()
  }
];

// Mock API responses
export const mockApiResponses = {
  login: {
    success: true,
    message: 'Login berhasil',
    data: {
      token: 'mock-token-123',
      user: mockUser
    }
  },
  stats: {
    success: true,
    data: mockStats
  },
  faskes: {
    success: true,
    data: mockFaskes
  },
  rujukan: {
    success: true,
    data: mockRujukan
  },
  pasien: {
    success: true,
    data: mockPasien
  }
};

// Mock error responses
export const mockErrorResponses = {
  serverUnavailable: {
    success: false,
    message: 'Server tidak tersedia. Pastikan backend berjalan di port 3001.'
  },
  unauthorized: {
    success: false,
    message: 'Email atau password salah'
  },
  notFound: {
    success: false,
    message: 'Endpoint tidak ditemukan. Pastikan server berjalan.'
  }
};
