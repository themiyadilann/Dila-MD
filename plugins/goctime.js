const { cmd } = require('../command');
const schedule = require('node-schedule');
const moment = require('moment-timezone');
const mongoose = require('mongoose');
const config = require('../config');
const sensitiveData = require('../dila_md_licence/a/b/c/d/dddamsbs');

// MongoDB Connection
mongoose.connect(config.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const TIMEZONE = 'Asia/Colombo';

// Mongoose schema for open/close times per group
const timeSchema = new mongoose.Schema({
    groupId: { type: String, required: true, unique: true },
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true }
});

const TimeModel = mongoose.model('Time', timeSchema);

// Adjust time to a specific timezone and subtract 5:30 hours
function adjustTime(time) {
    const [hour, minute] = time.split(':').map(Number);
    return moment.tz({ hour, minute }, TIMEZONE).subtract(5, 'hours').subtract(30, 'minutes').format('HH:mm');
}

// Save times for a specific group
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

// Load times for all groups on startup
async function loadAllGroupTimes() {
    try {
        const allTimes = await TimeModel.find();
        return allTimes;
    } catch (err) {
        console.error('Error loading group times:', err);
    }
}

// Reschedule jobs for a specific group
function rescheduleGroupJobs(conn, groupId, openTime, closeTime) {
    // Reschedule open time
    const adjustedOpenTime = adjustTime(openTime);
    const [adjustedHourOpen, adjustedMinuteOpen] = adjustedOpenTime.split(':').map(Number);
    const openCron = `0 ${adjustedMinuteOpen} ${adjustedHourOpen} * * *`;

    schedule.scheduleJob(`openGroup-${groupId}`, openCron, async () => {
        await conn.groupSettingUpdate(groupId, 'not_announcement');
        await conn.sendMessage(groupId, { text: `*𝗚𝗿𝗼𝘂𝗽 𝗢𝗽𝗲𝗻𝗲𝗱 𝗮𝘁 ${openTime}. 🔓*\n${sensitiveData.footerText}` });
    });

    // Reschedule close time
    const adjustedCloseTime = adjustTime(closeTime);
    const [adjustedHourClose, adjustedMinuteClose] = adjustedCloseTime.split(':').map(Number);
    const closeCron = `0 ${adjustedMinuteClose} ${adjustedHourClose} * * *`;

    schedule.scheduleJob(`closeGroup-${groupId}`, closeCron, async () => {
        await conn.groupSettingUpdate(groupId, 'announcement');
        await conn.sendMessage(groupId, { text: `*𝗚𝗿𝗼𝘂𝗽 𝗖𝗹𝗼𝘀𝗲𝗱 𝗮𝘁 ${closeTime}. 🔒*\n${sensitiveData.footerText}` });
    });

    console.log(`Group ${groupId} scheduled to open at ${openTime} and close at ${closeTime}.`);
}

// Load and reschedule jobs for all groups on startup
async function rescheduleAllGroups(conn) {
    const allGroupTimes = await loadAllGroupTimes();
    if (allGroupTimes.length > 0) {
        allGroupTimes.forEach(groupTime => {
            rescheduleGroupJobs(conn, groupTime.groupId, groupTime.openTime, groupTime.closeTime);
        });
    }
}

// Command to set daily open time for a group
cmd({ pattern: "opentime", desc: "Set daily open time for the group", category: "group", filename: __filename }, async (conn, mek, m, { from, args, isGroup, isBotAdmins, isAdmins, reply }) => {
    if (!isGroup) return reply('This command can only be used in a group. 🚫');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
    if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');

    if (args.length < 1) return reply('Usage: .opentime <HH:mm>');

    const openTime = args[0];
    const groupId = from;

    await saveTimes(groupId, openTime, closeTime = "");  // Save the open time to MongoDB for this group
    rescheduleGroupJobs(conn, groupId, openTime, closeTime);  // Reschedule for this group

    reply(`*𝗚𝗿𝗼𝘂𝗽 𝗪𝗶𝗹𝗹 𝗢𝗽𝗲𝗻 𝗗𝗮𝗶𝗹𝘆 𝗮𝘁 ${openTime}. ⏰*\n${sensitiveData.footerText}`);
});

// Command to set daily close time for a group
cmd({ pattern: "closetime", desc: "Set daily close time for the group", category: "group", filename: __filename }, async (conn, mek, m, { from, args, isGroup, isBotAdmins, isAdmins, reply }) => {
    if (!isGroup) return reply('This command can only be used in a group. 🚫');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
    if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');

    if (args.length < 1) return reply('Usage: .closetime <HH:mm>');

    const closeTime = args[0];
    const groupId = from;

    await saveTimes(groupId, openTime = "", closeTime);  // Save the close time to MongoDB for this group
    rescheduleGroupJobs(conn, groupId, openTime, closeTime);  // Reschedule for this group

    reply(`*𝗚𝗿𝗼𝘂𝗽 𝗪𝗶𝗹𝗹 𝗖𝗹𝗼𝘀𝗲 𝗗𝗮𝗶𝗹𝘆 𝗮𝘁 ${closeTime}. ⏰*\n${sensitiveData.footerText}`);
});

// Reschedule jobs on startup for all groups
rescheduleAllGroups(conn);
