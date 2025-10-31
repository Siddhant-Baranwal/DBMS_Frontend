import React, { useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance'
import Error from '../Other/Error'

export default function AddSupplier() {
  useEffect(() => {
    document.title = 'Add supplier'
  }, [])

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    gst: '',
    city: '',
    zip: '',
    area: '',
    building: ''
  })

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      await axiosInstance.post('/suppliers', form)
      window.close()
    } catch (err) {
      console.error(err);
      Error('Could not add the new supplier');
    }
  }

  const changeHandler = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="page-container animate-fade-in">
      <h1 className="page-title">Add a New Supplier</h1>
      <form onSubmit={submitHandler} className="form-container">
        <div className="form-group">
          <label className="form-label">Name of the firm:</label>
          <input name="name" value={form.name} onChange={changeHandler} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Email address:</label>
          <input name="email" type="email" value={form.email} onChange={changeHandler} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Phone number:</label>
          <input name="phone" value={form.phone} onChange={changeHandler} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">GST number:</label>
          <input name="gst" value={form.gst} onChange={changeHandler} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">City:</label>
          <input name="city" value={form.city} onChange={changeHandler} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Zip code:</label>
          <input name="zip" value={form.zip} onChange={changeHandler} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Area:</label>
          <input name="area" value={form.area} onChange={changeHandler} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Building number:</label>
          <input name="building" value={form.building} onChange={changeHandler} className="form-input" />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}
