import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'

export default function BuyBill() {
  const { id } = useParams()
  const navigate = useNavigate()
  const today = new Date()
  const [buyers, setBuyers] = useState([])
  const [carriers, setCarriers] = useState([])
  const [form, setForm] = useState({
    customer: '',
    order_day: today.getDate(),
    order_month: today.getMonth() + 1,
    order_year: today.getFullYear(),
    carrier: '',
    bill_number: id
  })

  const [currentBuyers, setCurrentBuyers] = useState([])
  const [currentDrivers, setCurrentDrivers] = useState([])
  const [showDropdownBuyers, setShowDropdownBuyers] = useState(true)
  const [showDropdownDrivers, setShowDropdownDrivers] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchBuyers = async () => {
      try {
        const res = await axiosInstance.get('/buyers/all-gst', { params: { id } })
        const data = Array.isArray(res.data) ? res.data : []
        if (mounted) {
          setBuyers(data)
          setCurrentBuyers(data)
          const q = (form.customer || '').trim().toUpperCase()
          setShowDropdownBuyers(q === '' ? true : !data.some((s) => s.toUpperCase() === q))
        }
      } catch (err) {
        console.error(err)
      }
    }

    const fetchDrivers = async () => {
      try {
        const res = await axiosInstance.get('/drivers/all-licences')
        const data = Array.isArray(res.data) ? res.data : []
        if (mounted) {
          setCarriers(data)
          setCurrentDrivers(data)
          const q = (form.carrier || '').trim().toUpperCase()
          setShowDropdownDrivers(q === '' ? true : !data.some((d) => d.toUpperCase() === q))
        }
      } catch (err) {
        console.error(err)
      }
    }

    const fetchBill = async () => {
      try {
        const res = await axiosInstance.get(`/sales-book/${id}`)
        if (mounted && res && res.data) setForm((prev) => ({ ...prev, ...res.data }))
      } catch (err) {}
    }

    document.title = 'Invoice details'
    fetchBuyers()
    fetchDrivers()
    fetchBill()
    return () => {
      mounted = false
    }
  }, [id])

  const reloadBuyers = async () => {
    try {
      const res = await axiosInstance.get('/buyers/all-gst', { params: { id } })
      const data = Array.isArray(res.data) ? res.data : []
      setBuyers(data)
      setCurrentBuyers(data)
      const q = (form.customer || '').trim().toUpperCase()
      setShowDropdownBuyers(q === '' ? true : !data.some((s) => s.toUpperCase() === q))
    } catch (err) {
      console.error(err)
    }
  }

  const reloadDrivers = async () => {
    try {
      const res = await axiosInstance.get('/drivers/all-licences')
      const data = Array.isArray(res.data) ? res.data : []
      setCarriers(data)
      setCurrentDrivers(data)
      const q = (form.carrier || '').trim().toUpperCase()
      setShowDropdownDrivers(q === '' ? true : !data.some((d) => d.toUpperCase() === q))
    } catch (err) {
      console.error(err)
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      await axiosInstance.post('/sales-book', form)
      navigate(`/sales/items/${id}`)
    } catch (err) {
      console.error(err)
    }
  }

  const changeHandler = (e) => {
    const { name, value, type } = e.target
    if (name === 'customer') {
      const q = (value || '').toUpperCase()
      setCurrentBuyers(buyers.filter((item) => item.toUpperCase().startsWith(q)))
      setShowDropdownBuyers(!buyers.some((s) => s.toUpperCase() === q))
    }
    if (name === 'carrier') {
      const q = (value || '').toUpperCase()
      setCurrentDrivers(carriers.filter((item) => item.toUpperCase().startsWith(q)))
      setShowDropdownDrivers(!carriers.some((d) => d.toUpperCase() === q))
    }
    setForm((prev) => ({ ...prev, [name]: type === 'number' ? Number(value) : value }))
  }

  const selectHandlerBuyer = (e) => {
    const value = e.target.value
    setForm((prev) => ({ ...prev, customer: value }))
    if (buyers.includes(value)) setShowDropdownBuyers(false)
  }

  const selectHandlerDriver = (e) => {
    const value = e.target.value
    setForm((prev) => ({ ...prev, carrier: value }))
    if (carriers.includes(value)) setShowDropdownDrivers(false)
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Bill {id}:</h1>
        <Link to="/sales" className="btn btn-secondary">Back</Link>
      </div>

      <form onSubmit={submitHandler} className="form-container">
        <div className="form-group">
          <label className="form-label">Bill Number:</label>
          <input name="bill_number" type="number" value={form.bill_number} readOnly className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">Buyer GST:</label>
          <div className="input-with-select">
            <input
              name="customer"
              value={form.customer}
              onChange={changeHandler}
              className="form-input"
              aria-label="Buyer GST"
              placeholder="Type or select buyer GST"
            />
            <button type="button" onClick={reloadBuyers} className="btn btn-secondary reload-btn" aria-label="Reload buyers" title="Reload buyers">Reload</button>
            {showDropdownBuyers && (
              <div className="dropdown-wrapper dropdown-left-auto">
                <select size={1 + currentBuyers.length} onChange={selectHandlerBuyer} className="dropdown-select">
                  <option value="">--Choose a value--</option>
                  {currentBuyers.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </select>
                <a href="/add/buyer" target="_blank" rel="noreferrer" className="btn-icon btn-add">+</a>
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Order Date:</label>
          <div className="date-group">
            <input name="order_day" type="number" value={form.order_day} onChange={changeHandler} className="form-input-date" />
            <p>/</p>
            <input name="order_month" type="number" value={form.order_month} onChange={changeHandler} className="form-input-date" />
            <p>/</p>
            <input name="order_year" type="number" value={form.order_year} onChange={changeHandler} className="form-input-date year" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Driver license:</label>
          <div className="input-with-select">
            <input name="carrier" value={form.carrier} onChange={changeHandler} className="form-input" aria-label="Driver license" placeholder="Type or select driver license" />
            <button type="button" onClick={reloadDrivers} className="btn btn-secondary reload-btn" aria-label="Reload drivers" title="Reload drivers">Reload</button>
            {showDropdownDrivers && (
              <div className="dropdown-wrapper dropdown-left-auto">
                <select size={1 + currentDrivers.length} onChange={selectHandlerDriver} className="dropdown-select">
                  <option value="">--Choose a value--</option>
                  {currentDrivers.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </select>
                <a href="/add/driver" target="_blank" rel="noreferrer" className="btn-icon btn-add">+</a>
              </div>
            )}
          </div>
        </div>

        <button type="submit" disabled={!(buyers.includes(form.customer) && carriers.includes(form.carrier))} className="btn btn-primary">Next</button>
      </form>
    </div>
  )
}
