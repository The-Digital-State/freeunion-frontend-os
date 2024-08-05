import { Icons } from 'shared/components/common/Icon/Icon.interface';
import styles from './CircleButton.module.scss';
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { Icon } from 'shared/components/common/Icon/Icon';

interface ICircleButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  iconName?: keyof typeof Icons;
  text?: string;
}

const CircleButton = ({ iconName, text, ...props }: ICircleButtonProps): JSX.Element => {
  return (
    <button className={styles.circle} {...props}>
      <div className={styles.topOfCircle}>
        <Icon iconName={iconName} />
      </div>
      <div className={styles.bottomOfCircle}>
        <p>{text}</p>
      </div>
    </button>
  );
};

export default CircleButton;
