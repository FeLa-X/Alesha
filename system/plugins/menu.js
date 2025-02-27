const moment = require("moment-timezone");
const pkg = require(process.cwd() + "/package.json");
const axios = require("axios");
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
  command: "menu",
  alias: ["menu", "help"],
  category: ["main"],
  description: "Menampilkan menu bot",
  loading: true,
  async run(m, { sock, plugins, config, QMess, Func, text }) {
    let data = fs.readFileSync(process.cwd() + "/system/case.js", "utf8");
    let casePattern = /case\s+"([^"]+)"/g;
    let matches = data.match(casePattern);
    if (!matches) return m.reply("Tidak ada case yang ditemukan.");
    matches = matches.map((match) => match.replace(/case\s+"([^"]+)"/, "$1"));
    let menu = {};
    plugins.forEach((item) => {
      if (item.category && item.command && item.alias) {
        item.category.forEach((cat) => {
          if (!menu[cat]) {
            menu[cat] = {
              command: [],
            };
          }
          menu[cat].command.push({
            name: item.command,
            alias: item.alias,
            description: item.description,
            settings: item.settings,
          });
        });
      }
    });
    let cmd = 0;
    let alias = 0;
    let pp = await sock
      .profilePictureUrl(m.sender, "image")
      .catch((e) => config.thumbnail.pict);
    Object.values(menu).forEach((category) => {
      cmd += category.command.length;
      category.command.forEach((command) => {
        alias += command.alias.length;
      });
    });
    let premium = db.list().user[m.sender].premium.status;
    let limit = db.list().user[m.sender].limit;

    const header = `☘️ *A L E S H A – B O T*
👋 Hai nama saya Alesha saya adalah asisten bot WhatsApp 
yang akan membantu anda dengan fitur yang sediakan !
─────────────────────────
        `;

    const footer = `
📢 *Jika Anda menemui masalah*
*hubungi developer bot.*
🤖 *Didukung oleh WhatsApp*

> 💬 *Fitur Limit*: ✨
> 💬 *Fitur Premium*: 🌟
─────────────────────────
`;

    if (text === "all") {
      let caption = `${header} 
🎮🎮 *Info Pengguna*:
> - 🧑‍💻 Nama: ${m.pushName}
> - 🏷️ Tag: @${m.sender.split("@")[0]}
> - 🎖️ Status: ${m.isOwner ? "Developer 👑" : premium ? "Premium 🌟" : "Gratis 🤭"}
> - ⚖️ Limit: ${m.isOwner ? "Tidak terbatas 🔥" : limit}

🤖 *Info Bot*:
> - 🏷️ Nama: ${pkg.name}
> - 🔢 Versi: v${pkg.version}
> - 🕰️ Waktu Aktif: ${Func.toDate(process.uptime() * 1000)}
> - 🔑 Prefix: [ ${m.prefix} ]
> - ⚡ Total perintah: ${cmd + alias + matches.length}

  
🛠️ *menu – OTHER* 
${matches.map((a, i) => `> *(${i + 1})* ${m.prefix + a}`).join("\n")}
─────────────────────────
`;

      Object.entries(menu).forEach(([tag, commands]) => {
        caption += `\n🛠️ *Menu – ${tag.toUpperCase()}* 
${commands.command.map((command, index) => `> *(${index + 1})* ${m.prefix + command.name} ${command.settings?.premium ? "🌟" : command.settings?.limit ? "✨" : ""}`).join("\n")}
─────────────────────────
`;
      });

      caption += footer;

      sock.sendMessage(
                m.cht, {
                    video: {
                        url: config.thumbnail.gif,
                    },
                    gifPlayback: true,
                    gifAttribution: ~~(Math.random() * 2),
                    caption: caption,
                    contextInfo: {
                        mentionedJid: sock.parseMention(caption),
                        externalAdReply: {
                            title: "© Alesha | Assistant",
                            body: "🌟 Alesha - New Era.",
                            thumbnailUrl: config.thumbnail.pict,
                            sourceUrl: config.thumbnail.sourceUrl,
                            mediaType: 1,
                            renderLargerThumbnail: true,
                        },
                    },
                }, {
                    quoted: QMess.BotCaption,
                },
            );
    } else if (Object.keys(menu).find((a) => a === text.toLowerCase())) {
      let list = menu[Object.keys(menu).find((a) => a === text.toLowerCase())];
      let caption = `${header}
🎮 *Info Pengguna*:
> - 🧑‍💻 Nama: ${m.pushName}
> - 🏷️ Tag: @${m.sender.split("@")[0]}
> - 🎖️ Status: ${m.isOwner ? "Developer 👑" : premium ? "Premium 🌟" : "Gratis 🤭"}
> - ⚖️ Limit: ${m.isOwner ? "Tidak terbatas 🔥" : limit}

🤖 *Info Bot*:
> - 🏷️ Nama: ${pkg.name}
> - 🔢 Versi: v${pkg.version}
> - 🕰️ Waktu Aktif: ${Func.toDate(process.uptime() * 1000)}
> - 🔑 Prefix: [ ${m.prefix} ]
> - ⚡ Total perintah: ${cmd + alias + matches.length}

─────────────────────────
🛠️ *Menu – ${text.toUpperCase()}*
${list.command
  .map(
    (a, i) =>
      `> *(${i + 1})* ${m.prefix + a.name} ${a.settings?.premium ? "🌟" : a.settings?.limit ? "✨" : ""}`,
  )
  .join("\n")}
─────────────────────────
`;

      caption += footer;

      sock.sendMessage(
                m.cht, {
                    video: {
                        url: config.thumbnail.gif,
                    },
                    gifPlayback: true,
                    gifAttribution: ~~(Math.random() * 2),
                    caption: caption,
                    contextInfo: {
                        mentionedJid: sock.parseMention(caption),
                        externalAdReply: {
                            title: "© Alesha | Assistant",
                            body: "🌟 Alesha - New Era.",
                            thumbnailUrl: config.thumbnail.pict,
                            sourceUrl: config.thumbnail.sourceUrl,
                            mediaType: 1,
                            renderLargerThumbnail: true,
                        },
                    },
                }, {
                    quoted: QMess.payment(m),
                },
            );
    } else {
      let list = Object.keys(menu);
      let caption = `${header}
🎮 *Info Pengguna*:
> - 🧑‍💻 Nama: ${m.pushName}
> - 🏷️ Tag: @${m.sender.split("@")[0]}
> - 🎖️ Status: ${m.isOwner ? "Developer 👑" : premium ? "Premium 🌟" : "Gratis 🤭"}
> - ⚖️ Limit: ${m.isOwner ? "Tidak terbatas 🔥" : limit}

🤖 *Info Bot*:
> - 🏷️ Nama: ${pkg.name}
> - 🔢 Versi: v${pkg.version}
> - 🕰️ Waktu Aktif: ${Func.toDate(process.uptime() * 1000)}
> - 🔑 Prefix: [ ${m.prefix} ]
> - ⚡ Total perintah: ${cmd + alias + matches.length}

─────────────────────────
🗂️ *Daftar Menu*:
> *(all)* ${m.prefix}menu all
${list.map((a) => `> *(${a})* ${m.prefix}menu ${a}`).join("\n")}

─────────────────────────
`;

      caption += footer;

        sock.sendMessage(
                m.cht, {
                    video: {
                        url: config.thumbnail.gif,
                    },
                    gifPlayback: true,
                    gifAttribution: ~~(Math.random() * 2),
                    caption: caption,
                    contextInfo: {
                        mentionedJid: sock.parseMention(caption),
                        externalAdReply: {
                            title: "© Alesha | Assistant",
                            body: "🌟 Alesha - New Era.",
                            thumbnailUrl: config.thumbnail.pict,
                            sourceUrl: config.thumbnail.sourceUrl,
                            mediaType: 1,
                            renderLargerThumbnail: true,
                        },
                    },
                }, {
                    quoted: QMess.payment(m),
                },
            );
    }
  },
};
