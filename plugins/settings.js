const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "settings",
    desc: "Check bot online or not.",
    category: "main",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        return await conn.sendMessage(from, {
            image: { url: 'https://telegra.ph/file/959a00b8f92106a8856de.jpg' },
            caption: 'hi, setting now karanna'
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
