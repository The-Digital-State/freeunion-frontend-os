import React, { useState } from 'react';
import styles from './UserAgreement.module.scss';

export function UserAgreement() {
  const [expanded, setExpandedStatus] = useState<boolean>(false);

  const toggle = (
    <>
      <span>{expanded ? ' ' : '... '} </span>
      <span className={`${styles.toggle} highlight`} onClick={setExpandedStatus.bind(null, !expanded)}>
        {expanded ? 'скрыть' : 'читать больше'}
      </span>
    </>
  );

  const expandedContent = (
    <>
      <li>Шифруем канал передачи данных - трафик между браузером и сервером.</li>
      <li>
        По умолчанию на платформе и в базе данных все пользователи анонимны - становятся неопознанными зубрами или белкой - каждому рандомно
        присваивается имя.
      </li>
      <li>
        Позже в разделе “Личные данные” вы можете назваться реальным именем, заполнить информацию о себе и обозначить, кому могут быть видны
        эти данные..
      </li>

      <li>Личные данные по умолчанию шифруются, только вы сами можете сделать их открытыми.</li>
      <li>Сервера платформы находятся вне СНГ.</li>
      <li>
        Компания-создатель платформы находится вне СНГ, не обязана и не будет передавать данные по запросу спецслужб постсоветских стран.
      </li>
      <li>
        Доступ к серверам, домену, хостинку и Production вне СНГ- нас не заставить слить данные.
        {expanded && toggle}
      </li>
      <br />
    </>
  );

  return (
    <div className={`${styles.UserAgreement}`}>
      <div className={`${styles.content} ${expanded ? styles.expanded : null}`}>
        <p>Как мы обеспечиваем безопасность ваших данных?</p>
        <ul>
          <li>Собираем минимум данных: для регистрации вам потребуется только e-mail и пароль.{!expanded && toggle}</li>
          {expanded && expandedContent}
        </ul>
      </div>
    </div>
  );
}
