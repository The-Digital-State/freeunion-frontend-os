import React, { useContext } from 'react';
import styles from './Footer.module.scss';
import { Icon } from '../../shared/components/common/Icon/Icon';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../../contexts/GlobalContext';
import { routes } from 'Routes';
import cn from 'classnames';

type IFooterProps = {
  children?: React.ReactElement | React.ReactElement[];
  showLinks?: boolean;
  showLogoMobile?: boolean;
  showLogoDesktop?: boolean;
  classname?: string;
};

export function Footer({ children, showLinks = true, showLogoMobile = true, showLogoDesktop = true, classname }: IFooterProps) {
  const {
    services: { userService },
  } = useContext(GlobalContext);

  function checkOpenNewTab(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!userService.isLoggedIn) {
      event.preventDefault();
      // @ts-ignore
      window.open(event.target.href);
    }
  }

  return (
    <footer
      className={cn(styles.Footer, {
        [classname]: !!classname,
      })}
    >
      {children ? (
        <div className={styles.actionsContainer}>{children}</div>
      ) : (
        <>
          <Link to="/" className={styles.footerLogo}>
            <Icon iconName="logo" />
          </Link>
          <Link to="/" className={styles.footerLogoSmall}>
            <Icon iconName="logoSmall" width={'1rem'} height={'auto'} />
          </Link>
        </>
      )}

      <div className={styles.footerLinks}>
        {showLinks && (
          <>
            <a href="https://freeunion.online/news/48/781" target="_blank" rel="noreferrer" className={styles.title_link}>
              О нас
            </a>
            <Link to={routes.CONTACT_US} className={styles.title_link}>
              Контакты
            </Link>
            <Link to={routes.RULES_SERVICE} onClick={checkOpenNewTab}>
              Пользовательское соглашение
            </Link>
            <Link to={routes.PRIVACY_POLICY} onClick={checkOpenNewTab}>
              Политика конфиденциальности
            </Link>
          </>
        )}
        <div className={styles.about}>
          <p>© 2021 - {new Date().getFullYear()}. freeunion.online</p>
        </div>
      </div>
    </footer>
  );
}
