const {readEnv} = require('../lib/database')
const {cmd, commands} = require('../command')
const os = require("os")
const {runtime} = require('../lib/functions')

cmd({
    pattern: "alive",
    desc: "Check uptime, RAM usage, and more",
    category: "main",
    filename: __filename
}, async (conn, mek, m, {from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
    try {
    const config = await readEnv();
        // RAM usage
        const totalRAM = Math.round(require('os').totalmem() / 1024 / 1024); // Total RAM in MB
        const usedRAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2); // Used RAM in MB
        const freeRAM = (totalRAM - parseFloat(usedRAM)).toFixed(2); // Free RAM in MB



        // Send the image with the status as the caption
        await conn.sendMessage(from, {
            image: { url: config.ALIVE_IMG },
            caption: config.ALIVE_MSG
        }, { quoted: mek || null });
        
   await conn.sendPresenceUpdate('recording', from);
   await conn.sendMessage(from, { audio: { url: 'https://github.com/themiyadilann/DilaMD-Media/raw/main/voice/alive.mp3' }, mimetype: 'audio/mpeg', ptt: true }, { quoted: mek });

    
} catch (e) {
        console.log(e)
        reply(`Error: ${e}`)
    }
})
