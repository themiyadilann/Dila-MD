const mongoose = require('mongoose');
const config = require('../config');
const EnvVar = require('./mongodbenv');

const defaultEnvVariables = [
    { key: 'ALIVE_IMG', value: 'https://telegra.ph/file/94055e3a7e18f50199374.jpg' },
    { key: 'ALIVE_MSG', value: '*𝗜𝗺 𝗔𝗹𝗶𝘃𝗲 𝗡𝗼𝘄 ♥*\n*𝚃𝚛𝚢 𝚃𝚑𝚒𝚜 ⤵*\n\n.ai (Your question)\n_example - .ai Hey_\n\n*Support Us ⤵*\n𝚆𝚑𝚊𝚝𝚜𝚊𝚙𝚙 - https://whatsapp.com/channel/0029ValK0gn4SpkP6iaXoj2y\n𝚈𝚘𝚞𝚝𝚞𝚋𝚎 - https://youtube.com/@dila_lk\n\n𝚆𝚎𝚋 𝚂𝚒𝚝𝚎 - dilalk.vercel.app\nᴍᴀᴅᴇ ʙʏ ᴍʀᴅɪʟᴀ' },
    { key: 'PREFIX', value: '.' },
    { key: 'AUTO_READ_STATUS', value: 'true' },
    { key: 'MODE', value: 'public' },
    { key: 'AUTO_VOICE', value: 'true' },
    { key: 'AUTO_STICKER', value: 'true' },
    { key: 'AUTO_REPLY', value: 'true' },
    { key: 'AUTO_IMAGE', value: 'true' },
    { key: 'AUTO_VIDEO', value: 'true' },
];

// MongoDB connection function
const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGODB);
        console.log('🛜 MongoDB Connected ✅');

        // Check and create default environment variables
        for (const envVar of defaultEnvVariables) {
            const existingVar = await EnvVar.findOne({ key: envVar.key });

            if (!existingVar) {
                // Create new environment variable with default value
                await EnvVar.create(envVar);
                console.log(`➕ Created default env var: ${envVar.key}`);
            }
        }

    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
