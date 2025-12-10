// index.js - BOT 24/7 ATERNOS 1.21 - KHÔNG BAO GIỜ BỊ KICK (Replit 2025)
const http = require('http');
const mineflayer = require('mineflayer');

// ====================== CẤU HÌNH ======================
const HOST = 'dailongsever111.aternos.me';
const PORT = 14483;
const USERNAME = 'BotChongTrom';
// ===================================================

console.log(`Đang kết nối ${USERNAME} → ${HOST}:${PORT} (1.21)`);

// Web server giữ Replit awake
const PORT_UPTIME = process.env.PORT || 8080;
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
  res.end('Bot đang online 24/7 - Aternos + Replit');
}).listen(PORT_UPTIME, () => console.log(`Web server trên cổng ${PORT_UPTIME}`));

let bot;
function createBot() {
  bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
    version: '1.21',
    auth: 'offline'
  });
  attachEvents();
}

function attachEvents() {
  bot.once('spawn', () => {
    console.log(`\nBot ${bot.username} đã vào server! Bật chống AFK siêu mạnh...`);
    startAntiAFK();
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    console.log(`[Chat] <${username}> ${message}`);
    const msg = (message + '').toLowerCase();
    if (msg.includes('chao') || msg.includes('hi')) bot.chat(`Chào ${username}! Bot online 24/7 đây ❤️`);
    if (msg === 'ping') bot.chat(`Pong! Bot vẫn sống khỏe nha ${username} ~`);
  });

  // Bỏ qua lỗi chat 1.21
  bot.on('error', err => {
    if (err.message.includes('chat format') || err.message.includes('ChatMessage')) {
      console.log('Bỏ qua lỗi chat 1.21 (bình thường)');
      return;
    }
    console.log(`Lỗi: ${err.message}`);
    reconnect();
  });

  bot.on('kicked', reason => { console.log(`Bị kick: ${JSON.stringify(reason)}`); reconnect(); });
  bot.on('end', () => { console.log('Mất kết nối → reconnect...'); reconnect(); });
}

// ====================== CHỐNG AFK SIÊU MẠNH ======================
let afkActive = false;
function superAntiAFK() {
  if (!bot.entity || afkActive) return;
  afkActive = true;

  const randomYaw = Math.random() * Math.PI * 2;
  const randomPitch = (Math.random() - 0.5) * Math.PI * 0.4;
  bot.look(randomYaw, randomPitch);

  bot.setControlState('jump', true);
  setTimeout(() => bot.setControlState('jump', false), 400);

  const actions = ['forward', 'back', 'left', 'right'];
  const action = actions[Math.floor(Math.random() * actions.length)];
  bot.setControlState(action, true);

  const moveTime = 1000 + Math.random() * 2000;
  setTimeout(() => {
    bot.clearControlStates();
    afkActive = false;
  }, moveTime);

  if (Math.random() < 0.3) {
    bot.setControlState('sneak', true);
    setTimeout(() => bot.setControlState('sneak', false), 1500);
  }
}

function startAntiAFK() {
  console.log('Bật chế độ chống AFK siêu mạnh...');
  superAntiAFK();
  setInterval(superAntiAFK, 8000); // mỗi 8 giây
}

// ====================== RECONNECT CHỐNG THROTTLE ======================
let delay = 15000;
function reconnect() {
  if (delay < 120000) delay += Math.random() * 30000;
  const wait = delay + Math.random() * 10000;
  console.log(`Đang đợi ${Math.round(wait/1000)}s trước khi reconnect...`);
  setTimeout(() => {
    delay = 15000;
    createBot();
  }, wait);
}

// Start
createBot();
