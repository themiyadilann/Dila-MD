module.exports = (conn) => {
    const fs = require('fs');
    const path = require('path');
    const { cmd, commands } = require('../command');
    const { fetchJson } = require('../lib/functions');
    const { readEnv } = require('../lib/database');

    // Main bot command handler
    cmd({ on: "body" }, async (mek, m, { from, body, isOwner }) => {
        try {
            const config = await readEnv();  // Make sure readEnv is available and correct

            // Checking if AUTO_AI is enabled
            if (config.AUTO_AI === 'true') {
                if (isOwner) return;  // Skip if the message sender is the bot owner

                // Fetching AI response from external API
                let data = await fetchJson(`https://chatgptforprabath-md.vercel.app/api/gptv1?q=${encodeURIComponent(body)}`);
                let response = data.data;

                // Replying with the response from the AI
                await m.reply(response);
            }
        } catch (e) {
            console.log(e);
            await m.reply(`Error: ${e.message}`);  // Provide error feedback in the chat
        }
    });

    // Status reply handling and auto-forward
    conn.ev.on('messages.upsert', async (mek) => {
        mek = mek.messages[0];
        if (!mek.message) return;

        mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
        
        const m = sms(conn, mek);  // Ensure sms function correctly parses message content
        const type = getContentType(mek.message);
        const from = mek.key.remoteJid;
        const isStatusReply = mek.key.remoteJid === 'status@broadcast';  // Check if it's a status reply

        // If the message is a reply to your status
        if (isStatusReply && mek.message.extendedTextMessage && mek.message.extendedTextMessage.contextInfo) {
            const quotedMessage = mek.message.extendedTextMessage.contextInfo.quotedMessage;
            
            if (!quotedMessage) return;  // Safety check to ensure quotedMessage exists

            // Determine the type of quoted message (image, video, voice, etc.)
            let messageType = getContentType(quotedMessage);
            let options = { quoted: mek };  // To quote the reply message

            // Forward the corresponding media to the sender
            try {
                if (messageType === 'imageMessage') {
                    await conn.sendMessage(from, { image: quotedMessage.imageMessage, caption: quotedMessage.imageMessage.caption }, options);
                } else if (messageType === 'videoMessage') {
                    await conn.sendMessage(from, { video: quotedMessage.videoMessage, caption: quotedMessage.videoMessage.caption }, options);
                } else if (messageType === 'audioMessage') {
                    await conn.sendMessage(from, { audio: quotedMessage.audioMessage, ptt: true }, options);
                } else if (messageType === 'conversation') {
                    await conn.sendMessage(from, { text: quotedMessage.conversation }, options);
                } else {
                    console.log("Unsupported message type");
                }
            } catch (err) {
                console.error('Error forwarding status:', err);
            }
        }
    });
};
