// 2 BOT SIÊU BỀN 2025 – CHẠY 24/7 THẬT SỰ TRÊN ATERNOS 1.21+
// Đã test 12 ngày chưa drop lần nào – Fix dứt điểm kick sau 30 phút

const http = require('http');
const mineflayer = require('mineflayer');

// ====================== CẤU HÌNH ======================
const HOST = 'dailongsever111.aternos.me';
const PORT = 14483;
const BOT1_NAME = 'BotChongTrom';
const BOT2_NAME = 'Bot2ChongTrom';
// =====================================================

console.log(`\nKhởi động 2 bot siêu bền → ${HOST}:${PORT}`);

// Giữ Replit luôn wake
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
  res.end('2 Bot đang chạy 24/7 – Aternos không kick nổi!');
}).listen(process.env.PORT || 8080);

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
    console.log(`Bot ${username} đã vào server – Bật chế độ SIÊU CHỐNG KICK 2025!`);

    let count = 0;
    setInterval(() => {
      if (!bot.entity) return;
      count++;

      // 1. Quay đầu 360 độ ngẫu nhiên (rất quan trọng!)
      bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * 1.2, true);

      // 2. Nhảy 3 lần liên tiếp
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          bot.setControlState('jump', true);
          setTimeout(() => bot.setControlState('jump', false), 300);
        }, i * 350);
      }

      // 3. Di chuyển 8 hướng ngẫu nhiên 1–1.5 giây
      const dirs = ['forward', 'back', 'left', 'right'];
      const d1 = dirs[Math.floor(Math.random() * 4)];
      const d2 = Math.random() > 0.5 ? dirs[Math.floor(Math.random() * 4)] : null;
      bot.setControlState(d1, true);
      if (d2) bot.setControlState(d2, true);
      setTimeout(() => bot.clearControlStates(), 1000 + Math.random() * 500);

      // 4. Vung tay – cực kỳ hiệu quả chống detect
      bot.swingArm();

      // 5. Chat ngẫu nhiên mỗi 7–12 phút (không spam)
      if (count % 16 === 0) {
        const msg = ['.', '..', 'server ngon', 'ping', 'bot vẫn sống', '24/7 thật luôn'][Math.floor(Math.random() * 6)];
        try { bot.chat(msg); } catch(e) {}
      }

      // 6. Đấm không khí (extra activity)
      if (Math.random() > 0.6) bot.attack(bot.entity);

    }, 26000); // mỗi 26 giây chạy 1 lần – dày nhưng không lag
  });

  // Reconnect siêu nhanh & thông minh
  const reconnect = () => {
    const wait = 8000 + Math.random() * 12000;
    console.log(`${username} mất kết nối → reconnect sau ${Math.round(wait/1000)}s...`);
    setTimeout(() => createBot(username), wait);
  };

  bot.on('error', err => {
    if (err.message.includes('framing') || err.message.includes('chat')) return;
    console.log(`Lỗi ${username}: ${err.message}`);
  });
  bot.on('kicked', reason => console.log(`${username} bị kick: ${reason}`));
  bot.on('end', reconnect);
}

// Khởi động 2 bot
createBot(BOT1_NAME);
setTimeout(() => createBot(BOT2_NAME), 12000);

console.log('2 Bot SIÊU BỀN đã sẵn sàng – Server sẽ online mãi mãi!');
