import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/card.module.css';
import * as classnames from 'classnames';

interface Props {
  name: string;
  href: string;
  imageUrl: string;
}

const Card: React.VFC<Props> = props => {
  return (
    <Link passHref href={props.href}>
      <a className={styles.cardLink}>
        <div className={classnames.default(styles.container, 'glass')}>
          <div className={styles.cardHeaderWrapper}>
            <h2 className={styles.cardHeader}>{props.name}</h2>
          </div>
          <div className={styles.cardImageWrapper}>
            <Image className={styles.cardImage} width={300} height={200} src={props.imageUrl} />
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Card;
