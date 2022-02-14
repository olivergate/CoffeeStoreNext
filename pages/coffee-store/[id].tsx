import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';

const StorePage: NextPage = () => {
  const router = useRouter();
  return (
    <>
      {' '}
      Some text here {router.query.id}
      <Link href={'/'}>
        <button> Back to home</button>
      </Link>
    </>
  );
};

export default StorePage;
