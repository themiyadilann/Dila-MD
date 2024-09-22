const { cmd } = require('../command');
const translate = require('@vitalets/google-translate-api');
const sensitiveData = require('../dila_md_licence/a/b/c/d/dddamsbs');

cmd({ 
    pattern: "translate", 
    desc: "Translate a message to a specified language", 
    category: "main", 
    filename: __filename 
}, async (conn, mek, m, { from, args, reply }) => { 
    if (args.length < 4 || args[1] !== 'to') {
        return reply('Usage: .translate <language> to <text>');
    }

    const targetLanguage = args[0]; // The first argument is the target language
    const textToTranslate = args.slice(2).join(" "); // The rest is the text to translate

    try {
        const res = await translate(textToTranslate, { to: targetLanguage });
        const translationText = res.text;

        const responseText = `*🌐 Translation Info 🌐*\n📜 *Original*: ${textToTranslate}\n🌍 *Translated (${targetLanguage})*: ${translationText}\n\n${sensitiveData.siteUrl}\n${sensitiveData.footerText}`;

        await conn.sendMessage(from, { text: responseText }, { quoted: mek });
    } catch (err) {
        return reply(`Error: ${err.message || "Translation failed"}`);
    }
});
