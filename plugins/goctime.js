const { cmd } = require('../command');
const schedule = require('node-schedule');
const moment = require('moment-timezone'); // Ensure you have installed this package
const { readEnv } = require('../lib/database');

const TIMEZONE = 'Asia/Colombo';  // Set the timezone

// Function to adjust time by subtracting 5 hours and 30 minutes
function adjustTime(time) {
    const [hour, minute] = time.split(':').map(Number);
    return moment.tz({ hour, minute }, TIMEZONE).subtract(5, 'hours').subtract(30, 'minutes').format('HH:mm');
}

// Load group times from config
const loadGroupTimes = async () => {
    const config = await readEnv();
    const groupTimeData = config.GROUP_TIME.split(',');
    const groupTimes = {};

    groupTimeData.forEach(data => {
        const [groupId, openTime, closeTime] = data.split('/');
        groupTimes[groupId] = { openTime, closeTime };
    });

    console.log("Loaded group times:", groupTimes); // Debugging output
    return groupTimes;
};

// Schedule opening and closing for groups
const scheduleGroupTimes = async (conn) => {
    const groupTimes = await loadGroupTimes();

    for (const [groupId, times] of Object.entries(groupTimes)) {
        const adjustedOpenTime = adjustTime(times.openTime);
        const adjustedCloseTime = adjustTime(times.closeTime);
        
        const [openHour, openMinute] = adjustedOpenTime.split(':').map(Number);
        const openCron = `0 ${openMinute} ${openHour} * * *`;
        
        const [closeHour, closeMinute] = adjustedCloseTime.split(':').map(Number);
        const closeCron = `0 ${closeMinute} ${closeHour} * * *`;

        console.log(`Scheduling group ${groupId}: Open at ${openCron}, Close at ${closeCron}`); // Debugging output

        // Schedule opening
        schedule.scheduleJob(`openGroup_${groupId}`, openCron, async () => {
            await conn.groupSettingUpdate(groupId, 'not_announcement');
            await conn.sendMessage(groupId, { text: `*𝗚𝗿𝗼𝘂𝗽 𝗢𝗽𝗲𝗻𝗲𝗱 𝗮𝘁 ${times.openTime}. 🔓*\nᴍʀ ᴅɪʟᴀ ᴏꜰᴄ` });
        });

        // Schedule closing
        schedule.scheduleJob(`closeGroup_${groupId}`, closeCron, async () => {
            await conn.groupSettingUpdate(groupId, 'announcement');
            await conn.sendMessage(groupId, { text: `*𝗚𝗿𝗼𝘂𝗽 𝗖𝗹𝗼𝘀𝗲𝗱 𝗮𝘁 ${times.closeTime}. 🔒*\nᴍʀ ᴅɪʟᴀ ᴏꜰᴄ` });
        });
    }
};

// Initialize scheduling
const initGroupSchedules = async (conn) => {
    await scheduleGroupTimes(conn);
};

// Call this function with your connection object to start scheduling
// initGroupSchedules(conn);
