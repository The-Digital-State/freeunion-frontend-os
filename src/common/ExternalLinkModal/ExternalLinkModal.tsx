import { Button } from 'shared/components/common/Button/Button';
import styles from './ExternalLinkModal.module.scss';

const ExternalLinkModal = ({ link }: { link: string }) => {
  return (
    <div className={styles.wrapper}>
      <h3>Переход по внешней ссылке</h3>
      <p className={styles.text}>Вы переходите на сторонний ресурс по ссылке: </p>
      <a className={styles.link} href={link} target="_blank" rel="noreferrer">
        {link}
      </a>
      <Button
        maxWidth
        onClick={() => {
          window.open(link);
        }}
      >
        Перейти
      </Button>
    </div>
  );
};

export default ExternalLinkModal;
