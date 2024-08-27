const config = require('../config');
const { cmd, commands } = require('../command');
const fg = require('api-dylux');

// Define the YouTube MP3 download command
cmd({
    pattern: "ytmp3",
    desc: "Download YouTube video as MP3",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Check if a URL was provided
        if (!q) {
            return reply('Please provide a YouTube video URL.');
        }

        // Fetch MP3 data from YouTube
        const data = await fg.ytmp3(q);

        // Format the reply
        let replyText = `
*🎵 YouTube MP3 Download 🎵*

🔍 *Title*: _${data.title}_

🕒 *Duration*: _${data.duration}_

🔗 *Download URL*: ${data.dl_link}

dilalk.vercel.app
ᵐᵃᵈᵆ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ`;

        // Send the reply with the thumbnail image
        await conn.sendMessage(from, { image: { url: data.thumb }, caption: replyText }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// Define the YouTube MP4 download command
cmd({
    pattern: "ytmp4",
    desc: "Download YouTube video as MP4",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Check if a URL was provided
        if (!q) {
            return reply('Please provide a YouTube video URL.');
        }

        // Fetch MP4 data from YouTube
        const data = await fg.ytmp4(q);

        // Format the reply
        let replyText = `
*📹 YouTube MP4 Download 📹*

🔍 *Title*: _${data.title}_

🕒 *Duration*: _${data.duration}_

🔗 *Download URL*: ${data.dl_link}

dilalk.vercel.app
ᵐᵃᵈᵆ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ`;

        // Send the reply with the thumbnail image
        await conn.sendMessage(from, { image: { url: data.thumb }, caption: replyText }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
