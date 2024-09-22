const { cmd } = require('../command');
const schedule = require('node-schedule'); // Make sure to install this package

let openTime, closeTime;

cmd({ pattern: "opentime", desc: "Set daily open time for the group", category: "group", filename: __filename }, async (conn, mek, m, { from, args, isGroup, isBotAdmins, isAdmins, reply }) => {
    if (!isGroup) return reply('This command can only be used in a group. 🚫');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
    if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');
    
    if (args.length < 1) return reply('Usage: .opentime <HH:mm>');

    openTime = args[0];
    schedule.scheduleJob('openGroup', `0 ${openTime.split(':')[1]} ${openTime.split(':')[0]} * * *`, async () => {
        await conn.groupSettingUpdate(from, 'not_announcement');
        await conn.sendMessage(from, { text: `Group opened at ${openTime}. 🔓\nᴍʀ ᴅɪʟᴀ ᴏꜰᴄ` });
    });

    reply(`Group will open daily at ${openTime}. ⏰`);
});

cmd({ pattern: "closetime", desc: "Set daily close time for the group", category: "group", filename: __filename }, async (conn, mek, m, { from, args, isGroup, isBotAdmins, isAdmins, reply }) => {
    if (!isGroup) return reply('This command can only be used in a group. 🚫');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
    if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');

    if (args.length < 1) return reply('Usage: .closetime <HH:mm>');

    closeTime = args[0];
    schedule.scheduleJob('closeGroup', `0 ${closeTime.split(':')[1]} ${closeTime.split(':')[0]} * * *`, async () => {
        await conn.groupSettingUpdate(from, 'announcement');
        await conn.sendMessage(from, { text: `Group closed at ${closeTime}. 🔒\nᴍʀ ᴅɪʟᴀ ᴏꜰᴄ` });
    });

    reply(`Group will close daily at ${closeTime}. ⏰`);
});
