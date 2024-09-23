const { cmd } = require('../command');
const schedule = require('node-schedule');
const moment = require('moment-timezone');
const fs = require('fs');

const TIMEZONE = 'Asia/Colombo'; // Set the timezone
const dbFilePath = require('../data/goctimes.json'); // Updated path for the JSON file

// Function to adjust time
function adjustTime(time) {
    const [hour, minute] = time.split(':').map(Number);
    return moment.tz({ hour, minute }, TIMEZONE).subtract(5, 'hours').subtract(30, 'minutes').format('HH:mm');
}

// Function to read group times from JSON
const readGroupTimes = () => {
    if (!fs.existsSync(dbFilePath)) {
        fs.writeFileSync(dbFilePath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(dbFilePath));
};

// Function to save group times to JSON
const saveGroupTimes = (data) => {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
};

cmd({ pattern: "opentime", desc: "Set daily open time for the group", category: "group", filename: __filename }, async (conn, mek, m, { from, args, isGroup, isBotAdmins, isAdmins, reply }) => {
    if (!isGroup) return reply('This command can only be used in a group. 🚫');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
    if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');

    if (args.length < 1) return reply('Usage: .opentime <HH:mm>');

    const openTime = args[0];
    const adjustedOpenTime = adjustTime(openTime);
    const [adjustedHour, adjustedMinute] = adjustedOpenTime.split(':').map(Number);
    const openCron = `0 ${adjustedMinute} ${adjustedHour} * * *`;

    // Clear any existing job before scheduling a new one
    schedule.cancelJob(`openGroup_${from}`);
    
    schedule.scheduleJob(`openGroup_${from}`, openCron, async () => {
        await conn.groupSettingUpdate(from, 'not_announcement');
        await conn.sendMessage(from, { text: `*𝗚𝗿𝗼𝘂𝗽 𝗢𝗽𝗲𝗻𝗲𝗱 𝗮𝘁 ${openTime}. 🔓*\nᴍʀ ᴅɪʟᴀ ᴏꜰᴄ` });
    });

    // Save to database
    const groupTimes = readGroupTimes();
    groupTimes[from] = { openTime, ...groupTimes[from] }; // Store or update open time
    saveGroupTimes(groupTimes);

    reply(`*𝗚𝗿𝗼𝘂𝗽 𝗪𝗶𝗹𝗹 𝗢𝗽𝗲𝗻 𝗗𝗮𝗶𝗹𝘆 𝗮𝘁 ${openTime}. ⏰*`);
});

cmd({ pattern: "closetime", desc: "Set daily close time for the group", category: "group", filename: __filename }, async (conn, mek, m, { from, args, isGroup, isBotAdmins, isAdmins, reply }) => {
    if (!isGroup) return reply('This command can only be used in a group. 🚫');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
    if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');

    if (args.length < 1) return reply('Usage: .closetime <HH:mm>');

    const closeTime = args[0];
    const adjustedCloseTime = adjustTime(closeTime);
    const [adjustedHour, adjustedMinute] = adjustedCloseTime.split(':').map(Number);
    const closeCron = `0 ${adjustedMinute} ${adjustedHour} * * *`;

    // Clear any existing job before scheduling a new one
    schedule.cancelJob(`closeGroup_${from}`);

    schedule.scheduleJob(`closeGroup_${from}`, closeCron, async () => {
        await conn.groupSettingUpdate(from, 'announcement');
        await conn.sendMessage(from, { text: `*𝗚𝗿𝗼𝘂𝗽 𝗖𝗹𝗼𝘀𝗲𝗱 𝗮𝘁 ${closeTime}. 🔒*\nᴍʀ ᴅɪʟᴀ ᴏꜰᴄ` });
    });

    // Save to database
    const groupTimes = readGroupTimes();
    groupTimes[from] = { closeTime, ...groupTimes[from] }; // Store or update close time
    saveGroupTimes(groupTimes);

    reply(`*𝗚𝗿𝗼𝘂𝗽 𝗪𝗶𝗹𝗹 𝗖𝗹𝗼𝘀𝗲 𝗗𝗮𝗶𝗹𝘆 𝗮𝘁 ${closeTime}. ⏰*`);
});

// Load scheduled jobs on startup
const loadScheduledJobs = () => {
    const groupTimes = readGroupTimes();
    for (const [groupId, times] of Object.entries(groupTimes)) {
        if (times.openTime) {
            const adjustedOpenTime = adjustTime(times.openTime);
            const [adjustedHour, adjustedMinute] = adjustedOpenTime.split(':').map(Number);
            const openCron = `0 ${adjustedMinute} ${adjustedHour} * * *`;

            schedule.scheduleJob(`openGroup_${groupId}`, openCron, async () => {
                // Assuming conn is available here
                await conn.groupSettingUpdate(groupId, 'not_announcement');
                await conn.sendMessage(groupId, { text: `*𝗚𝗿𝗼𝘂𝗽 𝗢𝗽𝗲𝗻𝗲𝗱 𝗮𝘁 ${times.openTime}. 🔓*\nᴍʀ ᴅɪʟᴀ ᴏꜰᴄ` });
            });
        }

        if (times.closeTime) {
            const adjustedCloseTime = adjustTime(times.closeTime);
            const [adjustedHour, adjustedMinute] = adjustedCloseTime.split(':').map(Number);
            const closeCron = `0 ${adjustedMinute} ${adjustedHour} * * *`;

            schedule.scheduleJob(`closeGroup_${groupId}`, closeCron, async () => {
                // Assuming conn is available here
                await conn.groupSettingUpdate(groupId, 'announcement');
                await conn.sendMessage(groupId, { text: `*𝗚𝗿𝗼𝘂𝗽 𝗖𝗹𝗼𝘀𝗲𝗱 𝗮𝘁 ${times.closeTime}. 🔒*\nᴍʿ ᴅɪʟᴀ ᴏꜰᴄ` });
            });
        }
    }
};

// Call this function on startup to load existing scheduled jobs
loadScheduledJobs();
