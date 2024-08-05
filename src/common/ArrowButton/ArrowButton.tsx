import { Icon } from 'shared/components/common/Icon/Icon';
import styles from './ArrowButton.module.scss';

export enum ArrowDirection {
  back,
  next,
  //'top' 'bottom'
}

const ArrowButton = ({
  arrowDirection,
  onClick,
  disable,
}: {
  arrowDirection: ArrowDirection;
  onClick: () => void;
  disable?: boolean;
}): JSX.Element => {
  let rotate: number;
  let text = '';

  switch (arrowDirection) {
    // case 'top':
    //   rotate = 90;
    //   break;
    case ArrowDirection.next:
      rotate = 180;
      text = 'Дальше';
      break;
    // case 'bottom':
    //   rotate = 270;
    //   break;
    default:
      rotate = 0;
      text = 'Назад';
  }

  return (
    <button className={styles.arrowButton} disabled={disable} onClick={onClick}>
      <span>{text}</span>
      <Icon iconName="arrowBorderLeft" rotate={rotate} />
    </button>
  );
};

export default ArrowButton;
