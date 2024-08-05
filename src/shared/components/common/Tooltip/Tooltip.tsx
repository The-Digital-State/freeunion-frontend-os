import styles from './Tooltip.module.scss';

const Tooltip = ({ title, children }: { title: string; children?: React.ReactElement }) => {
  return (
    <div className={styles.tooltip}>
      {children}
      <span className={styles.tooltiptext}>{title}</span>
    </div>
  );
};

export default Tooltip;
