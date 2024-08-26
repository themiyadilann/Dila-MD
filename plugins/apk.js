const { cmd } = require('../command');

// Replace this:
// const downloader = require('apkmirror-downloader');

// With this:
const downloader = await import('apkmirror-downloader');

//========= APK Download Command =========//
cmd({
    pattern: "apk",
    desc: "Download APK",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || q.trim() === "") return reply("Please type the APK package name... 🤖");

        let packageName = q.trim();

        reply(`🔄 Downloading APK for package: ${packageName}...`);

        let apkInfo = await downloader.downloadAPK(packageName);

        // Check if apkInfo and downloadURL are defined
        if (!apkInfo || !apkInfo.downloadURL) {
            return reply(`❌ Unable to download APK for package: ${packageName}. Please ensure the package name is correct.`);
        }

        let apkUrl = apkInfo.downloadURL;

        let desc = `
        *𝗗𝗶𝗹𝗮𝗠𝗗 𝗔𝗣𝗞 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 📱*

        📦 *𝗣𝗮𝗰𝗸𝗮𝗴𝗲*: _${packageName}_
        🔗 *𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗟𝗶𝗻𝗸*: ${apkUrl}

        dilalk.vercel.app
        ᵐᵃᵈᵉ ʙʏ ᴍʀᴅɪʟᴀ ᵒᶠᶜ`;

        // Send APK download link
        await conn.sendMessage(from, { text: desc }, { quoted: mek });
        await conn.sendMessage(from, { document: { url: apkUrl }, mimetype: "application/vnd.android.package-archive", fileName: `${packageName}.apk`, caption: "💻 *ᴍᴀᴅᴇ ʙʏ ᴍʀᴅɪʟᴀ*" }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
