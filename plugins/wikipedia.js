const config = require('../config');
const { cmd, commands } = require('../command');
const wiki = require('wikipedia');

// Define the Wikipedia search command
cmd({
    pattern: "wiki",
    desc: "Search Wikipedia for information",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Check if a query was provided
        if (!q) {
            return reply('Please provide a search query.');
        }

        // Fetch summary from Wikipedia
        const summary = await wiki.summary(q);
        
        // Format the reply
        let replyText = `
*📚 Wikipedia Summary 📚*

🔍 *Query*: _${q}_

💬 *Title*: _${summary.title}_

📝 *Summary*: _${summary.extract}_

🔗 *URL*: ${summary.content_urls.desktop.page}

dilalk.vercel.app
ᵐᵃᵈᵆ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ`;

        // Send the reply with the thumbnail image
        await conn.sendMessage(from, { image: { url: summary.originalimage.source }, caption: replyText }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
