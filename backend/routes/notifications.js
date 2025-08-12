const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const db = require('../config/db');

// Get notifications for user
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get notifications based on user role and faskes_id
    let query = `
      SELECT n.*, 
             u.nama as sender_name,
             f.nama_faskes as faskes_name
      FROM notifications n
      LEFT JOIN users u ON n.sender_id = u.id
      LEFT JOIN faskes f ON n.faskes_id = f.id
      WHERE n.recipient_id = ? OR n.faskes_id = ?
      ORDER BY n.created_at DESC
      LIMIT 50
    `;
    
    const [notifications] = await db.execute(query, [userId, req.user.faskes_id || 0]);
    
    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil notifikasi'
    });
  }
});

// Mark notification as read
router.patch('/:id/read', verifyToken, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;
    
    await db.execute(
      'UPDATE notifications SET is_read = 1 WHERE id = ? AND (recipient_id = ? OR faskes_id = ?)',
      [notificationId, userId, req.user.faskes_id || 0]
    );
    
    res.json({
      success: true,
      message: 'Notifikasi ditandai sebagai telah dibaca'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menandai notifikasi'
    });
  }
});

// Mark all notifications as read
router.patch('/read-all', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    await db.execute(
      'UPDATE notifications SET is_read = 1 WHERE recipient_id = ? OR faskes_id = ?',
      [userId, req.user.faskes_id || 0]
    );
    
    res.json({
      success: true,
      message: 'Semua notifikasi ditandai sebagai telah dibaca'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menandai notifikasi'
    });
  }
});

// Get unread notification count
router.get('/unread-count', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [result] = await db.execute(
      'SELECT COUNT(*) as count FROM notifications WHERE (recipient_id = ? OR faskes_id = ?) AND is_read = 0',
      [userId, req.user.faskes_id || 0]
    );
    
    res.json({
      success: true,
      data: {
        unreadCount: result[0].count
      }
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil jumlah notifikasi'
    });
  }
});

module.exports = router;
