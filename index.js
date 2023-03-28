const TgApi = require('node-telegram-bot-api');
const token = '';
const bot = new TgApi(token, { polling: true });
const chats = {};
const { gameOptions, againOptions } = require('./options');


const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Угадай цифру от 0 до 9 которую я загадал');
  const randomNumber = Math.floor(Math.random() * 10);
  chats[ chatId ] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадай', gameOptions);
}

const start = () => {

  bot.setMyCommands([
    { command: '/start', description: 'Приветствие' },
    { command: '/info', description: 'Проверить свой id' },
    { command: '/game', description: 'Игра угадай цифру' }
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
    if (text === '/game') {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, 'Выберите команду');
  });

  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/again') {
      return startGame(chatId);
    }
    if (data == chats[ chatId ]) {
      return bot.sendMessage(chatId, `Поздравляю ты отгадал цифру ${chats[ chatId ]}`, againOptions)
    } else {
      return bot.sendMessage(chatId, `К сожалению ты не отгадал это цифра ${chats[ chatId ]}`, againOptions)
    }
  })
}
start();
