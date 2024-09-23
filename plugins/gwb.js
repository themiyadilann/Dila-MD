const fs = require('fs');
const { cmd } = require('../command');
const welcomeGroupsFile = './welcomeGroups.json'; // Path to the JSON file

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

// Function to manage group welcome settings
const manageGroupWelcomeSettings = (groupId, action) => {
    const data = loadEnabledGroups();
    
    if (action === 'on' && !data.enabledGroups.includes(groupId)) {
        data.enabledGroups.push(groupId);
        saveEnabledGroups(data);
        return 'Welcome messages enabled for this group! 🥳';
    } else if (action === 'off' && data.enabledGroups.includes(groupId)) {
        data.enabledGroups = data.enabledGroups.filter(id => id !== groupId);
        saveEnabledGroups(data);
        return 'Welcome messages disabled for this group! ❌';
    } else {
        return 'Invalid action or group already in the requested state.';
    }
};

// Function to manage private welcome messages
const managePrivateWelcomeMessages = (status) => {
    const data = loadEnabledGroups();
    data.privateWelcomeEnabled = status;
    saveEnabledGroups(data);
    return status ? 'Private welcome messages enabled! 🎉' : 'Private welcome messages disabled! ❌';
};

// Function to list enabled groups
const listEnabledGroups = () => {
    const { enabledGroups } = loadEnabledGroups();
    return enabledGroups.length > 0 ? `Enabled groups:\n${enabledGroups.join('\n')}` : 'No groups have welcome messages enabled. 🚫';
};

// Command to manage welcome messages
cmd({
    pattern: "welcome (on|off|alleton|alletoff|list)",
    react: "👋",
    desc: "Enable/disable group welcome messages and private welcome messages.",
    category: "group",
    use: '.welcome (on|off|alleton|alletoff|list)',
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, reply, args }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group. 🚫');
        if (!isBotAdmins) return reply('The bot must be an admin to use this command. 🤖');
        if (!isAdmins) return reply('Only admins can use this command. 👮‍♂️');

        const option = args[0]; // Get the option

        switch (option) {
            case 'on':
            case 'off':
                const result = manageGroupWelcomeSettings(from, option);
                reply(result);
                break;

            case 'alleton':
                const enablePrivateMessageResult = managePrivateWelcomeMessages(true);
                reply(enablePrivateMessageResult);
                break;

            case 'alletoff':
                const disablePrivateMessageResult = managePrivateWelcomeMessages(false);
                reply(disablePrivateMessageResult);
                break;

            case 'list':
                const enabledGroupsList = listEnabledGroups();
                reply(enabledGroupsList);
                break;

            default:
                reply('Invalid option. Use "on", "off", "alleton", "alletoff", or "list".');
        }
    } catch (e) {
        reply('Error processing your request. ⚠️');
        console.log('Error processing welcome command:', e);
    }
});
