const { WAConnection, MessageType } = require('@adiwajshing/baileys');
const fs = require('fs');

async function startBot() {
    const conn = new WAConnection();

    // Load previous session
    conn.loadAuthInfo('./auth_info.json');
    await conn.connect();

    // Save session to avoid re-login
    const authInfo = conn.base64EncodedAuthInfo();
    fs.writeFileSync('./auth_info.json', JSON.stringify(authInfo, null, '\t'));

    conn.on('chat-update', async (chat) => {
        if (!chat.hasNewMessage) return;

        const m = chat.messages.all()[0];

        if (!m.message) return;

        // Check if the message is from a new number (unsaved)
        const sender = m.key.remoteJid;
        if (sender.endsWith('@s.whatsapp.net')) {
            const contact = await conn.isOnWhatsApp(sender);
            if (!contact.exists) {
                const replyMessage = `
                *Name*: Dilan
                *From*: Matara
                *Age*: 20
                *web* : dilalk.vercel.app

                _you .....?_ 🤖
                `;
                await conn.sendMessage(sender, replyMessage, MessageType.text);
            }
        }
    });
}

startBot().catch(err => console.log("unexpected error: " + err));
