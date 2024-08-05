import { useContext } from 'react';
import styles from './RoutingContainer.module.scss';
import { CloseButton } from '../../CloseButton/CloseButton';
import { Sidebar } from '../../../components/Sidebar/Sidebar';
import { Footer } from '../../../components/Footer/Footer';
import { RouteProps } from 'react-router';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { isSSR } from '../../../utils/isSSR';
import { NavigationBar } from '../../../components/NavigationBar/NavigationBar';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { routes } from 'Routes';
import { Link } from 'react-router-dom';

type IRoutingContainerProps = RouteProps & {
  children?: any;
  withSidebar?: boolean;
  withFooter?: boolean;
  showCloseButton?: boolean;
  closeButtonRoute?: any; // TODO: fix
};

export function RoutingContainer({
  children,
  withSidebar = true,
  withFooter = true,
  showCloseButton = false,
  closeButtonRoute,
}: IRoutingContainerProps) {
  const { isSidebarExpanded, setSidebarExpandedState } = useContext(GlobalContext);

  const { user } = useContext(GlobalDataContext);

  const isLoggedIn = !!user;

  return (
    <div className={`${styles.RoutingContainer} ${withSidebar ? styles.withSidebar : ''} custom-scroll`}>
      {showCloseButton && <CloseButton targetRoute={closeButtonRoute} />}
      {!isLoggedIn && <Link to={routes.HOME}>На главную</Link>}
      {withSidebar && !isSSR() && isLoggedIn && <Sidebar isExpanded={isSidebarExpanded} setExpandedState={setSidebarExpandedState} />}
      {withSidebar && isLoggedIn && <NavigationBar isExpanded={isSidebarExpanded} setExpandedState={setSidebarExpandedState} />}
      {children}
      {withFooter && (
        <div className={styles.wrapperFooter}>
          <Footer />
        </div>
      )}
    </div>
  );
}
