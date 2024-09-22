const { cmd } = require('../command');
const Hiru = require('hirunews-scrap');
const EsanaNews = require('@sl-code-lords/esana-news');
const DeranaNews = require('@kaveesha-sithum/derana-news');

// Initialize APIs
const hiruApi = new Hiru();
const esanaApi = new EsanaNews();
const deranaApi = new DeranaNews();

// Command to enable news updates
cmd({
  pattern: "setnews",
  desc: "Enable the latest news service in the group",
  isGroup: true,
  isOwner: true, // Only the group owner can enable
  react: "📰",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, sender }) => {
  try {
    if (isGroup) {
      const groupMetadata = await conn.groupMetadata(from);
      const groupName = groupMetadata.subject;

      // Fetch the latest news from multiple sources
      const hiruNews = await hiruApi.BreakingNews();
      const esanaNews = await esanaApi.getLatest();
      const deranaNews = await deranaApi.getLatestNews();

      // Structure the news into a message
      const newsMessage = `
📢 *News Updates for ${groupName}*

*Hiru News*:
📰 ${hiruNews.results.title}
📝 ${hiruNews.results.news}

*Esana News*:
📰 ${esanaNews.title}
📝 ${esanaNews.description}

*Derana News*:
📰 ${deranaNews.title}
📝 ${deranaNews.description}

Stay informed with the latest news in Sri Lanka!
`;

      // Send the news to the group
      await conn.sendMessage(from, { text: newsMessage });

      // Confirmation message to the group owner
      await conn.sendMessage(sender, { text: "News service enabled in this group!" });
    } else {
      await conn.sendMessage(from, { text: "This command can only be used in groups." });
    }
  } catch (e) {
    console.error(`Error in setnews command: ${e.message}`);
    await conn.sendMessage(from, { text: "An error occurred while fetching the news." });
  }
});
