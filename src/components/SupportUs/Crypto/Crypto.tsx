import styles from './Crypto.module.scss';
import { useEffect } from 'react';

const config = [
  {
    name: 'Bitcoin (Биткоин)',
    address: 'bc1qxkj7nz83y28lrh3d4urgnlttz9n79wlz802lgr',
    qrImg: require('./images/btc.jpeg').default,
  },
  {
    name: 'ERC20 (ETH, BSC, Polygon, и др.)',
    address: '0xDD6958CE5305bC619E1ec89E6DD95C958139556d',
    qrImg: require('./images/erc20.jpeg').default,
  },
  {
    name: 'LTC (Лайткоин)',
    address: 'ltc1qm4muz0hkkv6m0ahhtklypmf76eaak87c2ew57u',
    qrImg: require('./images/ltc.jpeg').default,
  },
];

function Crypto() {
  useEffect(() => {
    window.dataLayer.push({
      event: 'event',
      eventProps: {
        category: 'ui_interaction',
        action: 'open_crypto_modal',
        label: 'support-us_page',
      },
    });
  }, []);

  return (
    <div className={styles.wrapper}>
      <h3>Поддержать с помощью криптовалюты</h3>

      <div>
        {config.map(({ name, address, qrImg }) => {
          return (
            <div className={styles.coinItem} key={name}>
              <h5>{name}</h5>
              <p className={styles.address}>Адрес: {address}</p>
              <img src={qrImg} alt={name} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Crypto;
