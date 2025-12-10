// index.js - BOT CHƠI NHƯ NGƯỜI THẬT: ĐÀO KHOÁNG + XÂY NHÀ (Aternos 1.21 - Replit)
const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const collectBlock = require('mineflayer-collectblock');
const builder = require('mineflayer-builder');

const HOST = 'dailongsever111.aternos.me';
const PORT = 14483;
const USERNAME = 'BotChongTrom';

let bot;

function createBot() {
  bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
    version: '1.21',
    auth: 'offline'
  });

  // Load plugins
  bot.loadPlugin(pathfinder);
  bot.loadPlugin(collectBlock);
  bot.loadPlugin(builder.plugin);

  attachEvents();
}

function attachEvents() {
  bot.once('spawn', () => {
    console.log(`\nBot ${bot.username} đã vào server! Bắt đầu chơi như người thật...`);
    const mcData = require('minecraft-data')(bot.version);
    const defaultMove = new Movements(bot, mcData);
    bot.pathfinder.setMovements(defaultMove);

    startRealPlayerBehavior();
    startAntiAFK(); // vẫn giữ chống AFK
  });

  // Các event cũ (chat, error, kicked, end) giữ nguyên như trước
  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    console.log(`[Chat] <${username}> ${message}`);
    const msg = (message + '').toLowerCase();
    if (msg.includes('chao') || msg.includes('hi')) bot.chat(`Chào ${username}! Bot đang bận đào khoáng xây nhà đây ❤️`);
  });

  bot.on('error', err => {
    if (err.message.includes('chat format') || err.message.includes('ChatMessage')) return console.log('Bỏ qua lỗi chat 1.21');
    console.log(`Lỗi: ${err.message}`);
    reconnect();
  });

  bot.on('kicked', reason => { console.log(`Bị kick: ${JSON.stringify(reason)}`); reconnect(); });
  bot.on('end', () => { console.log('Mất kết nối → reconnect...'); reconnect(); });
}

// ====================== HÀNH VI NHƯ NGƯỜI THẬT ======================
async function startRealPlayerBehavior() {
  await collectWood(64);     // Chặt cây lấy 64 gỗ
  await mineOres();          // Đào khoáng sản
  await buildSimpleHouse();  // Xây nhà gỗ nhỏ
  bot.chat('Xong nhà rồi! Bot nghỉ tí rồi làm tiếp nha ư ư');
}

// Thu thập gỗ
async function collectWood(amount) {
  bot.chat('Đang đi chặt cây lấy gỗ...');
  const logs = bot.findBlock({ matching: ['oak_log', 'birch_log', 'spruce_log', 'jungle_log', 'acacia_log', 'dark_oak_log'].map(name => bot.mcData.blocksByName[name]?.id).filter(Boolean), maxDistance: 64 });
  if (logs) {
    await bot.collectBlock.collect(logs, { count: amount });
  }
}

// Đào khoáng (ưu tiên diamond > iron > coal > stone)
async function mineOres() {
  bot.chat('Bắt đầu đào khoáng sản...');
  const ores = ['diamond_ore', 'deepslate_diamond_ore', 'iron_ore', 'deepslate_iron_ore', 'coal_ore', 'deepslate_coal_ore', 'stone'];
  for (const oreName of ores) {
    const block = bot.findBlock({ matching: bot.mcData.blocksByName[oreName]?.id, maxDistance: 32 });
    if (block) {
      await bot.collectBlock.collect(block, { count: 32 });
      if (bot.inventory.items().length > 30) break; // đủ đồ thì dừng
    }
  }
}

// Xây nhà gỗ đơn giản 5x5x4 (tường gỗ, cửa sắt, mái gỗ)
async function buildSimpleHouse() {
  bot.chat('Đang xây nhà gỗ nhỏ...');
  const pos = bot.entity.position.offset(5, 0, 5); // xây cách spawn 5 block
  const wood = bot.mcData.blocksByName.oak_planks.id;

  // Tường + sàn
  for (let x = 0; x < 5; x++) {
    for (let z = 0; z < 5; z++) {
      for (let y = 0; y < 4; y++) {
        if (y === 0 || y === 3 || x === 0 || x === 4 || z === 0 || z === 4) {
          if (y === 1 && (x === 2 && z === 0)) continue; // cửa
          await bot.builder.placeBlock(bot.blockAt(pos.offset(x, y, z)), wood);
        }
      }
    }
  }
  // Cửa (iron door) nếu có, hoặc để lỗ
  bot.chat('Nhà xong rồi! Bot siêu pro luôn 😎');
}

// ====================== CHỐNG AFK SIÊU MẠNH (vẫn giữ) ======================
// (Dùng code cũ của bạn, hoặc bản plugin nếu muốn)

// ====================== RECONNECT ======================
let delay = 15000;
function reconnect() {
  if (delay < 120000) delay += Math.random() * 30000;
  const wait = delay + Math.random() * 10000;
  console.log(`Đang đợi ${Math.round(wait/1000)}s reconnect...`);
  setTimeout(() => { delay = 15000; createBot(); }, wait);
}

// Start
createBot();
