const config = require('../config')
const {cmd, commands} = require('../command')
const os = require("os")
const {runtime} = require('../lib/functions')

cmd({
    pattern: "system",
    alias: ["status","botinfo","runtime","uptime"],
    desc: "Check uptime, RAM usage, and more",
    category: "main",
    filename: __filename
}, async (conn, mek, m, {from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
    try {
        const start = Date.now(); // Start time for ping calculation

        // Reply to measure the ping
        const sentMsg = await reply('Calculating ping...');

        const end = Date.now(); // End time after message is sent
        const ping = end - start; // Calculate ping

        // RAM usage
        const totalRAM = Math.round(require('os').totalmem() / 1024 / 1024); // Total RAM in MB
        const usedRAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2); // Used RAM in MB
        const freeRAM = (totalRAM - parseFloat(usedRAM)).toFixed(2); // Free RAM in MB

        const status = `*🕒 Uptime:* ${runtime(process.uptime())}
*💾 RAM Usage:* 
- *Used*: ${usedRAM} MB
- *Free*: ${freeRAM} MB
- *Total*: ${totalRAM} MB
*🏠 HostName:* ${os.hostname()}
*👤 Owner:* ᴹᵃᵈᵉ ᴮʸ ᴹʳᴰⁱˡᵃ
*📶 Ping:* ${ping} ms
`

        // Update the message with the status and ping
        await conn.sendMessage(from, { text: status }, { quoted: sentMsg });
        
    } catch (e) {
        console.log(e)
        reply(`Error: ${e}`)
    }
})
