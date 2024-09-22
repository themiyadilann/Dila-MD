const { cmd } = require('../command');
const Hiru = require('hirunews-scrap');
const Derana = require('@kaveesha-sithum/derana-news');
const Esana = require('@sl-code-lords/esana-news');

// Function to fetch the latest news from different sources
async function getLatestNews() {
    let newsData = '';
    
    // Hiru News
    try {
        const hiruApi = new Hiru();
        const hiruNews = await hiruApi.BreakingNews();
        newsData += `📰 *Hiru News*: ${hiruNews.results.title}\n${hiruNews.results.news}\n${hiruNews.results.date}\n\n`;
    } catch (err) {
        newsData += `Error fetching Hiru News: ${err.message}\n`;
    }

    // Derana News
    try {
        const deranaApi = new Derana();
        const deranaNews = await deranaApi.getNews();
        newsData += `📰 *Derana News*: ${deranaNews.title}\n${deranaNews.content}\n${deranaNews.date}\n\n`;
    } catch (err) {
        newsData += `Error fetching Derana News: ${err.message}\n`;
    }

    // Esana News
    try {
        const esanaApi = new Esana();
        const esanaNews = await esanaApi.getLatestNews();
        newsData += `📰 *Esana News*: ${esanaNews.title}\n${esanaNews.description}\n${esanaNews.publishedAt}\n\n`;
    } catch (err) {
        newsData += `Error fetching Esana News: ${err.message}\n`;
    }

    return newsData || 'No news available at the moment.';
}

// Command to enable the news service in the group
cmd({
    pattern: "setnews",
    desc: "Enable Sri Lankan news updates in the group",
    isGroup: true,
    isOwner: false,
    react: "📰",
    filename: __filename
}, async (conn, mek, m, { from, isGroup }) => {
    try {
        if (isGroup) {
            const newsData = await getLatestNews();
            await conn.sendMessage(from, { text: `📰 *Latest Sri Lankan News*:\n\n${newsData}` });
        } else {
            await conn.sendMessage(from, { text: "This command can only be used in groups." });
        }
    } catch (e) {
        console.error(`Error in setnews command: ${e.message}`);
        await conn.sendMessage(from, { text: "Failed to fetch news updates." });
    }
});
