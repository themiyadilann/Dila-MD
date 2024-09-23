const { cmd } = require('../command');
const sensitiveData = require('../dila_md_licence/a/b/c/d/dddamsbs');

let welcomeEnabled = false;  // Variable to track if welcome messages are enabled
let goodbyeEnabled = false;   // Variable to track if goodbye messages are enabled

// Function to send welcome message to new members in group
const sendGroupWelcomeMessage = async (conn, groupId, participants, groupName) => {
    const mentions = participants.map(participant => participant.split('@')[0]);
    const welcomeMessage = `𝗛𝗲𝘆 ${mentions.join(', ')} 👋\n𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 *${groupName}* 🎉\nˢᵉᵊ ᵍʳᵒᵘᵖ ᵈᵉˢᶜʳⁱᵖᵗⁱᵒⁿ\n\nᴍᴀᴅᴇ ʙʏ ᴍʳ ᴅɪʟᴀ ᴏꜰᴄ`;

    await conn.sendMessage(groupId, {
        text: welcomeMessage,
        mentions: participants
    });
};

// Function to send a private welcome message to each new member
const sendPrivateWelcomeMessage = async (conn, memberId, groupName) => {
    const pushname = memberId.split('@')[0];
    const welcomeMessage = `𝗛𝗲𝘆 ${pushname} 👋\n𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 *${groupName}* 🎉\nˢᵉᵊ ᵍʳᵒᵘᵖ ᵈᵉˢᶜʳⁱᵖᵗⁱᵒⁿ\n\nᴍᴀᴅᴇ ʙʸ ᴍʳ ᴅɪʟᴀ ᴏꜰᴄ`;

    await conn.sendMessage(memberId, {
        text: welcomeMessage
    });
};

// Function to send goodbye message to members leaving the group
const sendGroupGoodbyeMessage = async (conn, groupId, participants, groupName) => {
    const mentions = participants.map(participant => participant.split('@')[0]);
    const goodbyeMessage = `𝗚𝗼𝗼𝗱𝗯𝘆𝗲 ${mentions.join(', ')} 😢\n𝗪𝗲'𝗿𝗲 𝘀𝗼𝗿𝗿𝘆 𝘁𝗼 𝘀𝗲𝗲 𝘆𝗼𝘂 𝗴𝗼 𝗳𝗿𝗼𝗺 *${groupName}*.\n\nᴍᴀᴅᴇ ʙʸ ᴍʳ ᴅɪʟᴀ ᴏꜰᴄ`;

    await conn.sendMessage(groupId, {
        text: goodbyeMessage,
        mentions: participants
    });
};

// Function to send a private goodbye message to each departing member
const sendPrivateGoodbyeMessage = async (conn, memberId, groupName) => {
    const pushname = memberId.split('@')[0];
    const goodbyeMessage = `𝗚𝗼𝗼𝗱𝗯𝘆𝗲 ${pushname} 😢\n𝗪𝗲'𝗿𝗲 𝘀𝗼𝗿𝗿𝘆 𝘁𝗼 𝘀𝗲𝗲 𝘆𝗼𝘂 𝗴𝗼 𝗳𝗿𝗼𝗺 *${groupName}*.\n\nᴍᴀᴅᴇ ʙʸ ᴍʳ ᴅɪʟᴀ ᴏꜰᴄ`;

    await conn.sendMessage(memberId, {
        text: goodbyeMessage
    });
};

// Event listener for new group participants
const registerGroupWelcomeGoodbyeListener = (conn) => {
    conn.ev.on('group-participants.update', async (update) => {
        const { id, participants, action } = update;
        const groupMetadata = await conn.groupMetadata(id);
        const groupName = groupMetadata.subject;

        if (action === 'add' && welcomeEnabled) { // Check if welcome messages are enabled
            await sendGroupWelcomeMessage(conn, id, participants, groupName);

            for (const participant of participants) {
                await sendPrivateWelcomeMessage(conn, participant, groupName);
            }
        } else if (action === 'remove' && goodbyeEnabled) { // Check if goodbye messages are enabled
            await sendGroupGoodbyeMessage(conn, id, participants, groupName);

            for (const participant of participants) {
                await sendPrivateGoodbyeMessage(conn, participant, groupName);
            }
        }
    });
};

// Welcome command to enable or disable welcome messages
cmd({
    pattern: "welcome on",
    react: "👋",
    desc: "Enable welcome messages for new group members",
    category: "group",
    use: '.welcome on',
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group. 🚫');
        if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
        if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');

        welcomeEnabled = true; // Enable welcome messages
        registerGroupWelcomeGoodbyeListener(conn); // Register listener if not already registered
        reply('Welcome messages are now enabled! 🥳');
    } catch (e) {
        reply('Error enabling welcome messages. ⚠️');
        console.log('Error enabling welcome messages:', e);
    }
});

// Goodbye command to enable or disable goodbye messages
cmd({
    pattern: "goodbye on",
    react: "👋",
    desc: "Enable goodbye messages for departing group members",
    category: "group",
    use: '.goodbye on',
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group. 🚫');
        if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
        if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');

        goodbyeEnabled = true; // Enable goodbye messages
        registerGroupWelcomeGoodbyeListener(conn); // Register listener if not already registered
        reply('Goodbye messages are now enabled! 😢');
    } catch (e) {
        reply('Error enabling goodbye messages. ⚠️');
        console.log('Error enabling goodbye messages:', e);
    }
});
