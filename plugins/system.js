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
        // RAM usage
        const totalRAM = Math.round(require('os').totalmem() / 1024 / 1024); // Total RAM in MB
        const usedRAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2); // Used RAM in MB
        const freeRAM = (totalRAM - parseFloat(usedRAM)).toFixed(2); // Free RAM in MB

        let status = `*🕒 Uptime:*  ${runtime(process.uptime())}
*💾 RAM Usage:* 
- *Used*: ${usedRAM} MB
- *Free*: ${freeRAM} MB
- *Total*: ${totalRAM} MB
*🏠 HostName:* ${os.hostname()}
*👤 Owner:* ᴹᵃᵈᵉ ᴮʸ ᴹʳᴰⁱˡᵃ
`
        return reply(`${status}`)
    } catch (e) {
        console.log(e)
        reply(`Error: ${e}`)
    }
})
