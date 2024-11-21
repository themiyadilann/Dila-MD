const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "MzFQERSZ#89wcTn827T7yTr2qCdYU-rNdfo5tYC1QgrBXkKk5dCg",
MONGODB: process.env.MONGODB || "",

};
