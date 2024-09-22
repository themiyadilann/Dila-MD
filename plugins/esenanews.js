const { cmd } = require('../command');
const Hiru = require('hirunews-scrap');
const Derana = require('@kaveesha-sithum/derana-news');
const Esana = require('@sl-code-lords/esana-news');

// Store active groups and last news updates to avoid duplicates
let activeGroups = {};
let lastNewsTitles = {};

// Function to fetch the latest news from different sources
async function getLatestNews() {
    let newsData = [];

    // Hiru News
    try {
        const hiruApi = new Hiru();
        const hiruNews = await hiruApi.BreakingNews();
        newsData.push({
            title: hiruNews.results.title,
            content: hiruNews.results.news,
            date: hiruNews.results.date
        });
    } catch (err) {
        console.error(`Error fetching Hiru News: ${err.message}`);
    }

    // Derana News
    try {
        const deranaApi = new Derana();
        const deranaNews = await deranaApi.getNews();
        newsData.push({
            title: deranaNews.title,
            content: deranaNews.content,
            date: deranaNews.date
        });
    } catch (err) {
        console.error(`Error fetching Derana News: ${err.message}`);
    }

    // Esana News
    try {
        const esanaApi = new Esana();
        const esanaNews = await esanaApi.getLatestNews();
        newsData.push({
            title: esanaNews.title,
            content: esanaNews.description,
            date: esanaNews.publishedAt
        });
    } catch (err) {
        console.error(`Error fetching Esana News: ${err.message}`);
    }

    return newsData;
}

// Function to check for and post new news to the group
async function checkAndPostNews(conn, groupId) {
    const latestNews = await getLatestNews();
    latestNews.forEach(async (newsItem) => {
        if (!lastNewsTitles[groupId]) {
            lastNewsTitles[groupId] = [];
        }

        // Check if the news title has been posted already
        if (!lastNewsTitles[groupId].includes(newsItem.title)) {
            // Send the news to the group
            await conn.sendMessage(groupId, { 
                text: `📰 *${newsItem.title}*\n${newsItem.content}\n${newsItem.date}` 
            });
            // Add to the list of sent news
            lastNewsTitles[groupId].push(newsItem.title);

            // Keep the list from growing indefinitely
            if (lastNewsTitles[groupId].length > 100) {
                lastNewsTitles[groupId].shift(); // Remove the oldest news
            }
        }
    });
}

// Command to activate the news service in the group
cmd({
    pattern: "setnews",
    desc: "Enable Sri Lankan news updates in this group",
    isGroup: true,
    isOwner: false,
    react: "📰",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, participants }) => {
    try {
        if (isGroup) {
            const isAdmin = participants.some(p => p.id === mek.sender && p.admin);
            const isBotOwner = mek.sender === conn.user.jid; // Check if the user is the bot owner

            if (isAdmin || isBotOwner) {
                if (!activeGroups[from]) {
                    activeGroups[from] = true; // Activate the news service for this group

                    // Notify the group
                    await conn.sendMessage(from, { text: "📰 News service has been activated for this group!" });

                    // Periodically check for new news every 1 minute (60,000 milliseconds)
                    setInterval(async () => {
                        if (activeGroups[from]) {
                            await checkAndPostNews(conn, from);
                        }
                    }, 60000); // 60,000 milliseconds = 1 minute

                } else {
                    await conn.sendMessage(from, { text: "📰 News service is already active in this group." });
                }
            } else {
                await conn.sendMessage(from, { text: "🚫 This command can only be used by group admins or the bot owner." });
            }
        } else {
            await conn.sendMessage(from, { text: "This command can only be used in groups." });
        }
    } catch (e) {
        console.error(`Error in setnews command: ${e.message}`);
        await conn.sendMessage(from, { text: "Failed to activate the news service." });
    }
});
