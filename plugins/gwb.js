const { cmd } = require('../command');
const sensitiveData = require('../dila_md_licence/a/b/c/d/dddamsbs');
const fs = require('fs'); // File system module for reading/writing JSON

// Base to store welcome settings and messages
const WelcomeSettings = {
    welcomeEnabled: false, // Track if welcome messages are enabled
    welcomeAlertEnabled: false, // Track if welcome alerts (private messages) are enabled
    welcomeMessages: {}, // Object to store welcome messages per group
    listenerRegistered: false, // Track if the welcome listener is registered
};

// Load existing welcome messages from the JSON file
const loadWelcomeMessages = () => {
    if (fs.existsSync('./data/welcomeMessages.json')) {
        WelcomeSettings.welcomeMessages = JSON.parse(fs.readFileSync('./data/welcomeMessages.json'));
    } else {
        WelcomeSettings.welcomeMessages = {};
    }
};

// Save welcome messages to the JSON file
const saveWelcomeMessages = () => {
    fs.writeFileSync('./data/welcomeMessages.json', JSON.stringify(WelcomeSettings.welcomeMessages, null, 2));
};

// Function to send welcome message to the group (for multiple participants)
const sendWelcomeMessage = async (conn, groupId, participants) => {
    const groupMetadata = await conn.groupMetadata(groupId); // Fetch group metadata
    const groupName = groupMetadata.subject; // Get group name

    // Create mentions and build the welcome message with all participants
    const mentions = participants.map(participant => participant);
    const welcomeText = WelcomeSettings.welcomeMessages[groupId] ? WelcomeSettings.welcomeMessages[groupId] : 'Welcome to the group!'; // Use custom or default message
    const welcomeMessage = `𝗛𝗲𝘆 ♥️🫂\n${mentions.map(memberId => `@${memberId.split('@')[0]}`).join('\n')}\n𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 *${groupName}* 🎉\nˢᵉᵉ ᵍʳᵒᵘᵖ ᵈᵉˢᶜʳⁱᵖᵗⁱᵒⁿ\n\n${welcomeText}\n\n${sensitiveData.footerText}`;

    await conn.sendMessage(groupId, { text: welcomeMessage, mentions });
};

// Function to send a private alert message to new members
const sendPrivateWelcomeAlert = async (conn, groupId, memberId) => {
    const groupMetadata = await conn.groupMetadata(groupId); // Fetch group metadata
    const groupName = groupMetadata.subject; // Get group name
    const groupDescription = groupMetadata.desc || 'No description available'; // Get group description
    const privateAlertMessage = `𝗛𝗲𝘆 @${memberId.split('@')[0]},\n𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 *${groupName}* 🎉\n𝗥𝗲𝗮𝗱 𝘁𝗵𝗶𝘀 : ${groupDescription}\n${sensitiveData.footerText}`;

    await conn.sendMessage(memberId, { text: privateAlertMessage, mentions: [memberId] });
};

// Event listener for new group participants
const registerGroupWelcomeListener = (conn) => {
    if (WelcomeSettings.listenerRegistered) return; // Prevent multiple registrations
    WelcomeSettings.listenerRegistered = true; // Mark the listener as registered

    conn.ev.on('group-participants.update', async (update) => {
        const { id, participants, action } = update; // id = group id, participants = new members, action = add/remove
        if (action === 'add') { // New members added
            if (WelcomeSettings.welcomeEnabled) await sendWelcomeMessage(conn, id, participants); // Send group welcome message
            if (WelcomeSettings.welcomeAlertEnabled) { // Send private welcome alerts
                participants.forEach(async (participant) => {
                    await sendPrivateWelcomeAlert(conn, id, participant);
                });
            }
        }
    });
};

// Command to enable welcome messages in group
cmd({ pattern: "welcomeon", react: "🎉", desc: "Enable welcome messages for new group members", category: "group", use: '.welcomeon', filename: __filename },
async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group. 🚫');
        if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
        if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');

        WelcomeSettings.welcomeEnabled = true; // Enable group welcome messages
        registerGroupWelcomeListener(conn); // Ensure listener is registered
        reply('Group welcome messages have been enabled! 🎉');
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

        WelcomeSettings.welcomeEnabled = false; // Disable group welcome messages
        reply('Group welcome messages have been disabled! ❌');
    } catch (e) {
        reply('Error disabling welcome messages. ⚠️');
        console.log(e);
    }
});

// Command to enable welcome alerts (private message to new members)
cmd({ pattern: "welcomealerton", react: "🔔", desc: "Enable welcome alerts for new group members", category: "group", use: '.welcomealerton', filename: __filename },
async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group. 🚫');
        if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
        if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');

        WelcomeSettings.welcomeAlertEnabled = true; // Enable private welcome alerts
        registerGroupWelcomeListener(conn); // Ensure listener is registered
        reply('Private welcome alerts have been enabled! 🔔');
    } catch (e) {
        reply('Error enabling welcome alerts. ⚠️');
        console.log(e);
    }
});

// Command to disable welcome alerts (private message to new members)
cmd({ pattern: "welcomealertoff", react: "🔕", desc: "Disable welcome alerts for new group members", category: "group", use: '.welcomealertoff', filename: __filename },
async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group. 🚫');
        if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
        if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');

        WelcomeSettings.welcomeAlertEnabled = false; // Disable private welcome alerts
        reply('Private welcome alerts have been disabled! 🔕');
    } catch (e) {
        reply('Error disabling welcome alerts. ⚠️');
        console.log(e);
    }
});

// Command to set a custom welcome message
cmd({
    pattern: "welcomemsg (.+)", // Use .+ to capture the entire message
    react: "✍️",
    desc: "Set a custom welcome message for the group",
    category: "group",
    use: '.welcomemsg {TEXT}',
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, reply }) => {
    try {
        // Check if the command is being used in a group
        if (!isGroup) return reply('This command can only be used in a group. 🚫');
        
        // Check if the bot is an admin
        if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
        
        // Check if the user is an admin
        if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');

        // Extract the custom message from the command input
        const message = m.message.replace(/\.welcomemsg /, '').trim(); // Replace the command part with an empty string

        // Check if the message is empty
        if (!message) return reply('Please provide a welcome message.'); // Prompt user to provide a message

        // Set the custom welcome message for the group
        WelcomeSettings.welcomeMessages[from] = message; 
        saveWelcomeMessages(); // Save the updated welcome messages to the JSON file

        // Respond with confirmation
        reply(`Custom welcome message set! 🎉\n\n${message}`);
    } catch (error) {
        // Handle any errors that occur during the process
        reply('Error setting custom welcome message. ⚠️');
        console.log(error);
    }
});

// Command to delete the custom welcome message
cmd({ pattern: "welcomedel", react: "🗑️", desc: "Delete the custom welcome message for the group", category: "group", use: '.welcomedel', filename: __filename },
async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group. 🚫');
        if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
        if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');

        delete WelcomeSettings.welcomeMessages[from]; // Delete the message for the group
        saveWelcomeMessages(); // Save changes to JSON file

        reply('Custom welcome message has been deleted! 🗑️');
    } catch (e) {
        reply('Error deleting custom welcome message. ⚠️');
        console.log(e);
    }
});

// Command to display welcome settings
cmd({ pattern: "welcomestates", react: "🔍", desc: "Display current welcome settings for the group", category: "group", use: '.welcomestates', filename: __filename },
async (conn, mek, m, { from, isGroup, reply }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group. 🚫');
        
        const welcomeStatus = WelcomeSettings.welcomeEnabled ? 'Enabled' : 'Disabled';
        const alertStatus = WelcomeSettings.welcomeAlertEnabled ? 'Enabled' : 'Disabled';
        const customMessage = WelcomeSettings.welcomeMessages[from] ? WelcomeSettings.welcomeMessages[from] : 'No custom message set.';

        reply(`Current welcome settings for the group:\n\nWelcome Messages: ${welcomeStatus}\nPrivate Alerts: ${alertStatus}\nCustom Welcome Message: ${customMessage}`);
    } catch (e) {
        reply('Error displaying welcome settings. ⚠️');
        console.log(e);
    }
});     

// Command to display welcome instructions
cmd({ pattern: "welcome", react: "👑", desc: "Display group welcome commands", category: "group", use: '.welcome', filename: __filename },
async (conn, mek, m, { from, isGroup, reply }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group. 🚫');

        const welcomeInfo = `👑 𝗗𝗜𝗟𝗔 𝗠𝗗 𝗚𝗥𝗢𝗨𝗣 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 👑\n\n✨ 𝚆𝚎𝚕𝚌𝚘𝚖𝚎 𝚘𝚗 ✨\n> _සමූහය තුල වෙල්කම් මැසේජ් එක 𝚘𝚗 කිරීමට අවශය නම්..._\n     💠 \`.welcomeon\`\n\n🌑 𝚆𝚎𝚕𝚌𝚘𝚖𝚎 𝚘𝚏𝚏 🌑\n> _සමූහය තුල වෙල්කම් මැසේජ් එක off කිරීමට අවශය නම්..._\n     💠 \`.welcomeoff\`\n\n📬 𝚆𝚎𝚕𝚌𝚘𝚖𝚎 𝚊𝚕𝚎𝚛𝚝 𝙾𝙽 📬\n> _සමූහය තුලට පැමිනෙන නවකයන් හට inbox alert එකක් මගින් සමූහයේ නීති රීති යැවීමට අවශ්‍ය නම්..._\n     💠 \`.welcomealerton\`\n\n📪 𝚆𝚎𝚕𝚌𝚘𝚖𝚎 𝚊𝚕𝚎𝚛𝚝 𝙾𝙵𝙵 📪\n> _සමූහය තුලට පැමිනෙන නවකයන් හට inbox alert එකක් මගින් සමූහයේ නීති රීති යැවීමට අනවශ්‍ය නම්..._\n     💠 \`.welcomealertoff\`\n\n📝 𝙲𝚑𝚊𝚗𝚐𝚎 𝚠𝚎𝚕𝚌𝚘𝚖𝚎 𝙼𝚂𝙶 📝\n> _ඔබේ හිතුමනාපෙට ඔබ කැමති welcome msg එකක් දාගත හැකිය..._\n     💠 \`.welcomemsg (text)\`\n\n🧐 𝙶𝚛𝚘𝚞𝚙 𝚠𝚎𝚕𝚌𝚘𝚖𝚎 𝚜𝚝𝚊𝚝𝚞𝚜 🧐\n> _දැනට සමූහය තුළ පවතින වෙල්කම් තත්ත්වය..._\n     💠 \`.welcomestates\`\n\n${sensitiveData.footerText}`;
        reply(welcomeInfo);
    } catch (e) {
        reply('Error displaying welcome information. ⚠️');
        console.log(e);
    }
});
