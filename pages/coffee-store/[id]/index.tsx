import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import styles from '../../../styles/coffeeStore.module.css';
import classnames from 'classnames';
import { getNearby } from '../../../axios';
import { FourSquareVenue } from '../..';
import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../../context/storeContext';

interface Params extends ParsedUrlQuery {
  id: string;
  [key: string]: any;
}

export const getStaticPaths: GetStaticPaths<Params> = async context => {
  const data = await getNearby('41.8781,-87.6298', 'coffee store');

  return {
    paths: [
      ...data.map(x => ({
        params: { id: x.fsq_id },
      })),
    ],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async context => {
  const data = await getNearby('41.8781,-87.6298', 'coffee store');
  const coffeeStore = data.find(x => x.fsq_id === context.params?.id);
  if (coffeeStore) {
    return {
      props: {
        coffeeStore: data.find(x => x.fsq_id === context.params?.id) || data[0],
        renderLocal: false,
      },
    };
  }
  return {
    props: {
      renderLocal: true,
    },
  };
};

interface Props {
  coffeeStore?: FourSquareVenue;
  renderLocal: boolean;
}

const StorePage: NextPage<Props> = initialProps => {
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const router = useRouter();
  const { state } = useContext(StoreContext);
  const id = router.query.id;

  useEffect(() => {
    console.log('fired Effect');
    console.log({ state });
    if (initialProps.renderLocal) {
      if (state.localStores.length > 0) {
        setCoffeeStore(state.localStores.find(store => store.fsq_id === router.query.id));
      }
    }
  }, [id, state.localStores.length]);

  if (!coffeeStore) {
    return null;
  }

  const handleUpload = () => console.log(initialProps);
  return (
    <div className={styles.layout}>
      <Head>
        <title>{coffeeStore.name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href={'/'}>
              <a>← Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{coffeeStore.name}</h1>
          </div>
          <Image width={600} height={360} alt={coffeeStore.name} src={coffeeStore.photo} />
        </div>
        <div className={classnames(styles.col2, 'glass')}>
          <div className={styles.iconWrapper}>
            <Image width={24} height={24} src="/static/icons/location_24.svg" />
            <p className={styles.text}>{coffeeStore.location.address}</p>
          </div>
          {(coffeeStore.location.neighborhood || coffeeStore.location.cross_street) && (
            <div className={styles.iconWrapper}>
              <Image width={24} height={24} src="/static/icons/storefront_24.svg" />
              <p className={styles.text}>{coffeeStore.location.neighborhood || coffeeStore.location.cross_street}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image width={24} height={24} src="/static/icons/star_24.svg" />
            <p className={styles.text}>1</p>
          </div>
          <button onClick={handleUpload} className={styles.upvoteButton}>
            Upvote
          </button>
        </div>
      </div>
    </div>
  );
};

export default StorePage;
