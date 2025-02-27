const fs = require("node:fs");

const config = {
  owner: ["6283832242065", "6285882510884"],
  name: "- NekoBot - Alesha",
  sessions: "sessions",
  limit: "100",
  prefix: [".", "?", "!", "/", "#"], // Tambahkan prefix sesuai kebutuhan
  sticker: {
    packname: "✨ NekoPack ✨", 
    author: "🐾 Alesha 🐾", 
  },
  thumbnail: {
    gif: "https://files.catbox.moe/nmgudn.mp4",
    sourceUrl: "https://yandex.com",
    pict: "https://files.catbox.moe/bw9h8j.jpg",
    pict2: "https://files.catbox.moe/4ogh75.jpg"
  },
  id: {
    newsletter: "12036338865549705@newsletter", 
    group: "12036337051558837@g.us" 
  },
  messages: {
    wait: "⏳ *Mohon tunggu sebentar*... Kami sedang memproses permintaan Anda, harap bersabar ya!", 
    owner: "🧑‍💻 *Fitur ini hanya untuk pemilik bot*... Maaf, Anda tidak memiliki akses ke fitur ini.", 
    premium: "🥇 *Upgrade ke Premium* untuk mendapatkan akses ke fitur eksklusif, murah dan cepat! Hubungi admin untuk info lebih lanjut.", 
    group: "👥 *Fitur ini hanya tersedia di grup*... Pastikan Anda berada di grup WhatsApp untuk mengakses fitur ini.",
    admin: "⚠️ *Anda harus menjadi admin grup* untuk menggunakan fitur ini, karena bot memerlukan hak akses admin.", 
    botAdmin: "🛠️ *Jadikan NekoBot sebagai admin* grup untuk menggunakan fitur ini. Pastikan Anda memberikan hak admin kepada bot.", 
  },
  database: "neko-db",
  tz: "Asia/Jakarta",
};

module.exports = config;

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  delete require.cache[file];
});
