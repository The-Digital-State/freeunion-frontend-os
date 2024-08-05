import styles from './Costs.module.scss';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { currencyLabel, PaymentCosts } from 'shared/interfaces/finance';

ChartJS.register(ArcElement, Tooltip, Legend);

const firstColors = ['#cc8282', '#82cc98', '#82ccc0', '#82abcc', '#9382cc', '#ca82cc', '#cc82a5'];

const Costs = ({ costs }: { costs: PaymentCosts[] }) => {
  const randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);

  const randomRGB = () => `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`;
  const data = {
    labels: costs.map((cost) => cost.name),
    datasets: [
      {
        label: '# of Votes',
        data: costs.map((cost) => cost.amount),
        backgroundColor: costs.map((i, index) => {
          if (index < firstColors.length) {
            return firstColors[index];
          } else {
            return randomRGB();
          }
        }),
        hoverOffset: 4,
      },
    ],
  };
  return (
    <div className={styles.costs}>
      <div className={styles.costsWrapper}>
        <div className={styles.doughnut}>
          <h3>Расходы объединения</h3>
          <div className={styles.doughnutWrapper}>
            <Doughnut data={data} />
          </div>
        </div>
        <div className={styles.costsList}>
          <h3>Общая информация</h3>
          <div className={styles.costsListWrapper}>
            {costs.map((cost) => {
              return (
                <div className={styles.costWrapper}>
                  <span className={styles.costName}>{cost.name}</span>

                  <span className={styles.costAmmount}>
                    {cost.amount} {currencyLabel[cost.currency]}
                  </span>
                </div>
              );
            })}
          </div>
          <div className={styles.summ}>
            <h4>Всего:</h4>
            <span>
              {costs.map((cost) => Number(cost.amount)).reduce((prev, curr) => prev + curr, 0)} {currencyLabel[costs[0].currency]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Costs;
