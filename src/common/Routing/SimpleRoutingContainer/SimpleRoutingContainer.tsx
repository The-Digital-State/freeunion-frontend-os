import React, { ReactNode, useContext, useEffect, useLayoutEffect, useState } from 'react';
import styles from './SimpleRoutingContainer.module.scss';
import { Link, useHistory } from 'react-router-dom';
import { Icon } from '../../../shared/components/common/Icon/Icon';
import { Footer } from '../../../components/Footer/Footer';
import { Icons } from '../../../shared/components/common/Icon/Icon.interface';
import CSS from 'csstype';
import { CloseButton } from '../../CloseButton/CloseButton';
import { GlobalContext } from 'contexts/GlobalContext';
import { routes } from 'Routes';
import { CustomImage } from 'common/CustomImage/CustomImage';
import cn from 'classnames';
import { GlobalDataContext } from 'contexts/GlobalDataContext';

type ISimpleRoutingContainerProps = {
  navs?: {
    id: number;
    label: string;
    icon: keyof typeof Icons;
    path: typeof routes;
    requireAuth?: boolean;
  }[];
  component?: any;
  children?: ReactNode;
  showCloseButton?: boolean;
  closeButtonRoute?: any; // TODO: fix
  title?: string;
  hideLogo?: boolean; // temp
  className?: string;
  classNameContainer?: string;
  logo?: {
    src: string;
    alt: string;
    href?: string;
  };
  showScrollToTopButton?: boolean;
  hideFooter?: boolean;
  style?: CSS.Properties;
  logoWithText?: boolean;
  mobileWithoutPadding?: boolean;
};

export function SimpleRoutingContainer({
  navs,
  title,
  component,
  hideLogo,
  children,
  logo,
  logoWithText,
  className,
  showCloseButton = false,
  closeButtonRoute,
  showScrollToTopButton = false,
  hideFooter = false,
  mobileWithoutPadding,
  style,
  classNameContainer,
}: ISimpleRoutingContainerProps) {
  const {
    services: { userService },
    screen: { innerWidth },
    setSidebarExpandedState,
  } = useContext(GlobalContext);
  const { user } = useContext(GlobalDataContext);

  const history = useHistory();

  useLayoutEffect(() => {
    return () => {
      setSidebarExpandedState(false);
    };
  }, []);

  const [isScrollTop, setScrollTopState] = useState<boolean>(true);

  const onScroll = () => {
    const isTop = document.documentElement.scrollTop < 100;
    setScrollTopState((state) => {
      if (state !== isTop) {
        return isTop;
      }
      return state;
    });
  };

  useEffect(() => {
    document.addEventListener('scroll', onScroll);

    return () => {
      document.removeEventListener('scroll', onScroll);
    };
  }, []);

  const scrollToTop = () => {
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={cn(styles.SimpleRoutingContainer, classNameContainer, {
        [styles.mobileWithoutPaddingContainer]: mobileWithoutPadding,
      })}
    >
      <header>
        {!hideLogo && (
          <Link
            to={!!logo?.href ? logo?.href : !user ? routes.HOME : routes.UNION}
            className={cn(styles.logoTitle, {
              [styles.showLogo]: !title,
            })}
          >
            {logo?.src ? (
              <CustomImage src={logo.src} alt={logo.alt} width={56} height={56} />
            ) : (
              <Icon
                iconName={!logoWithText ? 'logoSmall' : 'logo'}
                width={logoWithText ? 182 : 56}
                height={logoWithText ? 40 : 56}
                className={styles.logo}
              />
            )}
          </Link>
        )}

        {!!title &&
          (innerWidth > 640 ? (
            <h2 className={styles.title}>{title}</h2>
          ) : (
            <Link className={styles.title} to={logo?.href || routes.UNION}>
              {title}
            </Link>
          ))}

        {navs?.length && (
          <nav className=" p-left p-right">
            <ul className={styles.navbar}>
              {navs
                .filter((navItem) => userService.isLoggedIn || !navItem.requireAuth)
                .map((navItem) => (
                  <li
                    // @ts-ignore
                    className={navItem.path === history.location.pathname ? styles.active : ''}
                    onClick={() => {
                      // @ts-ignore
                      if (history.location.pathname !== navItem.path) {
                        // @ts-ignore
                        history.push(navItem.path);
                      }
                    }}
                    key={navItem.id}
                  >
                    <span>{navItem.label}</span>
                    {navItem?.icon && <Icon iconName={navItem.icon} />}
                  </li>
                ))}
            </ul>

            {/*<div className={`${styles.menuIcon}`} onClick={setSidebarExpandedState.bind(null, !isSidebarExpanded)}>*/}
            {/*  <Icon iconName="menu"/>*/}
            {/*</div>*/}
          </nav>
        )}
      </header>
      {showCloseButton && (
        <div>
          <CloseButton targetRoute={closeButtonRoute} />
        </div>
      )}
      <main className={className}>
        {component && React.createElement(component)}
        {children}
      </main>

      {/* {!isSSR() && user && <Sidebar isExpanded={isSidebarExpanded} setExpandedState={setSidebarExpandedState} mobileOnly={true} />} */}
      {/* <Sidebar isExpanded={isSidebarExpanded} setExpandedState={setSidebarExpandedState} mobileOnly={true} /> */}
      {mobileWithoutPadding && !hideFooter && (
        <div style={{ padding: '0 10px' }}>
          <Footer />
        </div>
      )}
      {!hideFooter && !mobileWithoutPadding && <Footer />}

      {showScrollToTopButton && (
        <div className={`${styles.scrollToTopButton} ${!isScrollTop ? styles.show : ''}`}>
          {/* TODO: delete wrapper, not needed */}
          <button onClick={scrollToTop}>
            <Icon iconName="arrowBottom" rotate={180} color="white" width={30} height={22} />
          </button>
        </div>
      )}
    </div>
  );
}
