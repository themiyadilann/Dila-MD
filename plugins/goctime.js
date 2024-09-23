const { cmd } = require('../command');
const schedule = require('node-schedule');
const moment = require('moment-timezone');
const mongoose = require('mongoose');
const config = require('../config');
const sensitiveData = require('../dila_md_licence/a/b/c/d/dddamsbs');
const TimeModel = require('./timeModel');  // Import the time model

// MongoDB Connection
mongoose.connect(config.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const TIMEZONE = 'Asia/Colombo';

// Adjust time to a specific timezone
function adjustTime(time) {
    const [hour, minute] = time.split(':').map(Number);
    return moment.tz({ hour, minute }, TIMEZONE).format('HH:mm');
}

// Schedule open/close jobs for a group
function scheduleJobs(groupId, openTime, closeTime, conn) {
    const adjustedOpenTime = adjustTime(openTime);
    const [hourOpen, minuteOpen] = adjustedOpenTime.split(':').map(Number);

    const adjustedCloseTime = adjustTime(closeTime);
    const [hourClose, minuteClose] = adjustedCloseTime.split(':').map(Number);

    // Open group
    const openJob = schedule.scheduleJob(`openGroup-${groupId}`, `${minuteOpen} ${hourOpen} * * *`, async () => {
        await conn.groupSettingUpdate(groupId, 'not_announcement');
        await conn.sendMessage(groupId, { text: `*Group opened at ${openTime}.* 🔓\n${sensitiveData.footerText}` });
    });

    // Close group
    const closeJob = schedule.scheduleJob(`closeGroup-${groupId}`, `${minuteClose} ${hourClose} * * *`, async () => {
        await conn.groupSettingUpdate(groupId, 'announcement');
        await conn.sendMessage(groupId, { text: `*Group closed at ${closeTime}.* 🔒\n${sensitiveData.footerText}` });
    });

    console.log(`Scheduled for group ${groupId}: Open at ${openTime}, Close at ${closeTime}`);
}

// Command to set group times
cmd({ pattern: "settime", desc: "Set open/close times for the group", category: "group", filename: __filename }, async (conn, mek, m, { from, args, isGroup, isAdmins, reply }) => {
    if (!isGroup) return reply('This command can only be used in a group.');
    if (!isAdmins) return reply('Only admins can use this command.');

    const [openTime, closeTime] = args;

    if (!openTime || !closeTime) return reply('Usage: .settime <openTime> <closeTime> (format: HH:mm)');

    try {
        // Save times to MongoDB
        let groupTime = await TimeModel.findOne({ groupId: from });
        if (!groupTime) {
            groupTime = new TimeModel({ groupId: from, openTime, closeTime });
        } else {
            groupTime.openTime = openTime;
            groupTime.closeTime = closeTime;
        }
        await groupTime.save();

        // Schedule jobs
        scheduleJobs(from, openTime, closeTime, conn);

        reply(`Times for group set: Open at ${openTime}, Close at ${closeTime}.`);

    } catch (err) {
        console.error(err);
        reply('Failed to save group times.');
    }
});

// On bot startup, load all saved times and schedule them
async function scheduleAllGroups(conn) {
    try {
        const allTimes = await TimeModel.find();
        allTimes.forEach(({ groupId, openTime, closeTime }) => {
            scheduleJobs(groupId, openTime, closeTime, conn);
        });
    } catch (err) {
        console.error('Error loading group times:', err);
    }
}

scheduleAllGroups(conn);
