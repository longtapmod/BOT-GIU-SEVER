// index.js - 2 BOT AFK ĐỨNG YÊN GIỮ SERVER ONLINE 24/7 (Aternos - Replit)
// Bản đơn giản ổn định, không crash chat 1.21, chống AFK nhẹ (quay đầu + nhảy), reconnect thông minh

const http = require('http');
const mineflayer = require('mineflayer');

// ====================== CẤU HÌNH 2 BOT ======================
const HOST = 'dailongsever111.aternos.me';
const PORT = 14483;
const BOT1_NAME = 'BotChongTrom';
const BOT2_NAME = 'Bot2ChongTrom'; // Tên bot 2 (thay nếu muốn)
// ============================================================

console.log(`\nĐang kết nối 2 bot → ${HOST}:${PORT} (1.20.4 - ổn định)`);

// Web server giữ Replit không ngủ
const PORT_UPTIME = process.env.PORT || 5000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('2 Bot AFK đang chạy 24/7 - Ping UptimeRobot nhé!');
}).listen(PORT_UPTIME, '0.0.0.0', () => console.log(`Web server chạy trên cổng ${PORT_UPTIME}`));

// Tạo 2 bot
let bot1, bot2;

function createBot1() {
  bot1 = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: BOT1_NAME,
    version: '1.20.4',  // Ổn định, không lỗi chat
    auth: 'offline'
  });
  attachEvents(bot1, BOT1_NAME);
}

function createBot2() {
  bot2 = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: BOT2_NAME,
    version: '1.20.4',
    auth: 'offline'
  });
  attachEvents(bot2, BOT2_NAME);
}

function attachEvents(bot, name) {
  bot.once('spawn', () => {
    console.log(`\nBot ${name} đã vào server! Bật chống AFK...`);
    startAntiAFK(bot);
  });

  // Chat đơn giản (bỏ qua lỗi 1.21)
  bot.on('chat', (username, message) => {
    try {
      if (username === bot.username) return;
      console.log(`[Chat ${name}] <${username}> ${message}`);
      const msg = message.toLowerCase();
      if (msg.includes('chao') || msg.includes('hi')) {
        bot.chat(`Chào ${username}! ${name} vẫn online ❤️`);
      }
    } catch (err) {}
  });

  bot.on('error', err => {
    if (err.message.includes('chat') || err.message.includes('format')) {
      console.log(`Bỏ qua lỗi chat cho ${name}`);
      return;
    }
    console.log(`Lỗi ${name}: ${err.message}`);
    reconnectBot(bot, name);
  });

  bot.on('kicked', reason => {
    console.log(`${name} bị kick: ${JSON.stringify(reason)}`);
    reconnectBot(bot, name);
  });

  bot.on('end', () => {
    console.log(`${name} mất kết nối → reconnect...`);
    reconnectBot(bot, name);
  });
}

// ====================== CHỐNG AFK NHẸ (ĐỨNG YÊN + QUAY ĐẦU + NHẢY) ======================
function startAntiAFK(bot) {
  setInterval(() => {
    if (!bot.entity) return;

    // Quay đầu ngẫu nhiên
    bot.look(bot.entity.yaw + Math.random() * 2 - 1, bot.entity.pitch + Math.random() * 0.5 - 0.25);

    // Nhảy nhẹ
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 300);

    // Di chuyển nhẹ
    const dir = ['forward', 'back', 'left', 'right'][Math.floor(Math.random() * 4)];
    bot.setControlState(dir, true);
    setTimeout(() => bot.clearControlStates(), 800);
  }, 25000); // Mỗi 25 giây - không quá lộ
}

// ====================== RECONNECT THÔNG MINH ======================
let reconnectDelay1 = 15000, reconnectDelay2 = 15000;

function reconnectBot(bot, name) {
  const delay = (name === BOT1_NAME ? reconnectDelay1 : reconnectDelay2);
  if (delay < 120000) {
    if (name === BOT1_NAME) reconnectDelay1 += Math.random() * 30000;
    else reconnectDelay2 += Math.random() * 30000;
  }
  const waitTime = delay + Math.random() * 10000;
  console.log(`${name} đợi ${Math.round(waitTime/1000)}s reconnect...`);

  setTimeout(() => {
    if (name === BOT1_NAME) {
      reconnectDelay1 = 15000;
      createBot1();
    } else {
      reconnectDelay2 = 15000;
      createBot2();
    }
  }, waitTime);
}

// Khởi động 2 bot
createBot1();
createBot2();
