const config = require("../settings.js");
const moment = require("moment-timezone");

const quoted = {
    fkon: (m) => {
      return {
        key: {
            fromMe: false,
            participant: m.sender,
            ...(m.chat ? {
                remoteJid: 'BROADCAST GROUP'
            } : {})
        },
        message: {
            contactMessage: {
                displayName: `${m.pushName}`,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${m.pushName}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        }
      }
    },

    BotCaption: {
        key: {
            remoteJid: "status@broadcast",
            participant: "0@s.whatsapp.net",
            fromMe: false,
            id: "",
        },
        message: {
            conversation: "Alesha New Era 🌟",
        },
    },

    fakeVerif: {
        key: {
            participant: '0@s.whatsapp.net',
            remoteJid: "0@s.whatsapp.net"
        },
        message: {
            conversation: `_Terverifikasi Oleh WhatsApp_`
        }
    },

    fakestatus: (teks) => {
        return {
            key: {
                remoteJid: "status@broadcast",
                participant: "0@s.whatsapp.net",
                fromMe: false,
                id: "",
            },
            message: {
                conversation: teks,
            },
        };
    },

    fakeig: {
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true,
                title: config.sticker.author,
                body: ucapan(),
                thumbnailUrl: config.thumbnail.pict,
                sourceUrl: config.thumbnail.sourchUrl
            }
        }
    },

    fakePay: {
        key: {
            remoteJid: '0@s.whatsapp.net',
            fromMe: false,
            id: "",
            participant: '0@s.whatsapp.net'
        },
        message: {
            requestPaymentMessage: {
                currencyCodeIso4217: "USD",
                amount1000: 999999999,
                requestFrom: '0@s.whatsapp.net',
                noteMessage: {
                    extendedTextMessage: {
                        text: config.name
                    }
                },
                expiryTimestamp: 999999999,
                amount: {
                    value: 91929291929,
                    offset: 1000,
                    currencyCode: "INR"
                }
            }
        }
    },

    payment: (m) => {
      return {
        key: {
            remoteJid: "0@s.whatsapp.net",
            fromMe: false
        },
        message: {
            requestPaymentMessage: {
                currencyCodeIso4217: "USD",
                amount1000: "99999999999",
                requestFrom: "0@s.whatsapp.net",
                noteMessage: {
                    extendedTextMessage: {
                        text: `${m.pushName}-san 🐼`,
                        contextInfo: {
                            mentionedJid: [`${m.sender}`]
                        }
                    }
                },
                expiryTimestamp: "0",
                amount: {
                    value: "99999999999",
                    offset: 1000,
                    currencyCode: "USD"
                }
            }
        }
      }
    },

    ephemeral: '86400',

    ucapan: ucapan(),

    adReply: (sock) => {
      return {
        contextInfo: {
            mentionedJid: sock.parseMention(m.text),
            groupMentions: [],
            forwardingScore: 9999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: ids,
                serverMessageId: 103,
                newsletterName: `${config.name} || Don't forget to Follow ⤵`
            },
        }
      }
    }
}

function date() {
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    let week = d.toLocaleDateString(locale, {
        weekday: 'long'
    })
    let date = d.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
    let tgl = `${week}, ${date}`
    return tgl
}

function ucapan() {
    const time = moment.tz('Asia/Jakarta').format('HH')
    let res = "Selamat malam 🌙"
    if (time >= 4) {
        res = "Selamat pagi 🌄"
    }
    if (time > 10) {
        res = "Selamat siang ☀️"
    }
    if (time >= 15) {
        res = "Selamat sore 🌇"
    }
    if (time >= 18) {
        res = "Selamat malam 🌙"
    }
    return res
}

function pickRandom(list) {
    return list[Math.floor(list.length * Math.random())]
}

function frezeDate() {
    let duration = new Date(new Date + 3600000)
    var date = new Date(duration);
    var hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    var bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    var tanggal = date.getDate();
    var bulanIndex = date.getMonth();
    var tahun = date.getFullYear();
    var hariIndex = date.getDay();
    return {
        Tanggal: tanggal,
        Bulan: bulan[bulanIndex],
        Tahun: tahun,
        Hari: hari[hariIndex],
    }
}

function frezeTime() {
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    let duration = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta"
    });
    var date = new Date(duration);
    var jam = date.getHours();
    var menit = date.getMinutes();
    var detik = date.getSeconds();
    return {
        Jam: jam,
        Menit: menit,
        Detik: detik,
    }
}

module.exports = quoted