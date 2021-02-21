import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Header from '../components/Header';
import styles from '../styles/Bet.module.css'

import { getTime } from '../components/helper'

export default function Bet() {

  const [matches, setMatches] = useState([]);
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState({
    date: "",
    dateTimeGMT: "",
    matchStarted: true,
    squad: false,
    "team- 1": "",
    "team - 2": "",
    toss_winner_team: "",
    type: "",
    unique_id: 0,
    winner_team: "",
  });

  const [pkey, setPkey] = useState('');
  const [amount, setAmount] = useState();
  const [isLoading, setIsLoading] = useState('1');

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('https://cricapi.com/api/matches/?apikey=txMW3gc7aVbMZIJ7XMRaXqLFuXO2');
      const data = await res.json();
      console.log(data.matches)
      setMatches(data.matches);
    }
    fetchData();
  }, [])

  const open = (e, match) => {
    setIsLoading('1');
    setModal(true);
    setSelected(match);
  }
  const close = () => setModal(false)

  const startBet = async (e) => {
    e.preventDefault();
    setIsLoading('2');
    const res = await fetch(`http://52.172.192.89:5001/${pkey}/${amount}`);
    const data = res.json();
    const arr = matches.map((ele) => {
      if (ele.unique_id === selected.unique_id) {
        ele.bet_id = data.bet_id;
        ele.amount = amount;
        return ele;
      } else {
        return ele;
      }
    })
    setMatches(arr);
    setIsLoading('3');
  }

  const bet = async (e) => {
    e.preventDefault();
    setIsLoading('2');
    // console.log(selected.bet_id);
    const res = await fetch(`http://52.172.192.89:5001/${pkey}/${amount}/${selected.bet_id}`);
    const data = res.json();
    if (data.status == 'ok') {
      setIsLoading('3');
    }
  }

  console.log(matches)

  return (
    <>
      <Head>
        <title>CricBet: Smart Cricket Bet</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Binance Smart Bet App
        </h1>

        <div className={styles.container}>
          {matches.map((match, i) => (
            <div className={styles.betOne} key={match.unique_id} onClick={(e) => open(e, match)}>
              <p className={styles.matchTitle}>{match["team-1"]} vs {match["team-2"]}</p>
              <p className={styles.matchDesc}>
                {`Match between ${match["team-1"]} and ${match["team-2"]} on `}
                {getTime(match["date"])}
              </p>
              {match.bet_id && <div className={styles.matchLast}>Bet Started | Hot</div>}
            </div>
          ))}
        </div>

        <div className={styles.modal} style={{ display: modal ? 'block' : 'none' }}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={close}>&times;</span>
            <p className={styles.matchTitle}>{selected["team-1"]} vs {selected["team-2"]}</p>
            <p className={styles.matchDesc}>You want to bet on this game with id <strong>{selected.unique_id}</strong></p>

            {isLoading === '1' && !selected.bet_id &&
              <React.Fragment>
                <p style={{ marginTop: 30 }} className={styles.matchDesc}>No bet is created on this match.</p>
                <p className={styles.matchDesc}>Enter amount of bet and wallet key to start a bet.</p>
                <form className={styles.formWrapper} onSubmit={startBet} >
                  <input
                    style={{ width: '30%' }}
                    className={styles.customFileInput}
                    value={amount}
                    placeholder="1.3 BNB"
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <input
                    className={styles.customFileInput}
                    value={pkey}
                    placeholder="797926d89f4cc364d..."
                    onChange={(e) => setPkey(e.target.value)}
                  />
                  <button className={styles.btn} type="submit">
                    Start Bet
                  </button>
                </form>
              </React.Fragment>
            }
            {selected.bet_id && isLoading === '1' &&
              <React.Fragment>
                <p style={{ marginTop: 30 }} className={styles.matchDesc}>Enter wallet key to participate in this bet.</p>
                <p className={styles.matchDesc}>Bet id:<strong>{selected.bet_id}</strong> of amount <strong>{selected.amount} BNB</strong></p>
                <form className={styles.formWrapper} onSubmit={bet} >
                  <input
                    className={styles.customFileInput}
                    value={pkey}
                    placeholder="797926d89f4cc364d..."
                    onChange={(e) => setPkey(e.target.value)}
                  />
                  <button className={styles.btn} type="submit">
                    Bet
                  </button>
                </form>
              </React.Fragment>
            }
            {
              isLoading === '2' && <div className={styles.loader}><div className="ldsRoller"><div></div><div></div><div></div><div>
              </div><div></div><div></div><div></div><div></div></div></div>
            }
            {
              isLoading === '3' && <p className={styles.matchDesc}>
                Bet success ✔️
                <br />
                To the moon 🚀
              </p>
            }
          </div>
        </div>

      </main>
    </>
  )
}
