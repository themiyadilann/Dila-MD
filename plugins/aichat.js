const fs = require('fs');
const path = require('path');
const { readEnv } = require('../lib/database');
const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');

// Auto-reply using AI and delete certain URLs
cmd({
    on: "body"
},    
async (conn, mek, m, { from, body, isOwner }) => {
    try {
        const config = await readEnv();
        const forbiddenLinks = ['wa.me', 'chat.whatsapp.com', 'whatsapp.com'];

        // Check if the message contains any forbidden links
        if (forbiddenLinks.some(link => body.includes(link))) {
            await conn.deleteMessage(from, mek.key); // Delete the message if it contains a link
            return;
        }

        // Continue with AI reply if the message doesn't contain a forbidden link
        if (config.AUTO_AI === 'true') {
            if (isOwner) return;

            // Fetch response from AI API
            let data = await fetchJson(`https://chatgptforprabath-md.vercel.app/api/gptv1?q=${body}`);
            let response = data.data;

            // Send the AI response as the reply
            await m.reply(response);
        }
    } catch (e) {
        console.log(e);
        await m.reply(`Error: ${e.message}`);
    }
});
