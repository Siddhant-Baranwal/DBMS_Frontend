import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  useEffect(() => {
    document.title = 'Welcome'
  }, [])

  return (
    <div className="page-container animate-fade-in">
      <h1 className="page-title">Welcome to the Dashboard</h1>
      <div className="home-links-container">
        {/* <Link className="home-link" to="/loans/taken">Loans Taken</Link>
        <Link className="home-link" to="/loans/given">Loans Given</Link>
        <Link className="home-link" to="/purchase">Purchase Book</Link>
        <Link className="home-link" to="/sales">Sales Book</Link> */}
        <Link className="home-link"  to="/loans/taken">
          <img src='/static/coin.png' className="logo"/>
          <div className='logolink'>Loans Taken</div>
        </Link>
        <Link className="home-link"  to="/loans/given">
          <img src='/static/coin.png' className="logo"/>
          <div className='logolink'>Loans Given</div>
        </Link>
        <Link className="home-link" to='/purchase'>
          <img src='/static/book.png' className="logo"/>
          <div className='logolink'>Purchase Book</div>
        </Link>
        <Link className="home-link"  to="/sales">
          <img src='/static/book.png' className="logo"/>
          <div className='logolink'>Sales Book</div>
        </Link>
      </div>
    </div>
  )
}
