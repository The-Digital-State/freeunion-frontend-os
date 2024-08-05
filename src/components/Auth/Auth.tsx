import { useContext, useLayoutEffect, useState } from 'react';
import styles from './Auth.module.scss';
import { Icon } from '../../shared/components/common/Icon/Icon';
import { Login } from './Login/Login';
import { InvitationPage } from './InvitationPage/InvitationPage';
import { useHistory, Redirect, Link } from 'react-router-dom';
import { GlobalContext } from '../../contexts/GlobalContext';
import { IInviteInfo } from '../../interfaces/user.interface';
import moment from 'moment';
import 'moment/locale/ru';

import { ForgetPassword } from './ForgetPassword/ForgetPassword';
import { ResetPassword } from './ResetPassword/ResetPassword';
import { Footer } from '../Footer/Footer';
import { routes } from 'Routes';
import { toast } from 'react-toastify';
import formatServerError from 'utils/formatServerError';

moment.locale('ru');

type IAuthProps = {
  type: 'login' | 'invitationPage' | 'forgetPassword' | 'resetPassword';
};

export function Auth({ type }: IAuthProps) {
  const {
    services: { authService, httpService },
    spinner: { showSpinner, hideSpinner },
  } = useContext(GlobalContext);
  const history = useHistory();

  const [inviteInfo, setInviteInfo] = useState<IInviteInfo>(null);

  useLayoutEffect(() => {
    if (type === 'invitationPage') {
      (async () => {
        showSpinner();
        const params = new URLSearchParams(history.location.search);
        const invite_id = params.get('invite_id');
        const invite_code = params.get('invite_code');
        const inviteInfo = await authService.getInviteInfo(+invite_id, invite_code);

        if (inviteInfo.errors) {
          toast.error(formatServerError(inviteInfo));
          setTimeout(() => {
            history.push(routes.ERROR_PAGE);
          });
        } else {
          setInviteInfo(inviteInfo);
        }
        hideSpinner();
      })();
    }
  }, []);

  let children;

  switch (type) {
    case 'login': {
      children = <Login />;
      // footerActionLeft = (
      //   <Button icon="group" textUpperCase={false}>
      //     Входите с нового браузера или устройства?
      //   </Button>
      // );
      break;
    }
    case 'invitationPage': {
      children = <InvitationPage inviteInfo={inviteInfo} />;
      // footerActionLeft = <Button>больше о платформе</Button>;

      break;
    }
    case 'forgetPassword': {
      children = <ForgetPassword />;
      // footerActionLeft = (
      //   <Button icon="group" textUpperCase={false}>
      //     Входите с нового браузера или устройства?
      //   </Button>
      // );

      break;
    }
    case 'resetPassword': {
      children = <ResetPassword />;
      // footerActionLeft = (
      //   <Button icon="group" textUpperCase={false}>
      //     Входите с нового браузера или устройства?
      //   </Button>
      // );

      break;
    }
  }

  if (httpService.token) {
    return <Redirect to={routes.UNION} />;
  }

  return (
    <div className={`${styles.Auth} p p-large`}>
      {/*<nav className={styles.nav}>*/}
      {/*<ul>*/}
      {/*  <li>*/}
      {/*    <Icon iconName="arrowBottom"/> РУС*/}
      {/*  </li>*/}
      {/*  <li>*/}
      {/*    <Icon iconName="arrowBottom"/> беларусь*/}
      {/*  </li>*/}
      {/*  <li>главная</li>*/}
      {/*  <li>О НАС</li>*/}
      {/*</ul>*/}
      {/*</nav>*/}
      <Link to="/" className={styles.logo}>
        <Icon iconName="logoSmall" width={138} height={92} />
      </Link>
      <header className={styles.header}>
        <Icon iconName="logoText" />
      </header>
      <div className={styles.mainLeft}>
        <div className={styles.leftContent}>
          <h3>Сервис для объединения и совместной работы</h3>
          <br />
          <p>
            Добро пожаловать в сервис для удаленной работы независимых объединений. Здесь вы можете реализовать любую свою инициативу.
            Присоединяйтесь к объединению, которое вам по душе. Или создайте свое.
          </p>
          {type === 'invitationPage' && (
            <p className="highlight">
              <span>Ваша ссылка-приглашение действительна {durationFromNow(inviteInfo?.limit)}</span>
            </p>
          )}
        </div>
      </div>
      <div className={styles.mainRight}>
        <div className={styles.rightContent}>{children}</div>
      </div>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  );
}

// {/*<div className="cookies cookies__hide">*/}
// {/*    <p className="h3">Продолжая пользоваться платформой вы принимаете все cookies</p>*/}
// {/*    <div className="cookies__actions">*/}
// {/*        <a className="btn" href="#">Изменить</a>*/}
// {/*        <span>или</span>*/}
// {/*        <a className="btn primary" href="#">Принять</a>*/}
// {/*    </div>*/}
// {/*</div>*/}

function durationFromNow(date: string) {
  if (!date) {
    return 'сутки';
  }

  return moment.utc(date).fromNow(true);
}
