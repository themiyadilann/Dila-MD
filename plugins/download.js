const { fetchJson } = require('../lib/functions');
const config = require('../config');
const { cmd, commands } = require('../command');

let baseUrl;

// Fetch base URL
(async () => {
    try {
        let baseUrlGet = await fetchJson('https://raw.githubusercontent.com/prabathLK/PUBLIC-URL-HOST-DB/main/public/url.json');
        baseUrl = baseUrlGet.api;
    } catch (error) {
        console.error('Failed to fetch base URL:', error);
    }
})();

const yourName = "dilalk.vercel.app\n ᵐᵃᵈᵉ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ";

// Function to validate URL and domain
const isValidUrl = (url, pattern) => url && url.startsWith("https://") && url.includes(pattern);

// Facebook Downloader
cmd({
    pattern: "fb",
    alias: ["facebook"],
    desc: "Download FB videos",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!isValidUrl(q, 'facebook')) return reply("*Please give me your link 🚫*\nExample: .fb (fb video link)");
        
        let data = await fetchJson(`${baseUrl}/api/fdown?url=${q}`);
        reply("*Downloading... 📥*");
        
        if (data.data.hd) {
            await conn.sendMessage(from, { video: { url: data.data.hd }, mimetype: "video/mp4", caption: `📺 FB HD VIDEO 🚀✨🎥\n\n ${yourName}` }, { quoted: mek });
        }
        if (data.data.sd) {
            await conn.sendMessage(from, { video: { url: data.data.sd }, mimetype: "video/mp4", caption: `📱 FB SD VIDEO 🎬⚡📥\n\n ${yourName}` }, { quoted: mek });
        }
    } catch (e) {
        console.error(e);
        reply(`Error: ${e.message}`);
    }
});

// TikTok Downloader
cmd({
    pattern: "tiktok",
    alias: ["tt"],
    desc: "Download TikTok videos",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!isValidUrl(q, 'tiktok')) return reply("*Please give me your link 🚫*\nExample: .tiktok (tiktok video link)");
        
        let data = await fetchJson(`${baseUrl}/api/tiktokdl?url=${q}`);
        reply("*Downloading... 📥*");
        
        if (data.data.no_wm) {
            await conn.sendMessage(from, { video: { url: data.data.no_wm }, mimetype: "video/mp4", caption: `🚀 NO-WATERMARK DilaMD TIKTOK DOWNLOADER 🎵✨📥\n\n ${yourName}` }, { quoted: mek });
        }
        if (data.data.wm) {
            await conn.sendMessage(from, { video: { url: data.data.wm }, mimetype: "video/mp4", caption: `🚀 With-WATERMARK DilaMD TIKTOK DOWNLOADER 🎵✨📥\n\n ${yourName}` }, { quoted: mek });
        }
        if (data.data.audio) {
            await conn.sendMessage(from, { audio: { url: data.data.audio }, mimetype: "audio/mpeg" }, { quoted: mek });
        }
    } catch (e) {
        console.error(e);
        reply(`Error: ${e.message}`);
    }
});

// Twitter Downloader
cmd({
    pattern: "twitter",
    alias: ["twdl"],
    desc: "Download Twitter videos",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!isValidUrl(q, 'twitter')) return reply("*Please give me your link 🚫*\nExample: .twitter (twitter video link)");
        
        let data = await fetchJson(`${baseUrl}/api/twitterdl?url=${q}`);
        reply("*Downloading...*");
        
        if (data.data.data.HD) {
            await conn.sendMessage(from, { video: { url: data.data.data.HD }, mimetype: "video/mp4", caption: `📺 TWITTER HD VIDEO 🚀✨🎥\n\n ${yourName}` }, { quoted: mek });
        }
        if (data.data.data.SD) {
            await conn.sendMessage(from, { video: { url: data.data.data.SD }, mimetype: "video/mp4", caption: `📱 TWITTER SD VIDEO 🎬⚡📥\n\n ${yourName}` }, { quoted: mek });
        }
        if (data.data.data.audio) {
            await conn.sendMessage(from, { audio: { url: data.data.data.audio }, mimetype: "audio/mpeg" }, { quoted: mek });
        }
    } catch (e) {
        console.error(e);
        reply(`Error: ${e.message}`);
    }
});

// Google Drive Downloader
cmd({
    pattern: "gdrive",
    alias: ["googledrive"],
    desc: "Download Google Drive files",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!isValidUrl(q, 'googledrive')) return reply("*Please give me your link 🚫*\nExample: .gdrive (gdrive link)");
        
        let data = await fetchJson(`${baseUrl}/api/gdrivedl?url=${q}`);
        reply("*Downloading...*");
        
        if (data.data.download) {
            await conn.sendMessage(from, { document: { url: data.data.download }, fileName: data.data.fileName, mimetype: data.data.mimeType, caption: `${data.data.fileName}\n\n${yourName}` }, { quoted: mek });
        }
    } catch (e) {
        console.error(e);
        reply(`Error: ${e.message}`);
    }
});

// MediaFire Downloader
cmd({
    pattern: "mediafire",
    alias: ["mfire"],
    desc: "Download MediaFire files",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!isValidUrl(q, 'mediafire')) return reply("*Please give me your link 🚫*\nExample: .mediafire (mediafire link)");
        
        let data = await fetchJson(`${baseUrl}/api/mediafiredl?url=${q}`);
        reply("*Downloading...*");
        
        if (data.data.link_1) {
            await conn.sendMessage(from, { document: { url: data.data.link_1 }, fileName: data.data.name, mimetype: data.data.file_type, caption: `${data.data.name}\n\n${yourName}` }, { quoted: mek });
        }
    } catch (e) {
        console.error(e);
        reply(`Error: ${e.message}`);
    }
});
