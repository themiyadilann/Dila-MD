const { cmd } = require('../command');
const weather = require('weather-js');
const sensitiveData = require('../dila_md_licence/a/b/c/d/dddamsbs');

cmd({
  pattern: "weather",
  desc: "Get weather info for a location",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    // Check if the user provided a location
    if (!args.length) {
      return reply('Please provide a location in the format: .weather country/city');
    }

    // Extract the location (country/city)
    const location = args.join(" ");

    // Fetch weather data using weather-js
    weather.find({ search: location, degreeType: 'C' }, async (err, result) => {
      if (err || !result.length) {
        return reply(`Error fetching weather: ${err.message || "No data found"}`);
      }

      // Extract current weather information
      const weatherData = result[0];
      const current = weatherData.current;
      const forecast = weatherData.forecast[0];

      // Create a message for the current weather and forecast
      const replyText = `*🌤 Weather Information 🌤*\n\n` +
        `📍 *Location*: _${weatherData.location.name}_\n` +
        `🌡️ *Temperature*: _${current.temperature}°C_\n` +
        `🌥️ *Condition*: _${current.skytext}_\n` +
        `💨 *Wind*: _${current.winddisplay}_\n` +
        `💧 *Humidity*: _${current.humidity}%_\n` +
        `🕒 *Observation Time*: _${current.observationtime}_\n\n` +
        `*📅 Forecast for Tomorrow*:\n` +
        `🌡️ *High*: _${forecast.high}°C_\n` +
        `🌡️ *Low*: _${forecast.low}°C_\n` +
        `🌥️ *Condition*: _${forecast.skytextday}_\n\n` +
        `${sensitiveData.siteUrl}\n${sensitiveData.footerText}`;

      // Send the weather data as a reply
      await conn.sendMessage(from, { 
        image: { url: current.imageUrl }, 
        caption: replyText 
      }, { quoted: mek });
    });
  } catch (e) {
    console.log(e);
    reply(`Error: ${e.message}`);
  }
});
