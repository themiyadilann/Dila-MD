const { readEnv } = require('../lib/database');
const { cmd } = require('../command');

// Handler to manage online presence and bot activity based on ALLOWS_ONLINE key
cmd({on: "body"}, async (conn, mek, m, { from, isOwner }) => {
    const config = await readEnv();

    // If ALLOWS_ONLINE is false, prevent showing online status and stop reading or delivering messages
    if (config.ALLOWS_ONLINE === 'false') {
        // Pause presence updates so the bot doesn't appear online
        await conn.sendPresenceUpdate('paused', from);

        // Prevent the bot from reading or delivering the message (no receipt sent)
        return;  // Bot ignores the message, no read/delivered status is updated
    }

    // If ALLOWS_ONLINE is true, proceed with normal bot functionalities
    // Example: Add bot's command handling here
    // The bot can handle incoming messages here
});
