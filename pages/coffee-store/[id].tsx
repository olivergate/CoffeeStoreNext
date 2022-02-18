import { GetStaticPaths, GetStaticPathsResult, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { CoffeeStore } from '../';
import coffeeStoreData from '../../data/coffee-stores.json';
import styles from '../../styles/coffeeStore.module.css';

const typedCoffeeStoreData: CoffeeStore[] = coffeeStoreData;

interface Params extends ParsedUrlQuery {
  id: string;
  [key: string]: any;
}

export const getStaticProps: GetStaticProps<Props, Params> = context => {
  return {
    props: {
      coffeeStore: typedCoffeeStoreData.find(x => x.id.toString() === context.params?.id),
    },
  };
};

const paths = typedCoffeeStoreData.map(x => ({ params: { id: x.id } }));

export const getStaticPaths: GetStaticPaths<Params> = () => {
  return {
    paths,
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
  console.log(props);
  return (
    <div className={styles.layout}>
      <Head>
        <title>{coffeeStore.name}</title>
      </Head>
      <div className={styles.col1}>
        <Link href={'/'}>
          <a> Back to home</a>
        </Link>
        <p>{coffeeStore.name}</p>
        <Image width={600} height={360} alt={coffeeStore.name} src={coffeeStore.imgUrl} />
      </div>
      <div className={styles.col2}>
        <p>{coffeeStore.address}</p>
        <p>{coffeeStore.neighbourhood}</p>
      </div>
    </div>
  );
};

export default StorePage;
