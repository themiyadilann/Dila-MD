const config = require('../config')
const {cmd, commands} = require('../command')

cmd({
    pattern: "dilo",
    desc: "Check if the bot is online.",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { 
    from, quoted, body, isCmd, command, args, q, isGroup, 
    sender, senderNumber, botNumber2, botNumber, pushname, 
    isMe, isOwner, groupMetadata, groupName, participants, 
    groupAdmins, isBotAdmins, isAdmins, reply 
}) => {
    try {
        const status = `*Name*: Dilan
*From*: Matara
*Age*: 20
*Web*: dilalk.vercel.app

_you .....?_ ♥✊`;

        const imageUrl = 'https://telegra.ph/file/dcd097f9f7a124d47e5b2.jpg';
        const audioUrl = 'https://drive.google.com/uc?export=download&id=1YYPnkKWdrxFe8C2kWdwf8qkeE0PO5RjW';

        // Check if mek is valid before using it
        const quotedMessage = mek ? mek : null;

        // Send the image with the caption
        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: status
        }, { quoted: quotedMessage });

        // Send the voice recording
        await conn.sendPresenceUpdate('recording', from);
        await conn.sendMessage(from, {
            audio: { url: audioUrl }, 
            mimetype: 'audio/mp4', // Adjust this if your audio file is in another format
            ptt: true // This makes the audio act like a voice note
        }, { quoted: quotedMessage });

    } catch (e) {
        console.error('Error sending message:', e);
        reply(`An error occurred: ${e.message}`);
    }
});
