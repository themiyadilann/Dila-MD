const { cmd } = require('../command');
const gplay = require('google-play-scraper');
const fetch = require('node-fetch'); // For HTTP requests, if needed

// Voice recording URL
const voiceUrl = 'https://drive.google.com/uc?export=download&id=1_Pd4yQVfofr14xPMIOvebVGwoXh1rohu';

//========= App Download Command =========//

cmd({
    pattern: "apk",
    desc: "Download apps from Google Play Store",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            await conn.sendMessage(from, { audio: { url: voiceUrl }, mimetype: 'audio/mp4', ptt: true }, { quoted: mek });
            return;
        }

        // Fetch app details from Google Play Store
        const app = await gplay.app(q);
        const { title, icon, url, description, developer } = app;

        let desc = `
> *𝗗𝗶𝗹𝗮𝗠𝗗 𝗚𝗼𝗼𝗴𝗹𝗲 𝗣𝗹𝗮𝘆 𝗔𝗽𝗽 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 📱*

🎵 *𝗧𝗶𝘁𝗹𝗲*: _${title}_
👤 *𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿*: _${developer}_
📝 *𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻*: _${description}_
🔗 *𝗟𝗶𝗻𝗸*: ${url}

dilalk.vercel.app
ᵐᵃᵈᵉ ʙʏ ᴍʀᴅɪʟᴀ`;

        // Send app details with thumbnail
        await conn.sendMessage(from, { image: { url: icon }, caption: desc }, { quoted: mek });

        // Provide URL for APK download if available
        // Note: Direct APK download functionality is not provided by `google-play-scraper`
        // You will need to use an external service or manually provide APK download links.
        reply("Direct APK download is not supported. Please use an external service or manual download link.");

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
