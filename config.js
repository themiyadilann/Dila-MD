const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "AyE1CLbA#FG2NnuLN0VU3Hcf2SUuIp1JHHYNEXDFlqIuPARClLjQ",
ALIVE_IMG: process.env.ALIVE_IMG || "https://telegra.ph/file/dcd097f9f7a124d47e5b2.jpg",
ALIVE_MSG: process.env.ALIVE_MSG || "*𝗜'𝗺 𝗔𝗹𝗶𝘃𝗲 𝗡𝗼𝘄 ♥*\n*𝚃𝚛𝚢 𝚃𝚑𝚒𝚜 ⤵*\n\n.ai (Your question)\n_example - .ai Hey_\n\n*Support Us ⤵*\n𝚆𝚑𝚊𝚝𝚜𝚊𝚙𝚙 - https://whatsapp.com/channel/0029ValK0gn4SpkP6iaXoj2y\n𝚈𝚘𝚞𝚝𝚞𝚋𝚎 - https://youtube.com/@dila_lk\n𝚆𝚎𝚋 𝚂𝚒𝚝𝚎 - dilalk.vercel.app\n\n𝙽𝙾𝚆 𝚄𝚂𝙴𝙳 𝚁𝙰𝙼: ${usedRAM} 𝙼𝙱\n𝚄𝙿 𝚃𝙸𝙼𝙴: ${runtime(process.uptime())}\nᴍᴀᴅᴇ ʙʏ ᴍʀᴅɪʟᴀ",
AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
MODE: process.env.MODE || "public",
};
