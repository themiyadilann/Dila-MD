const config = require('../config');
const { cmd, commands } = require('../command');
const GoogleImages = require('google-images');
const axios = require('axios');
const fs-extra = require('fs-extra');
const path = require('path');

// Initialize Google Images client
const client = new GoogleImages(config.googleCSEId, config.googleApiKey);

// Define the Google Images search command
cmd({
    pattern: "img",
    desc: "Search Google for images",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Check if a query was provided
        if (!q) {
            return reply('Please provide a search query.');
        }

        // Fetch image results from Google
        const images = await client.search(q, { type: 'photo' });
        if (!images.length) {
            return reply('No images found.');
        }

        // Get the URL of the first image
        const imageUrl = images[0].url;

        // Download the image
        const imagePath = path.join(__dirname, 'temp_image.jpg');
        const writer = fs-extra.createWriteStream(imagePath);
        const response = await axios({
            url: imageUrl,
            method: 'GET',
            responseType: 'stream'
        });
        response.data.pipe(writer);

        writer.on('finish', async () => {
            // Send the image
            await conn.sendMessage(from, { image: { url: imagePath }, caption: `Image search result for: ${q}` }, { quoted: mek });

            // Clean up the image file
            fs-extra.unlinkSync(imagePath);
        });

        writer.on('error', (err) => {
            console.error(err);
            reply('Error: Could not download image.');
        });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
