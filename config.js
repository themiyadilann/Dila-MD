const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "zBcSGJLD#YUTF8LQz7fwEopPGnhJTYkt37GuVOXqS2NxLwDb-IV0",
MONGODB: process.env.MONGODB || "",
};
