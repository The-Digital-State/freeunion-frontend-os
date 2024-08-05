import React from 'react';

import styles from './SocialNetworks.module.scss';
import Vk from '../../../public/landing_page/vk_icon.svg';
import Ok from '../../../public/landing_page/ok_icon.svg';
import Instagram from '../../../public/landing_page/instagram_icon.svg';
import Facebook from '../../../public/landing_page/facebook_icon.svg';
import Telegram from '../../../public/landing_page/telegram_icon.svg';
import { contacts } from 'shared/constants/contacts';

const socialNetworks = [
  {
    img: Telegram,
    src: contacts.telegram,
    alt: 'Telegram',
  },
  {
    img: Instagram,
    src: contacts.instagram,
    alt: 'Instagram',
  },
  {
    img: Facebook,
    src: contacts.facebook,
    alt: 'Facebook',
  },
  {
    img: Vk,
    src: contacts.vk,
    alt: 'Vk',
  },
  {
    img: Ok,
    src: contacts.odnoklassniki,
    alt: 'Ok',
  },
];

export function SocialNetworks() {
  return (
    <div className={styles.SocialNetworks}>
      {socialNetworks.map((social) => {
        return (
          <a href={social.src} target="_blank" className={styles.social_icons__link} rel="noreferrer">
            <img src={social.img} alt={`${social.alt} contact`} className={styles.social_icon}></img>
          </a>
        );
      })}
    </div>
  );
}
