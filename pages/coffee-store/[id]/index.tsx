import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import styles from '../../../styles/coffeeStore.module.css';
import classnames from 'classnames';
import { createATcoffeeStore, findAtCoffeeStore, getNearby, upVote } from '../../../axios';
import { CoffeeStore, FourSquareVenue } from '../..';
import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../../context/storeContext';
import useSWR from 'swr';

interface Params extends ParsedUrlQuery {
  id: string;
  [key: string]: any;
}

export const getStaticPaths: GetStaticPaths<Params> = async context => {
  const data = await getNearby('41.8781,-87.6298', 'coffee store');

  return {
    paths: [
      ...data.map(x => ({
        params: { id: x.id },
      })),
    ],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async context => {
  const data = await getNearby('41.8781,-87.6298', 'coffee store');
  const coffeeStore = data.find(x => x.id === context.params?.id);
  console.log(coffeeStore);
  if (coffeeStore) {
    return {
      props: {
        coffeeStore,
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
  coffeeStore?: CoffeeStore;
  renderLocal: boolean;
}

const extractFromArray = (value: string | string[]): string => {
  if (typeof value === 'string') {
    return value;
  }
  return value.join(' ');
};

export const fourSVToCS = (venue: FourSquareVenue): CoffeeStore => ({
  address: venue.location.address,
  id: venue.fsq_id,
  imgUrl: venue.photo,
  name: venue.name,
  neighbourhood: extractFromArray(venue.location.neighborhood || venue.location.cross_street || ''),
  voting: 0,
});

const StorePage: NextPage<Props> = initialProps => {
  const [coffeeStore, setCoffeeStore] = useState<CoffeeStore | undefined>(initialProps.coffeeStore);
  const [votingCount, setVotingCount] = useState(0);
  const router = useRouter();
  const { state } = useContext(StoreContext);
  const id = router.query.id as string;
  const { data, error } = useSWR({ id }, findAtCoffeeStore);

  useEffect(() => {
    if (!!data) {
      console.log('Data from SWR retrieved');
      setCoffeeStore(data.fields);
      setVotingCount(data.fields.voting);
    }
  }, [data]);

  const createCoffeeStore = async () => {
    if (initialProps.renderLocal) {
      if (!coffeeStore || initialProps.coffeeStore) {
        if (state.localStores.length > 0) {
          const coffeeStoreFromState = state.localStores.find(store => store.id === router.query.id);
          if (!!coffeeStoreFromState) {
            setCoffeeStore(coffeeStoreFromState);
            createATcoffeeStore(coffeeStoreFromState);
          }
        }
      }
    } else if (initialProps.coffeeStore) {
      console.log();
      createATcoffeeStore(initialProps.coffeeStore);
    }
  };

  useEffect(() => {
    createCoffeeStore();
  }, [id]);

  if (error || !coffeeStore) {
    return <>This Would be a skeleton component</>;
  }

  const handleUpVote = () => {
    upVote({ id });
    setVotingCount(votingCount + 1);
  };
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
          <Image width={600} height={360} alt={coffeeStore.name} src={coffeeStore.imgUrl} />
        </div>
        <div className={classnames(styles.col2, 'glass')}>
          <div className={styles.iconWrapper}>
            <Image width={24} height={24} src="/static/icons/location_24.svg" />
            <p className={styles.text}>{coffeeStore.address}</p>
          </div>
          {coffeeStore.neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image width={24} height={24} src="/static/icons/storefront_24.svg" />
              <p className={styles.text}>{coffeeStore.neighbourhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image width={24} height={24} src="/static/icons/star_24.svg" />
            <p className={styles.text}>{votingCount}</p>
          </div>
          <button onClick={handleUpVote} className={styles.upvoteButton}>
            Upvote
          </button>
        </div>
      </div>
    </div>
  );
};

export default StorePage;
