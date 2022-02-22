import axios from 'axios';
import type { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { Banner } from '../components/banner';
import Card from '../components/card';
import styles from '../styles/Home.module.css';
import { StoreImage, fsq_get, getNearby, getPhotos } from '../axios';
import { useLocation } from '../hooks/use-location';
import { useEffect } from 'react';
import React from 'react';

export interface FourSquareVenue {
  fsq_id: string;
  categories: {
    id: number;
    name: string;
    icon: {
      prefix: string;
      suffix: string;
    };
  }[];
  chains: any[];
  distance: number;
  geocodes: {
    main: {
      latitude: number;
      longitude: number;
    };
  };
  location: {
    address: string;
    country: string;
    cross_street: string;
    dma: string;
    formatted_address: string;
    locality: string;
    neighborhood: string;
    postcode: string;
    region: string;
  };
  name: string;
  related_places: {};
  timezone: string;
}

interface Props {
  coffeeStores: FourSquareVenue[];
  coffeeStoresPhoto: StoreImage[];
}

export const getStaticProps: GetStaticProps = async context => {
  const data = await getNearby('41.8781,-87.6298', 'coffee store');
  console.log(data);
  const photoData = await getPhotos(data.results.map(x => x.fsq_id));
  return {
    props: { coffeeStores: data.results, coffeeStoresPhoto: photoData },
  };
};

const Home: NextPage<Props> = props => {
  const location = useLocation();
  const [coffeeStores, setCoffeestores] = React.useState<FourSquareVenue[]>([]);

  const getAndSetLocalStores = async () => {
    const nearbyCoffee = await getNearby(location.latLong, 'coffee');
    setCoffeestores(nearbyCoffee.results);
  };

  useEffect(() => {
    getAndSetLocalStores();
  }, [location.latLong]);

  const coffeeStoresToDisplay = coffeeStores.length > 0 ? coffeeStores : props.coffeeStores;

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee application</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Banner location={location} />
        {location.errorMessage && <span>Something went wrong: {location.errorMessage}</span>}
        <div className={styles.heroImage}>
          <Image src="/static/hero-image.png" width={700} height={500} />
        </div>
        {coffeeStoresToDisplay.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>{location.latLong ? 'Your Local coffee stores' : 'Toronto Stores'}</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map(x => {
                const photo = props.coffeeStoresPhoto.find(photo => x.fsq_id === photo.fsq_id)!;
                console.log(photo);

                return (
                  <div key={x.fsq_id} className={styles.card}>
                    <Card href={`coffee-store/${x.fsq_id}`} imageUrl={photo?.photo} name={x.name} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
