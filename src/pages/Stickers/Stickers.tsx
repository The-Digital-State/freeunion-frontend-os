import { routes } from 'Routes';
import { Button } from 'shared/components/common/Button/Button';
import { contacts } from 'shared/constants/contacts';
import styles from './Stickers.module.scss';

const images = [
  require('../../public/images/stickers/heart.png').default,
  require('../../public/images/stickers/bros-by-ua.png').default,
  require('../../public/images/stickers/soldier-by.png').default,
  require('../../public/images/stickers/soldier-ua-by.png').default,
  require('../../public/images/stickers/belarus-no-dictator.png').default,
  require('../../public/images/stickers/soldiers.png').default,
  require('../../public/images/stickers/stickers.png').default,
];

function Stickers() {
  return (
    <div className={styles.wrapper}>
      <h1>Наклейки</h1>

      <p>
        Чувствуете как растет ненависть в отношении беларусов? А ведь беларусы помогают украинским беженцам - везут гуманитарку, расселяют.
        НО им некогда это <strong>демонстрировать</strong>, и украинцы НЕ ВИДЯТ, что им помогают именно беларусы. ДАВАЙТЕ обозначим себя!
        Чтобы украинцы видели, что это беларусы им помогают.
      </p>

      <p>
        РАСПЕЧАТАЙТЕ эти макеты в виде наклеек и ЗАНЕСИТЕ ВОЛОНТЕРАМ - на склад, завезите с собой на границу (пусть наклеят себе на спину,
        скажем), наклейте на машину с грузом, который идет в Украину.
      </p>

      <p>
        <strong>Или пожертвуйте на хорошее дело</strong> - мы сами распечатаем и отвезем!
      </p>

      <div className={styles.images}>
        {[
          require('../../public/images/stickers/4.png').default,
          require('../../public/images/stickers/2.png').default,
          require('../../public/images/stickers/3.png').default,
          require('../../public/images/stickers/1.png').default,
          require('../../public/images/stickers/5.png').default,
          require('../../public/images/stickers/by-ua-together.jpeg').default,
        ].map((image) => {
          return <img src={image} alt="Беларусы с Украиной" />;
        })}
      </div>

      <div className={styles.buttons}>
        <Button to="https://drive.google.com/drive/folders/1t07luSj15pau8oJb5cjJNv4urP9awxwz?usp=sharing" target="_blank">
          Скачать
        </Button>
        <Button color="light" to={routes.SUPPORT_US}>
          Поддержать нас
        </Button>
      </div>

      <h2>СТИКЕРПАК В ПОДАРОК</h2>

      <div className={styles.images}>
        {images.map((image) => {
          return <img src={image} alt="Стикеры Беларусы с Украиной" />;
        })}
      </div>

      <div className={styles.buttons}>
        <Button to="https://t.me/addstickers/belaruswithukraine" target="_blank">
          Получить
        </Button>
        <Button to={contacts.telegramBot} target="_blank" color="light">
          Связаться с нами
        </Button>
      </div>
    </div>
  );
}

export default Stickers;
