import { routes } from 'Routes';
import { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
// import { Icons } from 'common/Icon/Icon.interface';
import { Icon } from 'shared/components/common/Icon/Icon';
import { GlobalContext } from 'contexts/GlobalContext';

import styles from './Navbar.module.scss';

export function Navbar() {
  const { closeModal } = useContext(GlobalContext);
  const history = useHistory();
  const { pathname, search } = history.location;

  const handleClick = (item: { id: string; label: string; route: string }) => {
    history.push(item.route + (search ? `${search}` : ''));
    closeModal();
  };

  return (
    <ul className={styles.Navbar}>
      {[
        // { id: 'profile', label: 'Моя страница', route: routes.DASHBOARD, icon: 'profile' },
        { id: 'alliance', label: 'Объединение', route: routes.UNION, icon: 'alliance' },
        // {id: "laborUnion", label: 'Профсоюз', route: routes.LABOR_UNION, icon: 'laborUnion'},
      ].map((item) => {
        return (
          <li
            className={pathname.includes(item.route) ? styles.active : ''}
            onClick={!(pathname === item.route) ? handleClick.bind(null, item) : null}
            key={item.id}
          >
            <Link to={item.route}>
              <span>{item.label}</span>
              {/* @ts-ignore */}
              <Icon iconName={item.icon} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
