const config = require('../config');
const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');
const sensitiveData = require('../dila_md_licence/a/b/c/d/dddamsbs');

cmd({
  pattern: "ai",
  desc: "AI chat",
  category: "main",
  react: "",
  filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
  try {
    // Define the new API URL with the new key
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyByitRjKUtDonuVtpJm1R-RSdPdFPf-tcY`;
    
    // Prepare the body content for the API request
    const bodyContent = {
      contents: [{ parts: [{ text: q }] }]
    };
    
    // Fetch the AI response
    let data = await fetchJson(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyContent)
    });

    // Log specific parts of the response for debugging (optional)
    console.log('API response status:', data.status);
    console.log('API response error:', data.error); // Only log if an error exists

    // Check if the response structure is as expected
    if (data && data.contents && data.contents[0] && data.contents[0].parts && data.contents[0].parts[0].text) {
      let response = data.contents[0].parts[0].text;

      // Compose the message to send
      let replyText = `\n${sensitiveData.aiChatHeader}\n\n *𝗤𝘂𝗲𝗿𝘆*: _${q}_\n\n *𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲*: _${response}_\n\n${sensitiveData.siteUrl}\n${sensitiveData.footerText}`;
      
      // Send the message with the AI response
      let sentMessage = await conn.sendMessage(from, { image: { url: sensitiveData.imageUrl }, caption: replyText }, { quoted: mek });
      
      // React to the sent message
      await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
      await conn.sendMessage(from, { react: { text: "", key: sentMessage.key } });
    } else {
      // Log the error for debugging
      console.error('Invalid response format:', data);
      reply(`Error: Invalid response format from AI API.`);
    }

  } catch (error) {
    console.log(error);
    
    // Check for specific error types from the API (if available)
    if (error.response && error.response.data && error.response.data.error) {
      reply(`Error: ${error.response.data.error.message || 'Unknown error occurred.'}`);
    } else {
      reply(`Error: ${error.message}`);
    }
  }
});
