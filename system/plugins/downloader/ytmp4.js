/* Features Play YouTube
 * Fix Code by : KyzmkyzTempest
 */

module.exports = {
  command: "ytmp4",
  alias: ["mp4", "ytv"],
  category: ["downloader"],
  settings: {
    limit: true,
  },
  description: "Cari dan unduh audio dari YouTube",
  async run(m, { sock, Func, text }) {
    if (!text) {
      return m.reply(
        `╭──[❌ *Masukkan Input yang Valid* ]
᎒⊸ Ketik teks untuk mencari video YouTube, atau masukkan link YouTube yang valid.
᎒⊸ Contoh: *${m.prefix}play Lathi* atau *${m.prefix}play https://youtu.be/abc123*
╰────────────•`,
      );
    }

    m.reply(`╭──[⏳ *Sedang Diproses* ]
᎒⊸ *Mohon tunggu sebentar...*
╰────────────•`);

    let isUrl = Func.isUrl(text);
    let videoUrl;
    let videoUrls;

    if (isUrl) {
      videoUrl = isUrl[0];
    } else {
      let searchResult = await Func.fetchJson("https://www.api.im-rerezz.xyz/api/ytplaymp3?query=", text);
      let result = searchResult.result;
      if (!searchResult?.result) {
        return m.reply(
          `╭──[❌ *Hasil Tidak Ditemukan* ]
᎒⊸ Tidak ada video ditemukan dengan kata kunci *"${text}"*. Coba gunakan kata kunci lain!
╰────────────•`,
        );
      }
      videoUrl = result.metadata.url;
      videoUrls = result.download.url;
    }

    let data = await Func.fetchJson("https://www.api.im-rerezz.xyz/api/ytmp4?url=", videoUrl)

    if (!data?.result) {
      return m.reply(
        `╭──[❌ *Terjadi Kesalahan* ]
᎒⊸ Tidak dapat memproses permintaan Anda. Coba lagi nanti atau gunakan URL lain.
╰────────────•`,
      );
    }

    let metadata = data.result.metadata;

    let cap = `╭──[🎵 *YouTube - Audio Downloader* ]
 ${Object.entries(metadata)
   .map(([a, b]) => `᎒⊸ *${a.capitalize()}*       : ${b}`)
   .join("\n")}
╰────────────•

📝 *Catatan:*
᎒⊸ Anda akan menerima thumbnail dan file video dari video ini.
᎒⊸ Jika file video tidak terkirim, periksa URL atau coba lagi nanti.

🔗 *Link Video*: ${videoUrl}
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
          m.cht, {
              video: videoUrls,
          }, {
              quoted: sent
          },
      );
      });
  },
};
