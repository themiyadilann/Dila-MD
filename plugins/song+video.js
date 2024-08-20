const {cmd , commands} = require('../command')
const fg = require('api-dylux')
const yts = require('yt-search')
cmd({
    pattern: "song",
    desc: "download songs",
    category: "download",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if(!q) return reply("Please type Name or Url... 🤖")
const search = await yts(q)
const data = search.videos[0];
const url = data.url

let desc = `
🤖 _DilaMD Youtube Downloader_ 📥

title: ${data.title}
description: ${data.discretion}
time: ${data.timestemp}
ago: ${data.ago}
views: ${data.views}

ᴹᵃᵈᵉ ᴮʸ ᴹʳᴰⁱˡᵃ
`
await conn.sendMessage(from,{image:{url: data.thumbnail},captain:desc},{quoted:mek});
// download audio


let down = await fg.yta(url)
let downloadUrl = down.dl_url

// send audio message
await conn.sendMessage(from,{audio:{url:downloadUrl},mimetype:"audio/mpeg"},{quoted:mek})

}catch(e){
console.log(e)
reply(`${e}`)
}
})
