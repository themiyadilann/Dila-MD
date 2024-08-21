const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID,
ALIVE_IMG: process.env.ALIVE_IMG || "https://telegra.ph/file/d5200670d0dd45e6438da.jpg",
ALIVE_MSG: process.env.ALIVE_MSG || "I,m Alive Now",
DILO_IMG: process.env.DILO_IMG || "https://telegra.ph/file/b912907e0f618443d50bc.jpg",
DILO_MSG: process.env.DILO_MSG || "🌟 *Name*: Dilan  
🌍 *From*: Matara  
🎂 *Age*: 20  

🌐 *Website*:  dilalk.vercel.app 

_You...?_",
AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
MODE: process.env.MODE || "public",
};
