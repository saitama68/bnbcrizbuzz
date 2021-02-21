import React from 'react';
import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import styles from '../styles/Redeem.module.css'

export default function Redeem() {
  const [isLoading, setIsLoading] = React.useState('1');
  const [pkey, setPkey] = React.useState('');
  const [link, setLink] = React.useState('')

  const claim = async (e) => {
    e.preventDefault();
    console.log(pkey);
    setIsLoading('2');
    // console.log(selected.bet_id);
    const res = await fetch(`http://52.172.192.89:5001/${pkey}/${amount}`);
    const data = res.json();
    console.log(data);
    setLink(data);
    // https://testnet.bscscan.com/tx/0xef0a4bc79e73c0ddba9ad4b52d739e0260ee2e28a48ae42c3c1ebd3f5e4bf6d4'
    // console.log(link)
    setIsLoading('3');
  }

  return (
    <>
      <Head>
        <title>CricBet: Smart Cricket Bet</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Claim Reward on your bet
        </h1>

        {isLoading === '1' &&
          <form className={styles.formWrapper} onSubmit={claim} >
            <input
              className={styles.customFileInput}
              value={pkey}
              placeholder="0xdbCaD3ca6AF619Ff5d8..."
              onChange={(e) => setPkey(e.target.value)}
            />
            <button className={styles.btn} type="submit">
              Claim
                </button>
          </form>
        }
        {isLoading === '2' &&
          <div className="ldsRoller"><div></div><div></div><div></div><div>
          </div><div></div><div></div><div></div><div></div></div>
        }
        {
          isLoading === '3' && <p className={styles.matchDesc}>
            
            <Link href={link}>✔️ Bet success. Track on BSC Scan</Link>
          </p>
        }

      </main>
    </>
  )
}
