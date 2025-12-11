// 2 BOT SIÊU BỀN 2025 – FINAL FIX "Cannot interact with self!" + Version 1.21.10 + Throttle
// Delay reconnect 5-7 phút – Hoàn hảo cho Purpur/FreezeHost throttle
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
  res.end('Bot đang chạy 24/7 – Fix Throttle + Version 1.21.10 + Cannot interact!');
}).listen(process.env.PORT || 8080);

function createBot(name) {
  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: name,
    version: '1.21.10',  // Exact version cho Purpur 1.21.10
    auth: 'offline'       // FreezeHost + Floodgate cho phép
  });

  bot.once('spawn', () => {
    console.log(`✓ ${name} đã vào server – Chống kick MAX level (1.21.10 + Throttle OK)`);
    let ticks = 0;
    setInterval(() => {
      if (!bot.entity?.onGround) return;
      ticks++;
      // Quay đầu mạnh
      bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * 0.8, true);
      // Jump nhẹ – an toàn
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 200);
      // Di chuyển ngắn random
      const dir = ['forward','back','left','right'][Math.floor(Math.random()*4)];
      bot.setControlState(dir, true);
      setTimeout(() => bot.clearControlStates(), 700 + Math.random() * 500);
      // Vung tay (an toàn 100%)
      bot.swingArm();
      // Chat siêu kín (mỗi ~12-18 phút)
      if (ticks % 28 === 0) {
        const msg = ['.', '..', 'ok', 'ping'][Math.floor(Math.random()*4)];
        try { bot.chat(msg); } catch(e) {}
      }
    }, 24000); // 24 giây/lần – anti-AFK tối ưu
  });

  // Reconnect FIX THROTTLE: 5-7 phút random (300-420s) – Vượt Purpur 4000 ticks
  const reconnect = () => {
    const wait = 300000 + Math.random() * 120000;  // 5 phút + random 0-2 phút
    console.log(`${name} disconnect → reconnect sau ${Math.round(wait/1000/60)} phút (throttle fix)`);
    setTimeout(() => createBot(name), wait);
  };

  bot.on('error', () => {});
  bot.on('kicked', reason => console.log(`${name} kick: ${JSON.stringify(reason)}`));
  bot.on('end', reconnect);
}

// Khởi động 2 bot
createBot(BOT1);
setTimeout(() => createBot(BOT2), 300000); // Bot2 vào sau 5 phút để tránh throttle

console.log('FINAL FIX Throttle đã sẵn sàng cho FreezeHost – Server bạn sẽ 24/7 thật sự!');
