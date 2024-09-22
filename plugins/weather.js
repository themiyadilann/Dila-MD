const weather = require('weather-js');
const { cmd } = require('../command');
const sensitiveData = require('../dila_md_licence/a/b/c/d/dddamsbs');

cmd({
  pattern: "weather",
  desc: "Get the weather information for a location",
  category: "main",
  filename: __filename
}, async (conn, mek, m, {
  from, body, args, q, reply
}) => {
  try {
    if (!q) {
      return reply('Please provide a location. Example: .weather country/city');
    }

    const location = q.includes('/') ? q.split('/').join(', ') : q; // Convert "country/city" to "country, city"
    
    weather.find({ search: location, degreeType: 'C' }, function (err, result) {
      if (err || !result || result.length === 0) {
        return reply(`Error fetching weather: ${err ? err.message : 'Location not found'}`);
      }

      const weatherInfo = result[0];
      const current = weatherInfo.current;
      const locationInfo = weatherInfo.location;

      let replyText = `*🌤 Weather Information 🌤*\n\n📍 *Location*: _${locationInfo.name}_\n\n🌡️ *Temperature*: _${current.temperature}°C_\n\n🌥️ *Condition*: _${current.skytext}_\n\n💨 *Wind*: _${current.windspeed}_\n\n💧 *Humidity*: _${current.humidity}%_\n\n🕒 *Observation Time*: _${current.observationtime}_\n\n🔗 ${sensitiveData.siteUrl}\n${sensitiveData.footerText}`;

      conn.sendMessage(from, { text: replyText }, { quoted: mek });
    });
  } catch (e) {
    console.log(e);
    reply(`Error: ${e.message}`);
  }
});
