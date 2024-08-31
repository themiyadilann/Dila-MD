const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "AyE1CLbA#FG2NnuLN0VU3Hcf2SUuIp1JHHYNEXDFlqIuPARClLjQ",
ALIVE_IMG: process.env.ALIVE_IMG || "https://telegra.ph/file/dcd097f9f7a124d47e5b2.jpg",
ALIVE_MSG: process.env.ALIVE_MSG || "",
AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
MODE: process.env.MODE || "public",
};
