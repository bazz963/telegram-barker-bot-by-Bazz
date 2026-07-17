const { Telegraf } = require('telegraf');

// Pterodactyl will pull your Bot Token securely from your environment variables
const BOT_TOKEN = process.env.BOT_TOKEN; 

if (!BOT_TOKEN) {
    console.error("ERROR: BOT_TOKEN environment variable is missing in Pterodactyl!");
    process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// 1. /start command: Sends a dog photo and instructions
bot.start((ctx) => {
    // You can replace this link with any image address you like!
    const photoUrl = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'; 
    
    ctx.replyWithPhoto(photoUrl, {
        caption: `🐾 Welcome to the Barker Bot! 🐾\n\nUse the command like this:\n/bark 3\n\nType /dev to see who made me!`
    });
});

// 2. /bark [number] command: Loops and barks custom amounts
bot.command('bark', (ctx) => {
    const messageText = ctx.message.text.trim();
    const args = messageText.split(' '); 
    
    const countInput = args[1]; 
    const numberOfBarks = parseInt(countInput);

    // If they forgot the number or typed letters
    if (!countInput || isNaN(numberOfBarks)) {
        return ctx.reply("Woof? Please give me a number! Example: /bark 3");
    }

    // Safety limit so your panel doesn't crash from spam
    if (numberOfBarks > 50) {
        return ctx.reply("Oof! That's too much barking. Try a number 50 or less!");
    }

    let barkString = "";
    for (let i = 0; i < numberOfBarks; i++) {
        barkString += "Woof! 🐶 ";
    }

    ctx.reply(barkString.trim());
});

// 3. /dev command: Show your developer credits
bot.command('dev', (ctx) => {
    ctx.reply("💻 Barker Bot Developer 💻\n\nThis bot was proudly created by Your Name!");
});

// Launch the bot container
bot.launch().then(() => {
    console.log('Barker Bot is online and running flawlessly on Node.js 24!');
});

// Handle safe shutdowns inside Pterodactyl panels
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

