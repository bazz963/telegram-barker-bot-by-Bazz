const { Telegraf, Markup } = require('telegraf');

// ─── CONFIGURATION SETTINGS ──────────────────────────────────────────
const BOT_TOKEN = '8620955030:AAWzxRgUtAFwUvXlhfIfwkyDZw8452M4uc'; 
const MUSIC_API_KEY = 'PASTE_YOUR_MUSIC_API_KEY_HERE'; 

// 🛑 OWNER ONLY: Replace 7667145353 with your actual Telegram Account User ID!
const OWNER_ID = 7667145353; 
// ─────────────────────────────────────────────────────────────────────

const bot = new Telegraf(BOT_TOKEN);

// Simple database array to keep track of user chat IDs for broadcasting
const registeredUsers = new Set();

// Button layout
function getStylishButtons() {
    return Markup.inlineKeyboard([
        [
            Markup.button.url('📢 𝐉𝐎𝐈𝐍 𝐎𝐔𝐑 𝐂𝐇𝐀𝐍𝐍𝐄𝐋 📢', 'https://t.me/your_channel'),
            Markup.button.url('👑 💻 𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑 💻 👑', 'https://t.me/BazzHacker963')
        ],
        [
            Markup.button.callback('❤️ Thanks ❤️', 'trigger_thanks_alert')
        ]
    ]);
}

// ─── ACTION HANDLERS ─────────────────────────────────────────────────
bot.action('trigger_thanks_alert', (ctx) => {
    ctx.answerCbQuery('Thanks to Bazz king 👑⚡', { show_alert: true });
});
// ─────────────────────────────────────────────────────────────────────

// 1. /start command
bot.start((ctx) => {
    registeredUsers.add(ctx.chat.id);

    // Updated with your exact new title header text!
    const startText = 
        `⚡ 𝕎𝕖𝕝𝕔𝕠𝕞𝕖 𝕥𝕠 𝔹𝕒𝕫𝕫 𝕖𝕕𝕚𝕥𝕚𝕠𝕟 𝕤𝕡𝕒𝕞 𝕩 𝕞𝕦𝕤𝕚𝕔 𝕓𝕠𝕥 ⚡\n\n` +
        `🏆 𝗠𝗘𝗡𝗨 🏆\n` +
        `✨───────────────✨\n` +
        `🚀 \`/spam 100 hi guys\` - Trigger the spam tool\n` +
        `🎵 \`/music song name\` - Search for tracks\n` +
        `📢 \`/broadcast [text]\` - Admin Announcement\n` +
        `✨───────────────✨\n\n` +
        `💎 𝔖𝔢𝔩𝔢𝔠𝔱 𝔞𝔫 𝔬𝔭𝔱𝔦𝔬𝔫 𝔟𝔢𝔩𝔬𝔴:`;

    ctx.reply(startText, {
        parse_mode: 'Markdown',
        ...getStylishButtons()
    });
});

// 2. /spam command
bot.command('spam', async (ctx) => {
    registeredUsers.add(ctx.chat.id); 
    
    const messageText = ctx.message.text.trim();
    const args = messageText.split(' '); 
    const countInput = args[1]; 
    const numberOfSpams = parseInt(countInput);

    if (!countInput || isNaN(numberOfSpams)) {
        return ctx.reply("❌ Please give me a number and a message!\n💡 Example: `/spam 100 hi guys`", getStylishButtons());
    }

    if (numberOfSpams > 100) {
        return ctx.reply("⚠️ Please keep the limit to 100 separate messages or less!", getStylishButtons());
    }

    const commandLength = args[0].length + args[1].length + 2; 
    const customMessage = messageText.substring(commandLength).trim();
    const textToRepeat = customMessage || "💥 Spam! 🤖";

    for (let i = 0; i < numberOfSpams; i++) {
        if (i === numberOfSpams - 1) {
            await ctx.reply(textToRepeat, getStylishButtons());
        } else {
            await ctx.reply(textToRepeat);
        }
    }
});

// 3. /music command 
bot.command('music', async (ctx) => {
    registeredUsers.add(ctx.chat.id); 
    const https = require('https');
    const args = ctx.message.text.split(' ').slice(1);
    const searchQuery = args.join(' ');

    if (!searchQuery) {
        return ctx.reply("🎵 Please provide a song name!\n💡 Example: `/music Faded` ");
    }

    if (!MUSIC_API_KEY || MUSIC_API_KEY.includes('PASTE_YOUR_')) {
        return ctx.reply("⚙️ Music API key is not configured in the engine yet!");
    }

    ctx.reply(`🔍 Searching for "${searchQuery}"...`);

    const apiURL = `https://api.deezer.com/search?q=${encodeURIComponent(searchQuery)}`;
    
    https.get(apiURL, (res) => {
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', async () => {
            try {
                const parsedData = JSON.parse(rawData);
                if (parsedData.data && parsedData.data.length > 0) {
                    const track = parsedData.data[0];
                    await ctx.reply(`🎵 **Found:** ${track.title} - ${track.artist.name}`);
                    await ctx.replyWithAudio(track.preview, { caption: `🎧 Here is your preview for: ${track.title}` });
                } else {
                    ctx.reply("❌ Could not find that song.");
                }
            } catch (e) {
                ctx.reply("⚠️ Error parsing music data.");
            }
        });
    }).on('error', () => {
        ctx.reply("⚠️ Connection error while grabbing track data.");
    });
});

// 4. /broadcast command (OWNER ONLY)
bot.command('broadcast', async (ctx) => {
    const userId = ctx.from.id;

    if (userId !== OWNER_ID) {
        return ctx.reply("🚫 **ACCESS DENIED:** This command is strictly reserved for the Bot Owner! 👑", { parse_mode: 'Markdown' });
    }

    const args = ctx.message.text.split(' ').slice(1);
    const broadcastMessage = args.join(' ');

    if (!broadcastMessage) {
        return ctx.reply("📢 **Broadcast Error:** Please include the message text after the command.\n💡 Example: `/broadcast Global Announcement!`");
    }

    if (registeredUsers.size === 0) {
        return ctx.reply("👥 No active users found in database memory yet to send to!");
    }

    ctx.reply(`🚀 **Starting Global Broadcast...** Sending to ${registeredUsers.size} users.`);

    let successCount = 0;
    
    for (const chatID of registeredUsers) {
        try {
            await ctx.telegram.sendMessage(chatID, `🚨 **[ GLOBAL ANNOUNCEMENT ]** 🚨\n\n${broadcastMessage}`, { parse_mode: 'Markdown' });
            successCount++;
        } catch (err) {
            console.log(`Could not send broadcast packet to chat user ${chatID}:`, err.message);
        }
    }

    ctx.reply(`✅ **Broadcast Complete!** Successfully hit ${successCount}/${registeredUsers.size} active users!`);
});

async function startBot() {
    try {
        console.log('Connecting to Telegram...');
        await bot.launch();
        console.log('--- SUCCESS ---');
        console.log('Bazz Edition Spam x Music Bot is ONLINE!');
    } catch (error) {
        console.error('Launch Error:', error);
    }
}

startBot();

setInterval(() => {}, 100000);
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
