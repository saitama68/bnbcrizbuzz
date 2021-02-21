import React from 'react';
import Link from 'next/link';

const Header = () => {
  const [wid, setWid] = React.useState('');
  const openNav = () => setWid('100%')
  const closeNav = () => setWid('0%')

  return (
    <div>
      <header>
        <a href="/" className="logo"><img className="nav-img" src="/bsc.gif" alt="logo" /></a>
        <nav>
          <ul className="nav__links">
            <Link href="/">Home</Link>
            <Link href="/bet">Bet</Link>
            <Link href="/redeem">Redeem</Link>
          </ul>
        </nav>
        <p onClick={openNav} className="menu cta">menu</p>
      </header>

      <div style={{ width: wid }} className="overlay">
        <a className="close" onClick={closeNav}>&times;</a>
        <div className="overlay__content">
          <Link href="/">Home</Link>
          <Link href="/bet">Bet</Link>
          <Link href="/redeem">Redeem</Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
