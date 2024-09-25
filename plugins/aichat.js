const { getContentType } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');
const { readEnv } = require('../lib/database');

module.exports = (conn) => {
    // Status reply handling and auto-forward
    conn.ev.on('messages.upsert', async (mek) => {
        mek = mek.messages[0];
        if (!mek.message) return;

        mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
        const m = sms(conn, mek);  // Ensure sms function correctly parses message content
        const type = getContentType(mek.message);
        const from = mek.key.remoteJid;
        const isStatusReply = from === 'status@broadcast';  // Check if the message is from a status reply

        // If someone replies to your status
        if (isStatusReply && mek.message.extendedTextMessage && mek.message.extendedTextMessage.contextInfo) {
            const quotedMessage = mek.message.extendedTextMessage.contextInfo.quotedMessage;
            
            if (!quotedMessage) return;  // Safety check to ensure quotedMessage exists
            
            // Detect if this is a reply to your status and forward the original status
            const originalStatus = await conn.loadMessage(from, mek.message.extendedTextMessage.contextInfo.stanzaId);
            
            let messageType = getContentType(originalStatus.message);
            let options = { quoted: mek };  // To quote the reply message
            
            // Forward the corresponding media back to the person who replied
            try {
                if (messageType === 'imageMessage') {
                    await conn.sendMessage(mek.key.participant, { image: originalStatus.message.imageMessage, caption: originalStatus.message.imageMessage.caption }, options);
                } else if (messageType === 'videoMessage') {
                    await conn.sendMessage(mek.key.participant, { video: originalStatus.message.videoMessage, caption: originalStatus.message.videoMessage.caption }, options);
                } else if (messageType === 'audioMessage') {
                    await conn.sendMessage(mek.key.participant, { audio: originalStatus.message.audioMessage, ptt: true }, options);
                } else if (messageType === 'conversation') {
                    await conn.sendMessage(mek.key.participant, { text: originalStatus.message.conversation }, options);
                } else {
                    console.log("Unsupported message type in status");
                }
            } catch (err) {
                console.error('Error forwarding status:', err);
            }
        }
    });
};
