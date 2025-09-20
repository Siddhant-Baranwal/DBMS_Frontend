// Page 1
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className='page-container animate-fade-in'>
        <h1 className='page-title' >Welcome to the Dashboard</h1>
        <div className='home-links-container'>
          <Link className='home-link' to='/loans/taken'>Loans Taken</Link>
          <Link className='home-link' to='/loans/given'>Loans Given</Link>
          <Link className='home-link' to='/purchase'>Purchase Book</Link>
          <Link className='home-link' to='/sales'>Sales Book</Link>
        </div>
    </div>
  )
}