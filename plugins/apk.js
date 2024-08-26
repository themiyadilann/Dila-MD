const { cmd } = require('../command');
const { APKMirrorDownloader } = require('apkmirror-downloader');

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

        const apkmd = new APKMirrorDownloader({
            outDir: "./downloads"
        });

        let apkInfo = await apkmd.download({ org: "google-inc", repo: packageName }, { type: "apk" });

        if (!apkInfo) {
            return reply(`❌ Unable to download APK for package: ${packageName}. Please ensure the package name is correct.`);
        }

        let apkPath = apkInfo.filePath;

        let desc = `
*𝗗𝗶𝗹𝗮𝗠𝗗 𝗔𝗣𝗞 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 📱*

📦 *𝗣𝗮𝗰𝗸𝗮𝗴𝗲*: _${packageName}_
📂 *𝗙𝗶𝗹𝗲 𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻*: ${apkPath}

dilalk.vercel.app
ᵐᵃᵈᵉ ʙʏ ᴍʀᴅɪʟᴀ ᵒᶠᶜ`;

        // Send APK file
        await conn.sendMessage(from, { text: desc }, { quoted: mek });
        await conn.sendMessage(from, { document: { url: apkPath }, mimetype: "application/vnd.android.package-archive", fileName: `${packageName}.apk`, caption: "💻 *ᴍᴀᴅᴇ ʙʏ ᴍʀᴅɪʟᴀ*" }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
