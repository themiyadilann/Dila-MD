const config = require('../config');
const { cmd, commands } = require('../command');
const wiki = require('wikipedia');
const sensitiveData = require('../dila_md_licence/a/b/c/d/dddamsbs');

cmd({
  pattern: "wiki",
  desc: "Search Wikipedia for information",
  category: "main",
  filename: __filename
}, async (conn, mek, m, {
  from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply
}) => {
  try {
    if (!q) {
      return reply('Please provide a search query.');
    }
    const summary = await wiki.summary(q);
    
    let replyText = `*📚 Wikipedia Summary 📚*\n\n🔍 *Query*: _${q}_\n\n💬 *Title*: _${summary.title}_\n\n📝 *Summary*: _${summary.extract}_\n\n🔗 *URL*: ${summary.content_urls.desktop.page}\n\n${sensitiveData.siteUrl}\n${sensitiveData.footerText}\n\n​\u200B\u200Bhttps://whatsapp.com/channel/0029VapPPNGEgGfO1JkeJF1h`;

    await conn.sendMessage(from, {
      image: { url: summary.originalimage.source },
      caption: replyText
    }, { quoted: mek });
  } catch (e) {
    console.log(e);
    reply(`Error: ${e.message}`);
  }
});
