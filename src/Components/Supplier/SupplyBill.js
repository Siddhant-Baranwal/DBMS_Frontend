import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'

export default function SupplyBill() {
  const { id } = useParams()
  const navigate = useNavigate()
  const today = new Date()
  const [suppliers, setSuppliers] = useState([])
  const [carriers, setCarriers] = useState([])
  const [form, setForm] = useState({
    provider: '',
    order_day: today.getDate(),
    order_month: today.getMonth() + 1,
    order_year: today.getFullYear(),
    carrier: '',
    bill_number: id
  })
  const [currentSuppliers, setCurrentSuppliers] = useState([])
  const [currentDrivers, setCurrentDrivers] = useState([])
  const [showDropdownSuppliers, setShowDropdownSuppliers] = useState(true)
  const [showDropdownDrivers, setShowDropdownDrivers] = useState(true)

  const fetchSuppliers = async () => {
    try {
      const res = await axiosInstance.get('/suppliers/all-gst', { params: { id } })
      const data = Array.isArray(res.data) ? res.data : []
      setSuppliers(data)
      setCurrentSuppliers(data)
      const q = (form.provider || '').trim().toUpperCase()
      setShowDropdownSuppliers(q === '' ? true : !data.some((s) => s.toUpperCase() === q))
    } catch (err) {
      console.error(err)
    }
  }

  const fetchDrivers = async () => {
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

  useEffect(() => {
    let mounted = true
    const loadAll = async () => {
      document.title = 'Invoice details'
      try {
        const resSuppliers = await axiosInstance.get('/suppliers/all-gst', { params: { id } })
        const sData = Array.isArray(resSuppliers.data) ? resSuppliers.data : []
        if (mounted) {
          setSuppliers(sData)
          setCurrentSuppliers(sData)
          const q = (form.provider || '').trim().toUpperCase()
          setShowDropdownSuppliers(q === '' ? true : !sData.some((s) => s.toUpperCase() === q))
        }
      } catch (err) {
        console.error(err)
      }
      try {
        const resDrivers = await axiosInstance.get('/drivers/all-licences')
        const dData = Array.isArray(resDrivers.data) ? resDrivers.data : []
        if (mounted) {
          setCarriers(dData)
          setCurrentDrivers(dData)
          const q = (form.carrier || '').trim().toUpperCase()
          setShowDropdownDrivers(q === '' ? true : !dData.some((d) => d.toUpperCase() === q))
        }
      } catch (err) {
        console.error(err)
      }
      try {
        const resBill = await axiosInstance.get(`/purchase-book/${id}`)
        if (mounted && resBill && resBill.data) setForm((prev) => ({ ...prev, ...resBill.data }))
      } catch (err) {}
    }
    loadAll()
    return () => { mounted = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const reloadSuppliers = async () => { await fetchSuppliers() }
  const reloadDrivers = async () => { await fetchDrivers() }

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      await axiosInstance.post('/purchase-book', form)
      navigate(`/purchase/items/${id}`)
    } catch (err) {
      console.error(err)
    }
  }

  const changeHandler = (e) => {
    const { name, value, type } = e.target
    if (name === 'provider') {
      const q = (value || '').toUpperCase()
      setCurrentSuppliers(suppliers.filter((item) => item.toUpperCase().startsWith(q)))
      setShowDropdownSuppliers(!suppliers.some((s) => s.toUpperCase() === q))
    }
    if (name === 'carrier') {
      const q = (value || '').toUpperCase()
      setCurrentDrivers(carriers.filter((item) => item.toUpperCase().startsWith(q)))
      setShowDropdownDrivers(!carriers.some((d) => d.toUpperCase() === q))
    }
    setForm((prev) => ({ ...prev, [name]: type === 'number' ? Number(value) : value }))
  }

  const selectHandlerSupplier = (e) => {
    const value = e.target.value
    setForm((prev) => ({ ...prev, provider: value }))
    if (suppliers.includes(value)) setShowDropdownSuppliers(false)
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
        <Link to="/purchase" className="btn btn-secondary">Back</Link>
      </div>

      <form onSubmit={submitHandler} className="form-container">
        <div className="form-group">
          <label className="form-label">Bill Number:</label>
          <input name="bill_number" type="number" value={form.bill_number} readOnly className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">Supplier GST:</label>
          <div className="input-with-select">
            <input name="provider" value={form.provider} onChange={changeHandler} className="form-input" />
            <button type="button" onClick={reloadSuppliers} className="btn btn-secondary reload-btn" title="Reload suppliers">Reload</button>
            {showDropdownSuppliers && (
              <div className="dropdown-wrapper dropdown-left-auto">
                <select size={1 + currentSuppliers.length} onChange={selectHandlerSupplier} className="dropdown-select">
                  <option value="">--Choose a value--</option>
                  {currentSuppliers.map((item, index) => <option key={index} value={item}>{item}</option>)}
                </select>
                <a href="/add/supplier" target="_blank" rel="noreferrer" className="btn-icon btn-add">+</a>
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
            <input name="carrier" value={form.carrier} onChange={changeHandler} className="form-input" />
            <button type="button" onClick={reloadDrivers} className="btn btn-secondary reload-btn" title="Reload drivers">Reload</button>
            {showDropdownDrivers && (
              <div className="dropdown-wrapper dropdown-left-auto">
                <select size={1 + currentDrivers.length} onChange={selectHandlerDriver} className="dropdown-select">
                  <option value="">--Choose a value--</option>
                  {currentDrivers.map((item, index) => <option key={index} value={item}>{item}</option>)}
                </select>
                <a href="/add/driver" target="_blank" rel="noreferrer" className="btn-icon btn-add">+</a>
              </div>
            )}
          </div>
        </div>

        <button type="submit" disabled={!(suppliers.includes(form.provider) && carriers.includes(form.carrier))} className="btn btn-primary">Next</button>
      </form>
    </div>
  )
}
