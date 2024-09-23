const { cmd } = require('../command');
const sensitiveData = require('../dila_md_licence/a/b/c/d/dddamsbs');

// Function to send welcome message to new members with profile picture
const sendWelcomeMessage = async (conn, groupId, memberId, groupName) => {
    try {
        // Fetch the profile picture URL of the new member
        let profilePicUrl;
        try {
            profilePicUrl = await conn.profilePictureUrl(memberId, 'image'); // Get the profile pic URL of the new member
        } catch (err) {
            profilePicUrl = 'https://example.com/default-profile-picture.jpg'; // Use a default image if the profile picture is not available
        }

        // Create the welcome message
        const welcomeMessage = {
            caption: `𝗛𝗲𝘆 @${memberId.split('@')[0]} 👋\n𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 *${groupName}* 🎉\nˢᵉᵉ ᵍʳᵒᵘᵖ ᵈᵉˢᶜʳⁱᵖᵗⁱᵒⁿ\n\nᴍᴀᴅᴇ ʙʏ ᴍʀ ᴅɪʟᴀ ᴏꜰᴄ`,
            mentions: [memberId],
            image: { url: profilePicUrl } // Send the profile picture along with the message
        };

        // Send the welcome message with the profile picture
        await conn.sendMessage(groupId, welcomeMessage);
    } catch (e) {
        console.log('Error sending welcome message:', e);
    }
};

// Event listener for new group participants
const registerGroupWelcomeListener = (conn) => {
    conn.ev.on('group-participants.update', async (update) => {
        const { id, participants, action } = update; // id = group id, participants = new members, action = add/remove
        if (action === 'add') {  // Check if the action is a new member joining
            const groupMetadata = await conn.groupMetadata(id); // Fetch group details
            const groupName = groupMetadata.subject; // Get the group name
            participants.forEach(async (participant) => {
                await sendWelcomeMessage(conn, id, participant, groupName);  // Send welcome message to each new member
            });
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

        // Register the event listener for new participants
        registerGroupWelcomeListener(conn);

        reply('Welcome message functionality activated! 🥳');
    } catch (e) {
        reply('Error setting up welcome messages. ⚠️');
        console.log(e);
    }
});
