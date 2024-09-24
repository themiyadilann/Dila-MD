const { cmd } = require('../command');
const sensitiveData = require('../dila_md_licence/a/b/c/d/dddamsbs');
const schedule = require('node-schedule');
const moment = require('moment-timezone');
const fs = require('fs');
const TIMEZONE = 'Asia/Colombo';
const dbFilePath = './data/goctimes.json';

// Function to adjust the given time by subtracting 5 hours and 30 minutes
function adjustTime(time) {
    const [hour, minute] = time.split(':').map(Number);
    return moment.tz({ hour, minute }, TIMEZONE).subtract(5, 'hours').subtract(30, 'minutes').format('HH:mm');
}

// Function to read group times from the JSON file
const readGroupTimes = () => {
    if (!fs.existsSync(dbFilePath)) {
        fs.writeFileSync(dbFilePath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(dbFilePath));
};

// Function to save group times to the JSON file
const saveGroupTimes = (data) => {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
};

// Command to set daily open time for the group or reset
cmd({
    pattern: "opentime",
    desc: "Set daily open time for the group or reset",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, args, isGroup, isBotAdmins, isAdmins, reply }) => {
    if (!isGroup) return reply('This command can only be used in a group. 🚫');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
    if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');

    if (args[0] === 'reset') {
        const groupTimes = readGroupTimes();
        if (!groupTimes[from]?.openTimes) return reply('*𝗡𝗼 𝗢𝗽𝗲𝗻 𝗧𝗶𝗺𝗲 𝗳𝗼𝗿 𝘁𝗵𝗶𝘀 𝗴𝗿𝗼𝘂𝗽 𝗳𝗼𝘂𝗻𝗱. ❌*');
        delete groupTimes[from].openTimes;
        saveGroupTimes(groupTimes);
        return reply('*𝗚𝗿𝗼𝘂𝗽 𝗢𝗽𝗲𝗻 𝗧𝗶𝗺𝗲 𝗥𝗲𝘀𝗲𝘁𝘁𝗲𝗱. 🔄*');
    }

    if (args.length < 1) return reply('𝗚𝗿𝗼𝘂𝗽 𝗔𝘂𝘁𝗼 𝗢𝗽𝗲𝗻 🔓\n\n𝚂𝚎𝚝 𝚐𝚛𝚘𝚞𝚙 𝚘𝚙𝚎𝚗 𝚝𝚒𝚖𝚎\n     .opentime HH:MM,HH:MM...\n𝚁𝚎𝚜𝚎𝚝 𝚐𝚛𝚘𝚞𝚙 𝚘𝚙𝚎𝚗 𝚝𝚒𝚖𝚎\n     .opentime reset\n𝙶𝚛𝚘𝚞𝚙 𝚃𝚒𝚖𝚎 𝚍𝚎𝚝𝚊𝚒𝚕𝚜\n     .grouptimelist\n\nᴍᴀᴅᴇ ʙʏ ᴍʀ ᴅɪʟᴀ ᴏꜰᴄ');

    const openTimes = args[0].split(',');
    openTimes.forEach((openTime) => {
        const adjustedOpenTime = adjustTime(openTime);
        const [adjustedHour, adjustedMinute] = adjustedOpenTime.split(':').map(Number);
        const openCron = `0 ${adjustedMinute} ${adjustedHour} * * *`;
        schedule.cancelJob(`openGroup_${from}_${openTime}`);
        schedule.scheduleJob(`openGroup_${from}_${openTime}`, openCron, async () => {
            await conn.groupSettingUpdate(from, 'not_announcement');
            await conn.sendMessage(from, { text: `*𝗚𝗿𝗼𝘂𝗽 𝗢𝗽𝗲𝗻𝗲𝗱 𝗮𝘁 ${openTime}. 🔓*\n${sensitiveData.footerText}` });
        });
    });

    const groupTimes = readGroupTimes();
    groupTimes[from] = { openTimes: args[0], ...groupTimes[from] };
    saveGroupTimes(groupTimes);
    reply(`*𝗚𝗿𝗼𝘂𝗽 𝗪𝗶𝗹𝗹 𝗢𝗽𝗲𝗻 𝗗𝗮𝗶𝗹𝘆 𝗮𝘁 ${args[0]}. ⏰*`);
});

// Command to set daily close time for the group or reset
cmd({
    pattern: "closetime",
    desc: "Set daily close time for the group or reset",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, args, isGroup, isBotAdmins, isAdmins, reply }) => {
    if (!isGroup) return reply('This command can only be used in a group. 🚫');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
    if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');

    if (args[0] === 'reset') {
        const groupTimes = readGroupTimes();
        if (!groupTimes[from]?.closeTimes) return reply('*𝗡𝗼 𝗖𝗹𝗼𝘀𝗲 𝗧𝗶𝗺𝗲 𝗳𝗼𝗿 𝘁𝗵𝗶𝘀 𝗴𝗿𝗼𝘂𝗽 𝗳𝗼𝘂𝗻𝗱. ❌*');
        delete groupTimes[from].closeTimes;
        saveGroupTimes(groupTimes);
        return reply('*𝗚𝗿𝗼𝘂𝗽 𝗖𝗹𝗼𝘀𝗲 𝗧𝗶𝗺𝗲 𝗥𝗲𝘀𝗲𝘁𝘁𝗲𝗱. 🔄*');
    }

    if (args.length < 1) return reply('𝗚𝗿𝗼𝘂𝗽 𝗔𝘂𝘁𝗼 𝗖𝗹𝗼𝘀𝗲 🔒\n\n𝚂𝚎𝚝 𝚐𝚛𝚘𝚞𝚙 𝚌𝚕𝚘𝚜𝚎 𝚝𝚒𝚖𝚎\n     .closetime HH:MM,HH:MM...\n𝚁𝚎𝚜𝚎𝚝 𝚐𝚛𝚘𝚞𝚙 𝚌𝚕𝚘𝚜𝚎 𝚝𝚒𝚖𝚎\n     .closetime reset\n𝙶𝚛𝚘𝚞𝚙 𝚃𝚒𝚖𝚎 𝚍𝚎𝚝𝚊𝚒𝚕𝚜\n     .grouptimelist\n\nᴍᴀᴅᴇ ʙʏ ᴍʀ ᴅɪʟᴀ ᴏꜰᴄ');

    const closeTimes = args[0].split(',');
    closeTimes.forEach((closeTime) => {
        const adjustedCloseTime = adjustTime(closeTime);
        const [adjustedHour, adjustedMinute] = adjustedCloseTime.split(':').map(Number);
        const closeCron = `0 ${adjustedMinute} ${adjustedHour} * * *`;
        schedule.cancelJob(`closeGroup_${from}_${closeTime}`);

        const warnCron = `0 ${adjustedMinute - 5} ${adjustedHour} * * *`;
        schedule.scheduleJob(`warnClose_${from}_${closeTime}`, warnCron, async () => {
            await conn.sendMessage(from, { text: `_තව විනාඩි 5 කින් සමූහය වසා දමයි....🤖_` });
        });

        schedule.scheduleJob(`closeGroup_${from}_${closeTime}`, closeCron, async () => {
            for (let i = 5; i >= 1; i--) {
                await conn.sendMessage(from, { text: `*Group closes in ${i} seconds*` });
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            await conn.groupSettingUpdate(from, 'announcement');
            await conn.sendMessage(from, { text: `*𝗚𝗿𝗼𝘂𝗽 𝗖𝗹𝗼𝘀𝗲𝗱 𝗮𝘁 ${closeTime}. 🔒*\n${sensitiveData.footerText}` });
        });
    });

    const groupTimes = readGroupTimes();
    groupTimes[from] = { closeTimes: args[0], ...groupTimes[from] };
    saveGroupTimes(groupTimes);
    reply(`*𝗚𝗿𝗼𝘂𝗽 𝗪𝗶𝗹𝗹 𝗖𝗹𝗼𝘀𝗲 𝗗𝗮𝗶𝗹𝘆 𝗮𝘁 ${args[0]}. ⏰*`);
});

// Command to list group open and close times
cmd({
    pattern: "grouptimelist",
    desc: "List daily open and close times for the group",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, reply }) => {
    if (!isGroup) return reply('This command can only be used in a group. 🚫');

    const groupTimes = readGroupTimes();
    const times = groupTimes[from];
    if (!times) return reply('*𝗚𝗿𝗼𝘂𝗽 𝗧𝗶𝗺𝗲𝘀 𝗡𝗼𝘁 𝗳𝗼𝘂𝗻𝗱. ❌*');

    const openTimes = times.openTimes ? `Open Times: ${times.openTimes}` : 'No Open Times Set.';
    const closeTimes = times.closeTimes ? `Close Times: ${times.closeTimes}` : 'No Close Times Set.';
    
    reply(`*𝗚𝗿𝗼𝘂𝗽 𝗧𝗶𝗺𝗲𝘀 𝗙𝗼𝗿 𝗧𝗵𝗶𝘀 𝗚𝗿𝗼𝘂𝗽:*\n${openTimes}\n${closeTimes}`);
});
