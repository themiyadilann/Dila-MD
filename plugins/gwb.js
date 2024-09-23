const { cmd } = require('../command');
const sensitiveData = require('../dila_md_licence/a/b/c/d/dddamsbs');

// Function to send welcome message to new members
const sendWelcomeMessage = async (conn, groupId, memberId, groupName) => {
    try {
        console.log(`Preparing to send welcome message to: ${memberId}`);

        // Attempt to get the profile picture of the new member
        const profilePicUrl = await conn.profilePictureUrl(memberId, 'image')
            .catch(() => 'https://example.com/default-profile-picture.jpg'); // Default image if fetching fails

        // Construct the welcome message
        const welcomeMessage = {
            text: `𝗛𝗲𝘆 @${memberId.split('@')[0]} 👋\n𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 *${groupName}* 🎉\nˢᵉᵉ ᵍʳᵒᵘᵖ ᵈᵉˢᶜʳⁱᵖᵗⁱᵒⁿ\n\nᴍᴀᴅᴇ ʙʏ ᴍʀ ᴅɪʟᴀ ᴏꜰᴄ`,
            mentions: [memberId],
            // Add the profile picture as a thumbnail in the options
            thumbnail: await conn.profilePictureUrl(memberId, 'image')
                .catch(() => 'https://example.com/default-thumbnail.jpg')
        };

        // Send the welcome message to the group
        await conn.sendMessage(groupId, welcomeMessage);
        console.log(`Welcome message sent to ${memberId} in group ${groupName}`);
    } catch (e) {
        console.error('Error sending welcome message:', e);
    }
};

// Event listener for new group participants
const registerGroupWelcomeListener = (conn) => {
    conn.ev.on('group-participants.update', async (update) => {
        try {
            console.log('Group participants update detected:', update);
            const { id, participants, action } = update; // id = group id, participants = new members, action = add/remove

            if (action === 'add') {
                const groupMetadata = await conn.groupMetadata(id);
                const groupName = groupMetadata.subject;

                participants.forEach(async (participant) => {
                    console.log(`Sending welcome message to: ${participant}`);
                    await sendWelcomeMessage(conn, id, participant, groupName);
                });
            }
        } catch (e) {
            console.error('Error handling group participant update:', e);
        }
    });
};

// Example of registering the event listener in your main file
cmd({ pattern: "welcome", react: "👋", desc: "Send a welcome message when a new member joins the group", category: "group", use: '.greet', filename: __filename }, 
async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group. 🚫');
        if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
        if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');

        registerGroupWelcomeListener(conn);
        console.log('Welcome message listener registered.');

        reply('Welcome message functionality activated! 🥳');
    } catch (e) {
        reply('Error setting up welcome messages. ⚠️');
        console.log('Error setting up welcome messages:', e);
    }
});
