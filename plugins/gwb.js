const { cmd } = require('../command');
const sensitiveData = require('../dila_md_licence/a/b/c/d/dddamsbs');

let welcomeEnabled = false; // Variable to track if welcome messages are enabled

// Function to send welcome message to new members
const sendWelcomeMessage = async (conn, groupId, memberId) => {
    const welcomeMessage = `*Welcome to the group, @${memberId.split('@')[0]}! 🎉*\nFeel free to introduce yourself and have fun! ✨\n${sensitiveData.footerText}`;
    await conn.sendMessage(groupId, { text: welcomeMessage, mentions: [memberId] });
};

// Event listener for new group participants
const registerGroupWelcomeListener = (conn) => {
    conn.ev.on('group-participants.update', async (update) => {
        const { id, participants, action } = update; // id = group id, participants = new members, action = add/remove
        if (action === 'add' && welcomeEnabled) {  // Check if welcome messages are enabled
            participants.forEach(async (participant) => {
                await sendWelcomeMessage(conn, id, participant);  // Send welcome message to each new member
            });
        }
    });
};

// Command to enable welcome messages
cmd({ pattern: "welcomeon", react: "🎉", desc: "Enable welcome messages for new group members", category: "group", use: '.welcomeon', filename: __filename },
async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group. 🚫');
        if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
        if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');
        
        welcomeEnabled = true; // Set welcome messages to enabled
        registerGroupWelcomeListener(conn); // Ensure listener is registered
        reply('Welcome messages have been enabled! 🎉');
    } catch (e) {
        reply('Error enabling welcome messages. ⚠️');
        console.log(e);
    }
});

// Command to disable welcome messages
cmd({ pattern: "welcomeoff", react: "❌", desc: "Disable welcome messages for new group members", category: "group", use: '.welcomeoff', filename: __filename },
async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group. 🚫');
        if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
        if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');
        
        welcomeEnabled = false; // Set welcome messages to disabled
        reply('Welcome messages have been disabled! ❌');
    } catch (e) {
        reply('Error disabling welcome messages. ⚠️');
        console.log(e);
    }
});
