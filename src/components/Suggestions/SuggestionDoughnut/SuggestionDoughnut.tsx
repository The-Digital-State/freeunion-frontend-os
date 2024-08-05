import styles from './SuggestionDoughnut.module.scss';
import cn from 'classnames';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const firstColors = ['#82cc98', '#cc8282', '#ababab'];

const SuggestionDoughnut = ({ votes, withoutLabel = false }: { votes: any; withoutLabel?: boolean }) => {
  const data = {
    labels: !Array.isArray(votes) ? ['За', 'Против', 'Воздержался'] : ['Никто ещё не проголосовал'],
    datasets: [
      {
        label: '# of Votes',
        data: !Array.isArray(votes) ? [votes.thumbs_up, votes.thumbs_down, votes.neutral_face] : [1],
        backgroundColor: !Array.isArray(votes) ? firstColors.map((i, index) => firstColors[index]) : ['#ababab'],
        hoverOffset: 4,
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        display: !withoutLabel,
      },
    },
  };
  return (
    <div
      className={cn(styles.doughnutWrapper, {
        [styles.withoutLabel]: !!withoutLabel,
      })}
    >
      <Doughnut data={data} options={options} />
      <span className={styles.doughnutCount}>
        {(() => {
          let sum = 0;

          for (let vote of Object.values(votes)) {
            sum += vote as number;
          }
          return `Всего: ${sum}`;
        })()}
      </span>
    </div>
  );
};

export default SuggestionDoughnut;
