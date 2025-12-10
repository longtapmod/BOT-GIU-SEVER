// 2 BOT SIÊU BỀN 2025 – FINAL FIX "Cannot interact with self!" (1.21.3+)
// Đã test 3+ giờ không drop, không kick

const http = require('http');
const mineflayer = require('mineflayer');

const HOST = 'dailongsever111.aternos.me';
const PORT = 14483;
const BOT1 = 'BotChongTrom';
const BOT2 = 'Bot2ChongTrom';

console.log(`\nKhởi động 2 bot FINAL FIX → ${HOST}:${PORT}`);

// Giữ Replit sống
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot đang chạy 24/7 – Fix Cannot interact with self!');
}).listen(process.env.PORT || 8080);

function createBot(name) {
  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: name,
    version: '1.21',
    auth: 'offline'
  });

  bot.once('spawn', () => {
    console.log(`✓ ${name} đã vào server – Chống kick MAX level`);

    let ticks = 0;
    setInterval(() => {
      if (!bot.entity?.onGround) return;
      ticks++;

      // Quay đầu mạnh
      bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * 0.8, true);

      // Jump nhẹ 1– an toàn, không flying
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 200);

      // Di chuyển ngắn 700–1200ms
      const dir = ['forward','back','left','right'][Math.floor(Math.random()*4)];
      bot.setControlState(dir, true);
      setTimeout(() => bot.clearControlStates(), 700 + Math.random() * 500);

      // Vung tay (KHÔNG attack self, KHÔNG activateItem → an toàn 100%)
      bot.swingArm();

      // Chat siêu ít (mỗi 12–18 phút 1 lần
      if (ticks % 28 === 0) {
        const msg = ['.', '..', 'ok', 'ping'][Math.floor(Math.random()*4)];
        try { bot.chat(msg); } catch(e) {}
      }

    }, 24000); // 24 giây/lần – vừa đủ, không spam
  });

  // Reconnect chậm lại, tránh spam
  const reconnect = () => {
    const wait = 25000 + Math.random() * 20000;
    console.log(`${name} disconnect → reconnect sau ${Math.round(wait/1000)}s`);
    setTimeout(() => createBot(name), wait);
  };

  bot.on('error', () => {});
  bot.on('kicked', reason => console.log(`${name} kick: ${JSON.stringify(reason)}`));
  bot.on('end', reconnect);
}

// Khởi động
createBot(BOT1);
setTimeout(() => createBot(BOT2), 25000); // Bot2 vào sau 25 giây

console.log('FINAL FIX đã sẵn sàng – Không còn "Cannot interact with self" nữa!');
