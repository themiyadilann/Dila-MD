const fs = require('fs');
const path = require('path');
const { readEnv } = require('../lib/database');
const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');

(async () => {
    try {
        const config = await readEnv();

        async function sendReplies(conn, from, replies, pushname) {
            for (const [index, reply] of replies.entries()) {
                setTimeout(async () => {
                    await conn.sendMessage(from, { text: reply.replace('${pushname}', pushname) }, { quoted: null });
                }, index * 700);
            }
        }

        cmd({ on: "body" }, async (conn, mek, m, { from, body, isOwner, pushname }) => {
            const sequenceTrigger = config.WCPROFILEMSG ? config.WCPROFILEMSG.toLowerCase() : '';

            if (body.toLowerCase() === sequenceTrigger) {
                const replies = [
                    `*𝗛𝗘𝗬* ${pushname}`,
                    `*I am ${config.WCPROFILENAME} 👤*`,
                    `*From - ${config.WCPROFILEFROM} 📍*`,
                    `*Age - ${config.WCPROFILEAGE} 🎂*`,
                    '*Save Me 📩*',
                    '*You........?*'
                ];
                await sendReplies(conn, from, replies, pushname);
            }

            // Command for 'link' with link preview enabled
            if (body.toLowerCase() === 'link') {
                const ownerNumber = config.OWNER_NUMBER ? config.OWNER_NUMBER.replace('@s.whatsapp.net', '') : '';
                const linkReply = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(config.WCPROFILEMSG)}  _Gurl & boys drop a msg...💐🫀🤍_`;

                // Send message with link preview
                await conn.sendMessage(from, { 
                    text: linkReply, 
                    previewType: 'url' // This enables the link preview
                }, { quoted: null });
            }

            // Respond to 'name' command
            if (body.toLowerCase().startsWith('name')) {
                const nameReply = `*Your Name Is* ${pushname}`;
                await conn.sendMessage(from, { text: nameReply }, { quoted: null });
            }
        });
    } catch (error) {
        console.error('Error initializing bot:', error);
    }
})();
