const fs = require('fs');
const path = require('path');
const { readEnv } = require('../lib/database');
const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');
const emoji = require('node-emoji'); // This library is still used for random emoji selection

cmd({ on: "body" }, async (conn, mek, m, { from, body, isOwner }) => {
    try {
        const config = await readEnv();
        
        // Check if auto-react is enabled in the config
        if (config.AUTO_REACT === 'true') {

            // Regular expression to detect emojis in the message
            const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
            
            // Extract emojis from the body using regex
            const incomingEmojis = body.match(emojiRegex);

            // If there are emojis in the incoming message, reattach them
            if (incomingEmojis && incomingEmojis.length > 0) {
                await m.react(incomingEmojis[0]); // React with the first emoji found
            } else {
                // If no emojis are found, react with a random emoji
                const randomEmoji = emoji.random().emoji; // Get a random emoji
                await m.react(randomEmoji);
            }
        }
    } catch (e) {
        console.log(e);
        await m.reply(`Error: ${e.message}`);
    }
});
