const config = require('../config');
const { cmd, commands } = require('../command');
const fg = require('api-dylux');

// Define the YouTube MP3 download command
cmd({
    pattern: "song",
    desc: "Download YouTube video as MP3",
    category: "downloader",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a YouTube video URL.');
        const data = await fg.ytmp3(q);
        const replyText = `
*🎵 YouTube MP3 Download 🎵*

🔍 *Title*: _${data.title}_

🕒 *Duration*: _${data.duration}_

🔗 *Download URL*: ${data.dl_link}

dilalk.vercel.app
ᵐᵃᵈᵆ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ`;
        await conn.sendMessage(from, { image: { url: data.thumb }, caption: replyText }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// Define the YouTube MP4 download command
cmd({
    pattern: "video",
    desc: "Download YouTube video as MP4",
    category: "downloader",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a YouTube video URL.');
        const data = await fg.ytmp4(q);
        const replyText = `
*📹 YouTube MP4 Download 📹*

🔍 *Title*: _${data.title}_

🕒 *Duration*: _${data.duration}_

🔗 *Download URL*: ${data.dl_link}

dilalk.vercel.app
ᵐᵃᵈᵆ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ`;
        await conn.sendMessage(from, { image: { url: data.thumb }, caption: replyText }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// Define the TikTok download command
cmd({
    pattern: "tiktok",
    desc: "Download TikTok video",
    category: "downloader",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a TikTok video URL.');
        const data = await fg.tiktok(q);
        const replyText = `
*🎶 TikTok Video Download 🎶*

🔍 *Title*: _${data.title}_

🔗 *Download URL*: ${data.url}

dilalk.vercel.app
ᵐᵃᵈᵆ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ`;
        await conn.sendMessage(from, { video: { url: data.url }, caption: replyText }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// Define the Instagram Story download command
cmd({
    pattern: "instagram",
    desc: "Download Instagram stories",
    category: "downloader",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide an Instagram username.');
        const data = await fg.igstory(q);
        const replyText = `
*📸 Instagram Story Download 📸*

🔍 *Username*: _${q}_

🔗 *Story URLs*: 
${data.map((story, index) => `${index + 1}. ${story.url}`).join('\n')}

dilalk.vercel.app
ᵐᵃᵈᵆ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ`;
        await conn.sendMessage(from, { text: replyText }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// Define the Facebook video download command
cmd({
    pattern: "fb",
    desc: "Download Facebook video",
    category: "downloader",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a Facebook video URL.');
        const data = await fg.fbdl(q);
        const replyText = `
*📘 Facebook Video Download 📘*

🔍 *Title*: _${data.title}_

🔗 *Download URL*: ${data.dl_link}

dilalk.vercel.app
ᵐᵃᵈᵆ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ`;
        await conn.sendMessage(from, { video: { url: data.dl_link }, caption: replyText }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// Define the Twitter video download command
cmd({
    pattern: "twitter",
    desc: "Download Twitter video",
    category: "downloader",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a Twitter video URL.');
        const data = await fg.twitter(q);
        const replyText = `
*🐦 Twitter Video Download 🐦*

🔍 *Title*: _${data.title}_

🔗 *Download URL*: ${data.dl_link}

dilalk.vercel.app
ᵐᵃᵈᵆ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ`;
        await conn.sendMessage(from, { video: { url: data.dl_link }, caption: replyText }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// Define the SoundCloud download command
cmd({
    pattern: "soundcloud",
    desc: "Download SoundCloud track",
    category: "downloader",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a SoundCloud track URL.');
        const data = await fg.soundcloudDl(q);
        const replyText = `
*🎧 SoundCloud Track Download 🎧*

🔍 *Title*: _${data.title}_

🔗 *Download URL*: ${data.url}

dilalk.vercel.app
ᵐᵃᵈᵆ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ`;
        await conn.sendMessage(from, { audio: { url: data.url }, caption: replyText }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// Define the Pinterest search command
cmd({
    pattern: "pinterest",
    desc: "Search Pinterest for images",
    category: "search",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a search query.');
        const data = await fg.pinterest(q);
        const replyText = `
*🔍 Pinterest Image Search 🔍*

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

// Define the HD Wallpaper search command
cmd({
    pattern: "wallpaper",
    desc: "Search for HD wallpapers",
    category: "search",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a search query.');
        const data = await fg.wallpaper(q);
        const replyText = `
*🖼️ HD Wallpaper Search 🖼️*

🔍 *Query*: _${q}_

🔗 *Image URLs*: 
${data.map((image, index).join('\n')}

dilalk.vercel.app
ᵐᵃᵈᵆ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ`;
        await conn.sendMessage(from, { text: replyText }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// Define the Sticker Search command
cmd({
    pattern: "stickersearch",
    desc: "Search for stickers",
    category: "search",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a search query.');
        const data = await fg.StickerSearch(q);
        const replyText = `
*🔍 Sticker Search 🔍*

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

// Define the NPM Package Search command
cmd({
    pattern: "npmsearch",
    desc: "Search for NPM packages",
    category: "search",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a package name to search.');
        const data = await fg.npmSearch(q);
        const replyText = `
*📦 NPM Package Search 📦*

🔍 *Query*: _${q}_

🔗 *Package URLs*: 
${data.map((pkg, index) => `${index + 1}. ${pkg.name} - ${pkg.link}`).join('\n')}

dilalk.vercel.app
ᵐᵃᵈᵆ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ`;
        await conn.sendMessage(from, { text: replyText }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// Define the YouTube MP3 (Alternative) download command
cmd({
    pattern: "yta",
    desc: "Download YouTube video as MP3 (Alternative)",
    category: "downloader",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a YouTube video URL.');
        const data = await fg.yta(q);
        const replyText = `
*🎵 YouTube MP3 Download (Alternative) 🎵*

🔍 *Title*: _${data.title}_

🕒 *Duration*: _${data.duration}_

🔗 *Download URL*: ${data.dl_link}

dilalk.vercel.app
ᵐᵃᵈᵆ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ`;
        await conn.sendMessage(from, { image: { url: data.thumb }, caption: replyText }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// Define the YouTube MP4 (Alternative) download command
cmd({
    pattern: "ytv",
    desc: "Download YouTube video as MP4 (Alternative)",
    category: "downloader",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a YouTube video URL.');
        const data = await fg.ytv(q);
        const replyText = `
*📹 YouTube MP4 Download (Alternative) 📹*

🔍 *Title*: _${data.title}_

🕒 *Duration*: _${data.duration}_

🔗 *Download URL*: ${data.dl_link}

dilalk.vercel.app
ᵐᵃᵈᵆ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ`;
        await conn.sendMessage(from, { image: { url: data.thumb }, caption: replyText }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// Define the TikTok (Alternative) download command
cmd({
    pattern: "tiktok2",
    desc: "Download TikTok video (Alternative)",
    category: "downloader",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a TikTok video URL.');
        const data = await fg.tiktok2(q);
        const replyText = `
*🎶 TikTok Video Download (Alternative) 🎶*

🔍 *Title*: _${data.title}_

🔗 *Download URL*: ${data.url}

dilalk.vercel.app
ᵐᵃᵈᵆ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ`;
        await conn.sendMessage(from, { video: { url: data.url }, caption: replyText }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// Define the SoundCloud download (Alternative) command
cmd({
    pattern: "soundcloud2",
    desc: "Download SoundCloud track (Alternative)",
    category: "downloader",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a SoundCloud track URL.');
        const data = await fg.soundcloudDl2(q);
        const replyText = `
*🎧 SoundCloud Track Download (Alternative) 🎧*

🔍 *Title*: _${data.title}_

🔗 *Download URL*: ${data.url}

dilalk.vercel.app
ᵐᵃᵈᵆ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ`;
        await conn.sendMessage(from, { audio: { url: data.url }, caption: replyText }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
