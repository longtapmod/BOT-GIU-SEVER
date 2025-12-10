// index.js - 2 BOT AFK ĐỨNG YÊN GIỮ SERVER ONLINE 24/7 (Aternos 1.21 - Replit)
// Bản ổn định cho server 1.21, chống kick, reconnect tốt

const http = require('http');
const mineflayer = require('mineflayer');

// ====================== CẤU HÌNH 2 BOT ======================
const HOST = 'dailongsever111.aternos.me';
const PORT = 14483;
const BOT1_NAME = 'BotChongTrom';
const BOT2_NAME = 'Bot2ChongTrom'; // Thay tên nếu muốn
// ============================================================

console.log(`\nĐang kết nối 2 bot → ${HOST}:${PORT} (phiên bản 1.21)`);

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
    version: '1.21',  // ĐÃ ĐỔI THÀNH 1.21
    auth: 'offline'
  });
  attachEvents(bot1, BOT1_NAME);
}

function createBot2() {
  bot2 = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: BOT2_NAME,
    version: '1.21',  // ĐÃ ĐỔI THÀNH 1.21
    auth: 'offline'
  });
  attachEvents(bot2, BOT2_NAME);
}

function attachEvents(bot, name) {
  bot.once('spawn', () => {
    console.log(`\nBot ${name} đã vào server thành công! Bật chống AFK...`);
    startAntiAFK(bot);
  });

  // Chat đơn giản
  bot.on('chat', (username, message) => {
    try {
      if (username === bot.username) return;
      console.log(`[Chat ${name}] <${username}> ${message}`);
      const msg = message.toLowerCase();
      if (msg.includes('chao') || msg.includes('hi') || msg.includes('hello')) {
        bot.chat(`Chào ${username}! ${name} vẫn online nè ❤️`);
      }
    } catch (err) {} // Bỏ qua lỗi chat 1.21
  });

  // Bỏ qua lỗi chat 1.21
  bot.on('error', err => {
    if (err.message.includes('chat') || err.message.includes('format') || err.message.includes('object Object') || err.message.includes('framing')) {
      console.log(`Bỏ qua lỗi chat 1.21 cho ${name}`);
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

// ====================== CHỐNG AFK NHẸ ======================
function startAntiAFK(bot) {
  setInterval(() => {
    if (!bot.entity) return;

    // Quay đầu nhẹ
    bot.look(bot.entity.yaw + (Math.random() - 0.5) * 0.5, bot.entity.pitch);

    // Nhảy
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 300);

    // Di chuyển ngắn
    const dir = ['forward', 'back', 'left', 'right'][Math.floor(Math.random() * 4)];
    bot.setControlState(dir, true);
    setTimeout(() => bot.clearControlStates(), 600);
  }, 30000); // Mỗi 30 giây
}

// ====================== RECONNECT THÔNG MINH ======================
let delay1 = 15000, delay2 = 15000;

function reconnectBot(bot, name) {
  const delay = name === BOT1_NAME ? delay1 : delay2;
  let wait = delay + Math.random() * 15000;
  if (delay < 120000) {
    if (name === BOT1_NAME) delay1 += 20000;
    else delay2 += 20000;
  }
  console.log(`${name} đợi ${Math.round(wait/1000)}s reconnect...`);
  setTimeout(() => {
    if (name === BOT1_NAME) createBot1();
    else createBot2();
  }, wait);
}

// Khởi động
createBot1();
setTimeout(createBot2, 8000); // Bot2 vào sau 8s tránh throttle
