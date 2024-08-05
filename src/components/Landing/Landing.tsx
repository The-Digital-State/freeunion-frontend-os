import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './Landing.module.scss';

import Logo from '../../public/landing_page/logo.svg';
// import Menu from '../../public/landing_page/menu.svg';
import Arrow_sideways from '../../public/landing_page/arrow1.svg';
import Hands from '../../public/landing_page/hands.svg';

import Screen_user from '../../public/landing_page/screen_user.svg';
import Screen_m_admin from '../../public/landing_page/screen_m_user.svg';
import Screen_admin from '../../public/landing_page/screen_admin.svg';
import Screen_m_user from '../../public/landing_page/screen_m_admin.svg';

import Group_icon from '../../public/landing_page/group_icon.svg';

import Joining_hands from '../../public/landing_page/joining_hands.png';

import Unity from '../../public/landing_page/unity.png';

import Logo_futer from '../../public/landing_page/logo_futer.svg';
import { Link } from 'react-router-dom';

import { SocialNetworks } from './SocialNetworks/SocialNetworks';
import { Slider } from '../../common/Slider/Slider';
import { GlobalContext } from '../../contexts/GlobalContext';
import { routes } from 'Routes';
import HowItWorks from './LandingSlider/HowItWorks';
import { isSSR } from '../../utils/isSSR';
import { Helmet } from 'react-helmet';
import { Button } from 'shared/components/common/Button/Button';
import BelarusSupportUkraineBanner from 'components/BelarusSupportUkraineBanner/BelarusSupportUkraineBanner';
import { GlobalDataContext } from 'contexts/GlobalDataContext';

const focuses: { id: number; content: string }[] = [
  {
    id: 1,
    content: 'Безопасная среда своих людей. Вход только по ссылке-приглашению Приглашая, люди ручаются.',
  },
  {
    id: 2,
    content: 'Люди в системе - неопознанные зайцы и зубры (каждому человеку присваивается случайное имя).',
  },
  {
    id: 3,
    content: 'Можно отследить целую ветку неблагонадежных людей.',
  },
  {
    id: 4,
    content: 'Данные отправляются на сервер по шифрованному протоколу.',
  },
  {
    id: 5,
    content: 'Мы не собираем и не храним никакие данные о пользователях, кроме E-mail.',
  },
  {
    id: 6,
    content: 'Серверы и доступ к исходному коду - вне страны.',
  },
];

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
const keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// modern Chrome requires { passive: false } when adding event
let supportsPassive = false;
try {
  window?.addEventListener(
    'test',
    null,
    Object.defineProperty({}, 'passive', {
      get: function () {
        supportsPassive = true;
        return supportsPassive;
      },
    })
  );
} catch (e) {}

let wheelOpt;
let wheelEvent;
let scrollIsDisabled;

if (!isSSR()) {
  wheelOpt = supportsPassive ? { passive: false } : false;
  wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
  scrollIsDisabled = false;
}

function disableScroll() {
  scrollIsDisabled = true;
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

function enableScroll() {
  scrollIsDisabled = false;
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  // @ts-ignore
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
  // @ts-ignore
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}

let howChooseExternal: 'task' | 'decision' | 'tool' = 'task';
let initialized = false;
let lastScrollTop = 0;

export function Landing() {
  const [howChoose, setHowChoose] = useState<'task' | 'decision' | 'tool'>(howChooseExternal);
  const [stylesHowSlider, setStylesHowSlider] = useState<{ transform: string }>({ transform: '0' });

  const {
    services: { deviceService },
  } = useContext(GlobalContext);

  const { user } = useContext(GlobalDataContext);

  const isAuthenticated = !!user;

  const howItWorksRef = useRef();

  function handleScroll() {
    if (scrollIsDisabled || !initialized || lastScrollTop > document.documentElement.scrollTop) {
      return;
    }

    lastScrollTop = document.documentElement.scrollTop;

    if (howItWorksRef) {
      const { clientHeight } = document.documentElement;
      const { bottom } = (howItWorksRef.current as HTMLDivElement).getBoundingClientRect();

      if (clientHeight > bottom) {
        setHowChoose((state) => {
          if (state === 'task') {
            (howItWorksRef.current as HTMLDivElement).scrollIntoView({ block: 'start', behavior: 'smooth' });
            disableScroll();
            setTimeout(() => {
              enableScroll();
            }, 1000);
            return 'decision';
          } else if (state === 'decision') {
            (howItWorksRef.current as HTMLDivElement).scrollIntoView({ block: 'start', behavior: 'smooth' });
            disableScroll();
            setTimeout(() => {
              enableScroll();
            }, 1000);
            return 'tool';
          }

          return 'tool';
        });
      }
    }
  }

  useLayoutEffect(() => {
    document.addEventListener('scroll', handleScroll);
    setTimeout(() => {
      initialized = true;
    }, 1000);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    let percent: string = '';
    switch (howChoose) {
      case 'task': {
        percent = '0%';
        break;
      }
      case 'decision': {
        percent = deviceService.isMobile ? '-110%' : '-100%';
        break;
      }
      case 'tool': {
        percent = deviceService.isMobile ? '-215%' : '-200%';
        break;
      }
    }

    setStylesHowSlider({
      transform: `${deviceService.isMobile ? 'translateY' : 'translateX'}(${percent})`,
    });

    if (initialized) {
      scrollTo(`scroll_${howChoose}`);
      howChooseExternal = howChoose;
    }
  }, [howChoose]);

  const scrollTo = (id: string) => {
    const targetClick = document.getElementById(`${id}`);

    if (deviceService.isMobile) {
      targetClick.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.landing_page}>
      <Helmet>
        <title>FreeUnion online</title>
      </Helmet>

      {/* Hero start */}
      <section className={styles.landing_hero}>
        <div className={styles.hero_wrapper}>
          <div className={styles.hero_left_section}>
            <div className={styles.innerwrapper_left_section}>
              <div className={styles.innerwrapper_logo}>
                <div itemScope itemType="http://schema.org/Organization" className={styles.logo}>
                  <Link itemProp="url" title="freeunion" to="/" className={styles.logo_link}>
                    <img itemProp="logo" src={Logo} alt="freeunion" className="logo_icon" />
                  </Link>
                </div>
              </div>
              <div className={styles.hero_service}>
                <h3 itemProp="name" className={styles.title}>
                  Вдохните жизнь в ваше объединение. <br /> Чтобы люди были не зрителями, и даже не участниками, а двигателями.
                </h3>
              </div>
              <div className={styles.innerwrapper_entrance}>
                {isAuthenticated ? (
                  <Button color="light" to={routes.UNION}>
                    вернуться в сервис
                  </Button>
                ) : (
                  <>
                    <Button color="light" to={routes.REGISTRATION} maxWidth>
                      присоединиться
                    </Button>
                    <span>или</span>
                    <Button color="light" to={routes.LOGIN} maxWidth>
                      войти
                    </Button>
                  </>
                )}
              </div>
              <div className={styles.menu}></div>
            </div>
            <div className={styles.join_menu_wrapper}>
              <div className={styles.menu}>
                {/*<a href="/" className={styles.menu_icon_link}>*/}
                {/*  <img src={Menu} alt="Menu" className="menu_icon" />*/}
                {/*</a>*/}
              </div>
              <div className={styles.hero_join}>
                <img src={Arrow_sideways} alt="Arrow" className={styles.join_arrow} />
                <p className={styles.title}>присоединяйся</p>
              </div>
            </div>
          </div>
          <div className={styles.hero_right_section}>
            <img src={Hands} alt="Hands" className={styles.hands} />
          </div>
        </div>
      </section>
      {/* Hero end */}
      {/* How it works strart */}
      <BelarusSupportUkraineBanner />
      <HowItWorks
        ref={howItWorksRef}
        setHowChoose={setHowChoose}
        scrollTo={scrollTo}
        howChoose={howChoose}
        stylesHowSlider={stylesHowSlider}
      />
      {/* How it works end */}
      {/* Service functionality start */}
      <section className={styles.landing_service_functionality}>
        <div className={styles.service_functionality_wrapper}>
          <h1 className={styles.title}>двусторонний сервис</h1>
          <div className={styles.service_functionality_innerwrapper}>
            <div className={styles.service_functionality_left_section}>
              <div className={styles.service_functionality_left_section_text}>
                <h2 className={styles.title}>функционал сервиса доступный для всех пользователей</h2>
                <img src={Screen_m_admin} alt="Hands" className={styles.screen_m_admin} />
                <p className={styles.subtitle}>
                  Инструмент для совместной работы, похож на привычную всем соцсеть, но люди тут анонимны. Они присоединяются к объединению
                  по интересам, выдвигают предложения, голосуют и так решают, что делать, а затем берут задачи в работу.
                </p>
              </div>
              <img src={Screen_admin} alt="Hands" className={styles.screen_admin} />
            </div>
            <div className={styles.service_functionality_right_section}>
              <img src={Screen_user} alt="Hands" className={styles.screen_user} />
              <div className={styles.service_functionality_right_section_text}>
                <h2 className={styles.title}>функционал системы администрирования для лидеров&#8209;активистов и руководителей</h2>
                <img src={Screen_m_user} alt="Hands" className={styles.screen_m_user} />
                <ul className={styles.subtitle}>
                  <li>Привлечение новых людей и вовлечение их в работу - даже если людей очень много.</li>
                  <li>Коммуникация с участниками объединения (рассылки, уведомления, переписки, групповые чаты в Telegram).</li>
                  <li>
                    Упрощенная регистрация. Мы не собираем и не храним ваши данные - это значит они не могут попасть в ненадежные руки.
                  </li>
                  <li>Организация совместных онлайн и оффлайн мероприятий.</li>
                  <li>Постановка задач и контроль за выполнением.</li>
                  <li>Оплата взносов.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Service functionality end */}
      {/* Focus safety start */}
      <section className={styles.landing_focus_safety}>
        <div className={styles.focus_safety_wrapper}>
          <h1 className={styles.title}>наш фокус - ваша безопасность!</h1>
          <div className={styles.focus_safety_innerwrapper}>
            {!deviceService.isMobile &&
              focuses.map((focus) => (
                <div className={styles.innerwrapper_card} key={focus.id}>
                  <img src={Group_icon} alt="Task" />
                  <p className={styles.title}>{focus.content}</p>
                </div>
              ))}

            {deviceService.isMobile && (
              <Slider
                children={focuses.map((focus) => (
                  <div className={styles.innerwrapper_card} key={focus.id}>
                    <img src={Group_icon} alt="Task" />
                    <p className={styles.title}>{focus.content}</p>
                  </div>
                ))}
                slidesOnPage={1}
                controlsVerticalOffset={0}
                controlsHorizontalOffset={0}
                controlsVerticalPosition="bottom"
              />
            )}
          </div>
        </div>
      </section>
      {/* Focus safety end */}
      {/* Who are we start */}
      <section className={styles.landing_who_are_we}>
        <div className={styles.who_are_we_wrapper}>
          <div className={styles.who_are_we_left_section}>
            <h1 className={styles.title}>кто мы?</h1>
            <p className={styles.subtitle}>
              Мы команда беларусов айтишников из разных уголков мира. Выросли из инициативы “Профсоюз.онлайн”. Используем продуктовый
              подход: не разрабатываем этот продукт на заказ, а самостоятельно анализируем запросы руководителей, активистов и обычных
              людей, откликаемся на потребности и принимаем независимые решения в том, какие IT инструменты будут максимально отвечать
              запросам гражданского общества. Мы верим в общественный контроль и независимые СМИ как страховку от перекосов в системе.
            </p>
            <Button to={routes.REGISTRATION}>присоединиться</Button>
          </div>
          <div className={styles.who_are_we_right_section}>
            <img src={Joining_hands} alt="Joining hands" />
            <ul className={styles.subtitle}>
              <li>9 месяцев волонтерства</li>
              <li>Больше 2000 заявок</li>
              <li>Собрано 45 организаций</li>
              <li>С заводами с августа 2020 года</li>
            </ul>
          </div>
        </div>
      </section>
      {/* Who are we end */}
      {/* Good deal we start */}
      <section className={styles.landing_helpUs}>
        <p>Нам очень важна ваша поддержка, она будет способствовать развитию проекта дальше</p>
        <Button className={styles.supportBtn} to={routes.SUPPORT_US}>
          Поддержать нас
        </Button>
      </section>
      <section className={styles.landing_good_deal}>
        <div className={styles.good_deal_wrapper}>
          <h1 className={styles.title}>"вместо тысячи слов&nbsp;- одно хорошее дело"</h1>
          <img src={Unity} alt="Unity" className={styles.unity} />
        </div>
      </section>
      {/* Good deal we end */}
      {/* Footer start */}
      <footer className={styles.footer}>
        <div className={styles.footer__wrapper}>
          <div className={styles.logo}>
            <a href="/" className={styles.logo_link}>
              <img src={Logo_futer} alt="Logo" className={styles.logo_img} />
            </a>
          </div>
          <div className={styles.regulations}>
            <a href="/rules-service" target="_blank" className={styles.title_link}>
              <p className={styles.title}>Пользовательское соглашение</p>
            </a>
            <a href="/privacy-policy" target="_blank" className={styles.title_link}>
              <p className={styles.title}>Политика конфиденциальности</p>
            </a>
            <a href="https://www.instagram.com/cactuss.art" target="_blank" className={styles.title_link} rel="noreferrer">
              <p className={styles.title}>Иллюстрации @cactuss.art</p>
            </a>
            <a href="https://freeunion.online/news/48/781" target="_blank" rel="noreferrer" className={styles.title_link}>
              <p className={styles.title}> О нас</p>
            </a>

            <Link to={routes.CONTACT_US} className={styles.title_link}>
              <p className={styles.title}>Контакты</p>
            </Link>
            <p className={styles.title}>
              <span className={styles.title_text_decoration}>&copy;</span> 2021 - {new Date().getFullYear()} freeunion.online
            </p>
          </div>
          <SocialNetworks />
        </div>
      </footer>
      {/* Footer end */}
    </div>
  );
}
