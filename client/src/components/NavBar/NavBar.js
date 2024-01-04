import './NavBar.css';
import { useEffect, useState } from 'react';
import { IoIosNotifications } from 'react-icons/io';

const Navbar = ({ socket }) => {
  // визначення даних, що будуть потрібні в подальшій розробці
  const [notifications, setNotifications] = useState([]);
  const [openNotifications, setOpenNotifications] = useState(false);

  // отримання з бек-енду інформацію про користувача, що вподобав фотографію
  useEffect(() => {
    socket?.on('getNotification', data => {
      setNotifications(prev => [...prev, data]);
    });
  }, [socket]);

  // функція, що відображає сповіщення про вподобання фотографії
  const displayNotification = ({ senderName }, i) => {
    const action = 'вподобав(ла)';

    return (
      <li
        key={i}
        className="notification"
      >{`${senderName} ${action} ваш пост.`}</li>
    );
  };

  // функція, що закриває вікно сповіщень та робить їх прочитаними
  const handleRead = () => {
    setNotifications([]);
    setOpenNotifications(false);
  };

  return (
    <div className="navbar">
      <span className="logo">Pic Swap</span>
      <div className="icons">
        <div
          className="icon"
          onClick={() => setOpenNotifications(!openNotifications)}
        >
          <IoIosNotifications style={{ width: 20, height: 20 }} />
          {notifications.length > 0 && (
            <div className="counter">{notifications.length}</div>
          )}
        </div>
      </div>
      {openNotifications && (
        <div className="notifications">
          {notifications.length === 0 ? (
            <>
              <span>Ще немає сповіщень...</span>
            </>
          ) : (
            <>
              <ul className="list">
                {notifications.map((n, i) => displayNotification(n, i))}
              </ul>
              <button className="nButton" onClick={handleRead}>
                Прочитано
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
