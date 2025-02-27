/* Features Play YouTube
 * Fix Code by : KyzmkyzTempest
 */

module.exports = {
  command: "ytmp3",
  alias: ["mp3", "play"],
  category: ["downloader"],
  settings: {
    premium: true,
    limit: true,
  },
  description: "Cari dan unduh audio dari YouTube",
  async run(m, { sock, Func, text, Scraper }) {
    if (!text) {
      return m.reply(
        `╭──[❌ *Masukkan Input yang Valid* ]
᎒⊸ Ketik teks untuk mencari video YouTube, atau masukkan link YouTube yang valid.
᎒⊸ Contoh: *${m.prefix}play Lathi* atau *${m.prefix}play https://youtu.be/abc123*
╰────────────•`,
      );
    }

    m.footer(`╭──[⏳ *Sedang Diproses* ]
᎒⊸ *Mohon tunggu sebentar...*
╰────────────•`);

    
    const data = await Scraper.yt.getAll(text)
    console.log(data)
    if (!data?.search.url) {
      return m.reply(
        `╭──[❌ *Terjadi Kesalahan* ]
᎒⊸ Tidak dapat memproses permintaan Anda. Coba lagi nanti atau gunakan URL lain.
╰────────────•`,
      );
    }
    
    let metadata = data.search;
    delete metadata.thumbnail
    delete metadata.status
      
    let cap = `╭──[🎵 *YouTube - Audio Downloader* ]
 ${Object.entries(metadata)
   .map(([a, b]) => `᎒⊸ *${a.capitalize()}*       : ${b}`)
   .join("\n")}
╰────────────•

📝 *Catatan:*
᎒⊸ Anda akan menerima thumbnail dan file video dari video ini.
᎒⊸ Jika file video tidak terkirim, periksa URL atau coba lagi nanti.
`;

    sock
      .sendMessage(
        m.cht,
        {
          image: { url: metadata.thumbnail },
          caption: cap,
        },
        { quoted: m },
      )
      .then((sent) => {
        sock.sendMessage(
      m.cht,
      {
        audio: {
          url: data.audio,
        },
        mimetype: "audio/mpeg",
      },
      {
        quoted: sent,
      },
    );
      });
  },
};
