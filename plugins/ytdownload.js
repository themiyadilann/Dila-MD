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

//========= Command Function ==========//

const downloadMedia = async (conn, from, mek, data, url, type) => {
    try {
        let desc = `
> *𝗗𝗶𝗹𝗮𝗠𝗗 𝗬𝗼𝘂𝘁𝘂𝗯𝗲 ${type === 'audio' ? '𝗔𝘂𝗱𝗶𝗼' : '𝗩𝗶𝗱𝗲𝗼'} 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 🎧*

🎶 *𝗧𝗶𝘁𝗹𝗲*: _${data.title}_
👤 *𝗖𝗵𝗮𝗻𝗻𝗲𝗹*: _${data.author.name}_
📝 *𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻*: _${data.description}_
⏳ *𝗧𝗶𝗺𝗲*: _${data.timestamp}_
⏱️ *𝗔𝗴𝗼*: _${data.ago}_
👁️‍🗨️ *𝗩𝗶𝗲𝘄𝘀*: _${formatViews(data.views)}_
🔗 *𝗟𝗶𝗻𝗸*: ${url}

dilalk.vercel.app
ᵐᵃᵈᵉ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ`;

        await conn.sendPresenceUpdate('typing', from);
        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        let downloadUrl, fileType;

        if (type === 'audio') {
            downloadUrl = (await fg.yta(url)).dl_url;
            fileType = 'audio/mpeg';
        } else if (type === 'video') {
            downloadUrl = (await fg.ytv(url)).dl_url;
            fileType = 'video/mp4';
        }

        await conn.sendMessage(from, {
            text: "Reply with:\n1 - Send MP3\n2 - Send MP3 Document\n3 - Send MP4\n4 - Send MP4 Document"
        }, { quoted: mek });

        conn.ev.on('messages.upsert', async (msg) => {
            const selectedOption = msg.messages[0].message.conversation.trim();

            if (selectedOption === '1') {
                await conn.sendMessage(from, { audio: { url: downloadUrl }, mimetype: fileType }, { quoted: mek });
            } else if (selectedOption === '2') {
                await conn.sendMessage(from, { document: { url: downloadUrl }, mimetype: fileType, fileName: `${data.title}.mp3`, caption: "💻 *ᴍᴀᴅᴇ ʙʏ ᴍʳᴅɪʟᴀ*" }, { quoted: mek });
            } else if (selectedOption === '3') {
                await conn.sendMessage(from, { video: { url: downloadUrl }, mimetype: fileType }, { quoted: mek });
            } else if (selectedOption === '4') {
                await conn.sendMessage(from, { document: { url: downloadUrl }, mimetype: fileType, fileName: `${data.title}.mp4`, caption: "💻 *ᴍᴀᴅᴇ ʙʏ ᴍʳᴅɪʟᴀ*" }, { quoted: mek });
            }
        });
    } catch (e) {
        console.log(e);
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
    downloadMedia(conn, from, mek, data, url, 'audio');
});

//========= Video Download Command =========//

cmd({
    pattern: "video",
    desc: "Download videos",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
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
    downloadMedia(conn, from, mek, data, url, 'video');
});
