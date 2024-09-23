const { cmd } = require('../command');
const sensitiveData = require('../dila_md_licence/a/b/c/d/dddamsbs');

// Function to send welcome message to new members in group
const sendGroupWelcomeMessage = async (conn, groupId, participants, groupName) => {
    // Create a mention list for the message
    const mentions = participants.map(participant => participant.split('@')[0]);
    const welcomeMessage = `𝗛𝗲𝘆 ${mentions.join(', ')} 👋\n𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 *${groupName}* 🎉\nˢᵉᵊ ᵍʳᵒᵘᵖ ᵈᵉˢᶜʳⁱᵖᵗⁱᵒⁿ\n\nᴍᴀᴅᴇ ʙʏ ᴍʳ ᴅɪʟᴀ ᴏꜰᴄ`;

    await conn.sendMessage(groupId, {
        text: welcomeMessage,
        mentions: participants
    });
};

// Function to send a private welcome message to each new member
const sendPrivateWelcomeMessage = async (conn, memberId, groupName) => {
    const pushname = memberId.split('@')[0]; // Get the member's name from the ID
    const welcomeMessage = `𝗛𝗲𝘆 ${pushname} 👋\n𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 *${groupName}* 🎉\nˢᵉᵊ ᵍʳᵒᵘᵖ ᵈᵉˢᶜʳⁱᵖᵗⁱᵒⁿ\n\nᴍᴀᴅᴇ ʙʏ ᴍʳ ᴅɪʟᴀ ᴏꜰᴄ`;

    await conn.sendMessage(memberId, {
        text: welcomeMessage
    });
};

// Event listener for new group participants
const registerGroupWelcomeListener = (conn) => {
    conn.ev.on('group-participants.update', async (update) => {
        const { id, participants, action } = update; // id = group id, participants = new members, action = add/remove
        if (action === 'add') { // Check if the action is a new member joining
            const groupMetadata = await conn.groupMetadata(id);
            const groupName = groupMetadata.subject;

            // Send group welcome message
            await sendGroupWelcomeMessage(conn, id, participants, groupName);

            // Send private welcome messages
            for (const participant of participants) {
                await sendPrivateWelcomeMessage(conn, participant, groupName);
            }
        }
    });
};

// Example of registering the event listener in your main file
cmd({
    pattern: "welcome",
    react: "👋",
    desc: "Send a welcome message when a new member joins the group",
    category: "group",
    use: '.greet',
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group. 🚫');
        if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
        if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');

        // Register the event listener for new participants
        registerGroupWelcomeListener(conn);

        reply('Welcome message functionality activated! 🥳');
    } catch (e) {
        reply('Error setting up welcome messages. ⚠️');
        console.log('Error setting up welcome messages:', e);
    }
});
