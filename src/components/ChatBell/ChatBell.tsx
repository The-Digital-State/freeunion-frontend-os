import { Icon } from 'shared/components/common/Icon/Icon';
import styles from './ChatBell.module.scss';
import { Icons } from 'shared/components/common/Icon/Icon.interface';
import { NavLink } from 'react-router-dom';
import { routes } from 'Routes';
import { useEffect } from 'react';
import { getThreads } from 'shared/slices/chat';

import { useSelector, useDispatch } from '../../redux';

function ChatBell() {
  const dispatch = useDispatch();
  const threads = useSelector((state) => state.chat.threads);
  const newMessages = threads.reduce((prev, { new_messages }) => prev + new_messages, 0);
  useEffect(() => {
    dispatch(getThreads());
  }, []);
  return (
    <NavLink to={routes.chat} className={styles.link} activeClassName={styles.activeLink}>
      <Icon iconName={Icons.chat} className={styles.Icon} height="28" width="28" />
      {!!newMessages && <span className={styles.count}>{newMessages}</span>}
    </NavLink>
  );
}

export default ChatBell;
