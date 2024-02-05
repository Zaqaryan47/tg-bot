const TelegramApi = require('node-telegram-bot-api');
const { vidOptions } = require('./options');
const sequelize = require('./db');
const UserModel = require('./models');


const stick = './sticker/sticker.webp'

const token = '6554348814:AAFOyoJo5G4oDz6vsMgrNnJeKojRuPpSkFk';
// const ytToken = 'AIzaSyC8PrqFSD7LRuZO1utQyQkLjWKLQaBlWlM';

const bot = new TelegramApi(token, { polling: true });



const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
    } catch (e) {
        console.log('Подключение к бд сломалось', e);
    }

    bot.setMyCommands([
        { command: '/start', description: 'start' },
    ]);

    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;
        const firstName = msg.from.first_name;
        const username = msg.from.username

        try {
            if (text === '/start') {
                await bot.sendSticker(chatId, stick);
                return bot.sendMessage(chatId, `Բարի Գալուստ ${firstName || username} ջան Գիտակ։BOT,🤩`);
            }

            // Check if the text matches any video tag (case-insensitive)
            const matchedVideos = vidOptions.filter((video) => {
                const lowerCaseText = text.toLowerCase();
                return video.tag.some((tag) => lowerCaseText.includes(tag.toLowerCase()));
            });

          
// Initialize an array to store video IDs
const collectedVideoIds = [];

// ...

if (matchedVideos.length > 0) {
    for (const matchedVideo of matchedVideos) {
        // Store the video ID in the array
        collectedVideoIds.push(matchedVideo.vid);
        await bot.sendVideo(chatId, matchedVideo.vid);
    }
} else {
    return bot.sendMessage(chatId, 'դեռ չունենք նման անվաաննոումով info)');
}

// Now, collectedVideoIds array contains all the video IDs from matched videos
console.log(collectedVideoIds);

        } catch (e) {
            return bot.sendMessage(chatId, 'ինչ որ բան այն չէ (:');
        }
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', reason.stack || reason);
    });
};

start();
