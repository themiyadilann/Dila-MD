const { cmd } = require('../command');
const fg = require('api-dylux');
const yts = require('yt-search');

// Helper function to format views
const formatViews = (views) => {
    if (views >= 1_000_000_000) {
        return `${(views / 1_000_000_000).toFixed(1)}B`;
    } else if (views >= 1_000_000) {
        return `${(views / 1_000_000).toFixed(1)}M`;
    } else if (views >= 1_000) {
        return `${(views / 1_000).toFixed(1)}K`;
    } else {
        return views.toString();
    }
};

// Default voice recording URL
const voiceUrl = 'https://drive.google.com/uc?export=download&id=1_Pd4yQVfofr14xPMIOvebVGwoXh1rohu';

//========= Audio Download Command =========//

cmd({
    pattern: "song",
    desc: "Download songs",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            await conn.sendMessage(from, { audio: { url: voiceUrl }, mimetype: 'audio/mp4', ptt: true }, { quoted: mek });
            return;
        }

        const search = await yts(q);
        const data = search.videos[0];
        const url = data.url;

        let desc = `
> *𝗗𝗶𝗹𝗮𝗠𝗗 𝗬𝗼𝘂𝘁𝘂𝗯𝗲 𝗔𝘂𝗱𝗶𝗼 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 🎧*

🎶 *𝗧𝗶𝘁𝗹𝗲*: _${data.title}_
👤 *𝗖𝗵𝗮𝗻𝗻𝗲𝗹*: _${data.author.name}_
📝 *𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻*: _${data.description}_
⏳ *𝗧𝗶𝗺𝗲*: _${data.timestamp}_
⏱️ *𝗔𝗴𝗼*: _${data.ago}_
👁️‍🗨️ *𝗩𝗶𝗲𝘄𝘀*: _${formatViews(data.views)}_
🔗 *𝗟𝗶𝗻𝗸*: ${url}

dilalk.vercel.app
ᵐᵃᵈᵉ ʙʏ ᴍʀᴅɪʟᴀ`;

        // Send video details with thumbnail
        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        // Download and send audio
        let down = await fg.yta(url);
        let downloadUrl = down.dl_url;
        await conn.sendMessage(from, { audio: { url: downloadUrl }, mimetype: "audio/mpeg" }, { quoted: mek });
        await conn.sendMessage(from, { document: { url: downloadUrl }, mimetype: "audio/mpeg", fileName: `${data.title}.mp3`, caption: "💻 *ᴍᴀᴅᴇ ʙʏ ᴍʀᴅɪʟᴀ*" }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

//========= Video Download Command =========//

cmd({
    pattern: "video",
    desc: "Download videos",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            await conn.sendMessage(from, { audio: { url: voiceUrl }, mimetype: 'audio/mp4', ptt: true }, { quoted: mek });
            return;
        }

        const search = await yts(q);
        const data = search.videos[0];
        const url = data.url;

        let desc = `
*𝗗𝗶𝗹𝗮𝗠𝗗 𝗬𝗼𝘂𝘁𝘂𝗯𝗲 𝗩𝗶𝗱𝗲𝗼 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 🎥*

🎶 *𝗧𝗶𝘁𝗹𝗲*: _${data.title}_
👤 *𝗖𝗵𝗮𝗻𝗻𝗲𝗹*: _${data.author.name}_
📝 *𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻*: _${data.description}_
⏳ *𝗧𝗶𝗺𝗲*: _${data.timestamp}_
⏱️ *𝗔𝗴𝗼*: _${data.ago}_
👁️‍🗨️ *𝗩𝗶𝗲𝘄𝘀*: _${formatViews(data.views)}_
🔗 *𝗟𝗶𝗻𝗸*: ${url}

dilalk.vercel.app
ᵐᵃᵈᵉ ʙʏ ᴍʀᴅɪʟᴀ`;

        // Send video details with thumbnail
        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        // Download and send video
        let down = await fg.ytv(url);
        let downloadUrl = down.dl_url;
        await conn.sendMessage(from, { video: { url: downloadUrl }, mimetype: "video/mp4" }, { quoted: mek });
        await conn.sendMessage(from, { document: { url: downloadUrl }, mimetype: "video/mp4", fileName: `${data.title}.mp4`, caption: "💻 *ᴍᴀᴅᴇ ʙʏ ᴍʀᴅɪʟᴀ*" }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

//========= YouTube Playlist Download Command =========//

cmd({
    pattern: "playlist",
    desc: "Download YouTube playlist as audio",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            reply("Please provide a playlist URL or search query.");
            return;
        }

        const search = await yts(q);
        const data = search.playlists[0];
        const playlistUrl = data.url;

        let desc = `
*𝗗𝗶𝗹𝗮𝗠𝗗 𝗬𝗼𝘂𝘁𝘂𝗯𝗲 𝗣𝗹𝗮𝘆𝗹𝗶𝘀𝘁 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 🎶*

🎶 *𝗧𝗶𝘁𝗹𝗲*: _${data.title}_
👤 *𝗖𝗵𝗮𝗻𝗻𝗲𝗹*: _${data.author.name}_
🔗 *𝗟𝗶𝗻𝗸*: ${playlistUrl}

dilalk.vercel.app
ᵐᵃᵈᵉ ʙʏ ᴍʀᴅɪʟᴀ`;

        // Send playlist details with thumbnail
        await conn.sendMessage(from, { image: { url: data.image }, caption: desc }, { quoted: mek });

        // Download each video in the playlist as audio
        for (const video of data.videos) {
            let down = await fg.yta(video.url);
            let downloadUrl = down.dl_url;
            await conn.sendMessage(from, { audio: { url: downloadUrl }, mimetype: "audio/mpeg", caption: `🎶 *${video.title}*` }, { quoted: mek });
        }

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

//========= YouTube Video Info Command =========//

cmd({
    pattern: "ytinfo1",
    desc: "Get YouTube video info",
    category: "info",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            reply("Please provide a video URL or search query.");
            return;
        }

        const search = await yts(q);
        const data = search.videos[0];

        let desc = `
*𝗗𝗶𝗹𝗮𝗠𝗗 𝗬𝗼𝘂𝘁𝘂𝗯𝗲 𝗩𝗶𝗱𝗲𝗼 𝗜𝗻𝗳𝗼 📊*

🎶 *𝗧𝗶𝘁𝗹𝗲*: _${data.title}_
👤 *𝗖𝗵𝗮𝗻𝗻𝗲𝗹*: _${data.author.name}_
📝 *𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻*: _${data.description}_
⏳ *𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻*: _${data.timestamp}_
⏱️ *𝗨𝗽𝗹𝗼𝗮𝗱𝗲𝗱*: _${data.ago}_
👁️‍🗨️ *𝗩𝗶𝗲𝘄𝘀*: _${formatViews(data.views)}_
👍 *𝗟𝗶𝗸𝗲𝘀*: _${data.likes ? formatViews(data.likes) : 'N/A'}_
💬 *𝗖𝗼𝗺𝗺𝗲𝗻𝘁𝘀*: _${data.commentCount ? formatViews(data.commentCount) : 'N/A'}_
🔗 *𝗟𝗶𝗻𝗸*: ${data.url}

dilalk.vercel.app
ᵐᵃᵈᵉ ʙʏ ᴍʀᴅɪʟᴀ`;

        // Send video info with thumbnail
        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

//========= YouTube Search Command =========//

cmd({
    pattern: "ytsearch1",
    desc: "Search YouTube videos",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            reply("Please provide a search query.");
            return;
        }

        const search = await yts(q);
        const videos = search.videos.slice(0, 5); // Get top 5 results

        let result = '*𝗗𝗶𝗹𝗮𝗠𝗗 𝗬𝗼𝘂𝘁𝘂𝗯𝗲 𝗦𝗲𝗮𝗿𝗰𝗵 𝗥𝗲𝘀𝘂𝗹𝘁𝘀 🎥*\n\n';
        videos.forEach((video, index) => {
            result += `${index + 1}. 🎶 *Title*: _${video.title}_\n`;
            result += `   👤 *Channel*: _${video.author.name}_\n`;
            result += `   ⏱️ *Duration*: _${video.timestamp}_\n`;
            result += `   👁️‍🗨️ *Views*: _${formatViews(video.views)}_\n`;
            result += `   🔗 *Link*: ${video.url}\n\n`;
        });

        await conn.sendMessage(from, { text: result }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

//========= YouTube Channel Info Command =========//

cmd({
    pattern: "ytchannel",
    desc: "Get YouTube channel info",
    category: "info",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            reply("Please provide a channel name or URL.");
            return;
        }

        const search = await yts(q);
        const channel = search.channels[0];

        let desc = `
*𝗗𝗶𝗹𝗮𝗠𝗗 𝗬𝗼𝘂𝘁𝘂𝗯𝗲 𝗖𝗵𝗮𝗻𝗻𝗲𝗹 𝗜𝗻𝗳𝗼 📊*

👤 *𝗖𝗵𝗮𝗻𝗻𝗲𝗹 𝗡𝗮𝗺𝗲*: _${channel.name}_
📈 *𝗦𝘂𝗯𝘀𝗰𝗿𝗶𝗯𝗲𝗿𝘀*: _${formatViews(channel.subCount)}_
📹 *𝗧𝗼𝘁𝗮𝗹 𝗩𝗶𝗱𝗲𝗼𝘀*: _${channel.videoCount}_
🔗 *𝗟𝗶𝗻𝗸*: ${channel.url}

dilalk.vercel.app
ᵐᵃᵅᵉ ʙʏ ᴍʀᴅɪʟᴀ`;

        await conn.sendMessage(from, { image: { url: channel.thumbnail }, caption: desc }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

//========= Download and Convert to GIF Command =========//

cmd({
    pattern: "ytgif",
    desc: "Download YouTube video and convert to GIF",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            reply("Please provide a video URL or search query.");
            return;
        }

        const search = await yts(q);
        const data = search.videos[0];

        let desc = `
*𝗗𝗶𝗹𝗮𝗠𝗗 𝗬𝗼𝘂𝘁𝘂𝗯𝗲 𝗧𝗼 𝗚𝗜𝗙 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 🎥*

🎶 *𝗧𝗶𝘁𝗹𝗲*: _${data.title}_
👤 *𝗖𝗵𝗮𝗻𝗻𝗲𝗹*: _${data.author.name}_
⏳ *𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻*: _${data.timestamp}_
🔗 *𝗟𝗶𝗻𝗸*: ${data.url}

dilalk.vercel.app
ᵐᵃᵈᵉ ʙʏ ᴍʀᴅɪʟᴀ`;

        // Send video info with thumbnail
        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        // Download video
        let down = await fg.ytv(data.url);
        let downloadUrl = down.dl_url;

        // Convert video to GIF and send
        // Assuming there's a function fg.toGif for conversion, otherwise use an external tool.
        let gifUrl = await fg.toGif(downloadUrl);
        await conn.sendMessage(from, { video: { url: gifUrl }, mimetype: "video/gif" }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

//========= YouTube Playlist Downloader Command =========//

cmd({
    pattern: "playlist",
    desc: "Download all videos from a YouTube playlist",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            reply("Please provide a playlist URL or name.");
            return;
        }

        const search = await yts({ listId: q });
        const playlist = search.playlist;
        const videos = playlist.videos;

        let desc = `*𝗗𝗶𝗹𝗮𝗠𝗗 𝗬𝗼𝘂𝘁𝘂𝗯𝗲 𝗣𝗹𝗮𝘆𝗹𝗶𝘀𝘁 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 🎧*\n\n`;
        desc += `📄 *𝗣𝗹𝗮𝘆𝗹𝗶𝘀𝘁 𝗡𝗮𝗺𝗲*: _${playlist.title}_\n`;
        desc += `👤 *𝗖𝗵𝗮𝗻𝗻𝗲𝗹*: _${playlist.author.name}_\n`;
        desc += `🔗 *𝗟𝗶𝗻𝗸*: ${playlist.url}\n\n`;

        desc += `🎥 *𝗧𝗼𝘁𝗮𝗹 𝗩𝗶𝗱𝗲𝗼𝘀*: _${videos.length}_\n\n`;

        for (let i = 0; i < videos.length; i++) {
            const video = videos[i];
            const downloadAudio = await fg.yta(video.url);
            const downloadVideo = await fg.ytv(video.url);

            // Send video details with audio and video download links
            desc += `${i + 1}. 🎶 *Title*: _${video.title}_\n`;
            desc += `   🔗 *Audio*: ${downloadAudio.dl_url}\n`;
            desc += `   🔗 *Video*: ${downloadVideo.dl_url}\n\n`;
        }

        await conn.sendMessage(from, { text: desc }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
//========= YouTube Comments Fetcher Command =========//

cmd({
    pattern: "ytcomments",
    desc: "Fetch top comments from a YouTube video",
    category: "info",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            reply("Please provide a video URL or search query.");
            return;
        }

        const search = await yts(q);
        const video = search.videos[0];

        const comments = await fg.ytc(video.url); // Assuming fg.ytc fetches comments

        let desc = `*𝗗𝗶𝗹𝗮𝗠𝗗 𝗧𝗼𝗽 𝗖𝗼𝗺𝗺𝗲𝗻𝘁𝘀 🎤*\n\n`;
        desc += `🎶 *𝗧𝗶𝘁𝗹𝗲*: _${video.title}_\n`;
        desc += `👤 *𝗖𝗵𝗮𝗻𝗻𝗲𝗹*: _${video.author.name}_\n`;
        desc += `🔗 *𝗟𝗶𝗻𝗸*: ${video.url}\n\n`;

        comments.forEach((comment, index) => {
            desc += `${index + 1}. *${comment.authorName}*:\n`;
            desc += `   "${comment.text}"\n`;
            desc += `   👍 ${comment.likes} likes\n\n`;
        });

        await conn.sendMessage(from, { text: desc }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});


//========= YouTube Subtitle Downloader Command =========//

cmd({
    pattern: "ytsubtitle",
    desc: "Download subtitles from a YouTube video",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            reply("Please provide a video URL or search query.");
            return;
        }

        const search = await yts(q);
        const video = search.videos[0];

        const subtitles = await fg.ytsub(video.url); // Assuming fg.ytsub fetches subtitles

        if (!subtitles || subtitles.length === 0) {
            reply("No subtitles available for this video.");
            return;
        }

        let desc = `*𝗗𝗶𝗹𝗮𝗠𝗗 𝗦𝘂𝗯𝘁𝗶𝘁𝗹𝗲 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 🎥*\n\n`;
        desc += `🎶 *𝗧𝗶𝘁𝗹𝗲*: _${video.title}_\n`;
        desc += `👤 *𝗖𝗵𝗮𝗻𝗻𝗲𝗹*: _${video.author.name}_\n`;
        desc += `🔗 *𝗟𝗶𝗻𝗸*: ${video.url}\n\n`;

        subtitles.forEach((subtitle, index) => {
            desc += `${index + 1}. *Language*: ${subtitle.language}\n`;
            desc += `   🔗 *Download*: ${subtitle.url}\n\n`;
        });

        await conn.sendMessage(from, { text: desc }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});



//========= YouTube Trending Videos Fetcher Command =========//

cmd({
    pattern: "yttrending",
    desc: "Fetch trending YouTube videos",
    category: "info",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            reply("Please provide a region code (e.g., US, IN, etc.).");
            return;
        }

        const trending = await fg.yttrending(q); // Assuming fg.yttrending fetches trending videos by region

        let desc = `*𝗗𝗶𝗹𝗮𝗠𝗗 𝗧𝗿𝗲𝗻𝗱𝗶𝗻𝗴 𝗬𝗼𝘂𝘁𝘂𝗯𝗲 𝗩𝗶𝗱𝗲𝗼𝘀 📈*\n\n`;

        trending.forEach((video, index) => {
            desc += `${index + 1}. 🎶 *Title*: _${video.title}_\n`;
            desc += `   👤 *Channel*: _${video.author.name}_\n`;
            desc += `   👁️‍🗨️ *Views*: _${formatViews(video.views)}_\n`;
            desc += `   🔗 *Link*: ${video.url}\n\n`;
        });

        await conn.sendMessage(from, { text: desc }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});


//========= YouTube Related Videos Fetcher Command =========//

cmd({
    pattern: "ytrelated",
    desc: "Fetch related videos to a specific YouTube video",
    category: "info",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            reply("Please provide a video URL or search query.");
            return;
        }

        const search = await yts(q);
        const video = search.videos[0];

        const relatedVideos = await fg.ytrelated(video.url); // Assuming fg.ytrelated fetches related videos

        let desc = `*𝗗𝗶𝗹𝗮𝗠𝗗 𝗥𝗲𝗹𝗮𝘁𝗲𝗱 𝗩𝗶𝗱𝗲𝗼𝘀 🎥*\n\n`;
        desc += `🎶 *𝗧𝗶𝘁𝗹𝗲*: _${video.title}_\n`;
        desc += `👤 *𝗖𝗵𝗮𝗻𝗻𝗲𝗹*: _${video.author.name}_\n`;
        desc += `   🔗 *Link*: ${relatedVideo.url}\n\n`;
        });

        await conn.sendMessage(from, { text: desc }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});


//========= YouTube Channel Info Fetcher Command =========//

cmd({
    pattern: "ytchannel2",
    desc: "Fetch information about a YouTube channel",
    category: "info",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            reply("Please provide a channel name or URL.");
            return;
        }

        const search = await yts({ query: q, pages: 1 });
        const channel = search.channels[0];

        if (!channel) {
            reply("No channel found with the given query.");
            return;
        }

        let desc = `*𝗗𝗶𝗹𝗮𝗠𝗗 𝗬𝗼𝘂𝘁𝘂𝗯𝗲 𝗖𝗵𝗮𝗻𝗻𝗲𝗹 𝗜𝗻𝗳𝗼 📺*\n\n`;
        desc += `👤 *𝗡𝗮𝗺𝗲*: _${channel.name}_\n`;
        desc += `👥 *𝗦𝘂𝗯𝘀𝗰𝗿𝗶𝗯𝗲𝗿𝘀*: _${formatViews(channel.subCount)}_\n`;
        desc += `📄 *𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻*: _${channel.description}_\n`;
        desc += `🎥 *𝗩𝗶𝗱𝗲𝗼𝘀*: _${channel.videoCount}_\n`;
        desc += `🔗 *𝗟𝗶𝗻𝗸*: ${channel.url}\n\n`;

        await conn.sendMessage(from, { image: { url: channel.image }, caption: desc }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});


//========= YouTube Video Info Fetcher Command =========//

cmd({
    pattern: "ytinfo2",
    desc: "Fetch detailed information about a YouTube video",
    category: "info",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            reply("Please provide a video URL or search query.");
            return;
        }

        const search = await yts(q);
        const video = search.videos[0];

        let desc = `*𝗗𝗶𝗹𝗮𝗠𝗗 𝗬𝗼𝘂𝘁𝘂𝗯𝗲 𝗩𝗶𝗱𝗲𝗼 𝗜𝗻𝗳𝗼 🎥*\n\n`;
        desc += `🎶 *𝗧𝗶𝘁𝗹𝗲*: _${video.title}_\n`;
        desc += `👤 *𝗖𝗵𝗮𝗻𝗻𝗲𝗹*: _${video.author.name}_\n`;
        desc += `📅 *𝗣𝘂𝗯𝗹𝗶𝘀𝗵𝗲𝗱 𝗼𝗻*: _${video.ago}_\n`;
        desc += `⏳ *𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻*: _${video.timestamp}_\n`;
        desc += `👁️‍🗨️ *𝗩𝗶𝗲𝘄𝘀*: _${formatViews(video.views)}_\n`;
        desc += `👍 *𝗟𝗶𝗸𝗲𝘀*: _${formatViews(video.likes)}_\n`;
        desc += `🔗 *𝗟𝗶𝗻𝗸*: ${video.url}\n\n`;

        await conn.sendMessage(from, { image: { url: video.thumbnail }, caption: desc }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});


//========= YouTube Video Search Command =========//

cmd({
    pattern: "ytsearch2",
    desc: "Search YouTube videos by query",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            reply("Please provide a search query.");
            return;
        }

        const search = await yts(q);
        const videos = search.videos;

        let desc = `*𝗗𝗶𝗹𝗮𝗠𝗗 𝗬𝗼𝘂𝘁𝘂𝗯𝗲 𝗩𝗶𝗱𝗲𝗼 𝗦𝗲𝗮𝗿𝗰𝗵 🔎*\n\n`;
        videos.slice(0, 5).forEach((video, index) => { // Showing top 5 results
            desc += `${index + 1}. 🎶 *Title*: _${video.title}_\n`;
            desc += `   👤 *Channel*: _${video.author.name}_\n`;
            desc += `   ⏳ *Duration*: _${video.timestamp}_\n`;
            desc += `   👁️‍🗨️ *Views*: _${formatViews(video.views)}_\n`;
            desc += `   🔗 *Link*: ${video.url}\n\n`;
        });

        await conn.sendMessage(from, { text: desc }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
