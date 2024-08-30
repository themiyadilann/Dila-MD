const fs = require('fs');
const path = require('path');
const { config } = require('./config');
const { cmd, commands } = require('../command');

// Utility to load JSON data safely
function loadJsonData(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        console.error(`Error loading JSON from ${filePath}:`, error);
        return {};
    }
}

// Combine handlers for efficiency
cmd({
  on: "body"
},    
async (conn, mek, m, { from, body, isOwner }) => {
    if (isOwner) return; // Exit early for owner

    const voiceData = loadJsonData(path.join(__dirname, '../adata/autovoice.json'));
    const stickerData = loadJsonData(path.join(__dirname, '../adata/autosticker.json'));
    const replyData = loadJsonData(path.join(__dirname, '../adata/autoreply.json'));
    
    const configData = await config();

    // Auto Voice
    if (configData.AUTO_VOICE === 'true' && voiceData[body.toLowerCase()]) {
        try {
            await conn.sendPresenceUpdate('recording', from);
            await conn.sendMessage(from, { audio: { url: voiceData[body.toLowerCase()] }, mimetype: 'audio/mpeg', ptt: true }, { quoted: mek });
        } catch (error) {
            console.error('Error sending auto voice:', error);
        }
    }

    // Auto Sticker
    if (configData.AUTO_STICKER === 'true' && stickerData[body.toLowerCase()]) {
        try {
            await conn.sendMessage(from, { sticker: { url: stickerData[body.toLowerCase()] }, package: 'yourName' }, { quoted: mek });
        } catch (error) {
            console.error('Error sending auto sticker:', error);
        }
    }

    // Auto Reply
    if (configData.AUTO_REPLY === 'true' && replyData[body.toLowerCase()]) {
        try {
            await m.reply(replyData[body.toLowerCase()]);
        } catch (error) {
            console.error('Error sending auto reply:', error);
        }
    }
});
