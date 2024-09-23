const { cmd } = require('../command');
const schedule = require('node-schedule');
const moment = require('moment-timezone');
const fs = require('fs');
const path = require('path'); // Import path module
const sensitiveData = require('../dila_md_licence/a/b/c/d/dddamsbs');
const mongoose = require('mongoose');
const config = require('../config');  // Import config.js

// MongoDB Connection
mongoose.connect(config.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const TIMEZONE = 'Asia/Colombo';

// Mongoose schema for open/close times
const timeSchema = new mongoose.Schema({
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
    groupId: { type: String, required: true }
});

const TimeModel = mongoose.model('Time', timeSchema);

// Function to adjust time to a specific timezone and subtract 5:30 hours
function adjustTime(time) {
    const [hour, minute] = time.split(':').map(Number);
    return moment.tz({ hour, minute }, TIMEZONE).subtract(5, 'hours').subtract(30, 'minutes').format('HH:mm');
}

// Load times from MongoDB for the group
async function loadTimes(groupId) {
    try {
        const groupTime = await TimeModel.findOne({ groupId });
        if (groupTime) {
            return { openTime: groupTime.openTime, closeTime: groupTime.closeTime };
        }
        return {};
    } catch (err) {
        console.error('Error loading times:', err);
    }
}

// Save times to MongoDB for the group
async function saveTimes(groupId, openTime, closeTime) {
    try {
        let groupTime = await TimeModel.findOne({ groupId });
        if (!groupTime) {
            groupTime = new TimeModel({ groupId, openTime, closeTime });
        } else {
            groupTime.openTime = openTime;
            groupTime.closeTime = closeTime;
        }
        await groupTime.save();
        console.log(`Times for group ${groupId} saved to MongoDB.`);
    } catch (err) {
        console.error('Error saving times:', err);
    }
}

let openTime, closeTime;

// Command to set daily open time
cmd({ pattern: "opentime", desc: "Set daily open time for the group", category: "group", filename: __filename }, async (conn, mek, m, { from, args, isGroup, isBotAdmins, isAdmins, reply }) => {
    if (!isGroup) return reply('This command can only be used in a group. 🚫');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
    if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');
    
    if (args.length < 1) return reply('Usage: .opentime <HH:mm>');

    openTime = args[0];

    const adjustedOpenTime = adjustTime(openTime);
    const [adjustedHour, adjustedMinute] = adjustedOpenTime.split(':').map(Number);
    const openCron = `0 ${adjustedMinute} ${adjustedHour} * * *`;

    schedule.scheduleJob('openGroup', openCron, async () => {
        await conn.groupSettingUpdate(from, 'not_announcement');
        await conn.sendMessage(from, { text: `*𝗚𝗿𝗼𝘂𝗽 𝗢𝗽𝗲𝗻𝗲𝗱 𝗮𝘁 ${openTime}. 🔓*\n${sensitiveData.footerText}` });
    });

    await saveTimes(from, openTime, closeTime);  // Save the open time to MongoDB for this group
    reply(`*𝗚𝗿𝗼𝘂𝗽 𝗪𝗶𝗹𝗹 𝗢𝗽𝗲𝗻 𝗗𝗮𝗶𝗹𝘆 𝗮𝘁 ${openTime}. ⏰*\n${sensitiveData.footerText}`);
});

// Command to set daily close time
cmd({ pattern: "closetime", desc: "Set daily close time for the group", category: "group", filename: __filename }, async (conn, mek, m, { from, args, isGroup, isBotAdmins, isAdmins, reply }) => {
    if (!isGroup) return reply('This command can only be used in a group. 🚫');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
    if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');
    
    if (args.length < 1) return reply('Usage: .closetime <HH:mm>');

    closeTime = args[0];

    const adjustedCloseTime = adjustTime(closeTime);
    const [adjustedHour, adjustedMinute] = adjustedCloseTime.split(':').map(Number);
    const closeCron = `0 ${adjustedMinute} ${adjustedHour} * * *`;

    schedule.scheduleJob('closeGroup', closeCron, async () => {
        await conn.groupSettingUpdate(from, 'announcement');
        await conn.sendMessage(from, { text: `*𝗚𝗿𝗼𝘂𝗽 𝗖𝗹𝗼𝘀𝗲𝗱 𝗮𝘁 ${closeTime}. 🔒*\n${sensitiveData.footerText}` });
    });

    await saveTimes(from, openTime, closeTime);  // Save the close time to MongoDB for this group
    reply(`*𝗚𝗿𝗼𝘂𝗽 𝗪𝗶𝗹𝗹 𝗖𝗹𝗼𝘀𝗲 𝗗𝗮𝗶𝗹𝘆 𝗮𝘁 ${closeTime}. ⏰*\n${sensitiveData.footerText}`);
});
