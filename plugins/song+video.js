const { cmd } = require('../command');
const fg = require('api-dylux');
const yts = require('yt-search');
const { MessageActionRow, MessageButton } = require('discord.js'); // Adjust according to your library

// Helper function to format views
const formatViews = (views) => {
    if (views >= 1_000_000_000) {
        return `${(views / 1_000_000_000).toFixed(1)}B`;
    } else if (views >= 1_000_000) {
        return `${(views / 1_000_000).toFixed(1)}M`;
    } else if (views >= 1_000) {
        return `${(views / 1_000).toFixed(1)}K`;
    } else {
        return views.toString();
    }
};

// Helper function to truncate text
const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '... (Read more)' : text;
};

//========= Audio Download Command =========//

cmd({
    pattern: "song",
    desc: "Download songs",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("Please type a Name or Url... 🤖");

        const search = await yts(q);
        const data = search.videos[0];
        const url = data.url;

        const fullDesc = `
> *𝗗𝗶𝗹𝗮𝗠𝗗 𝗬𝗼𝘂𝘁𝘂𝗯𝗲 𝗔𝘂𝗱𝗶𝗼 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 🎧*

🎶 *𝗧𝗶𝘁𝗹𝗲*: _${data.title}_
👤 *𝗖𝗵𝗮𝗻𝗻𝗲𝗹*: _${data.author.name}_
📝 *𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻*: _${data.description}_
⏳ *𝗧𝗶𝗺𝗲*: _${data.timestamp}_
⏱️ *𝗔𝗴𝗼*: _${data.ago}_
👁️‍🗨️ *𝗩𝗶𝗲𝘄𝘀*: _${formatViews(data.views)}_
🔗 *𝗟𝗶𝗻𝗸*: ${url}

dilalk.vercel.app
ᵐᵃᵈᵉ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ
`;

        // Define the buttons
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('download_audio')
                    .setLabel('Download Audio')
                    .setStyle('PRIMARY')
            );

        // Send video details with thumbnail and button
        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: truncatedDesc, components: [row] }, { quoted: mek });

        // Send full description in a follow-up message
        await conn.sendMessage(from, fullDesc, { quoted: mek });

        // Handle button interaction
        conn.on('interactionCreate', async interaction => {
            if (!interaction.isButton()) return;

            if (interaction.customId === 'download_audio') {
                // Download and send audio
                let down = await fg.yta(url);
                let downloadUrl = down.dl_url;
                await interaction.reply({ content: "Downloading audio...", ephemeral: true });
                await conn.sendMessage(from, { audio: { url: downloadUrl }, mimetype: "audio/mpeg" }, { quoted: mek });
                await conn.sendMessage(from, { document: { url: downloadUrl }, mimetype: "audio/mpeg", fileName: `${data.title}.mp3`, caption: "💻 *ᴍᴀᴅᴇ ʙʏ ᴍʳᴅɪʟᴀ*" }, { quoted: mek });
            }
        });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

//========= Video Download Command =========//

cmd({
    pattern: "video",
    desc: "Download videos",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("Please type a Name or Url... 🤖");

        const search = await yts(q);
        const data = search.videos[0];
        const url = data.url;

        const fullDesc = `
*𝗗𝗶𝗹𝗮𝗠𝗗 𝗬𝗼𝘂𝘁𝘂𝗯𝗲 𝗩𝗶𝗱𝗲𝗼 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 🎥*

🎶 *𝗧𝗶𝘁𝗹𝗲*: _${data.title}_
👤 *𝗖𝗵𝗮𝗻𝗻𝗲𝗹*: _${data.author.name}_
📝 *𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻*: _${data.description}_
⏳ *𝗧𝗶𝗺𝗲*: _${data.timestamp}_
⏱️ *𝗔𝗴𝗼*: _${data.ago}_
👁️‍🗨️ *𝗩𝗶𝗲𝘄𝘀*: _${formatViews(data.views)}_
🔗 *𝗟𝗶𝗻𝗸*: ${url}

dilalk.vercel.app
ᵐᵃᵈᵉ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ
`;


        // Define the buttons
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('download_video')
                    .setLabel('Download Video')
                    .setStyle('PRIMARY')
