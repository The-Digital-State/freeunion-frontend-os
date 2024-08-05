import React from 'react';
import styles from './Topbar.module.scss';
import { Icon } from '../../shared/components/common/Icon/Icon';
import { GlobalContext } from '../../contexts/GlobalContext';
import ProfileInfo from 'components/ProfileInfo/ProfileInfo';
import cn from 'classnames';
import { Icons } from 'shared/components/common/Icon/Icon.interface';

type ITopbarProps = {
  imageSrc?: string;
  imageAlt?: string;
  leftContainer?: React.ReactElement;
  rightContainer?: React.ReactElement;
};

export function Topbar({ imageSrc, imageAlt, leftContainer = null, rightContainer = null }: ITopbarProps) {
  const { isSidebarExpanded, setSidebarExpandedState } = React.useContext(GlobalContext);

  return (
    <div className={cn(styles.topbar, 'p-left-xxl p-right-md')}>
      <div className={cn(styles.image, 'p-left p-0-left-xxl-only')}>
        <ProfileInfo topBar />
        {/* TODO: remove commented code after implemention navigation bar for mobile devices */}
        <button className={styles.menuIcon} onClick={setSidebarExpandedState.bind(null, !isSidebarExpanded)}>
          <Icon iconName={Icons.burger} width={32} height={32} />
        </button>
      </div>
      {/* <div className={`${styles.leftContainer} p-top p-0-top-lg`}>{leftContainer}</div> */}
      {/* <div className={styles.navbar}>
        <Navbar />
      </div> */}
      <div className={styles.rightContainer}>{rightContainer}</div>
    </div>
  );
}
