// Page 1
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
        <h1 class='title' >Welcome to the home page.</h1>
        <div class='homecont'>
          <Link class='homepagelinks' to='/loans/taken'>Loans taken</Link>
          <Link class='homepagelinks' to='/loans/given'>Loans given</Link>
          <Link class='homepagelinks' to='/purchase'>Purchase book</Link>
          <Link class='homepagelinks' to='/sales'>Sales book</Link>
        </div>
    </div>
  )
}
