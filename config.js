const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "AyE1CLbA#FG2NnuLN0VU3Hcf2SUuIp1JHHYNEXDFlqIuPARClLjQ",

};
