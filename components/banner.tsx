import { UseLocation } from '../hooks/use-location';
import styles from '../styles/banner.module.css';

interface Props {
  location: UseLocation;
}

export const Banner: React.VFC<Props> = props => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.title1}>Wine</span>
        <span className={styles.title2}>Connoiseur</span>
      </h1>
      <p className={styles.subTitle}>Discover your power</p>
      <button className={styles.button} onClick={props.location.handleTrack}>
        {props.location.loading ? 'Searching' : 'CLICK THIS BUTTON'}
      </button>
    </div>
  );
};
