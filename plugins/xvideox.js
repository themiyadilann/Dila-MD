const { cmd } = require('../command');
const xvideos = require('xvideosx');

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

//========= XVideos Download Command =========//

cmd({
    pattern: "xvideodl",
    desc: "Download videos from XVideos",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("Please type a URL... 🤖");

        const url = q.trim();
        const details = await xvideos.videos.details({ url });

        let desc = `
*𝗫𝗩𝗶𝗱𝗲𝗼𝘀 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 🎥*

🎶 *𝗧𝗶𝘁𝗹𝗲*: _${details.title}_
⏳ *𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻*: _${details.duration}_
👁️‍🗨️ *𝗩𝗶𝗲𝘄𝘀*: _${formatViews(details.views)}_
🔗 *𝗟𝗶𝗻𝗸*: ${url}

ᵐᵃᵈᵉ ʙʏ ᴍʀᴅɪʟᴀ ᵒᶠᶜ`;

        // Send video details with thumbnail
        await conn.sendMessage(from, { image: { url: details.image }, caption: desc }, { quoted: mek });

        // Download and send video
        const videoUrl = details.files.high;
        await conn.sendMessage(from, { video: { url: videoUrl }, mimetype: "video/mp4" }, { quoted: mek });
        await conn.sendMessage(from, { document: { url: videoUrl }, mimetype: "video/mp4", fileName: `${details.title}.mp4`, caption: "💻 *ᴍᴀᴅᴇ ʙʏ ᴍʀᴅɪʟᴀ*" }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
