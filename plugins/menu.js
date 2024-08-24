const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "menu",
    desc: "Check bot online or no.",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {

const config = await readEnv();
        
        // Send image with caption
        await conn.sendMessage(from, { image: { url: config.ALIVE_IMG }, caption: '*✸𝗗𝗶𝗹𝗮𝗠𝗗✸*\n*𝚃𝚛𝚢𝚃𝚑𝚒𝚜⤵*\n\n.ai\n_ex-.aiHey_\n\n*SupportUs⤵*\n𝚆𝚑𝚊𝚝𝚜𝚊𝚙𝚙-https://whatsapp.com/channel/0029ValK0gn4SpkP6iaXoj2y\n𝚈𝚘𝚞𝚝𝚞𝚋𝚎-https://youtube.com/@dila_lk\n𝚆𝚎𝚋𝚂𝚒𝚝𝚎-dilalk.vercel.app\n\n*OWNERMENU⤵*\n_.getsession_\n_.deletesession_\n_.join_\n_.shutdown_\n_.restart_\n_.autoreadmsg_\n_.autoreadcmd_\n_.autotyping_\n_.autorecording_\n_.autobio_\n_.autostatusview_\n_.autostatussave_\n_.mode_\n_.block_\n_.unblock_\n_.ban_\n_.unban_\n_.backup_\n_.addowner_\n_.delowner_\n_.ping_\n_.system_\n\n*GROUPMENU⤵*\n_.closetime_\n_.opentime_\n_.kick_\n_.add_\n_.promote_\n_.demote_\n_.setdesc_\n_.setppgc_\n_.tagall_\n_.hidetag_\n_.totag_\n_.admintag_\n_.group_\n_.grouplink_\n_.antilink_\n_.antibot_\n_.antiword_\n_.antispam_\n_.antidelete_\n_.antiviewone_\n\n*CONTACTMENU⤵*\n_.stickers_\n_.smeme_\n_.take_\n_.toimage_\n_.tovideo_\n_.toaudio_\n_.tomp3_\n_.imgtolink_\n\n*DOWNLOADMENU⤵*\n_.play_\n_.song_\n_.video_\n_.fb_\n_.tiktok_\n_.insta_\n_.modeapk_\n_.googledrive_\n\n*AIMENU⤵*\n_.ai_\n_.gemini_\n_.gpt3_' }, { quoted: mek });

        
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
