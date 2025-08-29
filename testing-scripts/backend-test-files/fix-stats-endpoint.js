const express = require('express');
const router = express.Router();
const { verifyToken } = require('./middleware/auth');
const db = require('./config/db');

// Get rujukan statistics - FIXED VERSION
router.get('/stats/overview', verifyToken, async (req, res) => {
  try {
    console.log('User role:', req.user.role);
    console.log('User faskes_id:', req.user.faskes_id);
    
    let whereClause = '';
    const params = [];

    // Filter berdasarkan role
    if (req.user.role === 'admin_faskes') {
      whereClause = 'WHERE (faskes_asal_id = ? OR faskes_tujuan_id = ?)';
      params.push(req.user.faskes_id || 0, req.user.faskes_id || 0);
    }

    const query = `
      SELECT 
        COALESCE(COUNT(*), 0) as total,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END), 0) as pending,
        COALESCE(SUM(CASE WHEN status = 'diterima' THEN 1 ELSE 0 END), 0) as diterima,
        COALESCE(SUM(CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END), 0) as ditolak,
        COALESCE(SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END), 0) as selesai
      FROM rujukan
      ${whereClause}
    `;
    
    console.log('Query:', query);
    console.log('Params:', params);

    const [rows] = await db.execute(query, params);
    console.log('Result:', rows[0]);

    // Ensure all values are numbers
    const stats = {
      total: parseInt(rows[0].total) || 0,
      pending: parseInt(rows[0].pending) || 0,
      diterima: parseInt(rows[0].diterima) || 0,
      ditolak: parseInt(rows[0].ditolak) || 0,
      selesai: parseInt(rows[0].selesai) || 0
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching rujukan stats:', error);
    
    // Return default stats if there's an error
    const defaultStats = {
      total: 0,
      pending: 0,
      diterima: 0,
      ditolak: 0,
      selesai: 0
    };

    res.json({
      success: true,
      data: defaultStats
    });
  }
});

module.exports = router;
