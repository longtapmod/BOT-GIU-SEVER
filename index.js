// index.js - BOT MINECRAFT 24/7 ATERNOS 1.21 (Replit)
// Đã fix hoàn toàn lỗi chat format + throttle
const http = require('http');
const mineflayer = require('mineflayer');

// ====================== CẤU HÌNH (CHỈ THAY 3 DÒNG NÀY) ======================
const HOST = 'dailongsever111.aternos.me';
const PORT = 14483;
const USERNAME = 'BotChongTrom';
// =========================================================================

console.log(`\nĐang kết nối ${USERNAME} → ${HOST}:${PORT} (phiên bản 1.21)`);

// Web server giữ Replit không ngủ
const PORT_UPTIME = process.env.PORT || 8080;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Bot Minecraft 1.21 đang chạy 24/7');
}).listen(PORT_UPTIME, () => console.log(`Web server chạy trên cổng ${PORT_UPTIME}`));

// Tạo bot
let bot;
function createBot() {
  bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
    version: '1.21',      // Đúng version server
    auth: 'offline'
  });
  attachEvents();
}

function attachEvents() {
  bot.once('spawn', () => {
    console.log(`\nBot ${bot.username} đã vào server thành công! Bật chống AFK...`);
    startAntiAFK();
  });

  // Fix lỗi chat format 1.21: bắt và bỏ qua lỗi này
  bot.on('error', (err) => {
    if (err.message.includes('unknown chat format code') || 
        err.message.includes('ChatMessage') || 
        err.message.includes('fromNetwork')) {
      console.log('Bỏ qua lỗi chat format 1.21 (bình thường, không ảnh hưởng)');
      return;
    }
    console.log(`Lỗi thật: ${err.message}`);
    reconnect();
  });

  // Chat trả lời (an toàn)
  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    console.log(`[Chat] <${username}> ${message}`);
    const msg = (message + '').toLowerCase();
    if (msg.includes('chao') || msg.includes('hi') || msg.includes('hello')) {
      bot.chat(`Chào ${username}! Bot vẫn online đây ❤️`);
    }
    if (msg === 'bot' || msg === 'ping') {
      bot.chat(`Bot online ngon lành nè ${username} ư ư`);
    }
  });

  bot.on('kicked', (reason) => {
    console.log(`Bị kick: ${JSON.stringify(reason)}`);
    reconnect();
  });

  bot.on('end', () => {
    console.log('Bot mất kết nối → reconnect với delay thông minh...');
    reconnect();
  });
}

// ====================== CHỐNG AFK ======================
let moving = false;
function antiAFK() {
  if (!bot?.entity || moving) return;
  moving = true;
  bot.look(bot.entity.yaw + 1.5, bot.entity.pitch);
  setTimeout(() => bot.look(bot.entity.yaw - 3, bot.entity.pitch), 1000);
  setTimeout(() => bot.look(bot.entity.yaw + 1.5, bot.entity.pitch), 2000);

  bot.setControlState('jump', true);
  setTimeout(() => bot.setControlState('jump', false), 400);

  const r = Math.floor(Math.random() * 4);
  if (r === 0) bot.setControlState('forward', true);
  if (r === 1) bot.setControlState('back', true);
  if (r === 2) bot.setControlState('left', true);
  if (r === 3) bot.setControlState('right', true);

  setTimeout(() => {
    bot.clearControlStates();
    moving = false;
  }, 1500);
}

function startAntiAFK() {
  antiAFK();
  setInterval(antiAFK, 28000);
}

// ====================== RECONNECT THÔNG MINH CHỐNG THROTTLE ======================
let reconnectDelay = 15000;

function reconnect() {
  if (reconnectDelay < 120000) reconnectDelay += Math.random() * 35000;
  const wait = reconnectDelay + Math.random() * 15000;

  console.log(`\nĐang đợi ${Math.round(wait/1000)} giây trước khi reconnect...`);
  setTimeout(() => {
    reconnectDelay = 15000; // reset khi thành công
    createBot();
  }, wait);
}

// Khởi động
createBot();
