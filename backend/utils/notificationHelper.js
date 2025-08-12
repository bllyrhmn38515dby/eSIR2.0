const db = require('../config/db');

// Create notification in database
const createNotification = async (notificationData) => {
  try {
    const {
      type,
      title,
      message,
      recipient_id,
      sender_id,
      faskes_id,
      rujukan_id
    } = notificationData;

    const [result] = await db.execute(`
      INSERT INTO notifications (type, title, message, recipient_id, sender_id, faskes_id, rujukan_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [type, title, message, recipient_id, sender_id, faskes_id, rujukan_id]);

    return result.insertId;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Send realtime notification via Socket.IO
const sendRealtimeNotification = (io, notificationData) => {
  try {
    const {
      type,
      title,
      message,
      targetRoom,
      data
    } = notificationData;

    const notification = {
      type,
      title,
      message,
      data,
      timestamp: new Date(),
      id: Date.now() // Temporary ID for realtime
    };

    if (targetRoom) {
      io.to(targetRoom).emit('notification', notification);
    } else {
      io.emit('notification', notification);
    }

    console.log(`Realtime notification sent to ${targetRoom || 'all'}:`, title);
  } catch (error) {
    console.error('Error sending realtime notification:', error);
  }
};

// Send notification for new rujukan
const sendRujukanNotification = async (io, rujukanData, senderId) => {
  try {
    // Create notification in database
    const notificationId = await createNotification({
      type: 'rujukan-baru',
      title: 'Rujukan Baru',
      message: `Rujukan baru dari ${rujukanData.faskes_asal_nama}`,
      recipient_id: null, // Will be sent to faskes
      sender_id: senderId,
      faskes_id: rujukanData.faskes_tujuan_id,
      rujukan_id: rujukanData.id
    });

    // Send realtime notification
    sendRealtimeNotification(io, {
      type: 'rujukan-baru',
      title: 'Rujukan Baru',
      message: `Rujukan baru dari ${rujukanData.faskes_asal_nama}`,
      targetRoom: `faskes-${rujukanData.faskes_tujuan_id}`,
      data: rujukanData
    });

    // Also send to admin room
    sendRealtimeNotification(io, {
      type: 'rujukan-baru',
      title: 'Rujukan Baru',
      message: `Rujukan baru: ${rujukanData.nomor_rujukan}`,
      targetRoom: 'admin-room',
      data: rujukanData
    });

    return notificationId;
  } catch (error) {
    console.error('Error sending rujukan notification:', error);
    throw error;
  }
};

// Send notification for status update
const sendStatusUpdateNotification = async (io, rujukanData, oldStatus, newStatus, senderId) => {
  try {
    // Create notification in database
    const notificationId = await createNotification({
      type: 'status-update',
      title: 'Status Rujukan Diperbarui',
      message: `Status rujukan ${rujukanData.nomor_rujukan} diubah dari ${oldStatus} menjadi ${newStatus}`,
      recipient_id: null, // Will be sent to faskes
      sender_id: senderId,
      faskes_id: rujukanData.faskes_asal_id,
      rujukan_id: rujukanData.id
    });

    // Send realtime notification to faskes asal
    sendRealtimeNotification(io, {
      type: 'status-update',
      title: 'Status Rujukan Diperbarui',
      message: `Status rujukan ${rujukanData.nomor_rujukan} diubah menjadi ${newStatus}`,
      targetRoom: `faskes-${rujukanData.faskes_asal_id}`,
      data: rujukanData
    });

    // Also send to admin room
    sendRealtimeNotification(io, {
      type: 'status-update',
      title: 'Status Rujukan Diperbarui',
      message: `Status rujukan ${rujukanData.nomor_rujukan} diubah menjadi ${newStatus}`,
      targetRoom: 'admin-room',
      data: rujukanData
    });

    return notificationId;
  } catch (error) {
    console.error('Error sending status update notification:', error);
    throw error;
  }
};

module.exports = {
  createNotification,
  sendRealtimeNotification,
  sendRujukanNotification,
  sendStatusUpdateNotification
};
