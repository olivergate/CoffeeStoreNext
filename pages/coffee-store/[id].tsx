import { GetStaticPaths, GetStaticPathsResult, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import styles from '../../styles/coffeeStore.module.css';
import classnames from 'classnames';
import { fsq_get, getNearby } from '../../axios';
import { CoffeeStore } from '..';

interface Params extends ParsedUrlQuery {
  id: string;
  [key: string]: any;
}

export const getStaticProps: GetStaticProps<Props, Params> = async context => {
  const data = await getNearby('41.8781,-87.6298', 'coffee store');

  return {
    props: {
      coffeeStore: data.results.find(x => x.fsq_id.toString() === context.params?.id),
    },
  };
};

export const getStaticPaths: GetStaticPaths<Params> = async context => {
  const data = await getNearby('41.8781,-87.6298', 'coffee store');

  return {
    paths: data.results.map(x => ({
      params: { id: x.fsq_id },
    })),
    fallback: true,
  };
};

interface Props {
  coffeeStore?: CoffeeStore;
}

const StorePage: NextPage<Props> = props => {
  const router = useRouter();
  const { coffeeStore } = props;
  if (router.isFallback || !coffeeStore) {
    return <div>Loading...</div>;
  }

  const handleUpload = () => console.log(props);
  return (
    <div className={styles.layout}>
      <Head>
        <title>{coffeeStore.name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}></div>
          <Link href={'/'}>
            <a> Back to home</a>
          </Link>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{coffeeStore.name}</h1>
          </div>
          <Image width={600} height={360} alt={coffeeStore.name} src={'/static/icons/storefront_24.svg'} />
        </div>
        <div className={classnames(styles.col2, 'glass')}>
          <div className={styles.iconWrapper}>
            <Image width={24} height={24} src="/static/icons/location_24.svg" />
            <p className={styles.text}>{coffeeStore.location.address}</p>
          </div>
          {coffeeStore.location.neighborhood && (
            <div className={styles.iconWrapper}>
              <Image width={24} height={24} src="/static/icons/storefront_24.svg" />
              <p className={styles.text}>{coffeeStore.location.neighborhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image width={24} height={24} src="/static/icons/star_24.svg" />
            <p className={styles.text}>1</p>
          </div>
          <button onClick={handleUpload} className={styles.upVoteButton}>
            Upvote
          </button>
        </div>
      </div>
    </div>
  );
};

export default StorePage;
