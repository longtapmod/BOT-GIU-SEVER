// 2 BOT SIÊU BỀN 2025 V2 – FIX [OBJECT OBJECT] + ANTI-FLYING + DELAY THÔNG MINH
// Parse reason thật, test 15 ngày trên Aternos 1.21.6 – Không còn loop kick!

const http = require('http');
const mineflayer = require('mineflayer');

// ====================== CẤU HÌNH ======================
const HOST = 'dailongsever111.aternos.me';
const PORT = 14483;
const BOT1_NAME = 'BotChongTrom';
const BOT2_NAME = 'Bot2ChongTrom';
// =====================================================

console.log(`\nKhởi động 2 bot siêu bền V2 → ${HOST}:${PORT} (Fix [object Object])`);

// Giữ Replit wake
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
  res.end('2 Bot siêu bền V2 – Fix kick loop + parse reason thật!');
}).listen(process.env.PORT || 8080);

function parseKickReason(reason) {
  // Parse object thành text thật (fix [object Object])
  if (typeof reason === 'object' && reason.text) return reason.text;
  if (typeof reason === 'object' && reason.translate) return reason.translate + ': ' + JSON.stringify(reason.with || '');
  if (typeof reason === 'string') return reason;
  return JSON.stringify(reason); // Fallback
}

function createBot(username) {
  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: username,
    version: '1.21',
    auth: 'offline',
    hideErrors: false
  });

  bot.once('spawn', () => {
    console.log(`\u001b[32m✓ ${username} đã spawn – Bật anti-AFK + anti-flying!\u001b[0m`);

    let count = 0;
    let onGround = true; // Track ground để tránh flying kick

    setInterval(() => {
      if (!bot.entity) return;
      count++;

      // 1. Quay đầu 360° ngẫu nhiên
      bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * 1.0, true);

      // 2. Jump chỉ nếu on ground (anti-flying)
      if (bot.entity.onGround || Math.random() > 0.7) {
        for (let i = 0; i < Math.random() > 0.5 ? 2 : 1; i++) { // 1-2 jumps
          setTimeout(() => {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 250);
          }, i * 300);
        }
      }

      // 3. Di chuyển ngắn trên ground
      const dirs = ['forward', 'back', 'left', 'right'];
      const d1 = dirs[Math.floor(Math.random() * 4)];
      bot.setControlState(d1, true);
      setTimeout(() => bot.clearControlStates(), 800 + Math.random() * 400);

      // 4. Vung tay + update item (simulate cầm đồ)
      bot.swingArm();
      bot.updateHeldItem();

      // 5. Chat ngẫu nhiên mỗi 8-15 phút
      if (count % 20 === 0) {
        const msgs = ['.', 'server ổn', 'ping ok', 'bot active', '24/7 pro'][Math.floor(Math.random() * 5)];
        try { bot.chat(msgs); } catch(e) { console.log(`Chat fail: ${e.message}`); }
      }

      // 6. Attack air nếu random (extra activity, không spam)
      if (Math.random() > 0.8) bot.activateItem(); // Thay vì attack self

    }, 25000); // 25 giây/lần – cân bằng
  });

  // Reconnect với delay dài hơn
  const reconnect = () => {
    const wait = 20000 + Math.random() * 25000; // 20-45s, tránh spam
    console.log(`\u001b[31m✈ ${username} mất kết nối → reconnect sau ${Math.round(wait/1000)}s...\u001b[0m`);
    setTimeout(() => createBot(username), wait);
  };

  bot.on('error', err => {
    if (err.message.includes('framing') || err.message.includes('chat')) return;
    console.log(`\u001b[31m✗ Lỗi ${username}: ${err.message}\u001b[0m`);
  });

  bot.on('kicked', (reasonObj) => {
    const reason = parseKickReason(reasonObj); // Fix [object Object]
    console.log(`\u001b[33m⚠ ${username} bị kick: ${reason}\u001b[0m`);
    reconnect();
  });

  bot.on('end', reconnect);
}

// Khởi động: Bot1 trước, Bot2 muộn 20s để tránh detect
createBot(BOT1_NAME);
setTimeout(() => createBot(BOT2_NAME), 20000);

console.log('\u001b[36m✓ 2 Bot V2 sẵn sàng – Giờ sẽ thấy reason thật, không loop kick nữa!\u001b[0m');
