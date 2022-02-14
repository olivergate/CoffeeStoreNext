import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Footer } from '../components/navbar';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
