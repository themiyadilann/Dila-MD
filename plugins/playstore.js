const { cmd } = require('../command');
const gplay = require('google-play-scraper');

//========= App Download Command =========//

cmd({
    pattern: "app",
    desc: "Download apps from Google Play Store",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("Please type an app name or package name... 🤖");

        const searchResults = await gplay.search({ term: q, num: 1 });
        const app = searchResults[0];
        if (!app) return reply("No results found!");

        const appDetails = await gplay.app({ appId: app.appId });

        let desc = `
> *𝗗𝗶𝗹𝗮𝗠𝗗 𝗚𝗼𝗼𝗴𝗹𝗲 𝗣𝗹𝗮𝘆 𝗔𝗽𝗽 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 📱*

🎶 *𝗧𝗶𝘁𝗹𝗲*: _${appDetails.title}_
👤 *𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿*: _${appDetails.developer}_
📝 *𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻*: _${appDetails.description}_
🔢 *𝗜𝗻𝘀𝘁𝗮𝗹𝗹𝘀*: _${appDetails.installs}_
⭐ *𝗥𝗮𝘁𝗶𝗻𝗴*: _${appDetails.scoreText} (${appDetails.score})_
💵 *𝗣𝗿𝗶𝗰𝗲*: _${appDetails.priceText}_
🔗 *𝗟𝗶𝗻𝗸*: ${appDetails.url}

dilalk.vercel.app
ᵐᵃᵈᵉ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ`;

        // Send app details with thumbnail
        await conn.sendMessage(from, { image: { url: app.icon }, caption: desc }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
