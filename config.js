const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "6VNEjSxS#JZB-cSysc5mpLHiFnkcd9N5tVuNmLAM3occwuLCS0ME",
MONGODB: process.env.MONGODB || "",

};
