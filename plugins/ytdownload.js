const fs = require('fs');
const path = require('path');
const { cmd } = require('../command');
const fg = require('api-dylux');
const yts = require('yt-search');

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
            await conn.sendPresenceUpdate('recording', from);
            await conn.sendMessage(from, { 
                audio: { url: 'https://github.com/themiyadilann/DilaMD-Media/raw/main/voice/song.mp3' }, 
                mimetype: 'audio/mpeg', 
                ptt: true 
            }, { quoted: mek });
            return;
        }

        const search = await yts(q);
        const data = search.videos[0];
        const url = data.url;

        let desc = `
> *𝗗𝗶𝗹𝗮𝗠𝗗 𝗬𝗼𝘂𝘁𝘂𝗯𝗲 𝗔𝘂𝗱𝗶𝗼 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 🎧*

🎶 *𝗧𝗶𝘁𝗹𝗲*: _${data.title}_
👤 *𝗖𝗵𝗮𝗻𝗻𝗲𝗹*: _${data.author.name}_
📝 *𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻*: _${data.description}_
⏳ *𝗧𝗶𝗺𝗲*: _${data.timestamp}_
⏱️ *𝗔𝗴𝗼*: _${data.ago}_
👁️‍🗨️ *𝗩𝗶𝗲𝘄𝘀*: _${formatViews(data.views)}_
🔗 *𝗟𝗶𝗻𝗸*: ${url}

dilalk.vercel.app
ᵐᵃᵈᵉ ʙʏ ᴍʀᴅɪʟᴀ ᴏғᴄ`;

        // Send video details with thumbnail
        await conn.sendPresenceUpdate('typing', from);
        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        // Download the audio
        let down = await fg.yta(url);
        let downloadUrl = down.dl_url;

        // Store the download URL in a temporary file or cache
        const downloadInfo = {
            type: 'audio',
            url: downloadUrl,
            title: data.title,
            mimetype: "audio/mpeg",
            fileName: `${data.title}.mp3`
        };

        await conn.sendMessage(from, { text: 'Reply with 1 for MP3, 2 for MP3 as document' }, { quoted: mek });

        conn.reply(from, "Awaiting your response...", mek).then(async (resp) => {
            let userResponse = resp.body;

            if (userResponse === '1') {
                await conn.sendMessage(from, { audio: { url: downloadInfo.url }, mimetype: downloadInfo.mimetype }, { quoted: mek });
            } else if (userResponse === '2') {
                await conn.sendMessage(from, { document: { url: downloadInfo.url }, mimetype: downloadInfo.mimetype, fileName: downloadInfo.fileName, caption: "💻 *ᴍᴀᴅᴇ ʙʏ ᴍʀᴅɪʟᴀ*" }, { quoted: mek });
            } else {
                reply("Invalid option.");
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
        if (!q) {
            await conn.sendPresenceUpdate('recording', from);
            await conn.sendMessage(from, { 
                audio: { url: 'https://github.com/themiyadilann/DilaMD-Media/raw/main/voice/video.mp3' }, 
                mimetype: 'audio/mpeg', 
                ptt: true 
            }, { quoted: mek });
            return;
        }

        const search = await yts(q);
        const data = search.videos[0];
        const url = data.url;

        let desc = `
*𝗗𝗶𝗹𝗮𝗠𝗗 𝗬𝗼𝘂𝘁𝘂𝗯𝗲 𝗩𝗶𝗱𝗲𝗼 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 🎥*

🎶 *𝗧𝗶𝘁𝗹𝗲*: _${data.title}_
👤 *𝗖𝗵𝗮𝗻𝗻𝗲𝗹*: _${data.author.name}_
📝 *𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻*: _${data.description}_
⏳ *𝗧𝗶𝗺𝗲*: _${data.timestamp}_
⏱️ *𝗔𝗴𝗼*: _${data.ago}_
👁️‍🗨️ *𝗩𝗶𝗲𝘄𝘀*: _${formatViews(data.views)}_
🔗 *𝗟𝗶𝗻𝗸*: ${url}

dilalk.vercel.app
ᵐᵃᵈᴇ ʙʏ ᴍʀᴅɪʟᴀ ᴏғᴄ`;

        // Send video details with thumbnail
        await conn.sendPresenceUpdate('typing', from);
        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        // Download the video
        let down = await fg.ytv(url);
        let downloadUrl = down.dl_url;

        // Store the download URL in a temporary file or cache
        const downloadInfo = {
            type: 'video',
            url: downloadUrl,
            title: data.title,
            mimetype: "video/mp4",
            fileName: `${data.title}.mp4`
        };

        await conn.sendMessage(from, { text: 'Reply with 3 for MP4, 4 for MP4 as document' }, { quoted: mek });

        conn.reply(from, "Awaiting your response...", mek).then(async (resp) => {
            let userResponse = resp.body;

            if (userResponse === '3') {
                await conn.sendMessage(from, { video: { url: downloadInfo.url }, mimetype: downloadInfo.mimetype }, { quoted: mek });
            } else if (userResponse === '4') {
                await conn.sendMessage(from, { document: { url: downloadInfo.url }, mimetype: downloadInfo.mimetype, fileName: downloadInfo.fileName, caption: "💻 *ᴍᴀᴅᴇ ʙʏ ᴍʀᴅɪʟᴀ*" }, { quoted: mek });
            } else {
                reply("Invalid option.");
            }
        });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
