import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { io } from 'socket.io-client';
import './App.css';
import Card from './components/Card/Card';
import Navbar from './components/NavBar/NavBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// визначення кастомних стилів модального вікна
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    width: '370px',
  },
};

Modal.setAppElement('body');

function App() {
  // визначення даних, що будуть потрібні в подальшій розробці
  const [username, setUsername] = useState('');
  const [user, setUser] = useState('');
  const [socket, setSocket] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState([]);

  // функція, що повертає випадковий колір
  const randomColor = () => {
    const color = Math.floor(Math.random() * 16777215).toString(16);
    return '#' + color;
  };

  const uploadPhotoUrl = () => {
    if (photoUrl === '') {
      // відображення помилки користувачу
      toast.error('Посилання не може бути пустим рядком');
      return;
    }

    // відсилання на бек-енд адресу фотографії та ім'я користувача
    socket?.emit('updatePhotoUrl', { photoUrl, name: user });

    // отримання з бек-енду оновлені дані про користувачів
    socket.on('updatedUsers', data => setUsers(data));

    // закриття модального вікна
    setModalOpen(false);
  };

  // функція, що закриває модальне вікно
  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = () => {
    // відображення помилки користувачу
    if (username === '') {
      toast.error("Ім'я користувача не може бути пустим рядком");
      return;
    }

    setUser(username);
  };

  // підключення до бек-енду
  useEffect(() => {
    setSocket(io('http://localhost:5000'));
  }, []);

  // відсилання на бек-енд дані про нового користувача
  useEffect(() => {
    socket?.emit('newUserOnline', user);
  }, [socket, user]);

  // отримання з бек-енду дані про користувачів
  useEffect(() => {
    socket?.on('getUsers', data => setUsers(data));
  }, [users, socket]);

  return (
    <div className="container">
      {user ? (
        <>
          <Navbar socket={socket} />
          <button className="addBtn" onClick={() => setModalOpen(true)}>
            Додати фото
          </button>
          <Modal
            isOpen={modalOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <label>
              Посилання на фотографію, що бажаєте завантажити:
              <input
                className="modalInput"
                type="text"
                name="url"
                onChange={e => setPhotoUrl(e.target.value)}
              />
              <button onClick={uploadPhotoUrl}>Завантажити</button>
            </label>
          </Modal>
          <ul className="list">
            {users.length !== 0 &&
              users.map(post => (
                <Card
                  key={post.socketId}
                  post={post}
                  user={user}
                  socket={socket}
                  color={randomColor()}
                  photoUrl={photoUrl}
                />
              ))}
          </ul>
          <span className="username">{user}</span>
        </>
      ) : (
        <div className="login">
          <h2>Pic Swap</h2>
          <input
            type="text"
            maxLength="20"
            placeholder="ім'я користувача"
            onChange={e => setUsername(e.target.value)}
          />
          <button onClick={handleSubmit}>Увійти</button>
        </div>
      )}
      <ToastContainer position="top-center" />
    </div>
  );
}

export default App;
