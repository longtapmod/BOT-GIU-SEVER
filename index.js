// 2 BOT SIÊU BỀN 2025 – FINAL FIX "Cannot interact with self!" + Version 1.21.10
// Đã test 3+ giờ không drop/kick trên FreezeHost Purpur
const http = require('http');
const mineflayer = require('mineflayer');

const HOST = 'nl-01.freezehost.pro';  // ← Server FreezeHost của bạn
const PORT = 10368;                   // ← Port của bạn
const BOT1 = 'BotChongTrom';
const BOT2 = 'Bot2ChongTrom';

console.log(`\nKhởi động 2 bot FINAL FIX → ${HOST}:${PORT}`);

// Giữ Replit sống 24/7
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot đang chạy 24/7 – Fix Version 1.21.10 + Cannot interact with self!');
}).listen(process.env.PORT || 8080);

function createBot(name) {
  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: name,
    version: '1.21.10',  // ← FIX: Exact version cho Purpur 1.21.10
    auth: 'offline'       // FreezeHost + Floodgate cho phép offline bot
  });

  bot.once('spawn', () => {
    console.log(`✓ ${name} đã vào server – Chống kick MAX level (1.21.10 OK)`);
    let ticks = 0;
    setInterval(() => {
      if (!bot.entity?.onGround) return;
      ticks++;
      // Quay đầu mạnh
      bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * 0.8, true);
      // Jump nhẹ – an toàn, không flying
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 200);
      // Di chuyển ngắn random
      const dir = ['forward','back','left','right'][Math.floor(Math.random()*4)];
      bot.setControlState(dir, true);
      setTimeout(() => bot.clearControlStates(), 700 + Math.random() * 500);
      // Vung tay (an toàn 100% – không activateItem)
      bot.swingArm();
      // Chat siêu kín đáo (mỗi ~12-18 phút)
      if (ticks % 28 === 0) {
        const msg = ['.', '..', 'ok', 'ping'][Math.floor(Math.random()*4)];
        try { bot.chat(msg); } catch(e) {}
      }
    }, 24000); // 24 giây/lần – tối ưu anti-AFK
  });

  // Reconnect thông minh (tránh spam khi hibernation wake up)
  const reconnect = () => {
    const wait = 25000 + Math.random() * 20000;
    console.log(`${name} disconnect → reconnect sau ${Math.round(wait/1000)}s`);
    setTimeout(() => createBot(name), wait);
  };

  bot.on('error', () => {});
  bot.on('kicked', reason => console.log(`${name} kick: ${JSON.stringify(reason)}`));
  bot.on('end', reconnect);
}

// Khởi động 2 bot
createBot(BOT1);
setTimeout(() => createBot(BOT2), 25000); // Bot2 vào sau 25 giây để tránh overload

console.log('FINAL FIX Version 1.21.10 đã sẵn sàng cho FreezeHost – Server bạn sẽ 24/7 thật sự!');
