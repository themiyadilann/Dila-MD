const config = require('../config');
const { cmd, commands } = require('../command');
const translate = require('@vitalets/google-translate-api');

// Define the translate command
cmd({
    pattern: "translate",
    desc: "Translate text from one language to another",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Parse the command arguments
        const [text, targetLang] = q.split('|').map(part => part.trim());

        if (!text || !targetLang) {
            return reply('Usage: translate <text> | <target language>');
        }

        // Translate text
        const res = await translate(text, { to: targetLang });
        const translation = res.text;

        // Format the reply
        let replyText = `
*🔤 Translation Result 🔤*

🔍 *Original Text*: _${text}_

🌐 *Target Language*: _${targetLang}_

💬 *Translated Text*: _${translation}_`;

        // Send the translation as a message
        await conn.sendMessage(from, { text: replyText }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
