const { cmd, commands } = require('../command');
const fg = require('api-dylux');
const yts = require('yt-search');

cmd({
    pattern: "song",
    desc: "download songs",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply("Please type Name or Url... 🤖");
        const search = await yts(q);
        const data = search.videos[0];
        const url = data.url;

        let desc = `
*𝗗𝗶𝗹𝗮𝗠𝗗 𝗬𝗼𝘂𝘁𝘂𝗯𝗲 𝗔𝘂𝗱𝗶𝗼 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 🎧*

*🎶 𝗧𝗶𝘁𝗹𝗲*: 
> _${data.title}_
*📝 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻*: 
> _${data.description}_
*⏱️ 𝗧𝗶𝗺𝗲*: 
> _${data.timestamp}_
*📅 𝗔𝗴𝗼*: 
> _${data.ago}_
*👁️‍🗨️ 𝗩𝗶𝗲𝘄𝘀*: 
> _${data.views}_

*💻 ᴍᴀᴅᴇ ʙʏ ᴍʀᴅɪʟᴀ*
`;
        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        // download audio
        let down = await fg.yta(url);
        let downloadUrl = down.dl_url;

        // send audio+document message
        await conn.sendMessage(from, { audio: { url: downloadUrl }, mimetype: "audio/mpeg" }, { quoted: mek });
        await conn.sendMessage(from, { document: { url: downloadUrl }, mimetype: "audio/mpeg", fileName: data.title + ".mp3", caption: "*💻 ᴍᴀᴅᴇ ʙʏ ᴍʀᴅɪʟᴀ*" }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

//=========video-dl========//

cmd({
    pattern: "video",
    desc: "download videos",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply("Please type Name or Url... 🤖");
        const search = await yts(q);
        const data = search.videos[0];
        const url = data.url;

        let desc = `
*𝗗𝗶𝗹𝗮𝗠𝗗 𝗬𝗼𝘂𝘁𝘂𝗯𝗲 𝗩𝗶𝗱𝗲𝗼 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 🎥*

*🎶 𝗧𝗶𝘁𝗹𝗲*: 
> _${data.title}_
*📝 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻*: 
> _${data.description}_
*⏱️ 𝗧𝗶𝗺𝗲*: 
> _${data.timestamp}_
*📅 𝗔𝗴𝗼*: 
> _${data.ago}_
*👁️‍🗨️ 𝗩𝗶𝗲𝘄𝘀*: 
> _${data.views}_

*💻 ᴍᴀᴅᴇ ʙʏ ᴍʀᴅɪʟᴀ*
`;
        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        // download video
        let down = await fg.ytv(url);
        let downloadUrl = down.dl_url;

        // send video+document message
        await conn.sendMessage(from, { video: { url: downloadUrl }, mimetype: "video/mp4" }, { quoted: mek });
        await conn.sendMessage(from, { document: { url: downloadUrl }, mimetype: "video/mp4", fileName: data.title + ".mp4", caption: "*💻 ᴍᴀᴅᴇ ʙʏ ᴍʀᴅɪʟᴀ*" }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
