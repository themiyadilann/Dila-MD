const { cmd } = require('../command');
const sensitiveData = require('../dila_md_licence/a/b/c/d/dddamsbs');

// Function to send welcome message to new members
const sendWelcomeMessage = async (conn, groupId, memberId) => {
    const welcomeMessage = `*Welcome to the group, @${memberId.split('@')[0]}! 🎉*\n*Feel free to introduce yourself and have fun!*\n${sensitiveData.footerText}`;
    await conn.sendMessage(groupId, { text: welcomeMessage, mentions: [memberId] });
};

// Event listener for new group participants
conn.ev.on('group-participants.update', async (update) => {
    const { id, participants, action } = update; // id = group id, participants = new members, action = add/remove
    if (action === 'add') {  // Check if the action is a new member joining
        participants.forEach(async (participant) => {
            await sendWelcomeMessage(conn, id, participant);  // Send welcome message to each new member
        });
    }
});
