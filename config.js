const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "42EmAYQA#XI_Gb_myo2HNrrHD7GgKzz5Jzug_dOj2m72MBh9byDM",
MONGODB: process.env.MONGODB || "mongodb+srv://mohsin:mohsin@cluster0.iauaztt.mongodb.net/?retryWrites=true&w=majority",
};
