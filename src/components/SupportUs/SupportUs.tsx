import { Button } from 'shared/components/common/Button/Button';
import styles from './SupportUs.module.scss';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from 'contexts/GlobalContext';
import Crypto from './Crypto/Crypto';
import Subscriptions from 'components/Subscriptions/Subscriptions';
import { routes } from 'Routes';
import { Payments } from 'components/Finance/Payments/Payments';
import { PaymentCosts, PaymentCreated } from 'shared/interfaces/finance';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';
import { getCosts, getFundraisings } from 'services/finance';
import Costs from 'components/Finance/Costs/Costs';
import SubscriptionCard from 'common/SubscriptionCard/SubscriptionCard';
import { Helmet } from 'react-helmet';
import Unity from '../../public/landing_page/unity.png';
import { CustomImage } from 'common/CustomImage/CustomImage';
import CreaterBlock from 'common/CreaterBlock/CreaterBlock';
import FreeUnionAvatar from './images/freeunion_avatar.png';

const cryptoData = {
  title: 'Пожертвование криптой',
  description: 'Доступны кошельки: Bitcoin, ERC20, LTC',
};

const freeunionUser = {
  public_family: 'Freeunion.online',
  public_name: '',
  public_avatar: FreeUnionAvatar,
};

const SupportUs = () => {
  const { openModal } = useContext(GlobalContext);
  const [payments, setPayments] = useState<PaymentCreated[]>([]);
  const [costs, setCosts] = useState<PaymentCosts[]>([]);

  const id = +process.env.REACT_APP_ORG_FU;

  const openCryptoModal = () => {
    openModal({
      params: {
        mainContainer: <Crypto />,
      },
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const fundraisings = await getFundraisings(+id);
        setPayments(fundraisings);
      } catch (e) {
        toast.error(formatServerError(e));
        console.log(formatServerError(e));
      }
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        const response = await getCosts(+id);
        setCosts(response);
      } catch (e) {
        toast.error(formatServerError(e));
        console.log('Ошибка', e);
      }
    })();
  }, [id]);

  const filterPayments = payments.filter((i) => !!i.auto_payments?.length || !!i.manual_payments?.length);

  return (
    <div className={styles.supportUs}>
      <Helmet>
        <title>Поддержка Freeunion</title>

        <meta name="title" content="Поддержка Freeunion" />
        <meta name="description" content="На этой странице вы можете поддержать команду Freeunion" />
        <meta name="keywords" content="поддержка, freeunion, донаты" />
      </Helmet>

      <div className={styles.title}>
        <div className={styles.titleWrapper}>
          <h2>Анонимная соцсеть для активистов</h2>
        </div>
      </div>
      <div className={styles.infoWrapper}>
        <CreaterBlock user={freeunionUser} />
        <CustomImage src={Unity} alt="Далучайся" background="white" errorImage="noImage" height={'auto'} rounded={false} width={'auto'} />
        <h2>почему это вам понравится</h2>
        <p>
          <a href={'https://freeunion.online/?pr'} target={'_blank'} rel="noreferrer">
            Freeunion.online
          </a>{' '}
          - платформа для самоорганизации, помогает сообществам переходить от обсуждения к действиям, добиваться поставленных целей. Уже
          есть платформы и мессенджеры, где сообщества общаются и генерируют идеи (Telegram, Zoom, Signal и др.). А{' '}
          <a href={'https://freeunion.online/?pr'} target={'_blank'} rel="noreferrer">
            Freeunion.online
          </a>{' '}
          помогает организовать работу: ставить цели, задачи, вовлечь в работу больше участников сообщества (и таким образом разгрузить
          плечи костяка команды).
        </p>
        <div className={styles.infoAbout}>
          <ul>
            <li>
              <h3>Быстрое создание объединения внутри платформы</h3>
            </li>
            <li>
              <h3>Функционал для генерации идей/предложений, их обсуждения и одобрения</h3>
            </li>
            <li>
              <h3>Создание опросов и голосований для принятия коллективных решений</h3>
            </li>
            <li>
              <h3>Доска с задачами</h3>
            </li>
            <li>
              <h3>Система финансирования объединения</h3>
            </li>
            <li>
              <h3>Новости и база знаний</h3>
            </li>
            <li>
              <h3>Создание рабочих групп</h3>
            </li>
            <li>
              <h3>Информирование о событиях объединения</h3>
            </li>
            <li>
              <h3>Обсуждение новостей и проектов</h3>
            </li>
            <li>
              <h3>Календарь мероприятий (скоро)</h3>
            </li>
          </ul>
          <CustomImage
            src={'/static/media/joining_hands.250dd677.png'}
            alt="Далучайся"
            background="white"
            errorImage="noImage"
            height={'auto'}
            rounded={false}
            width={'auto'}
          />
        </div>
        <h2>наша команда</h2>
        <p>
          Мы беларусы-айтишники, временно проживающие за пределами РБ, не относимся к каким-либо движениям, штабам или партиям, одинаково
          поддерживаем все беларусские инициативы. Мы{' '}
          <a href={'https://freeunion.online/news/48/781'} target={'_blank'} rel="noreferrer">
            создали и развиваем
          </a>{' '}
          эту платформу, потому что верим в то, что беларусы сами могут объединяться и определять свое будущее. Поэтому мы предлагаем
          Freeunion.online, как место, где люди внутри и за пределами РБ работают над совместными проектами, развивают свои сообщества.
        </p>
        <p>
          Если вы тоже хотите стать частью проекта - пишите{' '}
          <a href={'https://t.me/freeunion_bot'} target={'_blank'} rel="noreferrer">
            сюда
          </a>
        </p>
      </div>
      <h2>Криптовалюта</h2>
      <div className={styles.cryptoWrapper}>
        <SubscriptionCard subscription={cryptoData} primary={false} onClick={openCryptoModal} />
      </div>

      <Subscriptions organisationId={id} />

      {!!filterPayments.length && (
        <div className={styles.paymentsWrapper}>
          <h2>Единоразовые пожертвования</h2>
          <Payments payments={filterPayments} />
        </div>
      )}

      {!!costs.length && (
        <div className={styles.costsWrapper}>
          <Costs costs={costs} />
        </div>
      )}

      <Button to={routes.UNION_FU}>Перейти в организацию FreeUnion</Button>
    </div>
  );
};
export default SupportUs;
