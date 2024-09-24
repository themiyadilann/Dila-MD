const config = require('../config');
const { cmd, commands } = require('../command');
const wiki = require('wikipedia');
const sensitiveData = require('../dila_md_licence/a/b/c/d/dddamsbs');

// Command definition
cmd({
  pattern: "wiki",
  desc: "Search Wikipedia for information",
  category: "main",
  filename: __filename
}, async (conn, mek, m, {
  from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply
}) => {
  try {
    // Check if query is provided
    if (!q) {
      return reply('Please provide a search query.');
    }

    // Fetch Wikipedia summary
    const summary = await wiki.summary(q);

    // Create the message text
    let replyText = `*📚 Wikipedia Summary 📚*\n\n` +
                    `🔍 *Query*: _${q}_\n\n` +
                    `💬 *Title*: _${summary.title}_\n\n` +
                    `📝 *Summary*: _${summary.extract}_\n\n` +
                    `🔗 *URL*: ${summary.content_urls.desktop.page}\n\n` +
                    `🔄 Forwarded many times`;

    // Add buttons
    const buttons = [
      { buttonId: 'view_channel', buttonText: { displayText: 'View Channel' }, type: 1 }
    ];

    // Define button message
    const buttonMessage = {
      text: replyText, // Main text content
      footer: `${sensitiveData.siteUrl}\n${sensitiveData.footerText}`, // Footer text
      buttons: buttons, // Buttons array
      headerType: 1 // Header type for text-only message
    };

    // Send the button message
    await conn.sendMessage(from, buttonMessage, { quoted: mek });
    
    // Handle the button press event (Button logic)
    conn.ev.on('messages.upsert', async (upsert) => {
      const buttonResponse = upsert.messages[0];
      
      // Check if the response is a button click
      if (buttonResponse.message?.buttonsResponseMessage?.selectedButtonId === 'view_channel') {
        // Send the channel link when the button is clicked
        await conn.sendMessage(from, { text: 'Here is the channel link: https://whatsapp.com/channel/0029VapPPNGEgGfO1JkeJF1h' });
      }
    });
    
  } catch (e) {
    console.log(e);
    reply(`Error: ${e.message}`);
  }
});
