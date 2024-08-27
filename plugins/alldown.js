const config = require('../config');
const { cmd, commands } = require('../command');
const fg = require('api-dylux');
const yts = require('yt-search');

// YouTube Downloader Command
cmd({
    pattern: "yt",
    desc: "Download YouTube video or audio",
    category: "media",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a YouTube video URL.');

        // Download audio (mp3)
        const audioData = await fg.ytmp3(q);
        const videoData = await fg.ytmp4(q); // Download video (mp4)

        // Send video and audio options
        let replyText = `
*📹 YouTube Downloader 📹*

🔗 *URL*: ${q}

*Choose download format:*
1. Audio (mp3)
2. Video (mp4)
        `;

        await conn.sendMessage(from, { text: replyText }, { quoted: mek });

        // Handle user response
        conn.on('message', async (downloadMek) => {
            const chosenOption = downloadMek.body.trim();

            if (chosenOption === '1') {
                // Send audio
                await conn.sendMessage(from, { audio: { url: audioData.url }, mimetype: 'audio/mp4' }, { quoted: downloadMek });
                reply('Audio download complete.');
            } else if (chosenOption === '2') {
                // Send video
                await conn.sendMessage(from, { video: { url: videoData.url }, mimetype: 'video/mp4' }, { quoted: downloadMek });
                reply('Video download complete.');
            } else {
                reply('Invalid choice. Please choose 1 or 2.');
            }
        });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// TikTok Downloader Command
cmd({
    pattern: "tiktok",
    desc: "Download TikTok video",
    category: "media",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a TikTok video URL.');

        // Download TikTok video
        const data = await fg.tiktok(q);

        // Send video
        await conn.sendMessage(from, { video: { url: data.url }, mimetype: 'video/mp4' }, { quoted: mek });
        reply('TikTok download complete.');

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// Instagram Story Downloader Command
cmd({
    pattern: "igstory",
    desc: "Download Instagram story",
    category: "media",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide an Instagram username.');

        // Download Instagram story
        const data = await fg.igstory(q);

        // Send story images or videos
        for (const story of data) {
            if (story.type === 'image') {
                await conn.sendMessage(from, { image: { url: story.url } }, { quoted: mek });
            } else if (story.type === 'video') {
                await conn.sendMessage(from, { video: { url: story.url } }, { quoted: mek });
            }
        }
        reply('Instagram story download complete.');

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// Facebook Video Downloader Command
cmd({
    pattern: "facebook",
    desc: "Download Facebook video",
    category: "media",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a Facebook video URL.');

        // Download Facebook video
        const data = await fg.fbdl(q);

        // Send video
        await conn.sendMessage(from, { video: { url: data.url }, mimetype: 'video/mp4' }, { quoted: mek });
        reply('Facebook video download complete.');

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// Twitter Video Downloader Command
cmd({
    pattern: "twitter",
    desc: "Download Twitter video",
    category: "media",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a Twitter video URL.');

        // Download Twitter video
        const data = await fg.twitter(q);

        // Send video
        await conn.sendMessage(from, { video: { url: data.url }, mimetype: 'video/mp4' }, { quoted: mek });
        reply('Twitter video download complete.');

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// SoundCloud Downloader Command
cmd({
    pattern: "soundcloud",
    desc: "Download SoundCloud track",
    category: "media",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a SoundCloud track URL.');

        // Download SoundCloud track
        const data = await fg.soundcloudDl(q);

        // Send audio
        await conn.sendMessage(from, { audio: { url: data.url }, mimetype: 'audio/mp4' }, { quoted: mek });
        reply('SoundCloud download complete.');

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// Pinterest Search Command
cmd({
    pattern: "pinterest",
    desc: "Search Pinterest for images",
    category: "media",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a search query.');

        const data = await fg.pinterest(q);

        let replyText = `
*🔍 Pinterest Search Results 🔍*

🔍 *Query*: _${q}_

🔗 *Image URLs*: 
${data.map((image, index) => `${index + 1}. ${image.url}`).join('\n')}

dilalk.vercel.app
ᵐᵃᵈᵆ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ`;

        await conn.sendMessage(from, { text: replyText }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// Wallpaper Search Command
cmd({
    pattern: "wallpaper",
    desc: "Search for HD wallpapers",
    category: "media",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a search query.');

        const data = await fg.wallpaper(q);

        let replyText = `
*🔍 Wallpaper Search Results 🔍*

🔍 *Query*: _${q}_

🔗 *Image URLs*: 
${data.map((image, index) => `${index + 1}. ${image.url}`).join('\n')}

dilalk.vercel.app
ᵐᵃᵈᵆ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ`;

        await conn.sendMessage(from, { text: replyText }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// Sticker Search Command
cmd({
    pattern: "stickersearch",
    desc: "Search for stickers",
    category: "media",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a search query.');

        const data = await fg.StickerSearch(q);

        let replyText = `
*🔍 Sticker Search Results 🔍*

🔍 *Query*: _${q}_

🔗 *Sticker URLs*: 
${data.map((sticker, index) => `${index + 1}. ${sticker.url}`).join('\n')}

dilalk.vercel.app
ᵐᵃᵈᵆ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ`;

        await conn.sendMessage(from, { text: replyText }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// npm Search Command
cmd({
    pattern: "npmsearch",
    desc: "Search for npm packages",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a search query.');

        // Search for npm packages
        const data = await fg.npmSearch(q);

        let replyText = `
*🔍 npm Search Results 🔍*

🔍 *Query*: _${q}_

🔗 *Package Information*:
${data.map((pkg, index) => `${index + 1}. *Name*: ${pkg.name}\n   *Version*: ${pkg.version}\n   *Description*: ${pkg.description}\n   *Link*: ${pkg.link}`).join('\n\n')}

dilalk.vercel.app
ᵐᵃᵈᵆ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ`;

        await conn.sendMessage(from, { text: replyText }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// YouTube Search Command using yt-search
cmd({
    pattern: "yts",
    desc: "Search for YouTube videos",
    category: "media",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a search query.');

        const r = await yts(q);

        let replyText = `
*🔍 YouTube Search Results 🔍*

🔍 *Query*: _${q}_

${r.videos.slice(0, 5).map((video, index) => `${index + 1}. *Title*: ${video.title}\n   *Duration*: ${video.timestamp}\n   *Views*: ${video.views}\n   *Link*: ${video.url}`).join('\n\n')}

dilalk.vercel.app
ᵐᵃᵈᵆ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ`;

        await conn.sendMessage(from, { text: replyText }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// YouTube Video Information Command
cmd({
    pattern: "ytinfo",
    desc: "Get information about a YouTube video",
    category: "media",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a YouTube video URL or ID.');

        const video = await yts({ videoId: q });

        let replyText = `
*🎬 YouTube Video Information 🎬*

🔗 *URL*: ${video.url}
🎥 *Title*: ${video.title}
⌛ *Duration*: ${video.duration.timestamp}
👁️ *Views*: ${video.views}
📅 *Uploaded on*: ${video.uploadDate}
📢 *Channel*: ${video.author.name}

dilalk.vercel.app
ᵐᵃᵈᵆ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ`;

        await conn.sendMessage(from, { image: { url: video.thumbnail }, caption: replyText }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// YouTube Playlist Information Command
cmd({
    pattern: "ytplaylist",
    desc: "Get information about a YouTube playlist",
    category: "media",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a YouTube playlist ID.');

        const list = await yts({ listId: q });

        let replyText = `
*🎶 YouTube Playlist Information 🎶*

🔗 *Playlist URL*: ${list.url}
🎵 *Playlist Title*: ${list.title}
🗒️ *Videos in Playlist*:
${list.videos.map((video, index) => `${index + 1}. *Title*: ${video.title} (${video.duration})`).join('\n')}

dilalk.vercel.app
ᵐᵃᵈᵆ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ`;

        await conn.sendMessage(from, { text: replyText }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

module.exports = commands;
