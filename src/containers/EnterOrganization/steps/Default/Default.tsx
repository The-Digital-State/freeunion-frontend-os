import { Button } from 'shared/components/common/Button/Button';
import EnterOrganization from '../../EnterOrganization';
import { routes } from 'Routes';

import styles from './Default.module.scss';
import { useContext } from 'react';
import { GlobalDataContext } from 'contexts/GlobalDataContext';

export enum Types {
  success,
  confirmation,
}

interface Props {
  type?: Types;
  id: number;
}

function Default({ type, id }: Props) {
  const { organisations } = useContext(GlobalDataContext);
  // const [subscribeToNotifications, setSubscribeToNotifications] = useState(true);

  let title = 'Вы успешно присоединились к объединению';
  let text =
    'Теперь вам доступна внутрненняя информация. Хотите посмотреть, чем занимается объединение? Переходите на его страницу и смотрите задачи в работе.';

  if (type === Types.confirmation) {
    title = 'Администратор должен одобрить вашу заявку на вступление в объединение';
    text = 'Обычно это занимает не больше 24 часов, когда это произойдёт, мы вас уведомим.';
  }

  const union = organisations.find((org) => org.id === id);
  // rename variable
  const closedUnion = !union || (union.public_status === 1 && type === Types.confirmation);

  return (
    <EnterOrganization.Container title={title} className={styles.wrapper}>
      <div className={styles.wrapperContent}>
        <p>{text}</p>
        <img src={require('./images/people-together.png').default} alt="Люди вместе" />
      </div>

      <Button className={styles.button} to={!closedUnion ? routes.union.getLink(id) : routes.UNIONS}>
        {!closedUnion ? 'Перейти на страницу объединения' : 'Все объединения'}
      </Button>
      {/* <Checkbox
        className={styles.checkbox}
        label="Я согласен принимать уведомления от данного обьединения"
        valueChange={setSubscribeToNotifications}
        value={subscribeToNotifications}
      /> */}
    </EnterOrganization.Container>
  );
}

Default.Types = Types;

export default Default;
