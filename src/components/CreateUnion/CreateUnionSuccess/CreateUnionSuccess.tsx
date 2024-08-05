import { Link } from 'react-router-dom';
import { routes } from 'Routes';

import { Icon } from 'shared/components/common/Icon/Icon';
import { Button } from 'shared/components/common/Button/Button';

import styles from './CreateUnionSuccess.module.scss';

export function CreateUnionSuccess() {
  const { REACT_APP_ADMIN_URL } = process.env;

  return (
    <>
      <h1>объединение создано</h1>
      <div className={styles.CreateUnionSuccessInfo}>
        <Icon iconName="logoSmall" />
        <p data-cy="description-created-union-success" className={styles.CreateUnionSuccessText}>
          Ваше объединение создано. Вы будете его администратором. Перейдите в панель администрирования, в раздел "Объединение" - и
          заполните данные об объединении.
        </p>
      </div>

      <div className={styles.CreateUnionSuccessButtons}>
        <Link to={routes.UNION} data-cy="go-back-the-page">
          Вернуться в сервис
        </Link>
        <Button to={REACT_APP_ADMIN_URL} icon="securitySafe" data-cy="admin-btn" target="freeunion-admin">
          Панель администрирования
        </Button>
      </div>
    </>
  );
}
