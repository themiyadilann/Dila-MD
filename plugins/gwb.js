const { cmd } = require('../command');
const sensitiveData = require('../dila_md_licence/a/b/c/d/dddamsbs');

// In-memory store for the welcome feature toggle
const welcomeSettings = {}; // Key: groupId, Value: true (on) or false (off)

// Function to send welcome message to new members
const sendWelcomeMessage = async (conn, groupId, memberId) => {
    try {
        const welcomeMessage = `*Welcome to the group, @${memberId.split('@')[0]}! 🎉*\nFeel free to introduce yourself and have fun! ✨\n${sensitiveData.footerText}`;
        console.log(`Sending welcome message to ${memberId} in group ${groupId}:`, welcomeMessage); // Debug log
        await conn.sendMessage(groupId, { text: welcomeMessage, mentions: [memberId] });
    } catch (error) {
        console.error("Error sending welcome message:", error);
    }
};

// Event listener for new group participants
const registerGroupWelcomeListener = (conn) => {
    conn.ev.on('group-participants.update', async (update) => {
        try {
            const { id, participants, action } = update; // id = group id, participants = new members, action = add/remove
            if (action === 'add') {
                // Ensure welcome messages are enabled for this group
                if (!welcomeSettings[id]) {
                    console.log(`Welcome messages are disabled for group ${id}`);
                    return;
                }
                
                participants.forEach(async (participant) => {
                    try {
                        await sendWelcomeMessage(conn, id, participant);  // Send welcome message to each new member
                    } catch (error) {
                        console.error(`Error sending welcome message to participant ${participant}:`, error);
                    }
                });
            }
        } catch (error) {
            console.error("Error in group-participants.update event:", error);
        }
    });
};

// Example of registering the event listener in your main file
cmd({ 
    pattern: "welcome", 
    react: "👋", 
    desc: "Turn welcome messages on/off", 
    category: "group", 
    use: '&welcome on/off',  // Update the pattern to use '&' as the prefix
    filename: __filename 
}, 
async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, reply, args }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group. 🚫');
        if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
        if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');

        const action = args[0]?.toLowerCase();
        
        // Validate the argument for "on" or "off"
        if (!action || (action !== 'on' && action !== 'off')) {
            return reply('Please use `&welcome on` or `&welcome off`. ⚙️'); // Adjust for the correct prefix
        }

        // Toggle welcome message setting
        if (action === 'on') {
            welcomeSettings[from] = true;
            reply('Welcome message functionality activated! 🥳');
        } else if (action === 'off') {
            welcomeSettings[from] = false;
            reply('Welcome message functionality deactivated! 😶');
        }

        // Register the event listener for new participants if not already registered
        if (!conn.ev.listenerCount('group-participants.update')) {
            console.log('Registering group-participants.update listener...');
            registerGroupWelcomeListener(conn);
        }
        
    } catch (e) {
        console.error("Detailed error setting up welcome messages:", e); // Add this to log the exact error
        reply('Error setting up welcome messages. ⚠️');
    }
});
