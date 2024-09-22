const { cmd } = require('../command');
const schedule = require('node-schedule');
const moment = require('moment-timezone');
const { updateEnv, getEnvVar } = require('../lib/database'); // Import the database functions

const TIMEZONE = 'Asia/Colombo'; // Set the timezone

// Function to adjust time
function adjustTime(time) {
    const [hour, minute] = time.split(':').map(Number);
    return moment.tz({ hour, minute }, TIMEZONE).subtract(5, 'hours').subtract(30, 'minutes').format('HH:mm');
}

// Command to set daily open time
cmd({ pattern: "opentime", desc: "Set daily open time for the group", category: "group", filename: __filename }, async (conn, mek, m, { from, args, isGroup, isBotAdmins, isAdmins, reply }) => {
    if (!isGroup) return reply('This command can only be used in a group. 🚫');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
    if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');

    if (args.length < 1) return reply('Usage: .opentime <HH:mm>');

    const openTime = args[0];
    const adjustedOpenTime = adjustTime(openTime);
    const [adjustedHour, adjustedMinute] = adjustedOpenTime.split(':').map(Number);
    const openCron = `0 ${adjustedMinute} ${adjustedHour} * * *`;

    schedule.scheduleJob('openGroup', openCron, async () => {
        await conn.groupSettingUpdate(from, 'not_announcement');
        await conn.sendMessage(from, { text: `*𝗚𝗿𝗼𝘂𝗽 𝗢𝗽𝗲𝗻𝗲𝗱 𝗮𝘁 ${openTime}. 🔓*\nᴍʀ ᴅɪʟᴀ ᴏꜰᴄ` });
    });

    await updateEnv('openTime', openTime);
    reply(`*𝗚𝗿𝗼𝘂𝗽 𝗪𝗶𝗹𝗹 𝗢𝗽𝗲𝗻 𝗗𝗮𝗶𝗹𝘆 𝗮𝘁 ${openTime}. ⏰*`);
});

// Command to set daily close time
cmd({ pattern: "closetime", desc: "Set daily close time for the group", category: "group", filename: __filename }, async (conn, mek, m, { from, args, isGroup, isBotAdmins, isAdmins, reply }) => {
    if (!isGroup) return reply('This command can only be used in a group. 🚫');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
    if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');

    if (args.length < 1) return reply('Usage: .closetime <HH:mm>');

    const closeTime = args[0];
    const adjustedCloseTime = adjustTime(closeTime);
    const [adjustedHour, adjustedMinute] = adjustedCloseTime.split(':').map(Number);
    const closeCron = `0 ${adjustedMinute} ${adjustedHour} * * *`;

    schedule.scheduleJob('closeGroup', closeCron, async () => {
        await conn.groupSettingUpdate(from, 'announcement');
        await conn.sendMessage(from, { text: `*𝗚𝗿𝗼𝘂𝗽 𝗖𝗹𝗼𝘀𝗲𝗱 𝗮𝘁 ${closeTime}. 🔒*\nᴍʀ ᴅɪʟᴀ ᴏꜰᴄ` });
    });

    await updateEnv('closeTime', closeTime);
    reply(`*𝗚𝗿𝗼𝘂𝗽 𝗪𝗶𝗹𝗹 𝗖𝗹𝗼𝘀𝗲 𝗗𝗮𝗶𝗹𝘆 𝗮𝘁 ${closeTime}. ⏰*`);
});

// On bot restart, retrieve times from MongoDB and schedule jobs
(async () => {
    const openTime = await getEnvVar('openTime');
    const closeTime = await getEnvVar('closeTime');

    if (openTime) {
        const adjustedOpenTime = adjustTime(openTime);
        const [adjustedHour, adjustedMinute] = adjustedOpenTime.split(':').map(Number);
        const openCron = `0 ${adjustedMinute} ${adjustedHour} * * *`;

        schedule.scheduleJob('openGroup', openCron, async () => {
            // Replace 'your_group_id' with the actual group ID
            await conn.groupSettingUpdate('your_group_id', 'not_announcement');
            await conn.sendMessage('your_group_id', { text: `*𝗚𝗿𝗼𝘂𝗽 𝗢𝗽𝗲𝗻𝗲𝗱 𝗮𝘁 ${openTime}. 🔓*\nᴍʿ ᴅɪʟᴀ ᴏꜰᴄ` });
        });
    }

    if (closeTime) {
        const adjustedCloseTime = adjustTime(closeTime);
        const [adjustedHour, adjustedMinute] = adjustedCloseTime.split(':').map(Number);
        const closeCron = `0 ${adjustedMinute} ${adjustedHour} * * *`;

        schedule.scheduleJob('closeGroup', closeCron, async () => {
            // Replace 'your_group_id' with the actual group ID
            await conn.groupSettingUpdate('your_group_id', 'announcement');
            await conn.sendMessage('your_group_id', { text: `*𝗚𝗿𝗼𝘂𝗽 𝗖𝗹𝗼𝘀𝗲𝗱 𝗮𝘁 ${closeTime}. 🔒*\nᴍʿ ᴅɪʟᴀ ᴏꜰᴄ` });
        });
    }
})();
