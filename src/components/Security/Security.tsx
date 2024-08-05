import React, { useState } from 'react';
import styles from './Security.module.scss';
import { Icon } from '../../shared/components/common/Icon/Icon';
import { Contents, IContent } from '../../common/Contents/Contents';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { routes } from 'Routes';

const tableOfContents: IContent[] = [
  {
    id: 'platform-security',
    label: 'Безопасность платформы',
  },
  {
    id: 'encryption',
    label: 'Шифрование',
  },
  {
    id: 'surety',
    label: 'Поручительство',
  },
];

// const radioOptions = [
//   { id: 1, label: '15 суток' },
//   { id: 2, label: '24 часа' },
//   { id: 3, label: '1 час' }
// ];

export function Security() {
  // const {
  //   services: { userService },
  //   spinner: { showSpinner, hideSpinner },
  // } = useContext(GlobalContext);

  // const [invitedInfo, setInvitedInfo] = useState<IInvitedInfo>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [deletedFromChats, setDeletedFromChatsStatus] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isBlocked, setIsBlockedStatus] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [confirmingComplainingIsActive, setConfirmingComplainingStatus] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [confirmingBlockingIsActive, setConfirmingBlockingStatus] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [radioValue, setRadioValue] = useState<number>();

  return (
    <div className={styles.Security}>
      <Helmet>
        <title>Безопасность платформы</title>
      </Helmet>

      <aside>
        <Contents contents={tableOfContents} />
      </aside>

      <main className="p-left p-right">
        <h2 id="platform-security">Безопасность платформы</h2>
        <br />
        <div className={styles.card}>
          <div className={styles.icon}>
            <Icon iconName="fingerprint" />
          </div>
          <div>
            <ul className="text-uppercase no-style large">
              <li>1. Система доверительных контактов</li>
              <li>2. шифрование данных и трафика</li>
              <li>3. анонимизация каждого пользователя</li>
              <li>4. ДОСТУП К СЕРВЕРАМ И ИСХОДНОМУ КОДУ ВНЕ БЕЛАРУСИ</li>
            </ul>
          </div>
        </div>

        <p>Никто физически не может добраться до информации о вас, потому что:</p>

        <ul>
          <li>Сервера платформы находятся вне Беларуси.</li>
          <li>Доступ к домену, хостингу и Production вне Беларуси.</li>
        </ul>

        <p>Никто не может перехватить данные о вас, пока вы отправляете их нам:</p>
        <ul>
          {/*<li>*/}
          {/*    Данные шифруются перед отправкой (ключ шифрования недоступен).*/}
          {/*</li>*/}
          <li>Трафик между сервером и браузером шифруется.</li>
        </ul>

        <p>Никто не сможет добыть информацию о вас, перехватив базу данных:</p>
        <ul>
          <li>В системе вы будете как неопознанный зубр или лось, и только (каждому человеку рандомно присваивается имя)</li>
          <li>
            Вся информация о вас шифруется и недоступна абсолютно никому до момента, пока вы не поставите в предложенном окне галку
            “раскрыть мои данные”.
          </li>
        </ul>

        <br />

        <p>
          На платформу попадают лишь доверенные люди - те, за кого поручился кто-то. если вдруг внутри оказывается нехороший человек, можно
          отследить, кто пригласил его в систему и увидеть целую ветку неблагонадежных людей.
        </p>

        <p>Плохой человек При попадании внутрь не сможет никого вычислить:</p>
        <ul>
          <li>Внутри платформы он видит только зубров и лосей, но не знает даже близко, с кем общается.</li>
          <li>Мы используем безопасные каналы связи и коммуникации - Telegram.</li>
          <li>
            Мы используем Inkognio для общения в чатах платформы (не вы сидите в чате, а ваш бот, и поэтому никто не знает ваше имя в
            Telegram).
          </li>
        </ul>

        <p>Если кто-то захватил ваш телефон или компьютер, он не сможет войти в ваш аккаунт:</p>
        <ul>
          <li>Вашу страницу могут оперативно заблокировать ваши доверенные лица.</li>
        </ul>

        <br />
        <br />
        <br />
        <h2 id="encryption">шифрование</h2>
        <br />

        <div className={styles.card}>
          <div className={styles.icon}>
            <Icon iconName="fingerprint" />
          </div>
          <div>
            <ul className="text-uppercase no-style large">
              <li>1. Шифрование трафика между браузером и сервером.</li>
              <li>2. Шифрование личных данных в базе данных.</li>
            </ul>
          </div>
        </div>

        <p>
          Ваши личные данные, которые вы вводите в форме регистрации, передаются на сервер по безопасному шифрованному соединению -
          протоколу https. Мы собираем ваши данные в базе данных на сервере, анонимизируем или шифруем их таким образом, чтобы вашу личность
          нельзя было идентифицировать. Ваши данные не видны ни пользователям платформы, ни участникам объединений, ни администраторам
          объединений (лидерам, активистам).
        </p>
        <br />
        <h3>Исключения:</h3>
        <ul>
          <li>
            данные из поля “О себе” не шифруются и открыты для всех пользователей платформы, а также открыты в базе данных (видны
            администратору объединения).
          </li>
          <li>
            данные из полей формы регистрации "Страна", "Форма занятости", "Сфера деятельности", "Место работы" - не шифруются в базе данных
            и видны администратору объединения (когда он работает с базой данных), но не видны простым участникам объединения и
            пользователям платформы.
          </li>
        </ul>
        <br />

        <p>
          Ключи шифрования хранятся отдельно от базы данных и недоступны. Таким образом, никто, будь то наши сотрудники или злоумышленник,
          получив копию базы данных, не сможет получить доступ к скрытым пользовательским данным. Вы можете расшифровать (открыть) свои
          данные для всех пользователей платформы, участников вашего объединения или администратора вашего объединения - настройте видимость
          ваших данных на этапе присоединения к объединению или потом в форме редактирования данных.
        </p>

        <p>
          Вам на электронный адрес пришло письмо? Как администратор объединения или администратор платформы узнал ваш e-mail, если данные
          скрыты ото всех? Администратор объединения или платформа может присылать вам сообщения на указанные вами в форме регистрации
          e-mail и телефон, не зная его, - через встроенные в платформу сервисы и способы.
        </p>

        <br />
        <h2 id="surety">Поручительство</h2>
        <Link to={routes.GUARANTEE}>Поручительство</Link>
      </main>
    </div>
  );
}
