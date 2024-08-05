import styles from './UserContent.module.scss';
import { useContext } from 'react';
import { GlobalContext } from 'contexts/GlobalContext';
import { LinkList } from 'common/LinkList/LinkList';
import { ContentFooter } from 'components/NavigationBar/ContentFooter/ContentFooter';
import ProfileInfo from 'components/ProfileInfo/ProfileInfo';

export function UserContent() {
  const {
    services: { navigationBuilder },
  } = useContext(GlobalContext);

  //TODO: fix user model!

  const userContentItems = navigationBuilder.getUserContentStructure();

  return (
    <div className={styles.UserContentContainer}>
      <ProfileInfo />
      <section className={styles.main}>
        <LinkList items={userContentItems} />
      </section>
      <section className={styles.footer}>
        <ContentFooter />
      </section>
    </div>
  );
}
