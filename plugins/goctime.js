const { cmd } = require('../command');
const schedule = require('node-schedule');
const moment = require('moment-timezone');
const { updateEnv, readEnv } = require('../lib/database');
const EnvVar = require('../lib/mongodbenv');

const TIMEZONE = 'Asia/Colombo';

// Function to adjust time by subtracting 5 hours and 30 minutes
function adjustTime(time) {
    const [hour, minute] = time.split(':').map(Number);
    return moment.tz({ hour, minute }, TIMEZONE).subtract(5, 'hours').subtract(30, 'minutes').format('HH:mm');
}

// Function to save group settings
const saveGroupSettings = async (groupId, openTime, closeTime) => {
    await EnvVar.findOneAndUpdate(
        { key: `groupSettings_${groupId}` },
        { value: JSON.stringify({ openTime, closeTime }) },
        { new: true, upsert: true }
    );
};

// Load and return group settings
const loadGroupSettings = async (groupId) => {
    const settings = await EnvVar.findOne({ key: `groupSettings_${groupId}` });
    return settings ? JSON.parse(settings.value) : null;
};

// Command to set open time
cmd({ pattern: "opentime", desc: "Set daily open time for the group", category: "group", filename: __filename }, async (conn, mek, m, { from, args, isGroup, isBotAdmins, isAdmins, reply }) => {
    if (!isGroup) return reply('This command can only be used in a group. 🚫');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
    if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');

    if (args.length < 1) return reply('Usage: .opentime <HH:mm>');

    const openTime = args[0];
    await saveGroupSettings(from, openTime, null); // Save open time

    const adjustedOpenTime = adjustTime(openTime);
    const [adjustedHour, adjustedMinute] = adjustedOpenTime.split(':').map(Number);
    const openCron = `0 ${adjustedMinute} ${adjustedHour} * * *`;

    schedule.scheduleJob(`openGroup_${from}`, openCron, async () => {
        await conn.groupSettingUpdate(from, 'not_announcement');
        await conn.sendMessage(from, { text: `*𝗚𝗿𝗼𝘂𝗽 𝗢𝗽𝗲𝗻𝗲𝗱 𝗮𝘁 ${openTime}. 🔓*\nᴍʀ ᴅɪʟᴀ ᴏꜰᴄ` });
    });

    reply(`*𝗚𝗿𝗼𝘂𝗽 𝗪𝗶𝗹𝗹 𝗢𝗽𝗲𝗻 𝗗𝗮𝗶𝗹𝘆 𝗮𝘁 ${openTime}. ⏰*`);
});

// Command to set close time
cmd({ pattern: "closetime", desc: "Set daily close time for the group", category: "group", filename: __filename }, async (conn, mek, m, { from, args, isGroup, isBotAdmins, isAdmins, reply }) => {
    if (!isGroup) return reply('This command can only be used in a group. ❗');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
    if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');

    if (args.length < 1) return reply('Usage: .closetime <HH:mm>');

    const closeTime = args[0];
    await saveGroupSettings(from, null, closeTime); // Save close time

    const adjustedCloseTime = adjustTime(closeTime);
    const [adjustedHour, adjustedMinute] = adjustedCloseTime.split(':').map(Number);
    const closeCron = `0 ${adjustedMinute} ${adjustedHour} * * *`;

    schedule.scheduleJob(`closeGroup_${from}`, closeCron, async () => {
        await conn.groupSettingUpdate(from, 'announcement');
        await conn.sendMessage(from, { text: `*𝗚𝗿𝗼𝘂𝗽 𝗖𝗹𝗼𝘀𝗲𝗱 𝗮𝘁 ${closeTime}. 🔒*\nᴍʀ ᴅɪʟᴀ ᴏꜰᴄ` });
    });

    reply(`*𝗚𝗿𝗼𝘂𝗽 𝗪𝗶𝗹𝗹 𝗖𝗹𝗼𝘀𝗲 𝗗𝗮𝗶𝗹𝘆 𝗮𝘁 ${closeTime}. ⏰*`);
});

// Load and schedule jobs on startup
const initializeScheduledJobs = async () => {
    const groups = await EnvVar.find({ key: /^groupSettings_/ });
    for (const group of groups) {
        const { openTime, closeTime } = JSON.parse(group.value);
        if (openTime) {
            const adjustedOpenTime = adjustTime(openTime);
            const [adjustedHour, adjustedMinute] = adjustedOpenTime.split(':').map(Number);
            const openCron = `0 ${adjustedMinute} ${adjustedHour} * * *`;
            schedule.scheduleJob(`openGroup_${group.key.split('_')[1]}`, openCron, async () => {
                await conn.groupSettingUpdate(group.key.split('_')[1], 'not_announcement');
                await conn.sendMessage(group.key.split('_')[1], { text: `*𝗚𝗿𝗼𝘂𝗽 𝗢𝗽𝗲𝗻𝗲𝗱 𝗮𝘁 ${openTime}. 🔓*\nᴍʀ ᴅɪʟᴀ ᴏꜰᴄ` });
            });
        }
        if (closeTime) {
            const adjustedCloseTime = adjustTime(closeTime);
            const [adjustedHour, adjustedMinute] = adjustedCloseTime.split(':').map(Number);
            const closeCron = `0 ${adjustedMinute} ${adjustedHour} * * *`;
            schedule.scheduleJob(`closeGroup_${group.key.split('_')[1]}`, closeCron, async () => {
                await conn.groupSettingUpdate(group.key.split('_')[1], 'announcement');
                await conn.sendMessage(group.key.split('_')[1], { text: `*𝗚𝗿𝗼𝘂𝗽 𝗖𝗹𝗼𝘀𝗲𝗱 𝗮𝘁 ${closeTime}. 🔒*\nᴍʿ ᴅɪʟᴀ ᴏꜰᴄ` });
            });
        }
    }
};

initializeScheduledJobs();
