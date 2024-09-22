const { cmd } = require('../command');
const translate = require('@vitalets/google-translate-api');
const sensitiveData = require('../dila_md_licence/a/b/c/d/dddamsbs');

cmd({ 
    pattern: "translate", 
    desc: "Translate a message to a specified language", 
    category: "main", 
    filename: __filename 
}, async (conn, mek, m, { from, args, reply }) => { 
    // Check for the correct number of arguments and format
    if (args.length < 4 || args[1].toLowerCase() !== 'to') {
        return reply('Usage: .translate <language> to <text>');
    }

    const targetLanguage = args[0]; // Language code (e.g., 'en', 'si', 'ko')
    const textToTranslate = args.slice(2).join(" "); // Join remaining args as text to translate

    try {
        // Call the translation function
        const { text: translationText } = await translate(textToTranslate, { to: targetLanguage });
        
        const responseText = `*🌐 Translation Info 🌐*\n📜 *Original*: ${textToTranslate}\n🌍 *Translated (${targetLanguage})*: ${translationText}\n\n${sensitiveData.siteUrl}\n${sensitiveData.footerText}`;
        
        // Send the response message
        await conn.sendMessage(from, { text: responseText }, { quoted: mek });
    } catch (err) {
        return reply(`Error: ${err.message || "Translation failed"}`);
    }
});
