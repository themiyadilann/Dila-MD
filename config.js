const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "AyE1CLbA#FG2NnuLN0VU3Hcf2SUuIp1JHHYNEXDFlqIuPARClLjQ",
DILO_IMG: process.env.DILO_IMG || "https://telegra.ph/file/dcd097f9f7a124d47e5b2.jpg",
DILO_MSG: process.env.DILO_MSG || "*Name*: Dilan\n*From*: Matara\n*Age*: 20\n*web* : dilalk.vercel.app\n\n_you .....?_ 🤖",
AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
MODE: process.env.MODE || "public",
};
