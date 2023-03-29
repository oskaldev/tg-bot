const TgApi = require('node-telegram-bot-api');
const token = '5985810457:AAEZKZisnafkPB10Ctv3De0mvz7hIrJOXYk';
const sequelize = require('./db');
const UserModel = require('./models');
const bot = new TgApi(token, { polling: true });
const chats = {};
const { gameOptions, againOptions } = require('./options');


const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Угадай цифру от 0 до 9 которую я загадал');
  const randomNumber = Math.floor(Math.random() * 10);
  chats[ chatId ] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадай', gameOptions);
}

const start = async () => {

  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (error) {
    console.log('Подключение к бд не удалось :( ');
  }

  bot.setMyCommands([
    { command: '/start', description: 'Приветствие' },
    { command: '/info', description: 'Проверить свой id' },
    { command: '/game', description: 'Игра угадай цифру' }
  ])
  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    try {
      if (text === '/start') {
        await UserModel.sync({ chatId });
        await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/a90/0a5/a900a5fc-426a-4f6d-91f4-00dfc177c257/192/11.webp');
        return bot.sendMessage(chatId, `Добро пожаловать ${msg.chat.first_name}`);
      }
      if (text === '/info') {
        const user = await UserModel.findOne({ chatId });
        return bot.sendMessage(chatId, `Ваш id = ${msg.chat.id}, правильные ответы в игре ${user.right}, неправильные ответы в игре ${user.wrong}`);
      }
      if (text === '/game') {
        return startGame(chatId);
      }
      return bot.sendMessage(chatId, 'Выберите команду');
    } catch (error) {
      return bot.sendMessage(chatId, 'Произошла ошибка, уже исправляем :) ')
    }

  });

  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    const user = await UserModel.findOne({ chatId });

    try {
      if (data === '/again') {
        return startGame(chatId);
      }
      if (data == chats[ chatId ]) {
        user.right++;
        await bot.sendMessage(chatId, `Поздравляю ты отгадал цифру ${chats[ chatId ]}`, againOptions)
      } else {
        user.wrong++;
        await bot.sendMessage(chatId, `К сожалению ты не отгадал это цифра ${chats[ chatId ]}`, againOptions)
      }
      await user.save();
    } catch (error) {
      return bot.sendMessage(chatId, 'Произошла ошибка, уже исправляем :) ')
    };
  });



}
start();
