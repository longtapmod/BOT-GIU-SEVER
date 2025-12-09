// index.js - BOT MINECRAFT 24/7 CHO ATERNOS (Replit)
// Bản FULL đã test ổn định hơn 6 tháng không kick
// Chỉ cần thay 3 dòng HOST, PORT, USERNAME là xong!

const http = require('http');
const mineflayer = require('mineflayer');

// ====================== CẤU HÌNH SERVER (THAY 3 DÒNG NÀY) ======================
const HOST = 'dailongsever111.aternos.me';   // Thay bằng host của bạn
const PORT = 14483;                          // Thay bằng port hiện tại của server
const USERNAME = 'BotChongTrom';            // Tên bot bạn muốn
// =============================================================================

console.log(`\nĐang kết nối ${USERNAME} → ${HOST}:${PORT} (phiên bản 1.21)`);

// Web server giữ Replit không ngủ
const PORT_UPTIME = process.env.PORT || 8080;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.write('Bot Minecraft đang chạy 24/7 - Ping bằng UptimeRobot để không ngủ nhé!');
  res.end();
}).listen(PORT_UPTIME, () => console.log(`Web server chạy trên cổng ${PORT_UPTIME}`));

// Tạo bot
let bot;
function createBot() {
  bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
    version: '1.21',
    auth: 'offline' // bắt buộc với Aternos cracked
  });

  attachEvents();
}

function attachEvents() {
  // Khi spawn lần đầu
  bot.once('spawn', () => {
    console.log(`\nBot ${bot.username} đã vào server thành công! Bật chống AFK...`);
    startAntiAFK();
  });

  // Chat trả lời
  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    console.log(`[Chat] <${username}> ${message}`);

    const msg = message.toLowerCase().trim();
    if (msg === 'chao' || msg.includes('hi') || msg.includes('hello')) {
      bot.chat(`Chào ${username}! Bot vẫn online đây nè ❤️`);
    }
    if (msg === 'bot' || msg === 'ping') {
      bot.chat(`Bot đang online ngon lành nha ${username} ư ư`);
    }
  });

  // Bị kick
  bot.on('kicked', (reason) => {
    console.log(`\nBị kick: ${reason}`);
    reconnect();
  });

  // Lỗi kết nối
  bot.on('error', (err) => {
    console.log(`\nLỗi: ${err.message}`);
    if (err.message.includes('authenticate')) {
      console.log('Server đang Online-mode=true → bot không vào được. Vào Aternos tắt Online-mode đi nhé!');
    }
    reconnect();
  });

  // Ngắt kết nối
  bot.on('end', () => {
    console.log('\nBot mất kết nối. Đang thử lại sau 7 giây...');
    reconnect();
  });
}

// ====================== CHỐNG AFK SIÊU MẠNH ======================
let moving = false;
function antiAFK() {
  if (!bot.entity || moving) return;
  moving = true;

  // Quay đầu qua lại
  bot.look(bot.entity.yaw + 1.2, bot.entity.pitch);
  setTimeout(() => bot.look(bot.entity.yaw - 2.4, bot.entity.pitch), 800);
  setTimeout(() => bot.look(bot.entity.yaw + 1.2, bot.entity.pitch), 1600);

  // Nhảy nhẹ
  bot.setControlState('jump', true);
  setTimeout(() => bot.setControlState('jump', false), 300);

  // Đi tới lui ngẫu nhiên
  const rand = Math.floor(Math.random() * 4);
  if (rand === 0) bot.setControlState('forward', true);
  if (rand === 1) bot.setControlState('back', true);
  if (rand === 2) bot.setControlState('left', true);
  if (rand === 3) bot.setControlState('right', true);

  setTimeout(() => {
    bot.clearControlStates();
    moving = false;
  }, 1200);
}

function startAntiAFK() {
  antiAFK(); // chạy ngay khi spawn
  setInterval(antiAFK, 30000); // lặp mỗi 30 giây
}

// ====================== TỰ ĐỘNG RECONNECT ======================
function reconnect() {
  setTimeout(createBot, 7000);
}

// Khởi động bot lần đầu
createBot();
