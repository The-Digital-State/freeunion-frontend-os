import { SocialNetworks } from 'components/Landing/SocialNetworks/SocialNetworks';
import { contacts } from 'shared/constants/contacts';
import styles from './ContactUs.module.scss';
import Unity from '../../public/landing_page/unity.png';
import { Helmet } from 'react-helmet';
import { routes } from 'Routes';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { GlobalContext } from 'contexts/GlobalContext';

const ContactUs = () => {
  const {
    services: {
      userService: { isLoggedIn },
    },
  } = useContext(GlobalContext);

  const { REACT_APP_SUPPORT_ORG_ID } = process.env;

  return (
    <div className={styles.contactUs}>
      <Helmet>
        <title>Контакты</title>
        <meta name="og:title" content="Контакты" />
        <meta name="description" content="Контакты" />
        <meta name="og:image" content={Unity} />
      </Helmet>

      {isLoggedIn && REACT_APP_SUPPORT_ORG_ID && (
        <Link
          to={{
            pathname: routes.chat,
            search: `id=${REACT_APP_SUPPORT_ORG_ID}&type=organization`,
          }}
        >
          Чат со службой поддержки
        </Link>
      )}

      <span>
        Почта -{' '}
        <a href={`mailto:${contacts.email}`} target="_blank" rel="noreferrer">
          {contacts.email}
        </a>
      </span>
      <a href={`https://www.google.com/maps/search/${contacts.place}'`} target="_blank" rel="noreferrer">
        {contacts.place}
      </a>
      <a href={contacts.telegramBot} target="_blank" rel="noreferrer">
        Бот обратной связи
      </a>

      <div className={styles.socialLinks}>
        {' '}
        <h3>Соц сети:</h3> <SocialNetworks />
      </div>
      <img src={Unity} alt="Unity" className={styles.unity} />
    </div>
  );
};

export default ContactUs;
