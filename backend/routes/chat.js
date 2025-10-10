const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const db = require('../config/db');

// Get chat messages for a specific rujukan
router.get('/:rujukanId/messages', verifyToken, async (req, res) => {
  try {
    const { rujukanId } = req.params;
    const userId = req.user.id;

    // Check if user has access to this rujukan (referring facility, destination facility, or assigned driver)
    const [rujukan] = await db.execute(
      `SELECT r.*, u.faskes_id as user_faskes_id
       FROM rujukan r
       LEFT JOIN users u ON u.id = ?
       WHERE r.id = ?`,
      [userId, rujukanId]
    );

    if (rujukan.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Rujukan tidak ditemukan'
      });
    }

    const rujukanData = rujukan[0];
    const userFaskesId = rujukanData.user_faskes_id;

    // Check access: referring facility, destination facility, or admin
    if (rujukanData.faskes_asal_id !== userFaskesId &&
        rujukanData.faskes_tujuan_id !== userFaskesId &&
        req.user.role !== 'admin_pusat') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }

    // Get messages with sender info
    const [messages] = await db.execute(
      `SELECT cm.*, u.nama_lengkap as sender_name, u.username as sender_username,
              f.nama_faskes as sender_faskes_name
       FROM chat_messages cm
       JOIN users u ON cm.sender_id = u.id
       LEFT JOIN faskes f ON u.faskes_id = f.id
       WHERE cm.rujukan_id = ?
       ORDER BY cm.created_at ASC
       LIMIT 100`,
      [rujukanId]
    );

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil pesan chat'
    });
  }
});

// Send a chat message
router.post('/:rujukanId/messages', verifyToken, async (req, res) => {
  try {
    const { rujukanId } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Pesan tidak boleh kosong'
      });
    }

    // Check if user has access to this rujukan
    const [rujukan] = await db.execute(
      `SELECT r.*, u.faskes_id as user_faskes_id
       FROM rujukan r
       LEFT JOIN users u ON u.id = ?
       WHERE r.id = ?`,
      [userId, rujukanId]
    );

    if (rujukan.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Rujukan tidak ditemukan'
      });
    }

    const rujukanData = rujukan[0];
    const userFaskesId = rujukanData.user_faskes_id;

    // Check access
    if (rujukanData.faskes_asal_id !== userFaskesId &&
        rujukanData.faskes_tujuan_id !== userFaskesId &&
        req.user.role !== 'admin_pusat') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }

    // Insert message
    const [result] = await db.execute(
      'INSERT INTO chat_messages (rujukan_id, sender_id, message) VALUES (?, ?, ?)',
      [rujukanId, userId, message.trim()]
    );

    // Get the inserted message with sender info
    const [newMessage] = await db.execute(
      `SELECT cm.*, u.nama_lengkap as sender_name, u.username as sender_username,
              f.nama_faskes as sender_faskes_name
       FROM chat_messages cm
       JOIN users u ON cm.sender_id = u.id
       LEFT JOIN faskes f ON u.faskes_id = f.id
       WHERE cm.id = ?`,
      [result.insertId]
    );

    // Emit socket event to chat room
    const io = global.io;
    if (io) {
      io.to(`chat-${rujukanId}`).emit('new-message', newMessage[0]);
    }

    res.json({
      success: true,
      data: newMessage[0]
    });
  } catch (error) {
    console.error('Error sending chat message:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengirim pesan'
    });
  }
});

module.exports = router;
