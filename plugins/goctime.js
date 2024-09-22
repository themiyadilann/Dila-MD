const { cmd } = require('../command');
const schedule = require('node-schedule');
const moment = require('moment-timezone'); // Ensure you have installed this package

let openTime, closeTime;

const TIMEZONE = 'Asia/Colombo';  // Set the timezone

// Function to subtract 5 hours and 30 minutes from the input time
function adjustTime(time) {
    const [hour, minute] = time.split(':').map(Number);
    return moment.tz({ hour, minute }, TIMEZONE).subtract(5, 'hours').subtract(30, 'minutes').format('HH:mm');
}

cmd({ pattern: "opentime", desc: "Set daily open time for the group", category: "group", filename: __filename }, async (conn, mek, m, { from, args, isGroup, isBotAdmins, isAdmins, reply }) => {
    if (!isGroup) return reply('This command can only be used in a group. 🚫');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
    if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');
    
    if (args.length < 1) return reply('Usage: .opentime <HH:mm>');

    openTime = args[0];

    // Adjust the time by subtracting 5 hours and 30 minutes
    const adjustedOpenTime = adjustTime(openTime);
    const [adjustedHour, adjustedMinute] = adjustedOpenTime.split(':').map(Number);
    const openCron = `0 ${adjustedMinute} ${adjustedHour} * * *`;

    schedule.scheduleJob('openGroup', openCron, async () => {
        await conn.groupSettingUpdate(from, 'not_announcement');
        await conn.sendMessage(from, { text: `Group opened at ${openTime} (Asia/Colombo time). 🔓\nᴍʀ ᴅɪʟᴀ ᴏꜰᴄ` });
    });

    reply(`Group will open daily at ${openTime} (Asia/Colombo time), which corresponds to ${adjustedOpenTime} in your current system time. ⏰`);
});

cmd({ pattern: "closetime", desc: "Set daily close time for the group", category: "group", filename: __filename }, async (conn, mek, m, { from, args, isGroup, isBotAdmins, isAdmins, reply }) => {
    if (!isGroup) return reply('This command can only be used in a group. 🚫');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
    if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');

    if (args.length < 1) return reply('Usage: .closetime <HH:mm>');

    closeTime = args[0];

    // Adjust the time by subtracting 5 hours and 30 minutes
    const adjustedCloseTime = adjustTime(closeTime);
    const [adjustedHour, adjustedMinute] = adjustedCloseTime.split(':').map(Number);
    const closeCron = `0 ${adjustedMinute} ${adjustedHour} * * *`;

    schedule.scheduleJob('closeGroup', closeCron, async () => {
        await conn.groupSettingUpdate(from, 'announcement');
        await conn.sendMessage(from, { text: `Group closed at ${closeTime} (Asia/Colombo time). 🔒\nᴍʀ ᴅɪʟᴀ ᴏꜰᴄ` });
    });

    reply(`Group will close daily at ${closeTime} (Asia/Colombo time), which corresponds to ${adjustedCloseTime} in your current system time. ⏰`);
});
