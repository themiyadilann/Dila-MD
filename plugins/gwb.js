const fs = require('fs');
const { cmd } = require('../command');
const welcomeGroupsFile = './data/welcomeGroups.json'; // Path to the JSON file

// Function to load enabled groups from the JSON file
const loadEnabledGroups = () => {
    if (!fs.existsSync(welcomeGroupsFile)) {
        fs.writeFileSync(welcomeGroupsFile, JSON.stringify({ enabledGroups: [], privateWelcomeEnabled: false }));
    }
    const data = fs.readFileSync(welcomeGroupsFile);
    return JSON.parse(data);
};

// Function to save enabled groups to the JSON file
const saveEnabledGroups = (data) => {
    fs.writeFileSync(welcomeGroupsFile, JSON.stringify(data));
};

// Command to manage welcome messages
cmd({
    pattern: "welcome (on|off|alleton|alletoff|list)",
    react: "👋",
    desc: "Manage welcome messages and private welcome messages.",
    category: "group",
    use: '.welcome (on|off|alleton|alletoff|list)',
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, reply, args }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group. 🚫');
        if (!isBotAdmins) return reply('The bot must be an admin to use this command. 🤖');
        if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');

        const option = args[0]; // Get the option
        const data = loadEnabledGroups(); // Load current settings

        switch (option) {
            case 'on':
                if (!data.enabledGroups.includes(from)) {
                    data.enabledGroups.push(from);
                    saveEnabledGroups(data);
                    reply('Welcome messages are now enabled for this group! 🥳');
                } else {
                    reply('Welcome messages are already enabled for this group.');
                }
                break;

            case 'off':
                if (data.enabledGroups.includes(from)) {
                    data.enabledGroups = data.enabledGroups.filter(id => id !== from);
                    saveEnabledGroups(data);
                    reply('Welcome messages are now disabled for this group! ❌');
                } else {
                    reply('Welcome messages are already disabled for this group.');
                }
                break;

            case 'alleton':
                data.privateWelcomeEnabled = true;
                saveEnabledGroups(data);
                reply('Private welcome messages are now enabled! 🎉');
                break;

            case 'alletoff':
                data.privateWelcomeEnabled = false;
                saveEnabledGroups(data);
                reply('Private welcome messages are now disabled! ❌');
                break;

            case 'list':
                if (data.enabledGroups.length === 0) {
                    reply('No groups have welcome messages enabled. 🚫');
                } else {
                    reply(`Enabled groups:\n${data.enabledGroups.join('\n')}`);
                }
                break;

            default:
                reply('Invalid option. Use "on", "off", "alleton", "alletoff", or "list".');
                break;
        }
    } catch (e) {
        reply('Error processing your request. ⚠️');
        console.error('Error processing welcome command:', e);
    }
});

// Event listener for new group participants
const registerGroupWelcomeListener = (conn) => {
    conn.ev.on('group-participants.update', async (update) => {
        const { id, participants, action } = update;
        if (action === 'add' && loadEnabledGroups().enabledGroups.includes(id)) {
            const groupMetadata = await conn.groupMetadata(id);
            const groupName = groupMetadata.subject;

            // Send welcome message to new group members
            const welcomeMessage = `Welcome to *${groupName}* 🎉`;
            await Promise.all(participants.map(participant => {
                return conn.sendMessage(id, {
                    text: welcomeMessage,
                    mentions: [participant]
                });
            }));

            // Send private welcome messages if enabled
            if (loadEnabledGroups().privateWelcomeEnabled) {
                participants.forEach(async (participant) => {
                    const privateMessage = `Hey ${participant.split('@')[0]}, welcome to *${groupName}*! 🎉`;
                    await conn.sendMessage(participant, { text: privateMessage });
                });
            }
        }
    });
};

registerGroupWelcomeListener(conn); // Register the listener
