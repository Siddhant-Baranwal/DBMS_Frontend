// Page 9
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LoansTaken() {

  const [loans, setLoans] = useState([
    {
      id: 1,
      gst: 'VSA25464',
      rate: 5,
      amount: 10000,
      borrow_day: 23,
      borrow_month: 2,
      borrow_year: 2024,
      duration_days: 1000
    },
    {
      id: 2,
      gst: 'JTYJ54634',
      rate: 5,
      amount: 10000,
      borrow_day: 23,
      borrow_month: 2,
      borrow_year: 2024,
      duration_days: 1000
    },
    {
      id: 3,
      gst: 'GAR4312421',
      rate: 5,
      amount: 10000,
      borrow_day: 23,
      borrow_month: 2,
      borrow_year: 2024,
      duration_days: 1000
    },
    {
      id: 4,
      gst: 'GSE3453435',
      rate: 5,
      amount: 10000,
      borrow_day: 23,
      borrow_month: 2,
      borrow_year: 2024,
      duration_days: 1000
    }
  ])

  const orderByDate = () => {
    setLoans(prev =>
      [...prev].sort((a, b) => {
        const dateA = new Date(a.borrow_year, a.borrow_month - 1, a.borrow_day);
        const dateB = new Date(b.borrow_year, b.borrow_month - 1, b.borrow_day);
        return dateA - dateB;
      })
    );
  }

  const orderByGST = () => {
    setLoans(prev =>
      [...prev].sort((a, b) => a.gst.localeCompare(b.gst))
    );
  }
  
  const reloadHandler = () => {
    setLoans([
      {
        id: 1,
        gst: 'GER3W3645',
        rate: Math.floor(Math.random() * 5),
        amount: Math.floor(Math.random() * 100000),
        borrow_day: 1 + Math.floor(Math.random() * 30),
        borrow_month: 1 + Math.floor(Math.random() * 12),
        borrow_year: 2000 + Math.floor(Math.random() * 26),
        duration_days: Math.floor(Math.random() * 1000)
      },
      {
        id: 2,
        gst: 'MAN23984',
        rate: Math.floor(Math.random() * 5),
        amount: Math.floor(Math.random() * 100000),
        borrow_day: 1 + Math.floor(Math.random() * 30),
        borrow_month: 1 + Math.floor(Math.random() * 12),
        borrow_year: 2000 + Math.floor(Math.random() * 26),
        duration_days: Math.floor(Math.random() * 1000)
      },
      {
        id: 3,
        gst: 'NMTY563',
        rate: Math.floor(Math.random() * 5),
        amount: Math.floor(Math.random() * 100000),
        borrow_day: 1 + Math.floor(Math.random() * 30),
        borrow_month: 1 + Math.floor(Math.random() * 12),
        borrow_year: 2000 + Math.floor(Math.random() * 26),
        duration_days: Math.floor(Math.random() * 1000)
      },
      {
        id: 4,
        gst: 'VXZCV3426',
        rate: Math.floor(Math.random() * 5),
        amount: Math.floor(Math.random() * 100000),
        borrow_day: 1 + Math.floor(Math.random() * 30),
        borrow_month: 1 + Math.floor(Math.random() * 12),
        borrow_year: 2000 + Math.floor(Math.random() * 26),
        duration_days: Math.floor(Math.random() * 1000)
      }
    ])
  }
  
  const deleteHandler = (id) => {
    console.log(id);
  }

  return (
    <div className='page-container animate-fade-in'>
      <div className="page-header">
        <h1 className="page-title">Loans taken</h1>
        <Link to="/" className="btn btn-secondary">Home</Link>
      </div>
      <div className='action-bar'>
        <button onClick={orderByDate} className='btn btn-secondary'>Order by date</button>
        <button onClick={orderByGST} className='btn btn-secondary'>Order by supplier</button>
        <button onClick={reloadHandler} className='btn btn-secondary'>Reload</button>
        <a href='/add/loanstaken' target='_blank' className='btn btn-primary'>Take a new loan</a>
      </div>
      <div className='table-wrapper'>
        <table className='data-table'>
          <thead>
            <tr>
              <th>Supplier GST</th>
              <th>Interest rate</th>
              <th>Amount</th>
              <th>Borrow date</th>
              <th>Duration</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {loans.map((item, {index}) => {
            console.log(item);
            return (
              <tr key={index}>
                <td>{item.gst}</td>
                <td>{item.rate}</td>
                <td>{item.amount}</td>
                <td>{item.borrow_day}/{item.borrow_month}/{item.borrow_year}</td>
                <td>{item.duration_days}</td>
                <td><button className='btn-icon btn-delete' onClick={() => deleteHandler(item.id)}>&#128465;</button></td>
              </tr>
            )
          })}
          </tbody>
        </table>
      </div>
    </div>
  )
}