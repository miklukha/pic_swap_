import './Card.css';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { useState } from 'react';
import { VscAccount } from 'react-icons/vsc';

const Card = ({ post, socket, user, color }) => {
  // визначення даних, що будуть потрібні в подальшій розробці
  const [liked, setLiked] = useState(false);

  // визначення кастомних стилів картки
  const cardStyle = {
    width: 16,
    height: 16,
    cursor: 'pointer',
    marginRight: 10,
  };

  // адреса фотографії (заглушка) на випадок, якщо користувач немає фотографії
  const notPhotoUrl =
    'https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg';

  const handleNotification = () => {
    setLiked(true);
    // відсилання на бек-енд ім'я отримувача та відправника сповіщень
    socket.emit('sendNotification', {
      senderName: user,
      receiverName: post.name,
    });
  };

  return (
    <li className="card" style={{ listStyle: 'none' }}>
      <div className="info">
        <div className="userImg" style={{ backgroundColor: color }}>
          <VscAccount
            style={{
              width: 30,
              height: 30,
            }}
          />
        </div>
        <span>{post.name}</span>
      </div>
      <img src={post.photoUrl ?? notPhotoUrl} alt="user" className="postImg" />
      <div className="interaction">
        {liked ? (
          <IoMdHeart
            style={{ ...cardStyle, color: 'red' }}
            onClick={() => setLiked(false)}
          />
        ) : (
          <IoMdHeartEmpty
            style={cardStyle}
            onClick={() => handleNotification()}
          />
        )}
      </div>
    </li>
  );
};

export default Card;
