const defaultEnvVariables = [
    { key: 'ALIVE_IMG', value: 'https://telegra.ph/file/dcd097f9f7a124d47e5b2.jpg' },
    { key: 'ALIVE_MSG', value: '*𝗜\'𝗺 𝗔𝗹𝗶𝘃𝗲 𝗡𝗼𝘄 ♥*\n*𝚃𝚛𝚢 𝚃𝚑𝚒𝚜 ⤵*\n\n.ai (Your question)\n_example - .ai Hey_\n\n*Support Us ⤵*\n𝚆𝚑𝚊𝚝𝚜𝚊𝚙𝚙 - https://whatsapp.com/channel/0029ValK0gn4SpkP6iaXoj2y\n𝚈𝚘𝚞𝚝𝚞𝚋𝚎 - https://youtube.com/@dila_lk\n𝚆𝚎𝚋 𝚂𝚒𝚝𝚎 - dilalk.vercel.app\n\nᴍᴀᴅᴇ ʙʏ ᴍʀᴅɪʟᴀ' },
    { key: 'PREFIX', value: '.' },
    { key: 'DILO_IMG', value: 'https://telegra.ph/file/dcd097f9f7a124d47e5b2.jpg' },
    { key: 'DILO_MSG', value: '*Name*: Dilan\n*From*: Matara\n*Age*: 20\n*web* : dilalk.vercel.app\n\n_you .....?_ 🤖' },
    { key: 'MENU_IMG', value: 'https://telegra.ph/file/dcd097f9f7a124d47e5b2.jpg' },
    { key: 'MENU_MSG', value: '*✸𝗗𝗶𝗹𝗮𝗠𝗗✸*\n*𝚃𝚛𝚢𝚃𝚑𝚒𝚜⤵*\n\n.ai\n_ex-.aiHey_\n\n*SupportUs⤵*\n𝚆𝚑𝚊𝚝𝚜𝚊𝚙𝚙-https://whatsapp.com/channel/0029ValK0gn4SpkP6iaXoj2y\n𝚈𝚘𝚞𝚝𝚞𝚋𝚎-https://youtube.com/@dila_lk\n𝚆𝚎𝚋𝚂𝚒𝚝𝚎-dilalk.vercel.app\n\n*OWNERMENU⤵*\n_.getsession_\n_.deletesession_\n_.join_\n_.shutdown_\n_.restart_\n_.autoreadmsg_\n_.autoreadcmd_\n_.autotyping_\n_.autorecording_\n_.autobio_\n_.autostatusview_\n_.autostatussave_\n_.mode_\n_.block_\n_.unblock_\n_.ban_\n_.unban_\n_.backup_\n_.addowner_\n_.delowner_\n_.ping_\n_.system_\n\n*GROUPMENU⤵*\n_.closetime_\n_.opentime_\n_.kick_\n_.add_\n_.promote_\n_.demote_\n_.setdesc_\n_.setppgc_\n_.tagall_\n_.hidetag_\n_.totag_\n_.admintag_\n_.group_\n_.grouplink_\n_.antilink_\n_.antibot_\n_.antiword_\n_.antispam_\n_.antidelete_\n_.antiviewone_\n\n*CONTACTMENU⤵*\n_.stickers_\n_.smeme_\n_.take_\n_.toimage_\n_.tovideo_\n_.toaudio_\n_.tomp3_\n_.imgtolink_\n\n*DOWNLOADMENU⤵*\n_.play_\n_.song_\n_.video_\n_.fb_\n_.tiktok_\n_.insta_\n_.modeapk_\n_.googledrive_\n\n*AIMENU⤵*\n_.ai_\n_.gemini_\n_.gpt3_' },
    { key: 'AUTO_READ_STATUS', value: 'false' },
    { key: 'MODE', value: 'public' },
];

// MongoDB connection function
const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGODB);
        console.log('🛜 MongoDB Connected ✅');

        // Check and create default environment variables
        for (const envVar of defaultEnvVariables) {
            const existingVar = await EnvVar.findOne({ key: envVar.key });

            if (!existingVar) {
                // Create new environment variable with default value
                await EnvVar.create(envVar);
                console.log(`➕ Created default env var: ${envVar.key}`);
            }
        }

    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
