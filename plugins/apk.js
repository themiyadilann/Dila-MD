const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Helper function to download APK
async function downloadApk(url, outputPath) {
    try {
        const response = await axios.get(url, { responseType: 'stream' });
        const writer = fs.createWriteStream(outputPath);
        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Error downloading APK: ${error.message}`);
        throw error;
    }
}

// Define the APK download command
cmd({
    pattern: "apk",
    desc: "Download APK with details and thumbnail",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            return reply('Please provide an APK URL.');
        }

        // Replace with your logic to get APK details
        // For demonstration, we'll use a dummy URL and thumbnail
        const apkUrl = q; // The URL from the command argument
        const outputPath = path.resolve(__dirname, 'downloaded.apk');
        const thumbnailUrl = 'https://example.com/thumbnail.jpg'; // Replace with actual thumbnail URL

        // Download APK
        await downloadApk(apkUrl, outputPath);

        // Send APK details and thumbnail
        const description = `
*DilaMD APK Download Complete*

🔗 *APK Link*: ${apkUrl}
📂 *File Name*: downloaded.apk
📥 *Status*: Successfully downloaded

`;

        await conn.sendMessage(from, { image: { url: thumbnailUrl }, caption: description }, { quoted: mek });
        await conn.sendMessage(from, { document: { url: outputPath }, mimetype: "application/vnd.android.package-archive", fileName: 'downloaded.apk', caption: 'Here is your APK file.' }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
