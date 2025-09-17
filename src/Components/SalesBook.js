// Page 2
import React, { useState } from 'react'
import { Link } from 'react-router-dom';

export default function SalesBook() {
  const [sales, setSales] = useState([
    {
      bill_number: 1,
      order_day: 23,
      order_month: 9,
      order_year: 2025,
      carrier: 'Chintu Prasad',
      requester: 'MAN420786'
    },
    {
      bill_number: 2,
      order_day: 23,
      order_month: 9,
      order_year: 2025,
      carrier: 'Chintu Prasad',
      requester: 'MAN420786'
    },
    {
      bill_number: 3,
      order_day: 23,
      order_month: 9,
      order_year: 2025,
      carrier: 'Chintu Prasad',
      requester: 'MAN420786'
    },
    {
      bill_number: 4,
      order_day: 23,
      order_month: 9,
      order_year: 2025,
      carrier: 'Chintu Prasad',
      requester: 'MAN420786'
    }
  ]);
  const [form, setForm] = useState({
    start_date: '01/01/2000',
    end_date: '01/01/2025',
    gst: 'MAN13'
  })
  
  const submitHandler = (e) => {
    e.preventDefault();
    console.log(form);
    setSales([
      {
        bill_number: 1,
        order_day: 1 + Math.floor(Math.random() * 30),
        order_month: 1 + Math.floor(Math.random() * 12),
        order_year: 2000 + Math.floor(Math.random() * 26),
        carrier: 'Chintu Prasad',
        requester: 'MAN23554'
      },
      {
        bill_number: 2,
        order_day: 1 + Math.floor(Math.random() * 30),
        order_month: 1 + Math.floor(Math.random() * 12),
        order_year: 2000 + Math.floor(Math.random() * 26),
        carrier: 'Chintu Prasad',
        requester: 'MAN23554'
      },
      {
        bill_number: 3,
        order_day: 1 + Math.floor(Math.random() * 30),
        order_month: 1 + Math.floor(Math.random() * 12),
        order_year: 2000 + Math.floor(Math.random() * 26),
        carrier: 'Chintu Prasad',
        requester: 'MAN23554'
      },
      {
        bill_number: 4,
        order_day: 1 + Math.floor(Math.random() * 30),
        order_month: 1 + Math.floor(Math.random() * 12),
        order_year: 2000 + Math.floor(Math.random() * 26),
        carrier: 'Chintu Prasad',
        requester: 'MAN23554'
      }
    ])
  }

  const changeHandler = (e) => {
    const {name, value} = e.target;
    setForm(prev => ({...prev, [name]: value}));
  }

  return (
    <div>
      <h1 class='title'>This is the sales book.</h1>
      <form onSubmit={submitHandler} class='billform'>
        <div>
          <p>From: </p>
          <input type='date' defaultValue='2000-01-01' onChange={changeHandler}></input>
        </div>
        <div>
          <p>To: </p>
          <input type='date' defaultValue='2026-01-01' onChange={changeHandler}></input>
        </div>
        <div>
          <p>GST: </p>
          <input onChange={changeHandler}></input>
        </div>
        <button type='submit'>&#128269;</button>
      </form>
      <table class='table' border='1'>
      <thead class='tablehead'>
        <tr>
          <th>Bill number</th>
          <th>Order date</th>
          <th>Buyer GST</th>
          <th></th>
        </tr>
      </thead>
      <tbody class='tablebody'>
      {sales.map((item, {index}) => {
        console.log(item);
        return (
          <tr key={index}>
            <td>{item.bill_number}</td>
            <td>{item.order_day}/{item.order_month}/{item.order_year}</td>
            <td>{item.requester}</td>
            <td><Link class='editbill' to={`/sales/bill/${item.bill_number}`}>&#128394;</Link> </td>
          </tr>
        )
      })}
      </tbody>
      </table>
      <Link to={`/sales/bill/${Date.now() % 10000000000}`} class='addbill'>+</Link>
    </div>
  )
}
