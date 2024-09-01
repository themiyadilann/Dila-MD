const { readEnv } = require('../lib/database')
const { cmd, commands } = require('../command')
const os = require("os")
const { runtime } = require('../lib/functions')

cmd({
    pattern: "alive",
    desc: "Check uptime, RAM usage, and more",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const config = await readEnv();

        // Send the image with the status as the caption
        await conn.sendMessage(from, {
            image: { url: config.ALIVE_IMG },
            caption: config.ALIVE_MSG
        }, { quoted: mek || null });

        await conn.sendPresenceUpdate('recording', from);
        
        // Send the audio from the specified path
        const audioPath = '../media/voice/alive.mp3';
        await conn.sendMessage(from, { 
            audio: { url: audioPath }, 
            mimetype: 'audio/mpeg', 
            ptt: true 
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e}`);
    }
});
