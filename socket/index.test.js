const { Server } = require('socket.io');
const ioClient = require('socket.io-client');
const {
  addNewUserOnline,
  updatePhoto,
  removeUser,
  getUser,
  onlineUsers,
} = require('./index');

let server;
let socket;

beforeAll(done => {
  server = new Server();
  server.listen(5001);
  socket = ioClient.connect('http://localhost:5000');

  socket.on('connect', () => {
    done();
  });
});

afterAll(() => {
  server.close();
  socket.close();
});

test('addNewUserOnline adds a new user to the onlineUsers array', () => {
  addNewUserOnline('testUser', socket.id);
  expect(onlineUsers.some(user => user.name === 'testUser')).toBe(true);
});

test('updatePhoto updates the photoUrl of a user in the onlineUsers array', () => {
  const updatedUserData = { name: 'testUser', photoUrl: 'newUrl' };
  updatePhoto(updatedUserData);

  const updatedUser = onlineUsers.find(user => user.name === 'testUser');
  expect(updatedUser.photoUrl).toBe('newUrl');
});

test('getUser returns the correct user from the onlineUsers array', () => {
  const user = getUser('testUser');
  expect(user.socketId).toBe(socket.id);
});

test('removeUser removes a user from the onlineUsers array', () => {
  removeUser(socket.id);
  expect(onlineUsers.length).toBe(1);
});
