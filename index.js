const { Telegraf } = require('telegraf');

// Make sure your real token from @BotFather is inside these single quotes
const BOT_TOKEN = '8620955030:AAWzxRgUtAFwUvXlhfIfwkyDZw8452M4uc'; 

const bot = new Telegraf(BOT_TOKEN);

// 1. /start command
bot.start((ctx) => {
    const photoUrl = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'; 
    ctx.replyWithPhoto(photoUrl, {
        caption: `🐾 Welcome to the Spam Bot! 🐾\n\nUse the command like this:\n/spam 100 hi guys\n\nType /dev to see who made me!`
    });
});

// 2. /spam [number] [message] command (Sends multiple separate messages up to 100!)
bot.command('spam', async (ctx) => {
    const messageText = ctx.message.text.trim();
    const args = messageText.split(' '); 
    const countInput = args[1]; 
    const numberOfSpams = parseInt(countInput);

    if (!countInput || isNaN(numberOfSpams)) {
        return ctx.reply("Please give me a number and a message! Example: /spam 100 hi guys");
    }

    // New limit set exactly to 100 as requested!
    if (numberOfSpams > 100) {
        return ctx.reply("Please keep the limit to 100 separate messages or less!");
    }

    // Grabs your custom text message
    const commandLength = args[0].length + args[1].length + 2; 
    const customMessage = messageText.substring(commandLength).trim();
    const textToRepeat = customMessage || "Spam! 🤖";

    // Loops and sends individual messages up to 100 times
    for (let i = 0; i < numberOfSpams; i++) {
        await ctx.reply(textToRepeat);
    }
});

// 3. /dev command
bot.command('dev', (ctx) => {
    ctx.reply("💻 Spam Bot Developer 💻\n\nThis bot was proudly created by a legendary developer!");
});

// Start the bot securely
async function startBot() {
    try {
        console.log('Connecting to Telegram...');
        await bot.launch();
        console.log('--- SUCCESS ---');
        console.log('Spam Bot is officially ONLINE and ready!');
    } catch (error) {
        console.error('Launch Error:', error);
    }
}

startBot();

// Heartbeat loop forces Pterodactyl to stay awake infinitely
setInterval(() => {}, 100000);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));



