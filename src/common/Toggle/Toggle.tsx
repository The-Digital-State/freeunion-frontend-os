import styles from './Toggle.module.scss';

type IToggleProps = {
  checked: boolean;
  valueChange: (any) => void;
  title?: string;
  choice: object;
};

export function Toggle({ checked, title, valueChange, choice }: IToggleProps) {
  // const handleChange = () => {

  // }

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>{title}</p>
      <div className={styles.toggleContainer}>
        <label className={styles.label}>
          <input type="checkbox" className={styles.checkbox} checked={checked} onChange={() => valueChange(!checked)} />
          <span className={styles.before}>{choice[0]}</span>
          <span className={styles.after}>{choice[1]}</span>
          <span className={styles.switch}></span>
        </label>
      </div>
    </div>
  );
}

export default Toggle;
