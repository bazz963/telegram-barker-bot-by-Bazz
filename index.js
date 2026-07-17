const { Telegraf } = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN; 

if (!BOT_TOKEN) {
    console.error("ERROR: BOT_TOKEN environment variable is missing!");
    process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
    const photoUrl = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'; 
    ctx.replyWithPhoto(photoUrl, {
        caption: `🐾 Welcome to the Barker Bot! 🐾\n\nUse the command like this:\n/bark 3\n\nType /dev to see who made me!`
    });
});

bot.command('bark', (ctx) => {
    const messageText = ctx.message.text.trim();
    const args = messageText.split(' '); 
    const countInput = args[1]; 
    const numberOfBarks = parseInt(countInput);

    if (!countInput || isNaN(numberOfBarks)) {
        return ctx.reply("Woof? Please give me a number! Example: /bark 3");
    }

    if (numberOfBarks > 50) {
        return ctx.reply("Oof! That's too much barking. Try 50 or less!");
    }

    let barkString = "";
    for (let i = 0; i < numberOfBarks; i++) {
        barkString += "Woof! 🐶 ";
    }
    ctx.reply(barkString.trim());
});

bot.command('dev', (ctx) => {
    ctx.reply("💻 Barker Bot Developer 💻\n\nThis bot was proudly created by Your Name!");
});

bot.launch().then(() => {
    console.log('Barker Bot is online!');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));


