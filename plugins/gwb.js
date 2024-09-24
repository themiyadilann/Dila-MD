const { cmd } = require('../command');
const sensitiveData = require('../dila_md_licence/a/b/c/d/dddamsbs');

let welcomeEnabled = false; // Variable to track if welcome messages are enabled
let welcomeAlertEnabled = false; // Variable to track if welcome alerts are enabled

// Function to send welcome message to the group
const sendWelcomeMessage = async (conn, groupId, memberId) => {
    const groupMetadata = await conn.groupMetadata(groupId); // Fetch group metadata to get the group name
    const groupName = groupMetadata.subject; // Get the group name from metadata
    const welcomeMessage = `𝗛𝗲𝘆 @${memberId.split('@')[0]},\n𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 *${groupName}* 🎉\nˢᵉᵉ ᵍʳᵒᵘᵖ ᵈᵉˢᶜʳⁱᵖᵗⁱᵒⁿ\n${sensitiveData.footerText}`;
    
    await conn.sendMessage(groupId, { text: welcomeMessage, mentions: [memberId] });
};

// Function to send a private welcome alert to the new member
const sendWelcomeAlert = async (conn, groupId, memberId) => {
    const groupMetadata = await conn.groupMetadata(groupId); // Fetch group metadata to get the group name and description
    const groupName = groupMetadata.subject; // Group name
    const groupDescription = groupMetadata.desc || 'No description provided.'; // Group description
    const alertMessage = `𝗛𝗲𝘆 @${memberId.split('@')[0]},\n𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 *${groupName}*\n𝗥𝗲𝗮𝗱 𝘁𝗵𝗶𝘀:\n*${groupDescription}*\n\n${sensitiveData.footerText}`;
    
    await conn.sendMessage(memberId, { text: alertMessage, mentions: [memberId] });
};

// Event listener for new group participants
const registerGroupWelcomeListener = (conn) => {
    conn.ev.on('group-participants.update', async (update) => {
        const { id, participants, action } = update; // id = group id, participants = new members, action = add/remove
        if (action === 'add') {
            participants.forEach(async (participant) => {
                if (welcomeEnabled) {
                    await sendWelcomeMessage(conn, id, participant);  // Send welcome message to the group
                }
                if (welcomeAlertEnabled) {
                    await sendWelcomeAlert(conn, id, participant);  // Send private alert to the new member
                }
            });
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
        
        welcomeEnabled = true; // Set welcome messages to enabled
        registerGroupWelcomeListener(conn); // Ensure listener is registered
        reply('Welcome messages have been enabled! 🎉');
    } catch (e) {
        reply('Error enabling welcome messages. ⚠️');
        console.log(e);
    }
});

// Command to disable welcome messages in group
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

// Command to enable private alerts for new members
cmd({ pattern: "welcomealerton", react: "📬", desc: "Enable welcome alerts for new group members", category: "group", use: '.welcomealerton', filename: __filename },
async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group. 🚫');
        if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
        if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');
        
        welcomeAlertEnabled = true; // Set welcome alerts to enabled
        registerGroupWelcomeListener(conn); // Ensure listener is registered
        reply('Welcome alerts have been enabled! 📬');
    } catch (e) {
        reply('Error enabling welcome alerts. ⚠️');
        console.log(e);
    }
});

// Command to disable private alerts for new members
cmd({ pattern: "welcomealertoff", react: "📪", desc: "Disable welcome alerts for new group members", category: "group", use: '.welcomealertoff', filename: __filename },
async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group. 🚫');
        if (!isBotAdmins) return reply('Bot must be an admin to use this command. 🤖');
        if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');
        
        welcomeAlertEnabled = false; // Set welcome alerts to disabled
        reply('Welcome alerts have been disabled! 📪');
    } catch (e) {
        reply('Error disabling welcome alerts. ⚠️');
        console.log(e);
    }
});

// Command to display welcome instructions (accessible to anyone)
cmd({ pattern: "welcome", react: "👑", desc: "Display group welcome commands", category: "group", use: '.welcome', filename: __filename },
async (conn, mek, m, { from, isGroup, reply }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group. 🚫');
        
        const welcomeInfo = `
👑 𝗗𝗜𝗟𝗔 𝗠𝗗 𝗚𝗥𝗢𝗨𝗣 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 👑

✨ 𝚆𝚎𝚕𝚌𝚘𝚖𝚎 𝚘𝚗 ✨
> _සමූහය තුල වෙල්කම් මැසේජ් එක 𝚘𝚗 කිරීමට අවශය නම්..._
     💠 \`.welcomeon\`

🌑 𝚆𝚎𝚕𝚌𝚘𝚖𝚎 𝚘𝚏𝚏 🌑
> _සමූහය තුල වෙල්කම් මැසේජ් එක off කිරීමට අවශය නම්..._
     💠 \`.welcomeoff\`

📬 𝚆𝚎𝚕𝚌𝚘𝚖𝚎 𝚊𝚕𝚎𝚛𝚝 𝙾𝙽 📬
> _සමූහය තුලට පැමිනෙන නවකයන් හට inbox alert එකක් මගින් සමූහයේ නීති රීති යැවීමට අවශ්‍ය නම්..._
     💠 \`.welcomealerton\`

📪 𝚆𝚎𝚕𝚌𝚘𝚖𝚎 𝚊𝚕𝚎𝚛𝚝 𝙾𝙵𝙵 📪
> _සමූහය තුලට පැමිනෙන නවකයන් හට inbox alert එකක් මගින් සමූහයේ නීති රීති යැවීමට අනවශ්‍ය නම්..._
     💠 \`.welcomealertoff\`

📑 𝙸𝚗𝚜𝚝𝚛𝚞𝚌𝚝𝚒𝚘𝚗𝚜 📑
> _සමූහය පිලිබඳ නීති සහ රීති, විස්තර කෙටි පණිවිඩයක් ලෙස හෝ group description එක පෞද්ගලිකව යැවීමේදී මෙම options භාවිතා කරන්න._

ᴍᴀᴅᴇ ʙʏ ᴍʀ ᴅɪʟᴀ ᴏꜰᴄ
`;

        reply(welcomeInfo);
    } catch (e) {
        reply('Error displaying welcome commands. ⚠️');
        console.log(e);
    }
});
