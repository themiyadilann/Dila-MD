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

📝 𝙲𝚑𝚊𝚗𝚐𝚎 𝚠𝚎𝚕𝚌𝚘𝚖𝚎 𝙼𝚂𝙶 📝
> _ඔබේ හිතුමනාපෙට ඔබ කැමති welcome msg එකක් දාගත හැකිය..._
     💠 \`.welcomemsg (text)\`

🧐 𝙶𝚛𝚘𝚞𝚙 𝚠𝚎𝚕𝚌𝚘𝚖𝚎 𝚜𝚝𝚊𝚝𝚞𝚜 🧐
> _දැනට සමූහය තුළ පවතින වෙල්කම් තත්ත්වය..._
     💠 \`.welcomestates\`

ᴍᴀᴅᴇ ʙʏ ᴍʀ ᴅɪʟᴀ ᴏꜰᴄ
        `;
        reply(welcomeInfo);
    } catch (e) {
        reply('Error displaying welcome information. ⚠️');
        console.log(e);
    }
});
