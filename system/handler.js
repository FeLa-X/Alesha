const config = require("../settings.js");
const Func = require("../lib/function.js");
const QMess = require("../lib/allfake.js");
const sampah = require("../lib/storage.js")
const serialize = require("../lib/serialize.js");
const Uploader = require("../lib/uploader.js");
const pkg = require("baileys");
const moment = require("moment-timezone");
const cron = require("node-cron");

module.exports = async (m, sock, store) => {
  cron.schedule('*/1 * * * *', () => {
        if (db.list().settings.setbio) {
            sock.updateProfileStatus(`Alesha | 🎯 runtime : ${Func.toDate(process.uptime() * 1000)}`);
        }
    });

  await db.main(m);
  if (db.list().settings.readStatus) {
        if (m.key && m.key.remoteJid == "status@broadcast") {
            await sock.readMessages([m.key]);

            const maxTime = 5 * 60 * 1000;
            const currentTime = Date.now();
            const messageTime = m.messageTimestamp * 1000;
            const timeDiff = currentTime - messageTime;

            if (timeDiff <= maxTime) {
                const emojis = ["😱", "💥", "🚀", "🌟", "😺"];
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                
                try {
                    await sock.sendMessage("status@broadcast", {
                        react: { text: randomEmoji, key: m.key }
                    }, { statusJidList: [m.key.participant] });

                    console.log(chalk.green.bold("– 📸 *Membaca Status WhatsApp dari :* " + m.pushName));
                } catch (error) {
                    console.error('gagal memberi reaksi ke status', error);
                }
            }
            return;
        }
    }
    
  if (m.isBot) return;
  if (db.list().settings.self && !m.isOwner) return;
  if (m.isGroup && db.list().group[m.cht]?.mute && !m.isOwner) return;
  
  if (Object.keys(store.groupMetadata).length === 0) {
    store.groupMetadata = await sock.groupFetchAllParticipating();
  }
  
  const CONFIG = {
  RATE_LIMIT_DELAY: 900000, // 15 menit
  UPDATE_INTERVAL: 600000, // 10 menit
};

const updateGroupMetadata = async sock => {
  try {
    console.log('Fetching group metadata...');
    store.groupMetadata = await sock.groupFetchAllParticipating();
    console.log(`Updated metadata for ${Object.keys(store.groupMetadata).length} groups`);
  } catch (error) {
    console.log(`Error fetching group metadata: ${error.message}`);
    if (error?.data === 429) {
      console.log(`Rate limit hit, retrying in ${CONFIG.RATE_LIMIT_DELAY / 1000}s`);
      setTimeout(() => updateGroupMetadata(sock), CONFIG.RATE_LIMIT_DELAY);
      return;
    }
  }

  setTimeout(() => updateGroupMetadata(sock), CONFIG.UPDATE_INTERVAL);
};

  const isPrems = db.list().user[m.sender].premium.status;
  const isBanned = db.list().user[m.sender].banned.status;
  const isAdmin = m.isAdmin;
  const botAdmin = m.isBotAdmin;
  const Scraper = await scraper.list();
  const usedPrefix = config.prefix.includes(m.prefix);
  const text = m.text;
  const isCmd = m.prefix && usedPrefix;

  if (isCmd) {
    require("./case.js")(m,
      sock,
      config,
      text,
      QMess,
      Func,
      sampah,
      Scraper,
      Uploader,
      store,
      isPrems,
      isAdmin,
      botAdmin,
      isPrems,
      isBanned,
    );
  }
  
  cron.schedule("* * * * *", () => {
    let user = Object.keys(db.list().user);
    let time = moment.tz(config.tz).format("HH:mm");
    if (db.list().settings.resetlimit == time) {
      for (let i of user) {
        db.list().user[i].limit = 100;
      }
    }
  });
  for (let name in pg.plugins) {
    let plugin;
    if (typeof pg.plugins[name].run === "function") {
      let anu = pg.plugins[name];
      plugin = anu.run;
      for (let prop in anu) {
        if (prop !== "code") {
          plugin[prop] = anu[prop];
        }
      }
    } else {
      plugin = pg.plugins[name];
    }
    if (!plugin) return;

    try {
      if (typeof plugin.events === "function") {
        if (
          plugin.events.call(sock, m, {
            sock,
            QMess,
            Func,
            sampah,
            config,
            Uploader,
            store,
            isPrems,
            isAdmin,
            botAdmin,
            isPrems,
            isBanned,
          })
        )
          continue;
      }

      const cmd = usedPrefix
        ? m.command.toLowerCase() === plugin.command ||
          plugin?.alias?.includes(m.command.toLowerCase())
        : "";
      if (cmd) {
        if (plugin.loading) {
           m.react("🕐");
           m.footer(config.messages.wait)
        }
        if (plugin.settings) {
          if (plugin.settings.owner && !m.isOwner) {
            return m.footer(config.messages.owner);
          }
          if (plugin.settings.premium && !isPrems && !m.isOwner) {
            return m.footer(config.messages.premium);
          }
          if (plugin.settings.group && !m.isGroup) {
            return m.footer(config.messages.group);
          }
          if (plugin.settings.admin && !isAdmin) {
            return m.footer(config.messages.admin);
          }
          if (plugin.settings.botAdmin && !botAdmin) {
            return m.footer(config.messages.botAdmin);
          }
        }

        await plugin(m, {
          sock,
          config,
          text,
          plugins: Object.values(pg.plugins).filter((a) => a.alias),
          QMess,
          Func,
          sampah,
          Scraper,
          Uploader,
          store,
          isPrems,
          isAdmin,
          botAdmin,
          isPrems,
          isBanned,
        })
          .then(async (a) => {
            if (plugin?.settings?.limit && !isPrems && !m.isOwner) {
              db.list().user[m.sender].limit -= 1;
              m.footer(
                `> 💡 *Informasi:* Kamu telah menggunakan fitur limit\n> *- Limit kamu saat ini:* ${db.list().user[m.sender].limit} tersisa ☘️\n> *- Catatan:* Limit akan direset pada pukul 02:00 WIB setiap harinya.`,
              );
            }
          });
      }

    } catch (error) {
      if (error.name) {
        for (let owner of config.owner) {
          let jid = await sock.onWhatsApp(owner + "@s.whatsapp.net");
          if (!jid[0].exists) continue;
          let caption = "*– 乂 *Error Terdeteksi* 📉*\n"
          caption += `> *Nama command:* ${m.command}\n`
          caption += `> *Lokasi File:* ${name}`
          caption += `\n\n${Func.jsonFormat(error)}`

          sock.sendMessage(owner + "@s.whatsapp.net", {
            text: caption
          })
        }
        m.reply(Func.jsonFormat(error));
      } else {
        m.reply(Func.jsonFormat(error));
      }
    } finally {
      if (db.list().settings.online) {
        await sock.readMessages([m.key]);
      }
    }
  }
};