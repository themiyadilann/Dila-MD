import requests
import discord
from discord.ext import commands

# Replace with your bot token and command prefix
TOKEN = 'your-bot-token'
PREFIX = '!'

intents = discord.Intents.default()
intents.message_content = True
client = commands.Bot(command_prefix=PREFIX, intents=intents)

@client.event
async def on_ready():
    print(f'Logged in as {client.user}')

@client.command(name='ai', help='AI chat')
async def ai(ctx, *, query: str):
    try:
        # Fetch response from AI API
        response = requests.get(f'https://chatgptforprabath-md.vercel.app/api/gptv1?q={query}')
        data = response.json()
        reply_text = data.get('data', '')

        # Format the reply
        reply_message = (
            f"*𝗗𝗶𝗹𝗮𝗠𝗗 𝗔𝗜 𝗖𝗵𝗮𝘁 🧠*\n\n"
            f"🔍 *𝗤𝘂𝗲𝗿𝘆*: _{query}_\n\n"
            f"💬 *𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲*: _{reply_text}_\n\n"
            f"dilalk.vercel.app\nᵐᵃᵈᵆ ᵇʸ ᵐʳᵈⁱˡᵃ ᵒᶠᶜ"
        )

        # Send the reply with the image
        image_url = 'https://telegra.ph/file/5aee066590cf0c6eabf9d.jpg'
        embed = discord.Embed(description=reply_message)
        embed.set_image(url=image_url)

        await ctx.send(embed=embed)

    except Exception as e:
        await ctx.send(f'Error: {str(e)}')

client.run(TOKEN)
