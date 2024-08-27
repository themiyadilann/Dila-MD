const { cmd } = require('../command');
const youtubedl = require('youtube-dl-exec');
const youtubeSearch = require('youtube-api-v3-search');
const API_KEY = 'AIzaSyDkAicj9h23fQRBng4Q-fzQyp2qG_3Jov8'; // Replace with your YouTube API Key

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

// Voice recording URL
const voiceUrl = 'https://drive.google.com/uc?export=download&id=1_Pd4yQVfofr14xPMIOvebVGwoXh1rohu';

//========= Audio Download Command =========//

cmd({
    pattern: "song",
    desc: "Download songs",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            await conn.sendMessage(from, { audio: { url: voiceUrl }, mimetype: 'audio/mp4', ptt: true }, { quoted: mek });
            return;
        }

        // Search for video using YouTube API
        const searchResults = await youtubeSearch(API_KEY, { q, part: 'snippet', type: 'video', maxResults: 1 });
        const data = searchResults.items[0];
        const url = `https://www.youtube.com/watch?v=${data.id.videoId}`;

        let desc = `
> *𝗗𝗶𝗹𝗮𝗠𝗗 𝗬𝗼𝘂𝘁𝘂𝗯𝗲 𝗔𝘂𝗱𝗶𝗼 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 🎧*

🎶 *𝗧𝗶𝘁𝗹𝗲*: _${data.snippet.title}_
👤 *𝗖𝗵𝗮𝗻𝗻𝗲𝗹*: _${data.snippet.channelTitle}_
📝 *𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻*: _${data.snippet.description}_
⏳ *𝗧𝗶𝗺𝗲*: _${data.snippet.publishedAt}_
👁️‍🗨️ *𝗩𝗶𝗲𝘄𝘀*: _${formatViews(data.statistics.viewCount)}_
🔗 *𝗟𝗶𝗻𝗸*: ${url}

dilalk.vercel.app
ᵐᵃᵈᵉ ʙʏ ᴍʳᴅɪʟᵃ`;

        // Send video details with thumbnail
        await conn.sendMessage(from, { image: { url: data.snippet.thumbnails.high.url }, caption: desc }, { quoted: mek });

        // Download and send audio
        const audioFile = await youtubedl(url, { extractAudio: true, audioFormat: 'mp3' });
        await conn.sendMessage(from, { audio: { url: audioFile }, mimetype: "audio/mpeg" }, { quoted: mek });
        await conn.sendMessage(from, { document: { url: audioFile }, mimetype: "audio/mpeg", fileName: `${data.snippet.title}.mp3`, caption: "💻 *ᴍᴀᴅᴇ ʙʏ ᴍʳᴅɪʟᵃ*" }, { quoted: mek });

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
        if (!q) {
            await conn.sendMessage(from, { audio: { url: voiceUrl }, mimetype: 'audio/mp4', ptt: true }, { quoted: mek });
            return;
        }

        // Search for video using YouTube API
        const searchResults = await youtubeSearch(API_KEY, { q, part: 'snippet', type: 'video', maxResults: 1 });
        const data = searchResults.items[0];
        const url = `https://www.youtube.com/watch?v=${data.id.videoId}`;

        let desc = `
*𝗗𝗶𝗹𝗮𝗠𝗗 𝗬𝗼𝘂𝘁𝘂𝗯𝗲 𝗩𝗶𝗱𝗲𝗼 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 🎥*

🎶 *𝗧𝗶𝘁𝗹𝗲*: _${data.snippet.title}_
👤 *𝗖𝗵𝗮𝗻𝗻𝗲𝗹*: _${data.snippet.channelTitle}_
📝 *𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻*: _${data.snippet.description}_
⏳ *𝗧𝗶𝗺𝗲*: _${data.snippet.publishedAt}_
👁️‍🗨️ *𝗩𝗶𝗲𝘄𝘀*: _${formatViews(data.statistics.viewCount)}_
🔗 *𝗟𝗶𝗻𝗸*: ${url}

dilalk.vercel.app
ᵐᵃᵈᵉ ʙʏ ᴍʳᴅɪʟᵃ`;

        // Send video details with thumbnail
        await conn.sendMessage(from, { image: { url: data.snippet.thumbnails.high.url }, caption: desc }, { quoted: mek });

        // Download and send video
        const videoFile = await youtubedl(url, { extractAudio: false, format: 'mp4' });
        await conn.sendMessage(from, { video: { url: videoFile }, mimetype: "video/mp4" }, { quoted: mek });
        await conn.sendMessage(from, { document: { url: videoFile }, mimetype: "video/mp4", fileName: `${data.snippet.title}.mp4`, caption: "💻 *ᴍᴀᴅᴇ ʙʏ ᴍʳᴅɪʟᵃ*" }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
