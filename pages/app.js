// pages/_app.js
import '../styles/globals.css'; // global styles only

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
