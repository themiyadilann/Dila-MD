const config = require('../config')
const {cmd, commands} = require('../command')

cmd({
    pattern: "dilo",
    desc: "Check bot online or no.",
    category: "main",
    filename: __filename
},
async(conn, mek, m, {from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
    try {
        return await conn.sendMessage(
            from,
            {
                video: {url: config.DILO_VIDEO}, // Set the video URL
                caption: config.DILO_MSG         // Add the caption
            },
            {quoted: mek}
        )
    } catch(e) {
        console.log(e)
        reply(`${e}`)
    }
})
