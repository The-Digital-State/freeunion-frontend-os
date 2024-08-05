import styles from './Socials.module.scss';
import Vk from './images/vk.png';
import YouTube from './images/youtube.png';
import Facebook from './images/facebook.png';
import Telegram from './images/telegram.png';
import Ok from './images/ok.png';
import TikTok from './images/tiktok.png';
import Instagram from './images/instagram.png';
import Other from './images/other.png';
import { Socials as SocialsEnum } from 'shared/interfaces/organization';

interface ISocialsProps {
  iconLinks: { type: SocialsEnum; value: string }[];
}

const icons = {
  [SocialsEnum.vk]: Vk,
  [SocialsEnum.youtube]: YouTube,
  [SocialsEnum.facebook]: Facebook,
  [SocialsEnum.telegram]: Telegram,
  [SocialsEnum.ok]: Ok,
  [SocialsEnum.instagram]: Instagram,
  [SocialsEnum.tiktok]: TikTok,
  [SocialsEnum.other]: Other,
};

const Socials = ({ iconLinks }: ISocialsProps): JSX.Element => {
  return (
    <>
      {iconLinks
        .filter((i) => i.value)
        .map(({ type, value }) => {
          return (
            <a key={type} className={styles.socialIcon} href={value} target="_blank" rel="noreferrer">
              <img src={icons[type]} alt={`${type} logo`} />
            </a>
          );
        })}
    </>
  );
};

export default Socials;
