import classNames from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navigation.module.scss';

interface INavigations {
  title: string;
  route: string;
}

const Navigation = ({ navigations }: { navigations: INavigations[] }) => {
  const location = useLocation();

  return (
    <div className={styles.wrapperNavigation}>
      <ul className={styles.navigation}>
        {navigations.map((navigation) => {
          return (
            <Link
              to={navigation.route}
              className={classNames(styles.links, {
                [styles.active]: navigation.route === location.pathname,
              })}
            >
              {navigation.title}
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default Navigation;
