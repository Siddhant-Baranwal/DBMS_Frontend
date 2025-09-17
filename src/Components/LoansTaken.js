// Page 9
import React, { useState } from 'react'
import { Link } from 'react-router-dom';

export default function LoansTaken() {

  const [loans, setLoans] = useState([
    {
      gst: 'VSA25464',
      rate: 5,
      amount: 10000,
      borrow_day: 23,
      borrow_month: 2,
      borrow_year: 2024,
      duration_days: 1000
    },
    {
      gst: 'JTYJ54634',
      rate: 5,
      amount: 10000,
      borrow_day: 23,
      borrow_month: 2,
      borrow_year: 2024,
      duration_days: 1000
    },
    {
      gst: 'GAR4312421',
      rate: 5,
      amount: 10000,
      borrow_day: 23,
      borrow_month: 2,
      borrow_year: 2024,
      duration_days: 1000
    },
    {
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
        gst: 'GER3W3645',
        rate: Math.floor(Math.random() * 5),
        amount: Math.floor(Math.random() * 100000),
        borrow_day: 1 + Math.floor(Math.random() * 30),
        borrow_month: 1 + Math.floor(Math.random() * 12),
        borrow_year: 2000 + Math.floor(Math.random() * 26),
        duration_days: Math.floor(Math.random() * 1000)
      },
      {
        gst: 'MAN23984',
        rate: Math.floor(Math.random() * 5),
        amount: Math.floor(Math.random() * 100000),
        borrow_day: 1 + Math.floor(Math.random() * 30),
        borrow_month: 1 + Math.floor(Math.random() * 12),
        borrow_year: 2000 + Math.floor(Math.random() * 26),
        duration_days: Math.floor(Math.random() * 1000)
      },
      {
        gst: 'NMTY563',
        rate: Math.floor(Math.random() * 5),
        amount: Math.floor(Math.random() * 100000),
        borrow_day: 1 + Math.floor(Math.random() * 30),
        borrow_month: 1 + Math.floor(Math.random() * 12),
        borrow_year: 2000 + Math.floor(Math.random() * 26),
        duration_days: Math.floor(Math.random() * 1000)
      },
      {
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

  return (
    <div>
      <h1 class='title'>This is the LoansTaken page.</h1>
      <table class='table' border='1'>
        <thead class='tablehead'>
          <tr>
            <th>Supplier GST</th>
            <th>Interest rate</th>
            <th>Amount</th>
            <th>Borrow date</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody class='tablebody'>
        {loans.map((item, {index}) => {
          console.log(item);
          return (
            <tr key={index}>
              <td>{item.gst}</td>
              <td>{item.rate}</td>
              <td>{item.amount}</td>
              <td>{item.borrow_day}/{item.borrow_month}/{item.borrow_year}</td>
              <td>{item.duration_days}</td>
            </tr>
          )
        })}
        </tbody>
      </table>
      <div class='loanbutton'>
      <button onClick={orderByDate}>Order by date</button>
      <button onClick={orderByGST}>Order by supplier</button>
      <button onClick={reloadHandler}>Reload</button>
      <button><a href='/add/loanstaken' target='_blank'>Take a new loan</a></button>
      </div>
    </div>
  )
}
