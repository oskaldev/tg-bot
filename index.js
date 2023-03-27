const TgApi = require('node-telegram-bot-api');
const token = '';
const bot = new TgApi(token, { polling: true });

const start = () => {

  bot.setMyCommands([
    { command: '/start', description: 'Приветствие' },
    { command: '/info', description: 'Проверить свой id' },
    { command: '/delete_chat', description: 'Удалить чат' }
  ])
  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/a90/0a5/a900a5fc-426a-4f6d-91f4-00dfc177c257/192/11.webp')
      return bot.sendMessage(chatId, `Добро пожаловать ${msg.chat.first_name}`);
    }
    if (text === '/info') {
      return bot.sendMessage(chatId, `Ваш id = ${msg.chat.id}`);
    }
    return bot.sendMessage(chatId, 'Выберите команду');
  });
}
start();
