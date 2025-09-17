// Page 1
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
        <h1 class='hometitle' >Welcome to the home page.</h1>
        <div class='homecont'>
          <Link class='homepagelinks' to='/loans/taken'>Loans taken</Link>
          <Link class='homepagelinks' to='/loans/given'>Loans given</Link>
          <Link class='homepagelinks' to='/purchase'>Purchase book</Link>
          <Link class='homepagelinks' to='/sales'>Sales book</Link>
        </div>
        <div class='homecont'>
          <Link class='homepagelinks' to='/add/buyer'>Add buyer</Link>
          <Link class='homepagelinks' to='/add/driver'>Add driver</Link>
          <Link class='homepagelinks' to='/add/item'>Add item</Link>
          <Link class='homepagelinks' to='/add/supplier'>Add supplier</Link>
          <Link class='homepagelinks' to='/add/loansgiven'>Give loan</Link>
          <Link class='homepagelinks' to='/add/loanstaken'>Take loan</Link>
        </div>
    </div>
  )
}
