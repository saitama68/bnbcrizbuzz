import Head from 'next/head'
import Header from '../components/Header';
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <>
      <Head>
        <title>CricBet: Smart Cricket Bet</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to no-limit cricket betting platform
        </h1>

        <p className={styles.description}>
          A transparent no limit bet app on match results. Build on Binance Smart Chain with Chainlink Oracles.
        </p>

        <div className={styles.buttonCont}>
          <a href="/bet">
            <button className={styles.btn}>Start Betting Now</button>
          </a>
        </div>

      </main>
    </>
  )
}
