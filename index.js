// index.js (Phiên bản HOÀN CHỈNH)

// ----------------------------------------------------
// PHẦN 1: TẠO WEB SERVER ĐỂ TRÁNH BỊ NGỦ ĐÔNG (UPTIME)
// ----------------------------------------------------
const http = require('http');

// Sử dụng cổng của môi trường (ví dụ: Replit) hoặc mặc định là 8080
const PORT_UPTIME = process.env.PORT || 8080; 

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write("Bot Minecraft dang hoat dong va dang duoc ping 24/7!");
  res.end();
}).listen(PORT_UPTIME, () => {
    console.log(`✅ Web Server giữ uptime đã khởi động trên cổng ${PORT_UPTIME}.`);
});

// ----------------------------------------------------
// PHẦN 2: CODE BOT MINEFLAYER
// ----------------------------------------------------
const mineflayer = require('mineflayer')

// >>>>>>> THÔNG TIN SERVER ĐƯỢC CHÈN TRỰC TIẾP VÀO CODE <<<<<<<
const HOST = 'dailongsever111.aternos.me';
const PORT = 14483; // ĐÃ CẬP NHẬT
const USERNAME = 'BotDuSeveruWu'; // ĐÃ CẬP NHẬT
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

console.log(`\nĐang cố gắng kết nối bot ${USERNAME} tới ${HOST}:${PORT}...`)

const options = {
  host: HOST,
  port: PORT,
  username: USERNAME,
  // CHỈ ĐỊNH PHIÊN BẢN ĐỂ TĂNG TÍNH ỔN ĐỊNH VỚI GEUSERMC 1.21
  version: '1.21' 
}

const bot = mineflayer.createBot(options)

// ----------------------------------------------------
// CÁC SỰ KIỆN CỦA BOT
// ----------------------------------------------------

// 1. Kết nối thành công
bot.on('login', () => {
  console.log(`\n🎉 Bot ${bot.username} đã kết nối thành công và đang đứng yên.`)
  // bot.chat('Bot da online!');
})

// 2. Bot nhận tin nhắn chat
bot.on('chat', (username, message) => {
  if (username === bot.username) return 
  console.log(`[Chat]: <${username}> ${message}`)
  
  if (message.toLowerCase() === 'chao') {
    bot.chat(`Chao ban ${username}! Toi la bot dung yen cua server nay.`)
  }
})

// 3. Xử lý lỗi
bot.on('error', err => {
  console.error(`\n❌ LỖI KẾT NỐI: ${err.message}`)
  if (err.message.includes("Invalid credentials") || err.message.includes("Failed to authenticate")) {
      console.error("GỢI Ý: Lỗi này thường xảy ra nếu server là Premium (yêu cầu tài khoản trả phí) hoặc tên bot bị sai.");
  }
})

// 4. Ngắt kết nối
bot.on('end', reason => {
  console.log(`\n🔴 Bot đã bị ngắt kết nối. Lý do: ${reason}.`)
  console.log("Replit sẽ giữ tiến trình chạy, nhưng bot sẽ bị offline cho đến khi bạn khởi động lại hoặc sửa lỗi.");
})
