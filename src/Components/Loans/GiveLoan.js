import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'

export default function GiveLoan() {
  const [buyers, setBuyers] = useState([])
  const [currentBuyers, setCurrentBuyers] = useState([])
  const [showDropdown, setShowDropdown] = useState(true)
  const today = new Date()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    gst: '',
    rate: 0,
    amount: 0,
    borrow_day: today.getDate(),
    borrow_month: today.getMonth() + 1,
    borrow_year: today.getFullYear(),
    duration_day: 0
  })

  const fetchBuyers = async () => {
    try {
      const res = await axiosInstance.get('/buyers/all-gst')
      const gstList = Array.isArray(res.data) ? res.data : []
      setBuyers(gstList)
      setCurrentBuyers(gstList)
      const q = (form.gst || '').trim().toUpperCase()
      setShowDropdown(q === '' ? true : !gstList.some((g) => g.toUpperCase() === q))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    document.title = 'Give loan'
    fetchBuyers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      await axiosInstance.post('/loansgiven', {
        rate: form.rate,
        amt: form.amount,
        day: form.borrow_day,
        month: form.borrow_month,
        year: form.borrow_year,
        duration: form.duration_day,
        gstNumber: form.gst
      })
      navigate('/loans/given')
    } catch (err) {
      console.error(err)
    }
  }

  const changeHandler = (e) => {
    const { name, value } = e.target
    if (name === 'gst') {
      const q = (value || '').toUpperCase()
      setCurrentBuyers(buyers.filter((gst) => gst.toUpperCase().startsWith(q)))
      setShowDropdown(!buyers.some((gst) => gst.toUpperCase() === q))
      setForm((prev) => ({ ...prev, [name]: value }))
      return
    }
    const numericFields = ['rate', 'amount', 'borrow_day', 'borrow_month', 'borrow_year', 'duration_day']
    if (numericFields.includes(name)) {
      const numericValue = value === '' ? '' : Number(value)
      setForm((prev) => ({ ...prev, [name]: numericValue }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const selectHandler = (e) => {
    const value = e.target.value
    setForm((prev) => ({ ...prev, gst: value }))
    if (value && buyers.includes(value)) setShowDropdown(false)
    else setShowDropdown(true)
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Give a new loan</h1>
        <Link to="/loans/given" className="btn btn-secondary">Back</Link>
      </div>

      <form onSubmit={submitHandler} className="form-container">
        <div className="form-group">
          <label className="form-label">Buyer GST:</label>
          <div className="input-with-select">
            <input name="gst" value={form.gst} onChange={changeHandler} className="form-input" aria-label="Buyer GST" placeholder="Type or select buyer GST" />
            <button type="button" onClick={fetchBuyers} className="btn btn-secondary reload-btn" aria-label="Reload buyers" title="Reload buyers">Reload</button>
            {showDropdown && currentBuyers.length > 0 && (
              <div className="dropdown-wrapper dropdown-left-auto">
                <select size={1 + currentBuyers.length} onChange={selectHandler} className="dropdown-select">
                  <option value=''>--Choose a buyer--</option>
                  {currentBuyers.map((gst, index) => <option key={index} value={gst}>{gst}</option>)}
                </select>
                <a href="/add/buyer" target="_blank" rel="noreferrer" className="btn-icon btn-add" title="Add buyer">+</a>
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Rate:</label>
          <input name="rate" type="number" value={form.rate} onChange={changeHandler} className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">Amount:</label>
          <input name="amount" type="number" value={form.amount} onChange={changeHandler} className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">Borrow date:</label>
          <div className="date-group">
            <input name="borrow_month" type="number" value={form.borrow_month} onChange={changeHandler} className="form-input-date" />
            <p>/</p>
            <input name="borrow_day" type="number" value={form.borrow_day} onChange={changeHandler} className="form-input-date" />
            <p>/</p>
            <input name="borrow_year" type="number" value={form.borrow_year} onChange={changeHandler} className="form-input-date year" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Duration in days:</label>
          <input name="duration_day" type="number" value={form.duration_day} onChange={changeHandler} className="form-input" />
        </div>

        <button disabled={showDropdown} type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}
