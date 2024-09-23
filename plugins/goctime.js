const { cmd } = require('../command');
const sensitiveData = require('../dila_md_licence/a/b/c/d/dddamsbs');
const schedule = require('node-schedule');
const moment = require('moment-timezone');
const fs = require('fs');
const TIMEZONE = 'Asia/Colombo';
const dbFilePath = './data/goctimes.json';

function adjustTime(time) {
    const [hour, minute] = time.split(':').map(Number);
    return moment.tz({ hour, minute }, TIMEZONE).subtract(5, 'hours').subtract(30, 'minutes').format('HH:mm');
}

const readGroupTimes = () => {
    if (!fs.existsSync(dbFilePath)) {
        fs.writeFileSync(dbFilePath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(dbFilePath));
};

const saveGroupTimes = (data) => {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
};

// Open Time Command
cmd({ pattern: "opentime", desc: "Set daily open time for the group", category: "group", filename: __filename }, async (conn, mek, m, { from, args, isGroup, isBotAdmins, isAdmins, reply }) => {
    if (!isGroup) return reply('This command can only be used in a group. 🚫');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
    if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');
    if (args.length < 1) return reply('Usage: .opentime <HH:mm>[,<HH:mm>,<HH:mm>...]');

    const openTimes = args[0].split(',');  // Store original times
    openTimes.forEach((openTime) => {
        const adjustedOpenTime = adjustTime(openTime);  // Adjust each time
        const [adjustedHour, adjustedMinute] = adjustedOpenTime.split(':').map(Number);
        const openCron = `0 ${adjustedMinute} ${adjustedHour} * * *`;

        schedule.cancelJob(`openGroup_${from}_${openTime}`);  // Cancel job for each specific time
        schedule.scheduleJob(`openGroup_${from}_${openTime}`, openCron, async () => {
            await conn.groupSettingUpdate(from, 'not_announcement');
            await conn.sendMessage(from, { text: `*𝗚𝗿𝗼𝘂𝗽 𝗢𝗽𝗲𝗻𝗲𝗱 𝗮𝘁 ${openTime}. 🔓*\n${sensitiveData.footerText}` });  // Use original openTime
        });
    });

    const groupTimes = readGroupTimes();
    groupTimes[from] = { openTimes: args[0], ...groupTimes[from] };  // Save all open times
    saveGroupTimes(groupTimes);

    reply(`*𝗚𝗿𝗼𝘂𝗽 𝗪𝗶𝗹𝗹 𝗢𝗽𝗲𝗻 𝗗𝗮𝗶𝗹𝘆 𝗮𝘁 ${args[0]}. ⏰*`);
});

// Close Time Command
cmd({ pattern: "closetime", desc: "Set daily close time for the group", category: "group", filename: __filename }, async (conn, mek, m, { from, args, isGroup, isBotAdmins, isAdmins, reply }) => {
    if (!isGroup) return reply('This command can only be used in a group. 🚫');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
    if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');
    if (args.length < 1) return reply('Usage: .closetime <HH:mm>[,<HH:mm>,<HH:mm>...]');

    const closeTimes = args[0].split(',');  // Store original times
    closeTimes.forEach((closeTime) => {
        const adjustedCloseTime = adjustTime(closeTime);  // Adjust each time
        const [adjustedHour, adjustedMinute] = adjustedCloseTime.split(':').map(Number);
        const closeCron = `0 ${adjustedMinute} ${adjustedHour} * * *`;

        schedule.cancelJob(`closeGroup_${from}_${closeTime}`);  // Cancel job for each specific time
        schedule.scheduleJob(`closeGroup_${from}_${closeTime}`, closeCron, async () => {
            await conn.groupSettingUpdate(from, 'announcement');
            await conn.sendMessage(from, { text: `*𝗚𝗿𝗼𝘂𝗽 𝗖𝗹𝗼𝘀𝗲𝗱 𝗮𝘁 ${closeTime}. 🔒*\n${sensitiveData.footerText}` });  // Use original closeTime
        });
    });

    const groupTimes = readGroupTimes();
    groupTimes[from] = { closeTimes: args[0], ...groupTimes[from] };  // Save all close times
    saveGroupTimes(groupTimes);

    reply(`*𝗚𝗿𝗼𝘂𝗽 𝗪𝗶𝗹𝗹 𝗖𝗹𝗼𝘀𝗲 𝗗𝗮𝗶𝗹𝘆 𝗮𝘁 ${args[0]}. ⏰*`);
});

// Load scheduled jobs for saved times
const loadScheduledJobs = () => {
    const groupTimes = readGroupTimes();
    for (const [groupId, times] of Object.entries(groupTimes)) {
        if (times.openTimes) {
            const openTimes = times.openTimes.split(',');
            openTimes.forEach((openTime) => {
                const adjustedOpenTime = adjustTime(openTime);
                const [adjustedHour, adjustedMinute] = adjustedOpenTime.split(':').map(Number);
                const openCron = `0 ${adjustedMinute} ${adjustedHour} * * *`;
                schedule.scheduleJob(`openGroup_${groupId}_${openTime}`, openCron, async () => {
                    await conn.groupSettingUpdate(groupId, 'not_announcement');
                    await conn.sendMessage(groupId, { text: `*𝗚𝗿𝗼𝘂𝗽 𝗢𝗽𝗲𝗻𝗲𝗱 𝗮𝘁 ${openTime}. 🔓*\n${sensitiveData.footerText}` });  // Use original openTime
                });
            });
        }

        if (times.closeTimes) {
            const closeTimes = times.closeTimes.split(',');
            closeTimes.forEach((closeTime) => {
                const adjustedCloseTime = adjustTime(closeTime);
                const [adjustedHour, adjustedMinute] = adjustedCloseTime.split(':').map(Number);
                const closeCron = `0 ${adjustedMinute} ${adjustedHour} * * *`;
                schedule.scheduleJob(`closeGroup_${groupId}_${closeTime}`, closeCron, async () => {
                    await conn.groupSettingUpdate(groupId, 'announcement');
                    await conn.sendMessage(groupId, { text: `*𝗚𝗿𝗼𝘂𝗽 𝗖𝗹𝗼𝘀𝗲𝗱 𝗮𝘁 ${closeTime}. 🔒*\n${sensitiveData.footerText}` });  // Use original closeTime
                });
            });
        }
    }
};

loadScheduledJobs();
