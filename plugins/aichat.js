const fs = require('fs');
const path = require('path');
const { readEnv } = require('../lib/database');
const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');

// Auto-reply using AI
cmd({
    on: "body"
},    
async (conn, mek, m, { from, body, isOwner }) => {
    try {
        const config = await readEnv();
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
