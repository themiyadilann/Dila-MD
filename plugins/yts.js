const { cmd } = require('../command');
const yts = require('yt-search');
const fs = require('fs');
const ytdl = require('ytdl-core'); // Make sure to install this package

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

//========= YTS Search Command for 100 Videos =========//

cmd({
    pattern: "yts",
    desc: "Search and display up to 100 YouTube video details",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("Please type a Name or Url... 🤖");

        const search = await yts(q);
        const videos = search.videos.slice(0, 100); // Get only the first 100 videos

        if (videos.length === 0) return reply("No videos found for your query.");

        let message = `*𝗗𝗶𝗹𝗮𝗠𝗗 𝗬𝗼𝘂𝘁𝘂𝗯𝗲 𝗦𝗲𝗮𝗿𝗰𝗵 𝗥𝗲𝘀𝘂𝗹𝘁 🎥*\n\n`;

        videos.forEach((data, index) => {
            message += `*No - ${index + 1} ⤵*\n`;
            message += `🎶 *𝗧𝗶𝘁𝗹𝗲*: _${data.title}_\n`;
            message += `👤 *𝗖𝗵𝗮𝗻𝗻𝗲𝗹*: _${data.author.name}_\n`;
            message += `📝 *𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻*: _${data.description}_\n`;
            message += `⏳ *𝗧𝗶𝗺𝗲*: _${data.timestamp}_\n`;
            message += `⏱️ *𝗔𝗴𝗼*: _${data.ago}_\n`;
            message += `👁️‍🗨️ *𝗩𝗶𝗲𝘄𝘀*: _${formatViews(data.views)}_\n`;
            message += `🔗 *𝗟𝗶𝗻𝗸*: ${data.url}\n\n`;
        });

        message += "Reply with the video number to download.\n\n";
        message += "dilalk.vercel.app\nᵐᵃᵈᵉ ʙʏ ᴍʀᴅɪʟᴀ ᵒᶠᶜ";

        // Send the video details
        await conn.sendMessage(from, { text: message }, { quoted: mek });

        // Store videos in the chat context to use later
        conn.chatContext[from] = { videos };

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

//========= Handle Video Download =========//

cmd({
    pattern: "download",
    desc: "Download the selected YouTube video",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!conn.chatContext[from] || !conn.chatContext[from].videos) return reply("No video search results found.");

        const videoIndex = parseInt(q) - 1;
        const videos = conn.chatContext[from].videos;

        if (isNaN(videoIndex) || videoIndex < 0 || videoIndex >= videos.length) {
            return reply("Invalid video number. Please reply with a number from the search results.");
        }

        const video = videos[videoIndex];
        const videoUrl = video.url;

        // Download the video
        const downloadStream = ytdl(videoUrl, { quality: 'highest' });
        const fileName = `${video.title}.mp4`;
        const fileStream = fs.createWriteStream(fileName);

        downloadStream.pipe(fileStream);

        fileStream.on('finish', async () => {
            await conn.sendMessage(from, { text: `Download complete: ${fileName}` }, { quoted: mek });
            fs.unlinkSync(fileName); // Optionally remove the file after sending
        });

        fileStream.on('error', (err) => {
            console.log(err);
            reply(`Error: ${err.message}`);
        });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
