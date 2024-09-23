const { cmd } = require('../command');
const sensitiveData = require('../dila_md_licence/a/b/c/d/dddamsbs');

// In-memory store for the welcome feature toggle
const welcomeSettings = {}; // Key: groupId, Value: true (on) or false (off)

// Function to send welcome message to new members
const sendWelcomeMessage = async (conn, groupId, memberId) => {
    const welcomeMessage = `*Welcome to the group, @${memberId.split('@')[0]}! 🎉*\nFeel free to introduce yourself and have fun! ✨\n${sensitiveData.footerText}`;
    await conn.sendMessage(groupId, { text: welcomeMessage, mentions: [memberId] });
};

// Event listener for new group participants
const registerGroupWelcomeListener = (conn) => {
    conn.ev.on('group-participants.update', async (update) => {
        const { id, participants, action } = update; // id = group id, participants = new members, action = add/remove
        if (action === 'add' && welcomeSettings[id]) {  // Check if welcome is enabled for the group
            participants.forEach(async (participant) => {
                await sendWelcomeMessage(conn, id, participant);  // Send welcome message to each new member
            });
        }
    });
};

// Example of registering the event listener in your main file
cmd({ pattern: "welcome", react: "👋", desc: "Turn welcome messages on/off", category: "group", use: '.welcome on/off', filename: __filename }, 
async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, reply, args }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group. 🚫');
        if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
        if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');

        const action = args[0]?.toLowerCase();
        
        if (!action || (action !== 'on' && action !== 'off')) {
            return reply('Please use `.welcome on` or `.welcome off`. ⚙️');
        }

        // Toggle welcome message setting
        if (action === 'on') {
            welcomeSettings[from] = true;
            reply('Welcome message functionality activated! 🥳');
        } else if (action === 'off') {
            welcomeSettings[from] = false;
            reply('Welcome message functionality deactivated! 😶');
        }

        // Register the event listener for new participants (if not already registered)
        if (!conn.ev.listenerCount('group-participants.update')) {
            registerGroupWelcomeListener(conn);
        }
        
    } catch (e) {
        reply('Error setting up welcome messages. ⚠️');
        console.log(e);
    }
});
