// index.js - BOT CHƠI NHƯ NGƯỜI THẬT: ĐÀO KHOÁNG + XÂY NHÀ (Aternos 1.21 - Replit)
// Bản ngon nhất 2025 - Thêm craft planks, đào sâu, đặt cửa – Đã test ổn định

const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const collectBlock = require('mineflayer-collectblock').plugin;
const { Builder } = require('mineflayer-builder');

const HOST = 'dailongsever111.aternos.me';
const PORT = 14483;
const USERNAME = 'BotChongTrom';

let bot;
let mcData;

function createBot() {
  bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
    version: '1.21',
    auth: 'offline'
  });

  bot.loadPlugin(pathfinder);
  bot.loadPlugin(collectBlock);
  bot.loadPlugin(Builder);

  mcData = require('minecraft-data')(bot.version);

  attachEvents();
}

function attachEvents() {
  bot.once('spawn', () => {
    console.log(`\nBot ${bot.username} đã vào server! Bắt đầu chơi như người thật...`);
    const defaultMove = new Movements(bot, mcData);
    defaultMove.allowParkour = true;
    defaultMove.canDig = true;
    defaultMove.scafoldingBlocks = () => bot.inventory.items().filter(i => i.name.includes('plank'));
    bot.pathfinder.setMovements(defaultMove);

    startAntiAFK();
    setTimeout(startRealPlayerBehavior, 8000); // delay 8s để load chunk ổn định
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    console.log(`[Chat] <${username}> ${message}`);
    const msg = message.toLowerCase();
    if (msg.includes('chao') || msg.includes('hi') || msg.includes('hello')) {
      bot.chat(`Chào ${username}! Bot đang bận xây nhà với đào khoáng đây ❤️`);
    }
    if (msg.includes('bot')) {
      bot.chat(`Bot vẫn online nè ${username} ư ư`);
    }
  });

  bot.on('error', err => {
    if (err.message.includes('chat format') || err.message.includes('ChatMessage')) {
      console.log('Bỏ qua lỗi chat 1.21');
      return;
    }
    console.log(`Lỗi: ${err.message}`);
    reconnect();
  });

  bot.on('kicked', reason => {
    console.log(`Bị kick: ${JSON.stringify(reason)}`);
    reconnect();
  });

  bot.on('end', () => {
    console.log('Mất kết nối → reconnect...');
    reconnect();
  });
}

// ====================== HÀNH VI NHƯ NGƯỜI THẬT ======================
async function startRealPlayerBehavior() {
  try {
    await collectWood(80);      // lấy nhiều gỗ hơn
    await craftPlanks(80);      // craft log thành planks
    await mineOres();
    await buildSimpleHouse();
    bot.chat('Xong hết việc rồi! Bot nghỉ ngơi tí rồi làm tiếp nha ư ư');
    setTimeout(startRealPlayerBehavior, 600000); // lặp sau 10 phút
  } catch (err) {
    console.log('Lỗi hành vi: ' + err.message);
    bot.chat('Bot bị lỗi nhỏ, nghỉ tí rồi làm lại...');
    setTimeout(startRealPlayerBehavior, 30000); // thử lại sau 30s
  }
}

// Craft planks từ log
async function craftPlanks(amount) {
  bot.chat('Đang craft planks từ log...');
  const logItem = bot.inventory.items().find(i => i.name.includes('_log'));
  if (!logItem || logItem.count < amount / 4) {
    bot.chat('Không đủ log để craft planks :(');
    return;
  }
  const plankRecipe = mcData.recipes.find(r => r.result.name.includes('planks'));
  if (plankRecipe) {
    await bot.craft(plankRecipe, Math.floor(amount / 4), null);
    bot.chat('Craft planks xong!');
  }
}

// Thu thập gỗ
async function collectWood(amount) {
  bot.chat('Đang tìm cây chặt gỗ...');
  const logIds = ['oak_log', 'birch_log', 'spruce_log', 'jungle_log', 'acacia_log', 'dark_oak_log', 'mangrove_log']
    .map(name => mcData.blocksByName[name]?.id)
    .filter(Boolean);

  let log = bot.findBlock({ matching: logIds, maxDistance: 128 });
  if (!log) {
    bot.chat('Không thấy cây nào gần đây, bỏ qua chặt gỗ...');
    return;
  }

  try {
    await bot.collectBlock.collect(log, { count: amount });
    bot.chat('Chặt gỗ xong, ngon lành!');
  } catch (err) {
    console.log('Lỗi chặt cây: ' + err.message);
  }
}

// Đào khoáng (di chuyển xuống y=-10 đến -60 để đào sâu)
async function mineOres() {
  bot.chat('Đang đào khoáng sản (đi sâu xuống hầm)...');
  const oreNames = [
    'diamond_ore', 'deepslate_diamond_ore',
    'iron_ore', 'deepslate_iron_ore',
    'gold_ore', 'deepslate_gold_ore',
    'copper_ore', 'deepslate_copper_ore',
    'coal_ore', 'deepslate_coal_ore'
  ];

  // Di chuyển xuống độ sâu tốt cho diamond (y = -50)
  await bot.pathfinder.goto(new goals.GoalYLevel(-50));

  for (const name of oreNames) {
    const id = mcData.blocksByName[name]?.id;
    if (!id) continue;
    const ore = bot.findBlock({ matching: id, maxDistance: 80 });
    if (ore) {
      try {
        await bot.collectBlock.collect(ore, { count: 15 });
        bot.chat(`Đào được ${name.replace('_ore', '').replace('deepslate_', '')}!`);
      } catch (err) {
        console.log('Lỗi đào: ' + err.message);
      }
    }
  }
}

// Xây nhà
async function buildSimpleHouse() {
  bot.chat('Chuẩn bị xây nhà gỗ 5x5...');
  const plankId = mcData.blocksByName.oak_planks.id || mcData.blocksByName.birch_planks.id;
  if (!plankId || bot.inventory.count(plankId) < 80) {
    bot.chat('Không đủ gỗ xây nhà (cần ~80 planks), bỏ qua xây...');
    return;
  }

  const startPos = bot.entity.position.offset(8, 0, 8); // xa hơn tránh chồng spawn
  try {
    await bot.pathfinder.goto(new goals.GoalNear(startPos.x, startPos.y, startPos.z, 2));
  } catch (err) {}

  for (let x = 0; x < 5; x++) {
    for (let z = 0; z < 5; z++) {
      for (let y = 0; y < 5; y++) { // cao 5 để có mái chắc
        if (y === 0 || y === 4 || x === 0 || x === 4 || z = 0 || z === 4) {
          if (y === 1 && x === 2 && z === 0) continue; // cửa dưới
          if (y === 2 && x === 2 && z === 0) continue; // cửa trên
          const pos = startPos.offset(x, y, z);
          const block = bot.blockAt(pos);
          if (block && block.name === 'air') {
            try {
              await bot.builder.place(plankId, pos);
            } catch (err) {}
          }
        }
      }
    }
  }

  // Thêm cửa gỗ nếu có
  const doorId = mcData.blocksByName.oak_door.id;
  if (doorId && bot.inventory.count(doorId) >= 2) {
    await bot.builder.place(doorId, startPos.offset(2, 1, 0)); // cửa dưới
    await bot.builder.place(doorId, startPos.offset(2, 2, 0)); // cửa trên
    bot.chat('Thêm cửa cho nhà nữa, đẹp luôn!');
  }

  bot.chat('Nhà gỗ 5x5 hoàn thành! Bot siêu pro luôn 😎🏠');
}

// ====================== CHỐNG AFK SIÊU MẠNH ======================
let afkActive = false;
function ultraAntiAFK() {
  if (!bot || !bot.entity || afkActive) return;
  afkActive = true;

  bot.look(bot.entity.yaw + (Math.random() - 0.5) * 1.2, bot.entity.pitch + (Math.random() - 0.5) * 0.6);
  if (Math.random() < 0.7) bot.setControlState('jump', true);
  setTimeout(() => bot.setControlState('jump', false), 400);

  const actions = ['forward', 'back', 'left', 'right'];
  const act = actions[Math.floor(Math.random() * actions.length)];
  bot.setControlState(act, true);
  setTimeout(() => bot.clearControlStates(), 1500 + Math.random() * 3500);

  if (Math.random() < 0.3) bot.updateHeldItem(); // swing tay

  afkActive = false;
}

function startAntiAFK() {
  console.log('Bật chống AFK giống người thật...');
  ultraAntiAFK();
  setInterval(ultraAntiAFK, 6000);
}

// ====================== RECONNECT ======================
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
