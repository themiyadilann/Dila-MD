const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "yRNxXYKB#FnUhhTNoAZ0ojhuaaw6sWYi8eruo4sOJXyTDoVaW2gc",
MONGODB: process.env.MONGODB || "",
};
