import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'
import Error from '../Other/Error'

export default function SalesBook() {
  const [sales, setSaless] = useState([])
  const [form, setForm] = useState({
    start_date: '2000-01-01',
    end_date: '2025-12-31',
    gst: ''
  })

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const api = `/sales-book/search?start_date=${form.start_date}&end_date=${form.end_date}&gst=${form.gst}`
      const res = await axiosInstance.get(api)
      setSaless(res.data)
    } catch (err) {
      console.error(err);
      Error('Cannot load data due to server error.');
    }
  }

  useEffect(() => {
    document.title = 'Sales book'
    const fetchSales = async () => {
      try {
        const api = `/sales-book/search?start_date=${form.start_date}&end_date=${form.end_date}&gst=${form.gst}`
        const res = await axiosInstance.get(api)
        setSaless(res.data)
      } catch (err) {
        console.error(err);
        Error('Can not get data due to server error.');
      }
    }
    fetchSales()
  }, [])

  const changeHandler = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Sales book</h1>
        <Link to="/" className="btn btn-secondary">Home</Link>
      </div>
      <form onSubmit={submitHandler} className="filter-form">
        <div className="form-group">
          <label className="form-label">From:</label>
          <input name="start_date" value={form.start_date} type="date" onChange={changeHandler} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">To:</label>
          <input name="end_date" value={form.end_date} type="date" onChange={changeHandler} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">GST:</label>
          <input name="gst" value={form.gst} onChange={changeHandler} className="form-input" />
        </div>
        <button type="submit" className="btn btn-icon">&#128269;</button>
      </form>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Bill number</th>
              <th>Order date</th>
              <th>Buyer GST</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sales.map((item, index) => (
              <tr key={index}>
                <td>{item.bill_number}</td>
                <td>{item.order_day}/{item.order_month}/{item.order_year}</td>
                <td>{item.customer}</td>
                <td><Link className="btn-icon" to={`/sales/bill/${item.bill_number}`}>&#128394;</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link to={`/sales/bill/${Date.now() % 10000000000}`} className="floating-add-btn">+</Link>
    </div>
  )
}
