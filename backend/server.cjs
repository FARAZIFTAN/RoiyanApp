require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'roiyan_chat',
});

// REST API: get all messages
app.get('/api/messages', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM messages ORDER BY timestamp ASC');
  res.json(rows);
});

// REST API: post message
app.post('/api/messages', async (req, res) => {
  const { user_id, user_name, avatar, content, emotion, emoji, confidence, keywords } = req.body;
  const [result] = await db.query(
    'INSERT INTO messages (user_id, user_name, avatar, content, emotion, emoji, confidence, keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [user_id, user_name, avatar, content, emotion, emoji, confidence, keywords]
  );
  const [rows] = await db.query('SELECT * FROM messages WHERE id = ?', [result.insertId]);
  const message = rows[0];
  io.emit('new_message', message); // broadcast to all clients
  res.json(message);
});

// Hapus semua pesan dari database
app.delete('/api/messages', async (req, res) => {
  await db.query('DELETE FROM messages');
  io.emit('clear_messages'); // broadcast ke semua client
  res.json({ success: true });
});

// Socket.IO: real-time push
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
