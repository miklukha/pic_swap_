// import { Server } from 'socket.io';
const { Server } = require('socket.io');

// з'єднання з фронт-енд
const io = new Server({
  cors: {
    origin: 'http://localhost:3000',
  },
});

// створення масиву користувачів
let onlineUsers = [];

// функція, що змінює посилання на фотографію в масиві користувачів
const updatePhoto = userData => {
  const { photoUrl, name } = userData;

  onlineUsers = onlineUsers.map(user => {
    if (user.name === name) {
      user.photoUrl = photoUrl;
    }

    return user;
  });
};

// функція, що додає нових користувачів
const addNewUserOnline = (name, socketId) => {
  if (name !== '') {
    !onlineUsers.some(user => user.name === name) &&
      onlineUsers.push({ name, socketId });
  }
};

// функція, що видаляє користувачів з масиву
const removeUser = socketId => {
  onlineUsers = onlineUsers.filter(user => user.socketId !== socketId);
};

// функція, що отримує інформацію про користувача
const getUser = name => {
  return onlineUsers.find(user => user.name === name);
};

// підключення
io.on('connection', socket => {
  // реакція на подію "newUserOnline", що приходить з фронт-енду
  socket.on('newUserOnline', user => {
    // викликання функції, що додає користувачів
    addNewUserOnline(user, socket.id);
  });

  // реакція на подію "updatePhotoUrl", що приходить з фронт-енду
  socket.on('updatePhotoUrl', userData => {
    // викликання функції, що змінює адресу фотографії
    updatePhoto(userData);

    // відсилання на фронт-енд оновлених користувачів
    io.emit('updatedUsers', onlineUsers);
  });

  // реакція на подію "sendNotification", що приходить з фронт-енду
  socket.on('sendNotification', ({ senderName, receiverName }) => {
    // отримання об'єкту отримувача
    const receiver = getUser(receiverName);

    // відсилання на фронт-енд отримувачу ім'я відправника
    io.to(receiver?.socketId).emit('getNotification', {
      senderName,
    });
  });

  // відсилання на фронт-енд даних про користувачів
  io.emit('getUsers', onlineUsers);

  // від'єднання користувача
  socket.on('disconnect', () => {
    removeUser(socket.id);
  });
});

// встановлення порта
io.listen(5000);

module.exports = {
  onlineUsers,
  updatePhoto,
  addNewUserOnline,
  removeUser,
  getUser,
};
