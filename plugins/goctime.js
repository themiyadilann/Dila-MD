const { cmd } = require('../command');
const schedule = require('node-schedule');
const moment = require('moment-timezone'); // Make sure to install this package

let openTime, closeTime;

cmd({ pattern: "opentime", desc: "Set daily open time for the group", category: "group", filename: __filename }, async (conn, mek, m, { from, args, isGroup, isBotAdmins, isAdmins, reply }) => {
    if (!isGroup) return reply('This command can only be used in a group. 🚫');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
    if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');
    
    if (args.length < 1) return reply('Usage: .opentime <HH:mm>');

    openTime = args[0];
    const [hour, minute] = openTime.split(':').map(Number);
    const openCron = `0 ${minute} ${hour} * * *`;

    schedule.scheduleJob('openGroup', openCron, async () => {
        await conn.groupSettingUpdate(from, 'not_announcement');
        await conn.sendMessage(from, { text: `Group opened at ${openTime} (Asia/Colombo time). 🔓\nᴍʀ ᴅɪʟᴀ ᴏꜰᴄ` });
    });

    reply(`Group will open daily at ${openTime} (Asia/Colombo time). ⏰`);
});

cmd({ pattern: "closetime", desc: "Set daily close time for the group", category: "group", filename: __filename }, async (conn, mek, m, { from, args, isGroup, isBotAdmins, isAdmins, reply }) => {
    if (!isGroup) return reply('This command can only be used in a group. 🚫');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
    if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');

    if (args.length < 1) return reply('Usage: .closetime <HH:mm>');

    closeTime = args[0];
    const [hour, minute] = closeTime.split(':').map(Number);
    const closeCron = `0 ${minute} ${hour} * * *`;

    schedule.scheduleJob('closeGroup', closeCron, async () => {
        await conn.groupSettingUpdate(from, 'announcement');
        await conn.sendMessage(from, { text: `Group closed at ${closeTime} (Asia/Colombo time). 🔒\nᴍʀ ᴅɪʟᴀ ᴏꜰᴄ` });
    });

    reply(`Group will close daily at ${closeTime} (Asia/Colombo time). ⏰`);
});
