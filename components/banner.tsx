import styles from '../styles/banner.module.css';

interface Props {
  buttonClick: () => void;
}

export const Banner: React.VFC<Props> = props => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.title1}>Wine</span>
        <span className={styles.title2}>Connoiseur</span>
      </h1>
      <p className={styles.subTitle}>Discover your power</p>
      <button className={styles.button} onClick={props.buttonClick}>
        CLICK THIS BUTTON
      </button>
    </div>
  );
};
